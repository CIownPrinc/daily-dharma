/**
 * Library — story browser with search + age-stage filters.
 *
 * Phase 6 addition: text search across story titles, realms, and character names.
 *
 * SEARCH DESIGN:
 *   - `q` added to URL search params so searches are deep-linkable and
 *     survive page reload. This is the correct approach for any filterable
 *     list — the URL is the source of truth, not component state.
 *   - Client-side filtering only (13 stories fit in memory trivially).
 *     When the library grows past ~100, move to a search index (Fuse.js).
 *   - Input is controlled but navigation is debounced: typing updates a
 *     local `inputValue` state immediately (fast visual response) and
 *     pushes to the URL after 250ms (avoids history spam on every keystroke).
 *   - Search is case-insensitive and matches partial words.
 *   - When `q` is active, age-stage filter is still applied on top so the
 *     child only sees age-appropriate results even when searching.
 *   - Clear button (×) resets both search and navigates to default view.
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useRef, useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { stories, AGE_STAGES, type AgeStage } from "@/lib/dharma-data";
import { useProgress } from "@/lib/use-progress";
import { useProfile } from "@/lib/use-profile";
import { useDharmaStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const filterSchema = z.object({
  view: fallback(
    z.enum(["default", "all", "done", "Little", "Curious", "Seeker"]),
    "default",
  ).default("default"),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/library")({
  validateSearch: zodValidator(filterSchema),
  head: () => ({
    meta: [
      { title: "The Library — Dharma Quest" },
      { name: "description", content: "A gentle library of stories from the Ramayana, Mahabharata, and beyond — for children." },
      { property: "og:title", content: "The Library — Dharma Quest" },
      { property: "og:description", content: "Browse all our bedtime stories and tales." },
    ],
  }),
  component: LibraryPage,
});

const STAGE_META: Record<AgeStage, { emoji: string; color: string; activeColor: string }> = {
  Little:  { emoji: "🐘", color: "bg-leaf-soft ring-leaf/15",   activeColor: "bg-leaf-soft ring-leaf ring-2" },
  Curious: { emoji: "🪈", color: "bg-lotus-soft ring-lotus/15", activeColor: "bg-lotus-soft ring-lotus ring-2" },
  Seeker:  { emoji: "🎯", color: "bg-saffron-soft ring-saffron/20", activeColor: "bg-saffron-soft ring-saffron ring-2" },
};

function searchMatch(story: (typeof stories)[0], q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase().trim();
  return (
    story.title.toLowerCase().includes(needle) ||
    story.realm.toLowerCase().includes(needle) ||
    story.character.name.toLowerCase().includes(needle) ||
    story.blurb.toLowerCase().includes(needle) ||
    story.badge.virtue.toLowerCase().includes(needle)
  );
}

function LibraryPage() {
  const { view, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/library" });
  const { progress, hydrated } = useProgress();
  const { profile } = useProfile();
  const resolvedAgeStage = useDharmaStore((s) => s.resolvedAgeStage)();
  const completed = new Set(hydrated ? progress.completedStories : []);

  // Local input state for instant visual response; URL updated after debounce
  const [inputValue, setInputValue] = useState(q);
  const debounceRef = useRef<number | null>(null);

  // Keep local state in sync if URL q changes externally (e.g. back button)
  useEffect(() => { setInputValue(q); }, [q]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: value }) });
    }, 250);
  };

  const clearSearch = () => {
    setInputValue("");
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    navigate({ search: { view: "default", q: "" } });
  };

  const effectiveView: "all" | "done" | AgeStage =
    view === "default" ? resolvedAgeStage : view;

  const isDefaulting = view === "default" && !!profile && !q;
  const isSearching = q.trim().length > 0;

  const filtered = stories.filter((s) => {
    const matchesStage =
      isSearching ||   // searching overrides stage filter — search everything
      effectiveView === "all" ||
      (effectiveView === "done" ? completed.has(s.slug) : s.ageStage === effectiveView);
    return matchesStage && searchMatch(s, q);
  });

  const groups = isSearching
    ? [{ realm: "Search results", stories: filtered }]
    : Array.from(new Set(filtered.map((s) => s.realm))).map((realm) => ({
        realm,
        stories: filtered.filter((s) => s.realm === realm),
      }));

  const firstName = profile?.name?.split(" ")[0];

  return (
    <AppShell>
      <header className="mb-6 md:mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
          The Library of Tales
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          Every story is a small seed.
        </h1>
      </header>

      {/* ── Search input ── */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft text-base pointer-events-none" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search tales, characters, realms…"
          className={cn(
            "w-full rounded-2xl bg-card ring-1 ring-ink/10 focus:ring-lotus/50 focus:outline-none",
            "pl-11 pr-12 py-3.5 font-serif text-ink placeholder:text-ink-soft/60 text-[15px]",
            "transition-shadow",
            isSearching && "ring-lotus/40 shadow-soft",
          )}
          aria-label="Search stories"
        />
        {isSearching && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-ink/8 hover:bg-ink/15 flex items-center justify-center text-ink-soft font-bold text-sm transition-colors"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Stage filters (hidden while searching) ── */}
      {!isSearching && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {AGE_STAGES.map((stage) => {
              const meta = STAGE_META[stage.id];
              const active = effectiveView === stage.id;
              const count = stories.filter((s) => s.ageStage === stage.id).length;
              const doneCount = stories.filter((s) => s.ageStage === stage.id && completed.has(s.slug)).length;
              return (
                <button
                  key={stage.id}
                  onClick={() => navigate({ search: { view: stage.id, q: "" } })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl ring-1 transition-all text-center",
                    active ? meta.activeColor : `${meta.color} hover:ring-2`,
                  )}
                  aria-pressed={active}
                >
                  <span className="text-2xl" aria-hidden>{meta.emoji}</span>
                  <div>
                    <div className="font-bold text-xs text-ink leading-tight">{stage.label}</div>
                    <div className="text-[10px] text-ink-soft font-medium">{stage.range}</div>
                  </div>
                  <div className="text-[10px] font-bold text-ink-soft tabular-nums">
                    {doneCount}/{count}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-6">
            {(["all", "done"] as const).map((f) => {
              const active = effectiveView === f;
              const label = f === "all" ? "All Tales" : "Finished";
              const count = f === "all" ? stories.length : (hydrated ? completed.size : 0);
              return (
                <button
                  key={f}
                  onClick={() => navigate({ search: { view: f, q: "" } })}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ring-1 transition-colors",
                    active
                      ? "bg-lotus text-primary-foreground ring-lotus shadow-petal"
                      : "bg-card text-ink-soft ring-ink/10 hover:text-ink hover:ring-lotus/40",
                  )}
                  aria-pressed={active}
                >
                  {label}
                  <span className={cn("text-[10px] tabular-nums", active ? "opacity-80" : "opacity-60")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contextual default-filter banner */}
          {isDefaulting && (effectiveView === "Little" || effectiveView === "Curious" || effectiveView === "Seeker") && (
            <div className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 ring-1 ring-ink/5 mb-6 shadow-soft">
              <span className="text-xl shrink-0" aria-hidden>
                {STAGE_META[effectiveView as AgeStage].emoji}
              </span>
              <p className="text-sm text-ink-soft font-medium">
                Showing{" "}
                <span className="font-bold text-ink">
                  {AGE_STAGES.find((s) => s.id === effectiveView)?.label}
                </span>
                {firstName ? ` — picked for ${firstName}.` : "."}
                {" "}
                <button
                  onClick={() => navigate({ search: { view: "all", q: "" } })}
                  className="text-lotus font-bold hover:underline"
                >
                  See all →
                </button>
              </p>
            </div>
          )}
        </>
      )}

      {/* ── Search status ── */}
      {isSearching && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-ink-soft font-medium">
            {filtered.length === 0
              ? "No tales match that search."
              : `${filtered.length} tale${filtered.length === 1 ? "" : "s"} found`}
          </p>
          <button onClick={clearSearch} className="text-sm font-bold text-lotus hover:underline">
            Clear search
          </button>
        </div>
      )}

      {/* ── Story grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-3xl p-10 ring-1 ring-ink/5 text-center">
          <div className="text-3xl mb-3" aria-hidden>✿</div>
          <p className="text-ink-soft font-medium mb-4">
            {isSearching
              ? `No tales match "${q}". Try a character name or realm.`
              : effectiveView === "done"
                ? "No tales finished yet — your journey is just beginning."
                : "No tales here yet — try another path."}
          </p>
          <button
            onClick={clearSearch}
            className="inline-block bg-lotus text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors"
          >
            {isSearching ? "Clear search" : "See all tales"}
          </button>
        </div>
      ) : (
        groups.map(({ realm, stories: groupStories }) => (
          <section key={realm} className="mb-10">
            {(!isSearching || groups.length > 1) && (
              <h2 className="font-serif text-xl text-ink mb-4">{realm}</h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {groupStories.map((s) => (
                <StoryCard key={s.slug} story={s} done={completed.has(s.slug)} />
              ))}
            </div>
          </section>
        ))
      )}
    </AppShell>
  );
}

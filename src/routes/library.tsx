/**
 * Library — story browser.
 *
 * Phase 3 changes:
 *   1. Default filter is now the child's resolved age stage (from store),
 *      not "all". First-time users immediately see stories appropriate for them.
 *      URL search param `view` still overrides this so deep links and manual
 *      filter selections are preserved.
 *   2. Age stage filters are more visually prominent — shown as large cards
 *      at the top with age range and story count, not just small pills.
 *   3. A contextual banner explains why the filter is active when defaulting
 *      to the child's stage — it's informative, not confusing.
 *   4. "All Tales" and "Finished" remain as secondary filters below the
 *      stage cards.
 *
 * ARCHITECTURAL NOTE: We read resolvedAgeStage() from the store (not
 * just profile.ageStage) so parent overrides from /settings are respected
 * automatically throughout the app.
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { stories, AGE_STAGES, type AgeStage } from "@/lib/dharma-data";
import { useProgress } from "@/lib/use-progress";
import { useProfile } from "@/lib/use-profile";
import { useDharmaStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// "default" view means "use the child's age stage from the store"
const filterSchema = z.object({
  view: fallback(
    z.enum(["default", "all", "done", "Little", "Curious", "Seeker"]),
    "default",
  ).default("default"),
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

function LibraryPage() {
  const { view } = Route.useSearch();
  const navigate = useNavigate({ from: "/library" });
  const { progress, hydrated } = useProgress();
  const { profile } = useProfile();
  const resolvedAgeStage = useDharmaStore((s) => s.resolvedAgeStage)();
  const completed = new Set(hydrated ? progress.completedStories : []);

  // Resolve the effective filter:
  // - "default" → use child's age stage
  // - anything else → use as-is
  const effectiveView: "all" | "done" | AgeStage =
    view === "default" ? resolvedAgeStage : view;

  const isDefaulting = view === "default" && !!profile;

  const filtered = stories.filter((s) => {
    if (effectiveView === "all") return true;
    if (effectiveView === "done") return completed.has(s.slug);
    return s.ageStage === effectiveView;
  });

  const groups = Array.from(new Set(filtered.map((s) => s.realm)));

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
        <p className="text-ink-soft font-medium mt-2 max-w-prose">
          Choose any tale that calls to you. Each one is a few quiet minutes long.
        </p>
      </header>

      {/* ── Age stage selector — primary filters ── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {AGE_STAGES.map((stage) => {
          const meta = STAGE_META[stage.id];
          const active = effectiveView === stage.id;
          const count = stories.filter((s) => s.ageStage === stage.id).length;
          const doneCount = stories.filter((s) => s.ageStage === stage.id && completed.has(s.slug)).length;

          return (
            <button
              key={stage.id}
              onClick={() => navigate({ search: { view: stage.id } })}
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

      {/* ── Secondary filters ── */}
      <div className="flex gap-2 mb-6">
        {(["all", "done"] as const).map((f) => {
          const active = effectiveView === f;
          const label = f === "all" ? "All Tales" : "Finished";
          const count = f === "all" ? stories.length : (hydrated ? completed.size : 0);
          return (
            <button
              key={f}
              onClick={() => navigate({ search: { view: f } })}
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

      {/* Contextual banner when auto-filtering by age stage */}
      {isDefaulting && (effectiveView === "Little" || effectiveView === "Curious" || effectiveView === "Seeker") && (
        <div className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 ring-1 ring-ink/5 mb-6 shadow-soft">
          <span className="text-xl shrink-0" aria-hidden>
            {STAGE_META[effectiveView as AgeStage].emoji}
          </span>
          <p className="text-sm text-ink-soft font-medium">
            Showing stories for{" "}
            <span className="font-bold text-ink">
              {AGE_STAGES.find((s) => s.id === effectiveView)?.label}
            </span>
            {firstName ? ` — picked for ${firstName}.` : "."}
            {" "}
            <button
              onClick={() => navigate({ search: { view: "all" } })}
              className="text-lotus font-bold hover:underline"
            >
              See all →
            </button>
          </p>
        </div>
      )}

      {/* Story grid */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-3xl p-10 ring-1 ring-ink/5 text-center">
          <div className="text-3xl mb-3" aria-hidden>✿</div>
          <p className="text-ink-soft font-medium mb-4">
            {effectiveView === "done"
              ? "No tales finished yet — your journey is just beginning."
              : "No tales here yet — try another path."}
          </p>
          <Link
            to="/library"
            search={{ view: "all" }}
            className="inline-block bg-lotus text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors"
          >
            See all tales
          </Link>
        </div>
      ) : (
        groups.map((realm) => (
          <section key={realm} className="mb-10">
            <h2 className="font-serif text-xl text-ink mb-4">{realm}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered
                .filter((s) => s.realm === realm)
                .map((s) => (
                  <StoryCard key={s.slug} story={s} done={completed.has(s.slug)} />
                ))}
            </div>
          </section>
        ))
      )}
    </AppShell>
  );
}

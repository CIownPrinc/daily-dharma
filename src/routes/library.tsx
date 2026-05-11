import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { stories, AGE_STAGES, type AgeStage } from "@/lib/dharma-data";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/utils";

const filterSchema = z.object({
  view: fallback(z.enum(["all", "done", "Little", "Curious", "Seeker"]), "all").default("all"),
});

export const Route = createFileRoute("/library")({
  validateSearch: zodValidator(filterSchema),
  head: () => ({
    meta: [
      { title: "The Library — Dharma Quest" },
      {
        name: "description",
        content: "A gentle library of stories from the Ramayana, Mahabharata, and beyond — for children.",
      },
      { property: "og:title", content: "The Library — Dharma Quest" },
      {
        property: "og:description",
        content: "Browse all our bedtime stories and tales.",
      },
    ],
  }),
  component: LibraryPage,
});

const FILTERS: { id: "all" | "done" | AgeStage; label: string }[] = [
  { id: "all", label: "All Tales" },
  { id: "done", label: "Finished" },
  ...AGE_STAGES.map((s) => ({ id: s.id, label: s.label })),
];

function LibraryPage() {
  const { view } = Route.useSearch();
  const navigate = useNavigate({ from: "/library" });
  const { progress, hydrated } = useProgress();
  const completed = new Set(hydrated ? progress.completedStories : []);

  const filtered = stories.filter((s) => {
    if (view === "all") return true;
    if (view === "done") return completed.has(s.slug);
    return s.ageStage === view;
  });

  const groups = Array.from(new Set(filtered.map((s) => s.realm)));

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

      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter stories">
        {FILTERS.map((f) => {
          const active = view === f.id;
          const count =
            f.id === "all"
              ? stories.length
              : f.id === "done"
                ? hydrated ? completed.size : 0
                : stories.filter((s) => s.ageStage === f.id).length;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={active}
              onClick={() => navigate({ search: { view: f.id } })}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ring-1 transition-colors",
                active
                  ? "bg-lotus text-primary-foreground ring-lotus shadow-petal"
                  : "bg-card text-ink-soft ring-ink/10 hover:text-ink hover:ring-lotus/40",
              )}
            >
              {f.label}
              <span className={cn("text-[10px] tabular-nums", active ? "opacity-80" : "opacity-60")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-3xl p-10 ring-1 ring-ink/5 text-center">
          <div className="text-3xl mb-3" aria-hidden>✿</div>
          <p className="text-ink-soft font-medium mb-4">
            No tales here yet — try another path.
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

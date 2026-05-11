import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { journey, stories } from "@/lib/dharma-data";
import { useProgress } from "@/lib/use-progress";
import { cn } from "@/lib/utils";
import journeyMap from "@/assets/journey-map.jpg";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Your Journey — Dharma Quest" },
      { name: "description", content: "Wander through the realms of Vrindavan, the great forest, and the quiet hermitage." },
      { property: "og:title", content: "Your Journey — Dharma Quest" },
      { property: "og:description", content: "A gentle map of stories to discover." },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const { progress, hydrated } = useProgress();
  const completed = new Set(hydrated ? progress.completedStories : []);

  // Compute per-realm progress and unlock state.
  // First realm is always unlocked. Each next realm unlocks when at least one
  // story in the previous realm is finished.
  const realms = journey.map((realm, ri) => {
    const total = realm.nodes.length;
    const done = realm.nodes.filter((n) => completed.has(n.storySlug)).length;
    const prev = ri === 0 ? null : journey[ri - 1]!;
    const prevDone = prev
      ? prev.nodes.some((n) => completed.has(n.storySlug))
      : true;
    const locked = !prevDone;
    return { ...realm, total, done, locked, prevName: prev?.realm };
  });

  return (
    <AppShell>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
          Your Journey
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          A garden of paths to wander.
        </h1>
      </header>

      <div className="rounded-[2rem] overflow-hidden ring-1 ring-ink/5 shadow-soft mb-10 bg-lotus-soft">
        <img
          src={journeyMap}
          alt="A whimsical map of the Dharma Quest realms"
          width={1536}
          height={1024}
          className="w-full h-auto"
        />
      </div>

      <div className="space-y-10">
        {realms.map((realm) => {
          const pct = realm.total ? (realm.done / realm.total) * 100 : 0;
          return (
            <section
              key={realm.realm}
              className={cn(
                "relative rounded-3xl p-5 md:p-6 ring-1 ring-ink/5 bg-card shadow-soft transition-opacity",
                realm.locked && "opacity-90",
              )}
            >
              <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl md:text-2xl text-ink">{realm.realm}</h2>
                  {realm.locked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-ink/5 text-ink-soft px-2.5 py-1 rounded-full">
                      <span aria-hidden>🔒</span> Locked
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-ink-soft tabular-nums">
                  {realm.done} / {realm.total} tales
                </div>
              </div>

              <div
                className="h-1.5 w-full rounded-full bg-lotus-soft overflow-hidden mb-5"
                role="progressbar"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${realm.realm} progress`}
              >
                <div
                  className="h-full bg-gradient-to-r from-lotus to-saffron transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {realm.locked ? (
                <div className="text-center py-6">
                  <p className="text-ink-soft font-medium text-sm max-w-prose mx-auto">
                    Finish a tale in <span className="font-bold text-ink">{realm.prevName}</span> to open this realm.
                  </p>
                </div>
              ) : (
                <div className="relative pl-6">
                  <span className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-lotus/40 via-leaf/30 to-transparent" aria-hidden />
                  <div className="space-y-4">
                    {realm.nodes.map((node, idx) => {
                      const story = stories.find((s) => s.slug === node.storySlug);
                      if (!story) return null;
                      const done = completed.has(story.slug);
                      return (
                        <Link
                          key={node.storySlug}
                          to="/story/$slug"
                          params={{ slug: story.slug }}
                          className="group flex items-center gap-4 bg-jasmine/60 rounded-2xl p-3 ring-1 ring-ink/5 hover:shadow-petal transition-shadow relative"
                        >
                          <span
                            className={cn(
                              "absolute -left-[1.45rem] top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-card",
                              done
                                ? "bg-lotus text-primary-foreground"
                                : "bg-lotus-soft text-lotus border-2 border-lotus/30",
                            )}
                            aria-hidden
                          >
                            {done ? "✓" : idx + 1}
                          </span>
                          <div className="size-16 md:size-20 rounded-xl overflow-hidden bg-lotus-soft shrink-0">
                            <img
                              src={story.image}
                              alt=""
                              width={1024}
                              height={768}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-0.5">
                              {node.label} · {story.duration}
                            </div>
                            <h3 className="font-serif text-base md:text-lg text-ink truncate">{story.title}</h3>
                            <p className="text-xs md:text-sm text-ink-soft font-medium truncate">{story.blurb}</p>
                          </div>
                          <span className="text-lotus font-bold text-lg pr-2" aria-hidden>→</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

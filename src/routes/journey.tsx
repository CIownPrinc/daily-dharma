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
        {journey.map((realm) => (
          <section key={realm.realm}>
            <h2 className="font-serif text-xl md:text-2xl text-ink mb-5">{realm.realm}</h2>
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
                      className="group flex items-center gap-4 bg-card rounded-2xl p-3 ring-1 ring-ink/5 shadow-soft hover:shadow-petal transition-shadow relative"
                    >
                      <span
                        className={cn(
                          "absolute -left-[1.45rem] top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-jasmine",
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
          </section>
        ))}
      </div>
    </AppShell>
  );
}

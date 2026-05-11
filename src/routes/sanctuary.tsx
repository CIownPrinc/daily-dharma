import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StreakBadge } from "@/components/streak-badge";
import { LevelCard } from "@/components/level-card";
import { useProgress } from "@/lib/use-progress";
import { stories } from "@/lib/dharma-data";

export const Route = createFileRoute("/sanctuary")({
  head: () => ({
    meta: [
      { title: "My Sanctuary — Dharma Quest" },
      { name: "description", content: "Your quiet space — see the petals you've gathered and the tales you've finished." },
      { property: "og:title", content: "My Sanctuary — Dharma Quest" },
      { property: "og:description", content: "A peaceful space for your progress." },
    ],
  }),
  component: SanctuaryPage,
});

function SanctuaryPage() {
  const { progress, hydrated } = useProgress();
  const finished = stories.filter((s) => progress.completedStories.includes(s.slug));
  const todayCount = hydrated
    ? progress.completedMissions.filter((m) => m.endsWith(new Date().toISOString().slice(0, 10))).length
    : 0;

  return (
    <AppShell>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
          My Sanctuary
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          Look how far you've wandered.
        </h1>
      </header>

      <div className="mb-6">
        <LevelCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="md:col-span-1">
          <StreakBadge />
        </div>
        <Stat label="Tales Finished" value={hydrated ? progress.completedStories.length : 0} accent="leaf" />
        <Stat label="Missions Today" value={todayCount} accent="saffron" />
      </div>

      {hydrated && Object.keys(progress.reflections).length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-ink mb-4">Your reflections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(progress.reflections).map(([slug, r]) => {
              const s = stories.find((x) => x.slug === slug);
              if (!s) return null;
              return (
                <div key={slug} className="bg-card rounded-2xl p-5 ring-1 ring-ink/5 shadow-soft">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-1">
                    {r.date}
                  </div>
                  <h3 className="font-serif text-lg text-ink mb-2">{s.title}</h3>
                  <p className="font-serif italic text-ink-soft text-[15px] leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-4">Tales you've heard</h2>
        {finished.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 ring-1 ring-ink/5 text-center">
            <div className="text-3xl mb-3" aria-hidden>✿</div>
            <p className="text-ink-soft font-medium">
              No tales finished yet — your library awaits.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {finished.map((s) => (
              <div key={s.slug} className="bg-card rounded-2xl p-2 ring-1 ring-ink/5 shadow-soft">
                <div className="aspect-square rounded-xl overflow-hidden bg-lotus-soft mb-2">
                  <img src={s.image} alt={s.title} width={1024} height={768} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="px-1.5 pb-1.5">
                  <p className="text-xs font-bold text-ink leading-snug truncate">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink mb-4">For families</h2>
        <div className="bg-leaf-soft rounded-3xl p-6 md:p-8 ring-1 ring-leaf/15">
          <p className="font-serif italic text-lg text-ink mb-4">
            "Tell me a story and I will listen. Live a story and I will remember."
          </p>
          <p className="text-ink-soft font-medium leading-relaxed text-[15px]">
            Try asking your child today: <span className="text-leaf-deep font-bold">What did Krishna do when his village was in danger?</span> Their answer might surprise you — and start a conversation that lasts a lifetime.
          </p>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: "leaf" | "saffron" }) {
  const map = {
    leaf: "bg-leaf-soft text-leaf-deep ring-leaf/15",
    saffron: "bg-saffron-soft text-ink ring-saffron/30",
  };
  return (
    <div className={`rounded-3xl p-5 ring-1 shadow-soft ${map[accent]}`}>
      <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">
        {label}
      </div>
      <div className="font-serif text-3xl tabular-nums">{value}</div>
    </div>
  );
}

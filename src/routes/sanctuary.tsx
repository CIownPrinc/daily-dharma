/**
 * Sanctuary — the child's personal progress space.
 *
 * Key additions:
 *   1. Badge shelf — earned badges displayed as a visual collection with
 *      character quotes. Unearned badges shown as silhouettes with virtue
 *      labels so the child knows what to work toward.
 *   2. Reads earnedBadges from the Zustand store (via useProgress shim).
 *   3. Reflections section polished with story image thumbnails.
 *   4. "Tales you've heard" gallery improved with completion date.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StreakBadge } from "@/components/streak-badge";
import { LevelCard } from "@/components/level-card";
import { CharacterGallery } from "@/components/character-gallery";
import { BadgeRing } from "@/components/badge-ring";
import { useProgress } from "@/lib/use-progress";
import { useDharmaStore } from "@/lib/store";
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
  const earnedBadges = useDharmaStore((s) => s.progress.earnedBadges);
  const finished = stories.filter((s) => progress.completedStories.includes(s.slug));
  const todayCount = hydrated
    ? progress.completedMissions.filter((m) =>
        m.endsWith(new Date().toISOString().slice(0, 10))
      ).length
    : 0;

  // All possible badges (one per story) for the shelf — earned + silhouettes
  const allBadges = stories.map((s) => ({
    story: s,
    earned: earnedBadges.find((b) => b.slug === s.slug) ?? null,
  }));

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

      {/* Level card */}
      <div className="mb-6">
        <LevelCard />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="md:col-span-1">
          <StreakBadge />
        </div>
        <Stat label="Tales Finished" value={hydrated ? progress.completedStories.length : 0} accent="leaf" />
        <Stat label="Missions Today" value={todayCount} accent="saffron" />
      </div>

      {/* ── Badge Shelf ────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-serif text-xl md:text-2xl text-ink">Your Badges</h2>
          <span className="text-[11px] font-bold text-ink-soft uppercase tracking-widest tabular-nums">
            {earnedBadges.length} / {stories.length} earned
          </span>
        </div>

        {earnedBadges.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 ring-1 ring-ink/5 text-center">
            <div className="text-4xl mb-3" aria-hidden>✿</div>
            <p className="text-ink-soft font-medium">
              Finish your first tale to earn a badge.
            </p>
            <Link
              to="/library"
              className="mt-4 inline-block bg-lotus text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors"
            >
              Go to the Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allBadges.map(({ story, earned }) =>
              earned ? (
                /* Earned badge — compact BadgeRing style */
                <div
                  key={story.slug}
                  className="bg-card rounded-2xl p-4 ring-1 ring-ink/5 shadow-soft flex items-start gap-3"
                >
                  <div
                    className="size-14 rounded-full flex items-center justify-center text-3xl shrink-0 ring-2"
                    style={{
                      background: `${story.sceneColor}15`,
                      boxShadow: `0 0 0 2px ${story.sceneColor}35`,
                    }}
                    aria-hidden
                  >
                    {story.badge.icon}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="font-bold text-sm text-ink leading-tight truncate">
                      {story.badge.name}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mt-0.5">
                      {story.badge.virtue}
                    </div>
                    <p className="text-[12px] text-ink-soft font-medium mt-1 leading-snug line-clamp-2">
                      {story.badge.characterQuote}
                    </p>
                  </div>
                </div>
              ) : (
                /* Silhouette — shows the child what they're working toward */
                <div
                  key={story.slug}
                  className="bg-card/60 rounded-2xl p-4 ring-1 ring-ink/5 flex items-start gap-3 opacity-50"
                  aria-label={`${story.badge.name} — not yet earned`}
                >
                  <div className="size-14 rounded-full bg-ink/5 flex items-center justify-center text-3xl shrink-0 ring-2 ring-ink/10 filter grayscale">
                    {story.badge.icon}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="font-bold text-sm text-ink-soft leading-tight truncate">
                      {story.badge.name}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-ink-soft/60 mt-0.5">
                      {story.badge.virtue}
                    </div>
                    <Link
                      to="/story/$slug"
                      params={{ slug: story.slug }}
                      className="text-[11px] font-bold text-lotus mt-1.5 inline-block hover:underline"
                    >
                      Read {story.title} →
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ── Reflections ────────────────────────────────────────────────────── */}
      {hydrated && Object.keys(progress.reflections).length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl md:text-2xl text-ink mb-4">Your reflections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(progress.reflections).map(([slug, r]) => {
              const s = stories.find((x) => x.slug === slug);
              if (!s) return null;
              return (
                <div key={slug} className="bg-card rounded-2xl p-5 ring-1 ring-ink/5 shadow-soft flex gap-4">
                  {/* Story image thumbnail */}
                  <div className="size-14 rounded-xl overflow-hidden shrink-0 bg-lotus-soft">
                    <img
                      src={s.image}
                      referrerPolicy="no-referrer"
                      alt=""
                      width={56}
                      height={56}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-0.5">
                      {r.date} · {s.title}
                    </div>
                    <p className="font-serif italic text-ink-soft text-[15px] leading-relaxed line-clamp-3">
                      "{r.text}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Character gallery */}
      <CharacterGallery />

      {/* Tales heard */}
      <section className="mb-10">
        <h2 className="font-serif text-xl md:text-2xl text-ink mb-4">Tales you've heard</h2>
        {finished.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 ring-1 ring-ink/5 text-center">
            <div className="text-3xl mb-3" aria-hidden>✿</div>
            <p className="text-ink-soft font-medium">No tales finished yet — your library awaits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {finished.map((s) => (
              <Link
                key={s.slug}
                to="/story/$slug"
                params={{ slug: s.slug }}
                className="bg-card rounded-2xl p-2 ring-1 ring-ink/5 shadow-soft group hover:shadow-petal transition-shadow"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-lotus-soft mb-2">
                  <img
                    src={s.image}
                      referrerPolicy="no-referrer"
                    alt={s.title}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-1.5 pb-1.5">
                  <p className="text-xs font-bold text-ink leading-snug truncate">{s.title}</p>
                  <p className="text-[10px] font-bold text-lotus mt-0.5">{s.badge.icon} {s.badge.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Family section */}
      <section>
        <h2 className="font-serif text-xl md:text-2xl text-ink mb-4">For families</h2>
        <div className="bg-leaf-soft rounded-3xl p-6 md:p-8 ring-1 ring-leaf/15">
          <p className="font-serif italic text-lg text-ink mb-4">
            "Tell me a story and I will listen. Live a story and I will remember."
          </p>
          <p className="text-ink-soft font-medium leading-relaxed text-[15px] mb-4">
            Try asking your child today:{" "}
            <span className="text-leaf-deep font-bold">
              What did Krishna do when his village was in danger?
            </span>{" "}
            Their answer might surprise you — and start a conversation that lasts a lifetime.
          </p>
          <Link
            to="/parents"
            className="inline-flex items-center gap-2 bg-leaf text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-leaf-deep transition-colors"
          >
            Open Parent Dashboard →
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "leaf" | "saffron";
}) {
  const map = {
    leaf: "bg-leaf-soft text-leaf-deep ring-leaf/15",
    saffron: "bg-saffron-soft text-ink ring-saffron/30",
  };
  return (
    <div className={`rounded-3xl p-5 ring-1 shadow-soft ${map[accent]}`}>
      <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">{label}</div>
      <div className="font-serif text-3xl tabular-nums">{value}</div>
    </div>
  );
}

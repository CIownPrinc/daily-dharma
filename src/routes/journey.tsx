/**
 * Journey page — visual realm map.
 *
 * Phase 5 changes:
 *   1. Immersive night-sky hero: CSS-only starfield gradient replacing the
 *      flat journey-map.jpg image. The map image had no emotional draw —
 *      a static photo of an illustration doesn't feel like a journey.
 *      The CSS hero uses the same technique as the home screen but in
 *      deep indigo/purple tones to signal "night / exploration / mystery."
 *
 *   2. Realm cards redesigned as "path stones" — each realm has a
 *      scene-colored banner with an emoji landmark, not a plain white card.
 *      This makes the journey feel spatial, like moving through different
 *      worlds rather than scrolling a list.
 *
 *   3. Vertical path connector between realms — a dashed gradient line
 *      with animated dots that pulse when the next realm is unlocked.
 *      Reinforces the "journey" metaphor structurally.
 *
 *   4. Story nodes show the painting thumbnail, completion state, and
 *      the story's badge icon — so the child can see what they've earned
 *      in each realm at a glance.
 *
 *   5. Locked realms show a "one tale away" message with the specific
 *      story to complete, not a generic "finish previous realm" message.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { journey, stories } from "@/lib/dharma-data";
import { useProgress } from "@/lib/use-progress";
import { useDharmaStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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

// Visual metadata per realm — color + emoji landmark for the banner
const REALM_STYLE: Record<string, { color: string; darkColor: string; icon: string }> = {
  "Vrindavan":              { color: "#1a237e", darkColor: "#0d1445", icon: "🪈" },
  "The Forest of Epics":   { color: "#1b5e20", darkColor: "#0a2e0e", icon: "🌿" },
  "Field of Kurukshetra":  { color: "#4a148c", darkColor: "#220a42", icon: "⚔️" },
  "The Twilight Lands":    { color: "#880e4f", darkColor: "#3d0622", icon: "🌙" },
  "The Quiet Hermitage":   { color: "#37474f", darkColor: "#1a2226", icon: "🧘" },
  "The Eternal Sky":       { color: "#0d47a1", darkColor: "#061d40", icon: "⭐" },
};

function realmStyle(name: string) {
  return REALM_STYLE[name] ?? { color: "#1a237e", darkColor: "#0d1445", icon: "✿" };
}

function JourneyPage() {
  const { progress, hydrated } = useProgress();
  const earnedBadges = useDharmaStore((s) => s.progress.earnedBadges);
  const completed = new Set(hydrated ? progress.completedStories : []);

  const realms = journey.map((realm, ri) => {
    const total = realm.nodes.length;
    const done = realm.nodes.filter((n) => completed.has(n.storySlug)).length;
    const prev = ri === 0 ? null : journey[ri - 1]!;
    const prevDone = prev ? prev.nodes.some((n) => completed.has(n.storySlug)) : true;
    const locked = !prevDone;
    // Find the specific story in the previous realm the child should finish
    const unlockStory = prev
      ? stories.find((s) => prev.nodes.some((n) => n.storySlug === s.slug) && !completed.has(s.slug))
      : null;
    return { ...realm, total, done, locked, unlockStory };
  });

  const totalDone = realms.reduce((sum, r) => sum + r.done, 0);
  const totalAll = realms.reduce((sum, r) => sum + r.total, 0);

  return (
    <AppShell>
      {/* ── Immersive night-sky hero ── */}
      <div className="relative -mx-5 md:mx-0 mb-10 rounded-none md:rounded-3xl overflow-hidden min-h-[220px] md:min-h-[260px]">
        {/* Night sky gradient */}
        <div className="journey-hero-sky" aria-hidden />
        {/* Stars */}
        <div className="journey-hero-stars" aria-hidden />
        {/* Crescent moon */}
        <div className="journey-hero-moon" aria-hidden />
        {/* Mountain silhouettes — deeper/darker variant */}
        <div className="journey-hero-mountains" aria-hidden />

        {/* Content */}
        <div className="relative z-10 px-6 pt-10 pb-8 md:px-8 md:pt-12 md:pb-10">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
            Your Journey
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white leading-snug text-balance drop-shadow-sm">
            A garden of paths to wander.
          </h1>
          <p className="text-white/60 font-medium text-sm mt-2">
            Each realm holds its own wisdom. Walk slowly.
          </p>

          {/* Overall progress pill */}
          <div className="inline-flex items-center gap-3 mt-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <span className="text-white font-bold text-sm tabular-nums">
              {totalDone} of {totalAll} tales heard
            </span>
            <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-orange-300 rounded-full transition-all duration-700"
                style={{ width: totalAll ? `${(totalDone / totalAll) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Realm path ── */}
      <div className="relative">
        {realms.map((realm, ri) => {
          const style = realmStyle(realm.realm);
          const pct = realm.total ? (realm.done / realm.total) * 100 : 0;
          const isLast = ri === realms.length - 1;

          return (
            <div key={realm.realm} className="relative">
              {/* Connector between realms */}
              {ri > 0 && (
                <div className="flex flex-col items-center my-1" aria-hidden>
                  <div className={cn(
                    "w-px h-8 transition-all duration-700",
                    realm.locked
                      ? "bg-gradient-to-b from-ink/15 to-ink/5"
                      : "bg-gradient-to-b from-lotus/60 to-leaf/40"
                  )} />
                  <div className={cn(
                    "size-3 rounded-full ring-2 transition-all duration-500",
                    realm.locked
                      ? "bg-ink/10 ring-ink/10"
                      : "bg-lotus ring-lotus/30 animate-gentle-pulse"
                  )} />
                  <div className={cn(
                    "w-px h-8 transition-all duration-700",
                    realm.locked
                      ? "bg-gradient-to-b from-ink/5 to-transparent"
                      : "bg-gradient-to-b from-leaf/40 to-transparent"
                  )} />
                </div>
              )}

              {/* Realm card */}
              <section
                className={cn(
                  "rounded-3xl overflow-hidden ring-1 shadow-soft transition-all duration-500",
                  realm.locked
                    ? "ring-ink/5 opacity-75"
                    : "ring-ink/5 hover:shadow-petal"
                )}
              >
                {/* Realm banner */}
                <div
                  className="relative h-[72px] flex items-center px-5 gap-4"
                  style={{
                    background: `linear-gradient(135deg, ${style.darkColor}, ${style.color})`,
                  }}
                >
                  <span className="text-3xl" aria-hidden>{style.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-lg md:text-xl text-white leading-tight truncate">
                      {realm.realm}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Mini progress bar inside banner */}
                      <div className="flex-1 max-w-[120px] h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/70 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/60 tabular-nums">
                        {realm.done}/{realm.total}
                      </span>
                    </div>
                  </div>
                  {realm.locked && (
                    <span className="text-xl opacity-60" aria-label="Locked" aria-hidden>🔒</span>
                  )}
                  {!realm.locked && realm.done === realm.total && realm.total > 0 && (
                    <span className="text-xl" aria-label="Complete" aria-hidden>✿</span>
                  )}
                </div>

                {/* Realm body */}
                <div className="bg-card p-4 md:p-5">
                  {realm.locked ? (
                    /* Locked state — specific unlock guidance */
                    <div className="flex items-center gap-4 py-3">
                      <div
                        className="size-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: `${style.color}15` }}
                        aria-hidden
                      >
                        🔒
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink mb-0.5">
                          This realm is sleeping.
                        </p>
                        {realm.unlockStory ? (
                          <p className="text-xs text-ink-soft font-medium">
                            Hear{" "}
                            <Link
                              to="/story/$slug"
                              params={{ slug: realm.unlockStory.slug }}
                              className="font-bold text-lotus hover:underline"
                            >
                              {realm.unlockStory.title}
                            </Link>
                            {" "}to wake it.
                          </p>
                        ) : (
                          <p className="text-xs text-ink-soft font-medium">
                            Finish a tale in the previous realm to open this one.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Unlocked — story nodes */
                    <div className="relative pl-7">
                      {/* Vertical rail line */}
                      <span
                        className="absolute left-3 top-3 bottom-3 w-px"
                        style={{
                          background: `linear-gradient(to bottom, ${style.color}50, ${style.color}15)`,
                        }}
                        aria-hidden
                      />

                      <div className="space-y-3">
                        {realm.nodes.map((node, idx) => {
                          const story = stories.find((s) => s.slug === node.storySlug);
                          if (!story) return null;
                          const done = completed.has(story.slug);
                          const badge = earnedBadges.find((b) => b.slug === story.slug);

                          return (
                            <Link
                              key={node.storySlug}
                              to="/story/$slug"
                              params={{ slug: story.slug }}
                              className="group flex items-center gap-3 bg-jasmine/50 hover:bg-jasmine rounded-2xl p-3 ring-1 ring-ink/5 hover:shadow-petal transition-all relative"
                            >
                              {/* Node dot on the rail */}
                              <span
                                className={cn(
                                  "absolute -left-[1.55rem] top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-[9px] font-bold ring-[3px] ring-card transition-all duration-300",
                                  done
                                    ? "text-white"
                                    : "border border-current text-lotus-deep"
                                )}
                                style={done ? { background: style.color } : { background: "white", borderColor: `${style.color}50` }}
                                aria-hidden
                              >
                                {done ? "✓" : idx + 1}
                              </span>

                              {/* Story thumbnail */}
                              <StoryThumb src={story.image} alt="" done={done} sceneColor={style.color} />

                              {/* Story info */}
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                                  style={{ color: style.color }}>
                                  {node.label} · {story.duration}
                                </div>
                                <h3 className="font-serif text-base text-ink truncate leading-tight">
                                  {story.title}
                                </h3>
                                <p className="text-[12px] text-ink-soft font-medium truncate mt-0.5">
                                  {story.blurb}
                                </p>
                              </div>

                              {/* Badge earned indicator */}
                              {badge ? (
                                <div
                                  className="size-9 rounded-full flex items-center justify-center text-lg shrink-0"
                                  style={{ background: `${style.color}15` }}
                                  title={badge.name}
                                  aria-label={`Badge earned: ${badge.name}`}
                                >
                                  {story.badge.icon}
                                </div>
                              ) : (
                                <span className="text-lotus font-bold text-base pr-1 shrink-0" aria-hidden>→</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

/**
 * StoryThumb — image with shimmer skeleton placeholder.
 * Shared between JourneyPage and StoryCard (same pattern).
 */
function StoryThumb({
  src,
  alt,
  done,
  sceneColor,
}: {
  src: string;
  alt: string;
  done: boolean;
  sceneColor: string;
}) {
  return (
    <div className="size-16 md:size-18 rounded-xl overflow-hidden shrink-0 relative bg-lotus-soft">
      <img
        src={src}
        alt={alt}
        width={256}
        height={192}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cn(
          "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
          done && "brightness-90"
        )}
      />
      {done && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-hidden
        >
          <span
            className="size-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: sceneColor }}
          >
            ✓
          </span>
        </div>
      )}
    </div>
  );
}

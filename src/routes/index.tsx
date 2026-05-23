/**
 * Home screen — the emotional entry point of the app.
 *
 * Key changes from original:
 *   1. Personalized greeting uses child's name from profile store.
 *   2. Immersive sunrise header (CSS-only, no JS canvas) creates the
 *      "temple at golden hour" feeling from the blueprint.
 *   3. Notification card gives the daily narrative hook ("Krishna has
 *      a story for you today!") to reinforce the habit loop.
 *   4. Level progress bar is promoted to the hero area so the child
 *      immediately sees their progress.
 *   5. Stars, sun, and mountain silhouette are pure CSS — zero JS,
 *      no layout shift, no performance cost.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { MissionCard } from "@/components/mission-card";
import { ChantCard } from "@/components/chant-card";
import { StreakBadge } from "@/components/streak-badge";
import { LevelCard } from "@/components/level-card";
import { OmBreathing } from "@/components/om-breathing";
import { stories, missions, chants } from "@/lib/dharma-data";
import { useProfile } from "@/lib/use-profile";
import { useProgress } from "@/lib/use-progress";
import { useDharmaStore } from "@/lib/store";
import { getLevel } from "@/lib/levels";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const NOTIFICATIONS = [
  { icon: "🪈", text: "Krishna has a story for you today!" },
  { icon: "🐒", text: "Hanuman is waiting to share his leap." },
  { icon: "⭐", text: "Dhruva's steady heart has a lesson just for you." },
  { icon: "🌙", text: "Savitri walks beside the stars tonight." },
  { icon: "🏹", text: "Arjuna's question is your question too." },
];

function HomePage() {
  const { profile } = useProfile();
  const { progress, hydrated } = useProgress();

  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const story = stories[dayIndex % stories.length]!;
  const mission = missions[dayIndex % missions.length]!;
  const chant = chants[dayIndex % chants.length]!;
  const notif = NOTIFICATIONS[dayIndex % NOTIFICATIONS.length]!;

  const firstName = profile?.name?.split(" ")[0] ?? null;
  const petals = hydrated ? progress.petals : 0;
  const level = getLevel(petals);
  const justEarnedStreak = useDharmaStore((s) => s.justEarnedStreak);
  const clearStreakToast = useDharmaStore((s) => s.clearStreakToast);

  // Fire streak toast once, immediately after hydration sets the flag.
  // clearStreakToast() resets the flag so it never fires twice.
  useEffect(() => {
    if (!justEarnedStreak) return;
    const streak = progress.streak;
    const messages: Record<number, string> = {
      2:  "Two days in a row! The journey continues. 🌱",
      3:  "Three days of stories! The flame grows. 🔥",
      5:  "Five days! You're becoming a true Seeker. ✨",
      7:  "Seven days — a full week of wisdom! 🌟",
      10: "Ten days in a row! Hanuman himself is proud. 🐒",
      14: "Fourteen days! You walk the dharma path. 🪷",
      21: "Three weeks! The world bows to your dedication. 🙏",
      30: "Thirty days. You are a Dharma Keeper now. 🏆",
    };
    const msg = messages[streak] ?? `${streak} days in a row! Keep the light burning. 🔥`;
    toast(msg, {
      duration: 4500,
      icon: "🔥",
    });
    clearStreakToast();
  }, [justEarnedStreak, clearStreakToast, progress.streak]);

  return (
    <AppShell>
      {/* ── Immersive sunrise hero ── */}
      {/* CSS-only: gradient background + star pseudo-elements + mountain clip-path */}
      <div className="relative -mx-5 md:mx-0 mb-8 md:mb-10 rounded-none md:rounded-3xl overflow-hidden">
        {/* Sky gradient */}
        <div className="home-hero-sky" aria-hidden />

        {/* Sun */}
        <div className="home-hero-sun" aria-hidden />

        {/* Mountain silhouette */}
        <div className="home-hero-mountains" aria-hidden />

        {/* Content overlay */}
        <div className="relative z-10 px-5 pt-10 pb-8 md:px-8 md:pt-12 md:pb-10">
          {/* Greeting */}
          <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">
            {greeting()}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white leading-snug mb-2 text-balance drop-shadow-sm">
            {firstName ? (
              <>Welcome back, <span className="text-amber-200">{firstName}</span>.</>
            ) : (
              "The courtyard is quiet today."
            )}
          </h1>

          {/* Streak pill */}
          {hydrated && progress.streak > 1 && (
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mt-2">
              <span aria-hidden>🔥</span>
              <span className="text-white font-bold text-sm tabular-nums">
                {progress.streak} day streak
              </span>
            </div>
          )}

          {/* Mini level bar */}
          <div className="mt-4 max-w-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/70 text-[11px] font-bold uppercase tracking-widest">
                {level.name}
              </span>
              <span className="text-white/60 text-[11px] font-bold tabular-nums">
                {petals} petals
              </span>
            </div>
            <div
              className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(level.progressPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress toward ${level.next !== null ? "next level" : "mastery"}`}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-orange-300 rounded-full transition-all duration-700"
                style={{ width: `${level.progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Daily notification card ── */}
      <div className="bg-indigo-950/90 rounded-2xl px-4 py-3.5 mb-6 flex items-center gap-3 shadow-soft ring-1 ring-white/5">
        <span className="text-2xl shrink-0" aria-hidden>{notif.icon}</span>
        <div>
          <p className="text-white font-bold text-sm leading-snug">{notif.text}</p>
          <p className="text-white/50 text-xs font-medium mt-0.5">Tap the story below to begin</p>
        </div>
      </div>

      {/* ── Today's featured story ── */}
      <section className="mb-8 md:mb-10">
        <StoryCard story={story} featured />
      </section>

      {/* ── Habit cards ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
        <MissionCard mission={mission} />
        <ChantCard chant={chant} />
      </section>

      {/* ── Om breathing ── */}
      <section className="mb-10">
        <OmBreathing />
      </section>

      {/* ── More tales ── */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-serif text-xl md:text-2xl text-ink">More tales to discover</h2>
          <Link to="/library" className="text-sm font-bold text-lotus hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {stories
            .filter((s) => s.slug !== story.slug)
            .slice(0, 3)
            .map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
        </div>
      </section>
    </AppShell>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

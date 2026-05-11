import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { MissionCard } from "@/components/mission-card";
import { ChantCard } from "@/components/chant-card";
import { StreakBadge } from "@/components/streak-badge";
import { LevelCard } from "@/components/level-card";
import { OmBreathing } from "@/components/om-breathing";
import { stories, missions, chants } from "@/lib/dharma-data";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  // Pick "today's" content deterministically by day-of-year so it's stable
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const story = stories[dayIndex % stories.length]!;
  const mission = missions[dayIndex % missions.length]!;
  const chant = chants[dayIndex % chants.length]!;

  return (
    <AppShell>
      <header className="flex items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <p className="text-sm md:text-base text-ink-soft font-medium mb-1">
            {greeting()}, little one.
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance leading-tight">
            The courtyard is quiet today.
          </h1>
        </div>
        <div className="hidden md:block shrink-0">
          <StreakBadge />
        </div>
        <div className="md:hidden shrink-0">
          <StreakBadge compact />
        </div>
      </header>

      <section className="mb-6 md:mb-8">
        <LevelCard />
      </section>

      <section className="mb-8 md:mb-10">
        <StoryCard story={story} featured />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
        <MissionCard mission={mission} />
        <ChantCard chant={chant} />
      </section>

      <section className="mb-10">
        <OmBreathing />
      </section>

      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-serif text-xl md:text-2xl text-ink">More tales to discover</h2>
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

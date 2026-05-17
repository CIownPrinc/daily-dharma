/**
 * Parent dashboard — improved with:
 *   1. Today's activity summary at the top (stories done today, petals today)
 *   2. Badge earned shown alongside each completed story card
 *   3. Per-story discussion prompts co-located with story data
 *   4. Bedtime story suggestion based on last completed realm
 *   5. Reads earnedBadges from store for richer display
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ParentGate } from "@/components/parent-gate";
import { useProgress } from "@/lib/use-progress";
import { useProfile } from "@/lib/use-profile";
import { useDharmaStore } from "@/lib/store";
import { stories } from "@/lib/dharma-data";
import { getLevel } from "@/lib/levels";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "For Parents — Dharma Quest" },
      { name: "description", content: "See what your child is learning and find conversation prompts to share at the dinner table." },
      { property: "og:title", content: "For Parents — Dharma Quest" },
      { property: "og:description", content: "Discussion prompts and progress for grown-ups." },
    ],
  }),
  component: ParentsPage,
});

function ParentsPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <AppShell>
        <ParentGate onPass={() => setUnlocked(true)} onCancel={() => history.back()} />
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-3" aria-hidden>🛡️</div>
            <h1 className="font-serif text-2xl text-ink mb-2">A quiet area for grown-ups</h1>
            <p className="text-ink-soft text-sm">
              Solve the small math question to see what your child is learning.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return <ParentDashboard />;
}

function ParentDashboard() {
  const { progress, hydrated } = useProgress();
  const { profile } = useProfile();
  const earnedBadges = useDharmaStore((s) => s.progress.earnedBadges);
  const finished = stories.filter((s) => progress.completedStories.includes(s.slug));
  const level = getLevel(progress.petals);
  const petalsToGo = level.next ? Math.max(0, level.next - progress.petals) : 0;
  const nextName = level.index === 0 ? "Disciple" : level.index === 1 ? "Dharma Keeper" : null;
  const today = new Date().toISOString().slice(0, 10);
  const missionsToday = hydrated
    ? progress.completedMissions.filter((m) => m.endsWith(today)).length
    : 0;

  // Suggest a bedtime story based on the last completed realm
  const lastDoneSlug = progress.completedStories[progress.completedStories.length - 1];
  const lastDoneStory = stories.find((s) => s.slug === lastDoneSlug);
  const bedtimeSuggestion = lastDoneStory
    ? stories.find((s) => s.realm === lastDoneStory.realm && !progress.completedStories.includes(s.slug)) ??
      stories.find((s) => !progress.completedStories.includes(s.slug))
    : stories[0];

  const childName = profile?.name ?? "your child";
  const firstName = childName.split(" ")[0];

  return (
    <AppShell>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-leaf-deep mb-2">
          For Parents
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          {firstName ? `${firstName}'s journey so far` : "Your child's journey"}
        </h1>
        <p className="text-ink-soft mt-2 text-[15px] max-w-prose">
          Here's what {firstName} has been exploring — and gentle questions you can ask tonight.
        </p>
      </header>

      {/* ── Today's snapshot ── */}
      <section className="mb-8 bg-leaf-soft rounded-3xl p-5 ring-1 ring-leaf/15">
        <div className="text-[11px] font-bold uppercase tracking-widest text-leaf-deep mb-3">
          Today's Activity
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="font-serif text-2xl text-leaf-deep tabular-nums">
              {hydrated ? progress.completedStories.length : 0}
            </div>
            <div className="text-[10px] font-bold text-ink-soft uppercase tracking-widest mt-0.5">
              Tales total
            </div>
          </div>
          <div className="text-center">
            <div className="font-serif text-2xl text-leaf-deep tabular-nums">{missionsToday}</div>
            <div className="text-[10px] font-bold text-ink-soft uppercase tracking-widest mt-0.5">
              Missions today
            </div>
          </div>
          <div className="text-center">
            <div className="font-serif text-2xl text-leaf-deep tabular-nums">
              {hydrated ? progress.streak : 0}
            </div>
            <div className="text-[10px] font-bold text-ink-soft uppercase tracking-widest mt-0.5">
              Day streak
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Tales finished" value={hydrated ? progress.completedStories.length : 0} />
        <Stat label="Petals earned" value={hydrated ? progress.petals : 0} />
        <Stat label="Badges earned" value={earnedBadges.length} />
        <Stat label="Level" value={level.name} />
      </section>

      {/* Level progress nudge */}
      {nextName && hydrated && petalsToGo > 0 && (
        <section className="mb-8 bg-card rounded-2xl p-4 ring-1 ring-ink/5 shadow-soft">
          <p className="text-sm text-ink-soft font-medium">
            <span className="font-bold text-ink">{petalsToGo} more petals</span> until {firstName} becomes a{" "}
            <span className="font-bold text-leaf-deep">{nextName}</span>.
            They earn petals by finishing stories, completing missions, and writing reflections.
          </p>
        </section>
      )}

      {/* ── Bedtime suggestion ── */}
      {bedtimeSuggestion && (
        <section className="mb-8">
          <h2 className="font-serif text-xl text-ink mb-3">🌙 Bedtime suggestion</h2>
          <Link
            to="/story/$slug"
            params={{ slug: bedtimeSuggestion.slug }}
            className="flex items-center gap-4 bg-card rounded-2xl p-4 ring-1 ring-ink/5 shadow-soft hover:shadow-petal transition-shadow group"
          >
            <div className="size-16 rounded-xl overflow-hidden shrink-0 bg-lotus-soft">
              <img
                src={bedtimeSuggestion.image}
                alt=""
                width={64}
                height={64}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-0.5">
                {bedtimeSuggestion.realm} · {bedtimeSuggestion.duration}
              </div>
              <h3 className="font-serif text-lg text-ink truncate">{bedtimeSuggestion.title}</h3>
              <p className="text-xs text-ink-soft font-medium mt-0.5 line-clamp-1">
                {bedtimeSuggestion.blurb}
              </p>
            </div>
            <span className="text-lotus font-bold text-lg pr-1 shrink-0" aria-hidden>→</span>
          </Link>
        </section>
      )}

      {/* ── Completed stories with discussion prompts ── */}
      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-4">Talk about it tonight</h2>
        {finished.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 ring-1 ring-ink/5 text-center text-ink-soft text-sm">
            Once {firstName} finishes a tale, gentle conversation prompts will appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {finished.map((s) => {
              const badge = earnedBadges.find((b) => b.slug === s.slug);
              return (
                <article key={s.slug} className="bg-card rounded-2xl ring-1 ring-ink/5 shadow-soft overflow-hidden">
                  {/* Story header with image */}
                  <div className="flex items-center gap-3 p-4 border-b border-border/50">
                    <div className="size-12 rounded-xl overflow-hidden shrink-0 bg-lotus-soft">
                      <img src={s.image} alt="" width={48} height={48} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-0.5">
                        {s.realm}
                      </div>
                      <h3 className="font-serif text-base text-ink truncate">{s.title}</h3>
                    </div>
                    {badge && (
                      <div
                        className="size-10 rounded-full flex items-center justify-center text-xl shrink-0"
                        style={{ background: `${s.sceneColor}18` }}
                        title={`Badge earned: ${badge.name}`}
                        aria-label={`Badge earned: ${badge.name}`}
                      >
                        {s.badge.icon}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Lesson */}
                    <p className="text-xs text-ink-soft font-medium mb-3 italic">
                      Lesson: {s.lesson}
                    </p>

                    {/* Badge note */}
                    {badge && (
                      <div className="flex items-center gap-2 mb-3 bg-saffron-soft rounded-xl px-3 py-2">
                        <span className="text-base" aria-hidden>{s.badge.icon}</span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">Badge earned: </span>
                          <span className="text-xs font-bold text-ink">{badge.name}</span>
                          <span className="text-[10px] text-ink-soft"> · {s.badge.virtue}</span>
                        </div>
                      </div>
                    )}

                    {/* Discussion prompts */}
                    <div className="bg-lotus-soft rounded-xl p-3 mb-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-2">
                        Ask {firstName}
                      </div>
                      <ul className="text-sm text-ink space-y-1.5 list-disc list-inside marker:text-lotus">
                        {discussionPrompts(s.slug, s.character.name).map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Child's reflection */}
                    {progress.reflections[s.slug] && (
                      <div className="bg-jasmine/60 rounded-xl p-3">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-leaf-deep mb-1">
                          {firstName}'s reflection
                        </div>
                        <p className="font-serif italic text-sm text-ink">
                          "{progress.reflections[s.slug]!.text}"
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="text-center">
        <Link to="/" className="text-sm font-bold text-ink-soft hover:text-ink">
          ← Back to today
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-card rounded-2xl p-4 ring-1 ring-ink/5 shadow-soft">
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-1">{label}</div>
      <div className="font-serif text-2xl text-ink tabular-nums">{value}</div>
    </div>
  );
}

/**
 * Discussion prompts are co-located with story slugs here.
 * Each story gets 1-2 specific prompts + 1 universal prompt.
 * Blueprint recommendation: recall / connection / extension structure.
 */
function discussionPrompts(slug: string, character: string): string[] {
  const specific: Record<string, string[]> = {
    "boy-who-held-the-mountain": [
      "Can you show me a time today when you protected or helped someone?",
      "If you could hold up an umbrella for your whole family, what would you protect them from?",
    ],
    "leap-to-lanka": [
      "What's one thing you think you can't do — but maybe you secretly can?",
      "Who helps you remember how strong you are when you forget?",
    ],
    "sage-and-the-river": [
      "Can we sit together for one whole minute and watch something quietly?",
      "What do you notice when you stop being busy and just listen?",
    ],
    "rama-and-the-deer": [
      "What's one promise you'd like to make this week — and keep?",
      "Was there a moment today when you were kind even when no one was watching?",
    ],
    "ganesha-and-the-mouse": [
      "Is there someone in your life who people might overlook — but who matters to you?",
      "How does it feel when someone notices you, even when you're small or quiet?",
    ],
    "arjunas-choice": [
      "Did you face a hard choice today? What did your heart tell you?",
      "What does 'doing what is right' mean to you right now?",
    ],
    "draupadis-courage": [
      "Was there a moment today when you wanted to speak up but didn't? What stopped you?",
      "What would you say if you were as brave as Draupadi?",
    ],
    "eklavyas-practice": [
      "What's something you'd love to get really good at, even if no one teaches you?",
      "Can we practice something together for 10 minutes this week?",
    ],
    "savitri-and-the-stars": [
      "What's the biggest question you've been wondering about lately?",
      "If you could ask a wise person anything, what would you ask?",
    ],
    "prahlads-faith": [
      "What's something you love so much it makes you feel brave?",
      "How do you stay yourself when someone tries to change you?",
    ],
    "dhruva-and-the-pole-star": [
      "What's one quiet thing you could do every day this week?",
      "What do you want to be steady and reliable about — like the Pole Star?",
    ],
    "nachiketas-questions": [
      "What's a big question you've been wondering about — even if it's scary to ask?",
      "What matters more to you: understanding something true, or getting something you want?",
    ],
    "markandeya-and-time": [
      "Who do you love so much that you'd hold on to them forever?",
      "What does 'love is stronger than time' mean to you?",
    ],
  };

  const universal = `What was your favorite moment in ${character}'s story, and why?`;
  return [...(specific[slug] ?? []), universal].slice(0, 3);
}

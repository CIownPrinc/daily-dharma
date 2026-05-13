import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ParentGate } from "@/components/parent-gate";
import { useProgress } from "@/lib/use-progress";
import { useProfile } from "@/lib/use-profile";
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
  const finished = stories.filter((s) => progress.completedStories.includes(s.slug));
  const level = getLevel(progress.petals);
  const petalsToGo = level.next ? Math.max(0, level.next - progress.petals) : 0;
  const nextName = level.index === 0 ? "Disciple" : level.index === 1 ? "Dharma Keeper" : null;

  return (
    <AppShell>
      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-leaf-deep mb-2">
          For Parents
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          {profile ? `${profile.name}'s journey so far` : "Your child's journey"}
        </h1>
        <p className="text-ink-soft mt-2 text-[15px] max-w-prose">
          Here's what your child has been exploring — and gentle questions you can ask at the dinner table tonight.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Stat label="Tales finished" value={hydrated ? progress.completedStories.length : 0} />
        <Stat label="Petals earned" value={hydrated ? progress.petals : 0} />
        <Stat label="Day streak" value={hydrated ? progress.streak : 0} />
        <Stat label="Level" value={level.name} />
      </section>

      {nextName && hydrated && (
        <section className="mb-10 bg-leaf-soft rounded-3xl p-5 ring-1 ring-leaf/15">
          <p className="text-sm text-ink-soft font-medium">
            <span className="font-bold text-ink">{petalsToGo} more petals</span> until they
            become a <span className="font-bold text-leaf-deep">{nextName}</span>.
          </p>
        </section>
      )}

      <section className="mb-10">
        <h2 className="font-serif text-xl text-ink mb-4">Talk about it tonight</h2>
        {finished.length === 0 ? (
          <div className="bg-card rounded-2xl p-6 ring-1 ring-ink/5 text-center text-ink-soft text-sm">
            Once your child finishes a tale, gentle conversation prompts will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {finished.map((s) => (
              <article key={s.slug} className="bg-card rounded-2xl p-5 ring-1 ring-ink/5 shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-1">
                  {s.realm}
                </div>
                <h3 className="font-serif text-lg text-ink mb-1">{s.title}</h3>
                <p className="text-xs text-ink-soft font-medium mb-3">
                  Lesson: <span className="italic">{s.lesson}</span>
                </p>
                <div className="bg-lotus-soft rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-1">
                    Ask {profile?.name ?? "your child"}
                  </div>
                  <ul className="text-sm text-ink space-y-1.5 list-disc list-inside marker:text-lotus">
                    {discussionPrompts(s.slug, s.character.name).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                {progress.reflections[s.slug] && (
                  <div className="mt-3 bg-jasmine/60 rounded-xl p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-leaf-deep mb-1">
                      Their reflection
                    </div>
                    <p className="font-serif italic text-sm text-ink">
                      "{progress.reflections[s.slug].text}"
                    </p>
                  </div>
                )}
              </article>
            ))}
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
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-1">
        {label}
      </div>
      <div className="font-serif text-2xl text-ink tabular-nums">{value}</div>
    </div>
  );
}

function discussionPrompts(slug: string, character: string): string[] {
  const generic = [
    `What was your favorite part of ${character}'s story?`,
    `What would you have done if you were ${character}?`,
  ];
  const specific: Record<string, string[]> = {
    "boy-who-held-the-mountain": [
      "When did you feel like a helper today?",
      "Who do you want to keep safe?",
    ],
    "leap-to-lanka": [
      "What's one thing you think you can't do — but you secretly can?",
    ],
    "sage-and-the-river": [
      "Can we sit and watch something together for one whole minute?",
    ],
    "rama-and-the-deer": [
      "What's one promise you'd like to keep this week?",
    ],
    "ganesha-and-the-mouse": [
      "Who is a friend you have that some people might overlook?",
    ],
    "arjunas-choice": [
      "Was there a hard choice you had to make today?",
    ],
    "draupadis-courage": [
      "Was there a moment today when you wanted to speak up?",
    ],
    "eklavyas-practice": [
      "What's something you'd love to get really good at?",
    ],
    "savitri-and-the-stars": [
      "What's a question you wish you could ask a wise person?",
    ],
    "prahlads-faith": [
      "What's something you love so much it makes you feel brave?",
    ],
    "dhruva-and-the-pole-star": [
      "What's one quiet thing you can do every day this week?",
    ],
    "nachiketas-questions": [
      "What's a big question you've been wondering about?",
    ],
    "markandeya-and-time": [
      "Who do you love so much you want to hold onto them forever?",
    ],
  };
  return [...(specific[slug] ?? []), ...generic].slice(0, 3);
}

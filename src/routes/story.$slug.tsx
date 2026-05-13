import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { stories, missions, type Story, type Mission } from "@/lib/dharma-data";
import { Confetti } from "@/components/confetti";
import { useProgress } from "@/lib/use-progress";
import { useNarrator } from "@/lib/use-narrator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/story/$slug")({
  loader: ({ params }) => {
    const story = stories.find((s) => s.slug === params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.story.title} — Dharma Quest` },
          { name: "description", content: loaderData.story.blurb },
          { property: "og:title", content: loaderData.story.title },
          { property: "og:description", content: loaderData.story.blurb },
          { property: "og:image", content: loaderData.story.image },
          { name: "twitter:image", content: loaderData.story.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="text-center py-20">
        <h1 className="font-serif text-3xl text-ink">This tale is missing</h1>
        <Link to="/library" className="text-lotus font-bold mt-4 inline-block">
          ← Back to the library
        </Link>
      </div>
    </AppShell>
  ),
  errorComponent: ({ error }) => (
    <AppShell>
      <div className="text-center py-20">
        <h1 className="font-serif text-2xl text-ink">Something went quiet.</h1>
        <p className="text-ink-soft mt-2 text-sm">{error.message}</p>
      </div>
    </AppShell>
  ),
  component: StoryPage,
});

function StoryPage() {
  const { story } = Route.useLoaderData() as { story: Story };
  const [pageIdx, setPageIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const [choiceIdx, setChoiceIdx] = useState<number | null>(null);
  const { completeStory } = useProgress();
  const narrator = useNarrator();

  // Stop narration when changing page or unmounting
  useEffect(() => {
    return () => narrator.stop();
  }, [pageIdx, narrator]);

  const page = story.pages[pageIdx]!;
  const isLast = pageIdx === story.pages.length - 1;
  const choiceLocked = !!page.choice && choiceIdx === null;

  const next = () => {
    if (choiceLocked) return;
    if (isLast) {
      completeStory(story.slug);
      setFinished(true);
    } else {
      setPageIdx((i) => i + 1);
      setChoiceIdx(null);
    }
  };

  const back = () => {
    setPageIdx((i) => Math.max(0, i - 1));
    setChoiceIdx(null);
  };

  return (
    <AppShell>
      <Link to="/library" className="inline-flex items-center gap-1 text-sm text-ink-soft font-bold mb-6 hover:text-lotus">
        ← The Library
      </Link>

      {!finished ? (
        <article className="bg-card rounded-[2rem] ring-1 ring-ink/5 shadow-petal overflow-hidden">
          <div className="aspect-[16/10] md:aspect-[16/8] bg-lotus-soft overflow-hidden relative">
            <img
              src={page.image ?? story.image}
              alt={story.title}
              width={1024}
              height={768}
              className="w-full h-full object-cover transition-opacity duration-500"
              key={pageIdx}
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card/95 to-transparent" />
          </div>

          <div className="p-6 md:p-10">
            <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-3">
              {story.realm} · Page {pageIdx + 1} of {story.pages.length}
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-ink mb-5 text-balance">
              {story.title}
            </h1>

            <p className="font-serif text-lg md:text-xl text-ink leading-relaxed text-pretty min-h-[6rem]">
              {page.text}
            </p>

            {page.wisdom && (
              <div className="mt-6 flex gap-4 items-start bg-lotus-soft rounded-2xl p-5 ring-1 ring-lotus/15">
                <div className="text-3xl shrink-0" aria-hidden>🪔</div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-1">
                    Wisdom of the Story
                  </div>
                  <p className="font-serif italic text-ink leading-snug">{page.wisdom}</p>
                </div>
              </div>
            )}

            {page.choice && (
              <div className="mt-6 bg-jasmine/60 rounded-2xl p-5 ring-1 ring-ink/5">
                <div className="font-bold text-ink mb-3 flex items-start gap-2">
                  <span aria-hidden>🤔</span>
                  <span>{page.choice.question}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {page.choice.options.map((opt: string, i: number) => {
                    const answered = choiceIdx !== null;
                    const isCorrect = i === page.choice!.correctIndex;
                    const isPicked = choiceIdx === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => choiceIdx === null && setChoiceIdx(i)}
                        disabled={answered}
                        className={cn(
                          "text-left px-4 py-3 rounded-xl font-medium text-ink ring-1 transition-colors",
                          !answered && "bg-card ring-ink/10 hover:ring-lotus/40 hover:bg-lotus-soft cursor-pointer",
                          answered && isCorrect && "bg-leaf-soft ring-leaf/40 text-ink",
                          answered && !isCorrect && isPicked && "bg-card ring-ink/10 opacity-60",
                          answered && !isCorrect && !isPicked && "bg-card ring-ink/10 opacity-50",
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {choiceIdx !== null && (
                  <div className="mt-4 text-sm text-ink leading-relaxed bg-leaf-soft/60 rounded-xl px-4 py-3">
                    ✨ {choiceIdx === page.choice.correctIndex
                      ? page.choice.feedback
                      : `That's a kind thought too. ${page.choice.feedback}`}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mt-8 mb-6">
              {story.pages.map((_p, i: number) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === pageIdx ? "bg-lotus w-8" : i < pageIdx ? "bg-lotus/40 w-4" : "bg-ink/10 w-4",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={back}
                disabled={pageIdx === 0}
                className="px-5 py-3 rounded-full font-bold text-sm text-ink-soft hover:text-ink disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                onClick={next}
                disabled={choiceLocked}
                className={cn(
                  "bg-lotus text-primary-foreground px-7 py-3.5 rounded-full font-bold text-base transition-colors shadow-petal",
                  choiceLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-lotus-deep",
                )}
              >
                {isLast ? "Finish the tale ✿" : "Turn the page →"}
              </button>
            </div>
          </div>
        </article>
      ) : (
        <FinishView story={story} />
      )}
    </AppShell>
  );
}

function FinishView({ story }: { story: Story }) {
  const { progress, saveReflection, completeMission, isMissionCompletedToday, hydrated } =
    useProgress();
  const existing = progress.reflections[story.slug]?.text ?? "";
  const [text, setText] = useState(existing);
  const [saved, setSaved] = useState(false);

  // Pick a "post-story" mission deterministically from the story slug
  const missionIdx =
    Math.abs(story.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % missions.length;
  const mission: Mission = missions[missionIdx]!;
  const missionDone = hydrated && isMissionCompletedToday(mission.id);

  const onSave = () => {
    saveReflection(story.slug, text);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  // Find next story for auto-progression
  const idx = stories.findIndex((s) => s.slug === story.slug);
  const nextStory = idx >= 0 ? stories[(idx + 1) % stories.length] : null;

  return (
    <article className="bg-card rounded-[2rem] ring-1 ring-ink/5 shadow-petal p-8 md:p-12 relative">
      <Confetti />
      <div className="text-center">
        <div className="text-5xl mb-4 animate-petal inline-block" aria-hidden>✿</div>
        <h2 className="font-serif text-3xl text-ink mb-3">A petal for you.</h2>
        <p className="text-ink-soft font-medium max-w-prose mx-auto mb-6">
          You've earned <span className="font-bold text-lotus">3 petals</span> for finishing this tale.
        </p>

        <div className="bg-lotus-soft rounded-2xl p-6 md:p-8 max-w-md mx-auto mb-8">
          <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
            Today's Lesson
          </div>
          <p className="font-serif italic text-lg text-ink">{story.lesson}</p>
        </div>
      </div>

      {/* Reflection journal */}
      <section className="max-w-xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-lotus">
            Your Reflection
          </div>
          <span className="text-[10px] font-bold text-ink-soft">+1 petal first time</span>
        </div>
        <h3 className="font-serif text-xl text-ink mb-3">
          What did this story whisper to you?
        </h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="A few words from your heart…"
          className="w-full rounded-2xl bg-jasmine/70 ring-1 ring-ink/10 focus:ring-lotus/40 focus:outline-none p-4 font-serif text-ink placeholder:text-ink-soft/60 transition-shadow"
        />
        <div className="flex items-center justify-end gap-3 mt-2">
          {saved && (
            <span className="text-xs font-bold text-leaf-deep" aria-live="polite">
              ✓ Saved
            </span>
          )}
          <button
            onClick={onSave}
            disabled={!text.trim()}
            className="bg-lotus text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors shadow-petal disabled:opacity-40"
          >
            Save reflection
          </button>
        </div>
      </section>

      {/* Post-story mission */}
      <section className="max-w-xl mx-auto mb-8 bg-leaf-soft rounded-3xl p-6 ring-1 ring-leaf/15">
        <div className="text-[11px] font-bold uppercase tracking-widest text-leaf-deep mb-2">
          Now Take It Into the World
        </div>
        <h3 className="font-serif text-xl text-ink mb-1">{mission.title}</h3>
        <p className="text-ink-soft font-medium leading-relaxed text-[15px] mb-4">
          {mission.description}
        </p>
        <button
          onClick={() => !missionDone && completeMission(mission.id)}
          disabled={missionDone}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-colors",
            missionDone
              ? "bg-leaf text-primary-foreground cursor-default"
              : "bg-card text-leaf-deep ring-1 ring-leaf/30 hover:bg-leaf hover:text-primary-foreground",
          )}
        >
          <span
            className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center text-[10px]",
              missionDone ? "border-primary-foreground bg-primary-foreground/20" : "border-current",
            )}
            aria-hidden
          >
            {missionDone ? "✓" : ""}
          </span>
          {missionDone ? "Done — well lived" : "I'll do this today"}
        </button>
      </section>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="px-7 py-3.5 rounded-full font-bold text-base text-ink-soft hover:text-ink"
        >
          Return to Today
        </Link>
        {nextStory && (
          <Link
            to="/story/$slug"
            params={{ slug: nextStory.slug }}
            className="bg-lotus text-primary-foreground px-7 py-3.5 rounded-full font-bold text-base hover:bg-lotus-deep transition-colors shadow-petal"
          >
            Next tale: {nextStory.title} →
          </Link>
        )}
      </div>
    </article>
  );
}

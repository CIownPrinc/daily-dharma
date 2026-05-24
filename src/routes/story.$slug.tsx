/**
 * Story route — immersive reading experience + reward flow.
 *
 * Key changes:
 *   1. Full-bleed immersive layout: no AppShell padding on this route
 *      (handled by AppShell's isStoryRoute check). The image fills edge-to-edge.
 *   2. Story background color (sceneColor) bleeds behind the text card for
 *      emotional continuity as the child scrolls.
 *   3. FinishView now shows the story's BadgeRing and story-specific mantra
 *      (via ChantCard mantra prop) instead of generic content.
 *   4. completeStory is called with the badge so the store records it.
 *   5. Back button is always accessible but doesn't show the main nav
 *      (handled in AppShell) — the child is fully inside the story.
 */
import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { stories, missions, type Story, type Mission } from "@/lib/dharma-data";
import { Confetti } from "@/components/confetti";
import { BadgeRing } from "@/components/badge-ring";
import { ChantCard } from "@/components/chant-card";
import { useProgress } from "@/lib/use-progress";
import { useProfile } from "@/lib/use-profile";
import { useNarrator } from "@/lib/use-narrator";
import { useDharmaStore } from "@/lib/store";
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
        <Link to="/library" className="text-lotus font-bold mt-4 inline-block">← Back to the library</Link>
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
  // Captured at the moment the child finishes — before completeStory mutates
  // the store. This is the only reliable way to know if this is a first-ever
  // completion vs. a re-read, because the store updates synchronously and
  // any check *after* completeStory() will always return true.
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);
  const [choiceIdx, setChoiceIdx] = useState<number | null>(null);
  const { completeStory, progress } = useProgress();
  const { profile } = useProfile();
  const narratorEnabled = useDharmaStore((s) => s.settings.narratorEnabled);
  const narrator = useNarrator();
  // Keep stable references to speak/stop so effect deps don't change each render.
  // narrator.speak and narrator.stop are already useCallback-wrapped in the hook.
  const { speak, stop, supported } = narrator;

  // Single effect handles both cleanup and auto-play.
  // Merging eliminates the race condition where two effects both watched pageIdx:
  //   Old cleanup: stop() fired AFTER new effect's speak() on fast page turns.
  // Now: cleanup cancels the timer AND stops speech → then body schedules new speak.
  useEffect(() => {
    if (!narratorEnabled || !supported) {
      return () => stop();
    }
    const page = story.pages[pageIdx];
    if (!page) return () => stop();
    const text = [page.text, page.wisdom].filter(Boolean).join(". ");
    // 350ms delay so the page slide animation completes before speech starts.
    const t = setTimeout(() => speak(text), 350);
    return () => {
      clearTimeout(t);
      stop();
    };
  // speak and stop are stable useCallback refs — safe in deps, never stale.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIdx, narratorEnabled, supported]);

  const firstName = profile?.name?.split(" ")[0] ?? null;

  const page = story.pages[pageIdx]!;
  const isLast = pageIdx === story.pages.length - 1;
  const choiceLocked = !!page.choice && choiceIdx === null;

  const next = () => {
    if (choiceLocked) return;
    if (isLast) {
      // Capture first-completion state BEFORE the store updates
      const alreadyDone = progress.completedStories.includes(story.slug);
      setIsFirstCompletion(!alreadyDone);
      completeStory(story.slug, {
        slug: story.slug,
        name: story.badge.name,
        icon: story.badge.icon,
        virtue: story.badge.virtue,
        earnedAt: new Date().toISOString().slice(0, 10),
      });
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

  if (finished) {
    return (
      <AppShell>
        <FinishView story={story} isFirstCompletion={isFirstCompletion} />
      </AppShell>
    );
  }

  return (
    // Full-bleed story layout — no AppShell padding (see app-shell.tsx)
    <AppShell>
      <div
        className="min-h-dvh flex flex-col"
        style={{ background: story.sceneColor }}
      >
        {/* Floating back + progress bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 pt-4 md:pt-6 md:px-6">
          <Link
            to="/library"
            className="size-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white font-bold text-lg shrink-0 hover:bg-black/40 transition-colors"
            aria-label="Back to library"
          >
            ←
          </Link>
          {/* Page progress pills */}
          <div className="flex items-center gap-1.5 flex-1">
            {story.pages.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === pageIdx ? "bg-white w-8" : i < pageIdx ? "bg-white/50 w-4" : "bg-white/25 w-4",
                )}
                aria-hidden
              />
            ))}
          </div>
          {/* Narrator button — toggle narration manually.
              Uses the same stable speak/stop refs from the effect above. */}
          {supported && (
            <button
              type="button"
              onClick={() => {
                if (narrator.speaking) stop();
                else speak([page.text, page.wisdom].filter(Boolean).join(". "));
              }}
              className={cn(
                "inline-flex items-center gap-2 text-xs font-bold rounded-full px-3 py-1.5 ring-1 transition-colors",
                narrator.speaking
                  ? "bg-white text-ink ring-white"
                  : "bg-black/30 backdrop-blur-sm text-white ring-white/20 hover:bg-black/40",
              )}
              aria-label={narrator.speaking ? "Stop narration" : "Listen to this page"}
            >
              <span aria-hidden>{narrator.speaking ? "⏸" : "🔊"}</span>
              {narrator.speaking ? "Pause" : "Read"}
            </button>
          )}
        </div>

        {/* Story image — full bleed hero */}
        <div className="relative flex-shrink-0">
          <div className="aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden">
            <img
              src={page.image ?? story.image}
                  referrerPolicy="no-referrer"
              alt={story.title}
              width={1024}
              height={768}
              className="w-full h-full object-cover transition-opacity duration-500"
              key={pageIdx}
            />
          </div>
          {/* Gradient bridge from image into text card */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${story.sceneColor}, transparent)` }}
            aria-hidden
          />
          {/* Attribution — small, unobtrusive, legally correct */}
          {story.attribution && (
            <div className="absolute bottom-0 right-0 px-2 pb-1 pointer-events-none">
              <span className="text-[9px] text-white/40 font-medium leading-none">
                {story.attribution}
              </span>
            </div>
          )}
        </div>

        {/* Text card — slides up from bottom */}
        <div className="flex-1 flex flex-col rounded-t-3xl -mt-6 relative z-10 bg-card">
          <div className="p-6 md:p-10 flex-1 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
              {story.realm} · Page {pageIdx + 1} of {story.pages.length}
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-ink mb-5 text-balance">
              {story.title}
            </h1>

            <p className="font-serif text-lg md:text-xl text-ink leading-relaxed text-pretty min-h-[5rem] mb-4">
              {page.text}
            </p>

            {/* Character speech bubble — shown on any page that has a speakerLine.
                The line is written in the character's voice and addresses the child
                by first name via {name} placeholder, replaced at render time.
                Page 0 never shows a bubble (let the story open first). */}
            {pageIdx > 0 && page.speakerLine && (
              <div
                className="mb-4 flex items-start gap-3 rounded-2xl p-4 ring-1 ring-ink/5 animate-scene"
                style={{ background: `${story.sceneColor}0d` }}
              >
                <div
                  className="size-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ring-1 ring-ink/5"
                  style={{ background: `${story.sceneColor}18` }}
                  aria-hidden
                >
                  {story.character.emoji}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-lotus mb-1">
                    {story.character.name} says
                  </div>
                  <p className="font-serif italic text-ink text-[15px] leading-relaxed">
                    {firstName
                      ? page.speakerLine.replace(/\{name\}/g, firstName)
                      : page.speakerLine.replace(/\{name\},?\s*/g, "").trim()}
                  </p>
                </div>
              </div>
            )}
            {page.wisdom && (
              <div className="mt-2 mb-4 flex gap-4 items-start bg-lotus-soft rounded-2xl p-5 ring-1 ring-lotus/15">
                <div className="text-3xl shrink-0" aria-hidden>🪔</div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-1">
                    Wisdom of the Story
                  </div>
                  <p className="font-serif italic text-ink leading-snug">{page.wisdom}</p>
                </div>
              </div>
            )}

            {/* Choice interaction */}
            {page.choice && (
              <div className="mt-2 mb-4 bg-jasmine/60 rounded-2xl p-5 ring-1 ring-ink/5">
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
                          "text-left px-4 py-3 rounded-xl font-medium text-ink ring-1 transition-all",
                          !answered && "bg-card ring-ink/10 hover:ring-lotus/40 hover:bg-lotus-soft cursor-pointer",
                          answered && isCorrect && "bg-leaf-soft ring-leaf/40",
                          answered && !isCorrect && isPicked && "bg-card ring-ink/10 opacity-50",
                          answered && !isCorrect && !isPicked && "bg-card ring-ink/10 opacity-40",
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {choiceIdx !== null && (
                  <div
                    className="mt-4 text-sm text-ink leading-relaxed bg-leaf-soft/60 rounded-xl px-4 py-3"
                    aria-live="polite"
                  >
                    ✨{" "}
                    {choiceIdx === page.choice.correctIndex
                      ? page.choice.feedback
                      : `That's a kind thought too. ${page.choice.feedback}`}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3 mt-auto pt-4">
              <button
                onClick={back}
                disabled={pageIdx === 0}
                className="px-5 py-3 rounded-full font-bold text-sm text-ink-soft hover:text-ink disabled:opacity-30 transition-colors"
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
        </div>
      </div>
    </AppShell>
  );
}

function FinishView({ story, isFirstCompletion }: { story: Story; isFirstCompletion: boolean }) {
  const { progress, saveReflection, completeMission, isMissionCompletedToday, hydrated } =
    useProgress();
  const existing = progress.reflections[story.slug]?.text ?? "";
  const [text, setText] = useState(existing);
  const [saved, setSaved] = useState(false);

  const missionIdx =
    Math.abs(story.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % missions.length;
  const mission: Mission = missions[missionIdx]!;
  const missionDone = hydrated && isMissionCompletedToday(mission.id);

  const onSave = () => {
    saveReflection(story.slug, text);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const idx = stories.findIndex((s) => s.slug === story.slug);
  const nextStory = idx >= 0 ? stories[(idx + 1) % stories.length] : null;

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Confetti only on first completion — re-reading feels rewarding
          but shouldn't re-trigger the full celebration every time. */}
      <Confetti run={isFirstCompletion} />

      {/* Badge ring — the emotional peak of the session */}
      <div className="bg-card rounded-[2rem] ring-1 ring-ink/5 shadow-petal p-8 md:p-12 mb-6 text-center">
        <BadgeRing badge={story.badge} sceneColor={story.sceneColor} />

        <div className="mt-8 bg-lotus-soft rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">Today's Lesson</div>
          <p className="font-serif italic text-lg text-ink">{story.lesson}</p>
        </div>

        {isFirstCompletion && (
          <p className="text-ink-soft font-medium text-sm mt-4">
            +3 petals earned · Badge added to your Sanctuary
          </p>
        )}
      </div>

      {/* Story-specific mantra — tied to this story */}
      <div className="mb-6">
        <ChantCard mantra={story.mantra} />
      </div>

      {/* Reflection journal */}
      <section className="bg-card rounded-3xl ring-1 ring-ink/5 shadow-soft p-6 md:p-8 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-lotus">Your Reflection</div>
          <span className="text-[10px] font-bold text-ink-soft">+1 petal first time</span>
        </div>
        <h3 className="font-serif text-xl text-ink mb-3">What did this story whisper to you?</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="A few words from your heart…"
          className="w-full rounded-2xl bg-jasmine/70 ring-1 ring-ink/10 focus:ring-lotus/40 focus:outline-none p-4 font-serif text-ink placeholder:text-ink-soft/60 transition-shadow resize-none"
        />
        <div className="flex items-center justify-end gap-3 mt-2">
          {saved && (
            <span className="text-xs font-bold text-leaf-deep" aria-live="polite">✓ Saved</span>
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
      <section className="bg-leaf-soft rounded-3xl p-6 ring-1 ring-leaf/15 mb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-leaf-deep mb-2">Now Take It Into the World</div>
        <h3 className="font-serif text-xl text-ink mb-1">{mission.title}</h3>
        <p className="text-ink-soft font-medium leading-relaxed text-[15px] mb-4">{mission.description}</p>
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

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/" className="px-7 py-3.5 rounded-full font-bold text-base text-ink-soft hover:text-ink">
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
    </div>
  );
}

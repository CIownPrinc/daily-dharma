/**
 * ChantCard — renders a chant with syllable-by-syllable animation.
 *
 * API change: now accepts an optional `mantra` prop (from Story type) in
 * addition to the existing `chant` prop. When `mantra` is passed (post-story
 * flow), it takes priority — the child chants the mantra from the story they
 * just read, not a generic daily chant.
 *
 * This is the key UX improvement from the blueprint: the mantra is tied to the
 * story, reinforcing the story → habit → identity loop.
 */
import { useEffect, useRef, useState } from "react";
import type { Chant, Mantra } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

// Generic syllable splitter (used for Chant type, which has freeform text).
function splitSyllables(text: string): string[] {
  const tokens: string[] = [];
  for (const line of text.split(/\n+/)) {
    const words = line.split(/\s+/).filter(Boolean);
    for (const w of words) {
      const parts = w
        .replace(/…/g, "")
        .split(/([·\-])/)
        .filter((p) => p && p !== "·" && p !== "-");
      for (const p of parts) {
        if (p.length <= 4) tokens.push(p);
        else {
          const chunks = p.match(/[^aeiouāīūṛḥṃṅñṇ]*[aeiouāīūṛḥṃṅñṇ]+(?:[^aeiouāīūṛḥṃṅñṇ]*$|[^aeiouāīūṛḥṃṅñṇ]?)/gi);
          if (chunks && chunks.length > 1) tokens.push(...chunks);
          else tokens.push(p);
        }
      }
    }
    tokens.push("\n");
  }
  return tokens;
}

type Props =
  | { chant: Chant; mantra?: never }
  | { mantra: Mantra; chant?: never };

export function ChantCard({ chant, mantra }: Props) {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const intRef = useRef<number | null>(null);

  // Use story-specific syllables when available; fall back to generic splitter
  const syllables: string[] = mantra
    ? mantra.syllables
    : splitSyllables(chant!.text);

  const displayText = mantra ? mantra.text : chant!.text;
  const displayMeaning = mantra ? mantra.meaning : chant!.meaning;
  const displayName = mantra ? displayText : chant!.name;

  useEffect(() => {
    if (!playing) return;
    intRef.current = window.setInterval(() => {
      setIdx((i) => {
        const next = i + 1;
        if (next >= syllables.length) {
          setCount((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, 500);
    return () => {
      if (intRef.current) window.clearInterval(intRef.current);
    };
  }, [playing, syllables.length]);

  const reset = () => {
    setPlaying(false);
    setIdx(0);
    setCount(0);
  };

  return (
    <div className="bg-lotus-soft rounded-3xl p-6 md:p-7 ring-1 ring-lotus/15 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lotus text-[11px] font-bold uppercase tracking-widest">
          {mantra ? "Story Mantra" : "Mantra Moment"}
        </div>
        {!mantra && chant && (
          <div className="text-[10px] font-bold text-lotus/80 bg-card px-2.5 py-1 rounded-full tabular-nums">
            {chant.duration}
          </div>
        )}
      </div>

      <h4 className="font-serif text-xl md:text-2xl text-ink mb-2">{displayName}</h4>
      <p className="text-ink-soft font-medium leading-relaxed mb-5 text-[15px]">{displayMeaning}</p>

      {/* Syllable display */}
      <div className="bg-card rounded-2xl p-4 mb-5 ring-1 ring-lotus/10 min-h-16">
        <p className="font-serif text-lotus-deep text-center leading-relaxed text-[16px] flex flex-wrap justify-center gap-x-2 gap-y-1.5">
          {syllables.map((s, i) => {
            if (s === "\n") return <span key={i} className="basis-full h-0" aria-hidden />;
            const active = playing && i === idx;
            const past = playing && i < idx;
            return (
              <span
                key={i}
                className={cn(
                  "italic transition-all duration-200 px-1 rounded",
                  active && "text-lotus scale-125 font-bold bg-lotus/10",
                  past && "text-lotus/50",
                  !playing && "text-lotus-deep",
                )}
              >
                {s}
              </span>
            );
          })}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-3 bg-lotus text-primary-foreground px-5 py-3 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors shadow-petal"
          aria-pressed={playing}
        >
          <span className="size-7 rounded-full bg-primary-foreground/20 flex items-center justify-center" aria-hidden>
            {playing ? (
              <span className="flex gap-0.5">
                <span className="block w-1 h-3 bg-primary-foreground rounded-sm" />
                <span className="block w-1 h-3 bg-primary-foreground rounded-sm" />
              </span>
            ) : (
              <span className="block w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-primary-foreground ml-0.5" />
            )}
          </span>
          {playing ? "Pause" : "Begin Chanting"}
        </button>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-lotus/70">Repetitions</div>
            <div className="font-serif text-2xl text-lotus-deep tabular-nums">{count}</div>
          </div>
          {(count > 0 || idx > 0) && (
            <button onClick={reset} className="text-xs font-bold text-ink-soft hover:text-ink">Reset</button>
          )}
        </div>
      </div>
    </div>
  );
}

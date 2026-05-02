import { useState } from "react";
import type { Chant } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

export function ChantCard({ chant }: { chant: Chant }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="bg-lotus-soft rounded-3xl p-6 md:p-7 ring-1 ring-lotus/15 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lotus text-[11px] font-bold uppercase tracking-widest">
          Mantra Moment
        </div>
        <div className="text-[10px] font-bold text-lotus/80 bg-card px-2.5 py-1 rounded-full tabular-nums">
          {chant.duration}
        </div>
      </div>
      <h4 className="font-serif text-xl md:text-2xl text-ink mb-2">{chant.name}</h4>
      <p className="text-ink-soft font-medium leading-relaxed mb-5 text-[15px]">{chant.meaning}</p>

      <div className="bg-card rounded-2xl p-4 mb-5 ring-1 ring-lotus/10">
        <p className="font-serif italic text-lotus-deep text-center leading-relaxed whitespace-pre-line text-[15px]">
          {chant.text}
        </p>
      </div>

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
        {playing ? "Pause Chant" : "Play Chant"}
      </button>

      {playing && (
        <div className="mt-4 flex items-center justify-center gap-1 h-6" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="block w-1 bg-lotus rounded-full animate-gentle-pulse"
              style={{
                height: `${30 + ((i * 13) % 70)}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

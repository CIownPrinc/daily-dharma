import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";
const SEQUENCE: { phase: Phase; seconds: number; label: string }[] = [
  { phase: "inhale", seconds: 4, label: "Breathe in" },
  { phase: "hold-in", seconds: 2, label: "Hold" },
  { phase: "exhale", seconds: 4, label: "Breathe out" },
  { phase: "hold-out", seconds: 2, label: "Rest" },
];

export function OmBreathing() {
  const [running, setRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intRef = useRef<number | null>(null);

  const step = SEQUENCE[stepIdx]!;

  useEffect(() => {
    if (!running) return;
    intRef.current = window.setInterval(() => {
      setTick((t) => {
        const nextT = t + 1;
        if (nextT >= step.seconds) {
          setStepIdx((i) => {
            const ni = (i + 1) % SEQUENCE.length;
            if (ni === 0) setCycles((c) => c + 1);
            return ni;
          });
          return 0;
        }
        return nextT;
      });
    }, 1000);
    return () => {
      if (intRef.current) window.clearInterval(intRef.current);
    };
  }, [running, stepIdx, step.seconds]);

  const reset = () => {
    setRunning(false);
    setStepIdx(0);
    setTick(0);
    setCycles(0);
  };

  // Circle scale by phase
  const scale =
    step.phase === "inhale"
      ? 0.6 + (0.4 * (tick + 1)) / step.seconds
      : step.phase === "exhale"
        ? 1 - (0.4 * (tick + 1)) / step.seconds
        : step.phase === "hold-in"
          ? 1
          : 0.6;

  return (
    <div className="bg-saffron-soft rounded-3xl p-6 md:p-7 ring-1 ring-saffron/30 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink/70">
          Om Breathing
        </div>
        <div className="text-[10px] font-bold text-ink/70 bg-card px-2.5 py-1 rounded-full">
          4 · 2 · 4 · 2
        </div>
      </div>
      <h4 className="font-serif text-xl md:text-2xl text-ink mb-1">A quiet circle of breath</h4>
      <p className="text-ink-soft font-medium leading-relaxed mb-5 text-[14px]">
        Follow the lotus as it opens and closes. Four counts in, two to hold, four out, two to rest.
      </p>

      <div className="relative h-44 flex items-center justify-center mb-5" aria-live="polite">
        <div
          className={cn(
            "absolute size-36 rounded-full bg-gradient-to-br from-lotus/70 to-saffron/70 transition-transform duration-1000 ease-in-out",
            !running && "scale-75 opacity-60",
          )}
          style={running ? { transform: `scale(${scale})` } : undefined}
          aria-hidden
        />
        <div className="relative text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-ink/80">
            {running ? step.label : "Ready"}
          </div>
          <div className="font-serif text-4xl text-ink tabular-nums">
            {running ? step.seconds - tick : "·"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="bg-lotus text-primary-foreground px-5 py-3 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors shadow-petal"
        >
          {running ? "Pause" : cycles > 0 ? "Resume" : "Begin breathing"}
        </button>
        <div className="text-xs text-ink-soft font-bold">
          {cycles} {cycles === 1 ? "cycle" : "cycles"}
        </div>
        <button
          onClick={reset}
          className="text-xs font-bold text-ink-soft hover:text-ink"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/**
 * OmBreathing — guided breathing exercise with SVG progress ring.
 *
 * Phase 5 changes:
 *   1. SVG circular progress track replaces the plain CSS scaled blob.
 *      The ring drains/fills exactly in sync with the current phase timer,
 *      giving the child a precise visual cue of how long to breathe.
 *      Implementation: one SVG circle with stroke-dasharray/stroke-dashoffset
 *      animated via inline style — no library, no canvas, ~15 lines of math.
 *
 *   2. Phase timeline bar below the circle shows all four phases
 *      (Breathe in · Hold · Breathe out · Rest) with the active phase
 *      highlighted. This lets the child anticipate what's coming next
 *      rather than being surprised by transitions.
 *
 *   3. Countdown number is larger and more prominent — it's the primary
 *      piece of information during a session.
 *
 *   4. Glow animation on the ring during "inhale" phase reinforces the
 *      expanding feeling visually.
 *
 * ACCESSIBILITY: The live region announces each phase transition so screen
 * reader users get the same guidance without the visual ring.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

const SEQUENCE: { phase: Phase; seconds: number; label: string; hint: string }[] = [
  { phase: "inhale",   seconds: 4, label: "Breathe in",  hint: "slowly through your nose" },
  { phase: "hold-in",  seconds: 2, label: "Hold",        hint: "gently and softly" },
  { phase: "exhale",   seconds: 4, label: "Breathe out", hint: "slowly through your mouth" },
  { phase: "hold-out", seconds: 2, label: "Rest",        hint: "let everything soften" },
];

// Ring geometry — adjust RADIUS to change the circle size
const RADIUS = 72;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SVG_SIZE = (RADIUS + STROKE) * 2 + 4; // small padding

// Color per phase
const PHASE_COLOR: Record<Phase, string> = {
  "inhale":   "var(--lotus)",
  "hold-in":  "var(--saffron)",
  "exhale":   "oklch(0.55 0.14 165)",  // leaf-green
  "hold-out": "oklch(0.55 0.10 250)",  // soft blue
};

export function OmBreathing() {
  const [running,  setRunning]  = useState(false);
  const [stepIdx,  setStepIdx]  = useState(0);
  const [tick,     setTick]     = useState(0);
  const [cycles,   setCycles]   = useState(0);
  const intRef = useRef<number | null>(null);

  const step = SEQUENCE[stepIdx]!;

  useEffect(() => {
    if (!running) return;
    intRef.current = window.setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        if (next >= step.seconds) {
          setStepIdx((i) => {
            const ni = (i + 1) % SEQUENCE.length;
            if (ni === 0) setCycles((c) => c + 1);
            return ni;
          });
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (intRef.current) window.clearInterval(intRef.current); };
  }, [running, stepIdx, step.seconds]);

  const reset = () => {
    setRunning(false);
    setStepIdx(0);
    setTick(0);
    setCycles(0);
  };

  // Progress fraction: 0→1 within the current phase
  // For inhale/hold-in: ring fills as time passes (expanding feel)
  // For exhale/hold-out: ring drains (contracting feel)
  const fraction = (tick + 1) / step.seconds;
  const fillFraction =
    step.phase === "inhale"   ? fraction :
    step.phase === "hold-in"  ? 1 :
    step.phase === "exhale"   ? 1 - fraction :
    /* hold-out */              0;

  const dashOffset = CIRCUMFERENCE * (1 - fillFraction);
  const phaseColor = running ? PHASE_COLOR[step.phase] : "var(--lotus-soft)";
  const countdown  = running ? step.seconds - tick : 0;

  return (
    <div className="bg-saffron-soft rounded-3xl p-6 md:p-7 ring-1 ring-saffron/30 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink/70">
          Om Breathing
        </div>
        <div className="text-[10px] font-bold text-ink/60 bg-card px-2.5 py-1 rounded-full">
          4 · 2 · 4 · 2
        </div>
      </div>
      <h4 className="font-serif text-xl md:text-2xl text-ink mb-1">A quiet circle of breath</h4>
      <p className="text-ink-soft font-medium leading-relaxed mb-5 text-[14px]">
        Follow the ring. {running ? step.hint : "Four counts in, two to hold, four out, two to rest."}
      </p>

      {/* SVG ring + centre display */}
      <div className="flex flex-col items-center mb-5">
        <div
          className={cn("relative", running && step.phase === "inhale" && "breath-ring-glow")}
          aria-live="polite"
          aria-atomic="true"
          aria-label={running ? `${step.label}: ${countdown}` : "Ready to begin"}
        >
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="block"
            aria-hidden
          >
            {/* Background track */}
            <circle
              cx={SVG_SIZE / 2}
              cy={SVG_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="oklch(0.88 0.02 80)"
              strokeWidth={STROKE}
            />
            {/* Progress arc — starts at 12 o'clock, rotated -90° */}
            <circle
              cx={SVG_SIZE / 2}
              cy={SVG_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={phaseColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={running ? dashOffset : CIRCUMFERENCE}
              transform={`rotate(-90 ${SVG_SIZE / 2} ${SVG_SIZE / 2})`}
              style={{ transition: "stroke-dashoffset 0.95s linear, stroke 0.4s ease" }}
            />
            {/* Centre Om symbol */}
            <text
              x={SVG_SIZE / 2}
              y={SVG_SIZE / 2 - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="32"
              fill="oklch(0.45 0.12 330)"
            >
              🕉️
            </text>
          </svg>

          {/* Countdown number — overlaid below the Om symbol */}
          <div className="absolute inset-0 flex items-end justify-center pb-7 pointer-events-none">
            <div className="text-center">
              {running ? (
                <>
                  <div
                    className="font-serif text-3xl font-bold tabular-nums leading-none transition-colors duration-400"
                    style={{ color: phaseColor }}
                  >
                    {countdown}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-ink/60 mt-0.5">
                    {step.label}
                  </div>
                </>
              ) : (
                <div className="text-[11px] font-bold uppercase tracking-widest text-ink/40">
                  {cycles > 0 ? `${cycles} ${cycles === 1 ? "cycle" : "cycles"}` : "Ready"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phase timeline — all four phases visible */}
      <div className="flex items-stretch gap-1 mb-5 rounded-2xl overflow-hidden bg-black/5 p-1">
        {SEQUENCE.map((s, i) => {
          const isActive = running && i === stepIdx;
          const isDone   = running && i < stepIdx;
          const phasePct = isActive ? (tick / s.seconds) * 100 : isDone ? 100 : 0;
          return (
            <div
              key={s.phase}
              className={cn(
                "relative flex-1 rounded-xl px-2 py-2 text-center transition-all duration-300 overflow-hidden",
                isActive ? "bg-card shadow-soft" : "bg-transparent",
              )}
            >
              {/* Phase fill bar */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl opacity-20 transition-all duration-1000"
                  style={{
                    background: PHASE_COLOR[s.phase],
                    width: `${phasePct}%`,
                  }}
                  aria-hidden
                />
              )}
              <div className={cn(
                "relative text-[10px] font-bold uppercase tracking-wide leading-tight",
                isActive ? "text-ink" : "text-ink/40",
              )}>
                {s.label}
              </div>
              <div className={cn(
                "relative text-[9px] font-bold tabular-nums mt-0.5",
                isActive ? "text-ink/60" : "text-ink/25",
              )}>
                {s.seconds}s
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="bg-lotus text-primary-foreground px-6 py-3 rounded-full font-bold text-sm hover:bg-lotus-deep transition-colors shadow-petal"
          aria-label={running ? "Pause breathing exercise" : "Begin breathing exercise"}
        >
          {running ? "Pause" : cycles > 0 ? "Resume" : "Begin breathing"}
        </button>
        <div className="text-xs font-bold text-ink-soft tabular-nums">
          {cycles > 0 && `${cycles} ${cycles === 1 ? "cycle" : "cycles"}`}
        </div>
        {(cycles > 0 || running) && (
          <button
            onClick={reset}
            className="text-xs font-bold text-ink-soft hover:text-ink transition-colors"
            aria-label="Reset breathing exercise"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

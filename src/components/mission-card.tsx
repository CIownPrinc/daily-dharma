/**
 * MissionCard — daily habit card on the home screen.
 *
 * Phase 6 upgrade: same completion micro-animation as MissionSection in
 * FinishView — bounce, ripple, and floating "+1 petal 🌸" chip.
 *
 * The animation logic is identical to MissionSection so the habit-completion
 * feel is consistent whether the child completes a mission from the home
 * screen or from the story finish screen. Consistency reinforces the loop.
 */
import { useState } from "react";
import { useProgress } from "@/lib/use-progress";
import type { Mission } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

export function MissionCard({ mission }: { mission: Mission }) {
  const { completeMission, isMissionCompletedToday, hydrated } = useProgress();
  const done = hydrated && isMissionCompletedToday(mission.id);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleClick = () => {
    if (done) return;
    completeMission(mission.id);
    setJustCompleted(true);
  };

  return (
    <div className="bg-leaf-soft rounded-3xl p-6 md:p-7 ring-1 ring-leaf/15 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="text-leaf-deep text-[11px] font-bold uppercase tracking-widest">
          Daily Pebble
        </div>
        <div className="text-[10px] font-bold text-leaf-deep/70 bg-card px-2.5 py-1 rounded-full">
          {mission.category}
        </div>
      </div>
      <h4 className="font-serif text-xl md:text-2xl text-ink mb-2">{mission.title}</h4>
      <p className="text-ink-soft font-medium leading-relaxed mb-6 text-pretty text-[15px]">
        {mission.description}
      </p>

      <div className="relative inline-block">
        {/* Floating "+1 petal" chip */}
        {justCompleted && (
          <div
            className="absolute -top-8 left-1/2 pointer-events-none
                       animate-petal-float text-sm font-bold text-leaf-deep
                       bg-card rounded-full px-3 py-1 shadow-soft ring-1 ring-leaf/20
                       whitespace-nowrap"
            aria-hidden
          >
            +1 petal 🌸
          </div>
        )}

        {/* Ripple ring */}
        {justCompleted && (
          <span
            className="absolute inset-0 rounded-full bg-leaf/30 animate-mission-ripple pointer-events-none"
            aria-hidden
          />
        )}

        <button
          onClick={handleClick}
          disabled={done}
          className={cn(
            "relative inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm",
            "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-leaf focus-visible:ring-offset-2",
            done
              ? "bg-leaf text-primary-foreground cursor-default shadow-petal"
              : "bg-card text-leaf-deep ring-1 ring-leaf/30 hover:bg-leaf/10 active:scale-95",
            justCompleted && "animate-mission-bounce",
          )}
        >
          <span
            className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center text-[10px]",
              "transition-all duration-300",
              done
                ? "border-primary-foreground bg-primary-foreground/20 scale-110"
                : "border-current",
            )}
            aria-hidden
          >
            {done ? "✓" : ""}
          </span>
          {done ? "Well done!" : "Mark as done"}
        </button>
      </div>
    </div>
  );
}

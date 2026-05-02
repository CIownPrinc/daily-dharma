import { useProgress } from "@/lib/use-progress";
import type { Mission } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

export function MissionCard({ mission }: { mission: Mission }) {
  const { completeMission, isMissionCompletedToday, hydrated } = useProgress();
  const done = hydrated && isMissionCompletedToday(mission.id);

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
      <button
        onClick={() => !done && completeMission(mission.id)}
        disabled={done}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all",
          done
            ? "bg-leaf text-primary-foreground cursor-default"
            : "bg-card text-leaf-deep ring-1 ring-leaf/30 hover:bg-leaf hover:text-primary-foreground hover:ring-leaf",
        )}
      >
        <span
          className={cn(
            "size-5 rounded-full border-2 flex items-center justify-center text-[10px]",
            done ? "border-primary-foreground bg-primary-foreground/20" : "border-current",
          )}
          aria-hidden
        >
          {done ? "✓" : ""}
        </span>
        {done ? "Well done!" : "Mark as done"}
      </button>
    </div>
  );
}

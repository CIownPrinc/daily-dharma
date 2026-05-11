import { useProgress } from "@/lib/use-progress";
import { getLevel } from "@/lib/levels";

export function LevelCard() {
  const { progress, hydrated } = useProgress();
  const petals = hydrated ? progress.petals : 0;
  const level = getLevel(petals);

  return (
    <div className="bg-card rounded-3xl p-5 md:p-6 ring-1 ring-ink/5 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus">
          Your Path
        </div>
        <div className="text-[10px] font-bold text-ink-soft">
          {level.next !== null ? `${petals} / ${level.next} petals` : `${petals} petals`}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="font-serif text-2xl text-ink">{level.name}</h3>
        <span className="text-xs text-ink-soft font-bold uppercase tracking-widest">
          Lvl {level.index + 1}
        </span>
      </div>
      <p className="text-sm text-ink-soft font-medium mb-4">{level.blurb}</p>

      <div
        className="h-2 w-full rounded-full bg-lotus-soft overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(level.progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress toward next level`}
      >
        <div
          className="h-full bg-gradient-to-r from-lotus to-saffron transition-all duration-700"
          style={{ width: `${level.progressPct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-ink-soft">
        <span>{level.name}</span>
        <span>
          {level.next === null
            ? "Path complete ✿"
            : level.index === 0
              ? "Disciple"
              : "Dharma Keeper"}
        </span>
      </div>
    </div>
  );
}

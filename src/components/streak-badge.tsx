import { useProgress } from "@/lib/use-progress";

export function StreakBadge({ compact = false }: { compact?: boolean }) {
  const { progress, hydrated } = useProgress();
  const petals = hydrated ? progress.petals : 0;
  const streak = hydrated ? progress.streak : 0;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-card px-3 py-1.5 rounded-full ring-1 ring-ink/5 shadow-soft">
        <span className="text-lotus text-sm" aria-hidden>✿</span>
        <span className="font-bold text-sm text-ink tabular-nums">{petals}</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-5 ring-1 ring-ink/5 shadow-soft flex items-center gap-5">
      <div className="size-14 rounded-2xl bg-lotus-soft flex items-center justify-center text-2xl text-lotus animate-petal" aria-hidden>
        ✿
      </div>
      <div className="flex-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-0.5">
          Petals Found
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl text-lotus tabular-nums">{petals}</span>
          <span className="text-sm text-ink-soft font-semibold">
            {streak} {streak === 1 ? "day" : "days"} in a row
          </span>
        </div>
      </div>
    </div>
  );
}

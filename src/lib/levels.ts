export type LevelInfo = {
  index: 0 | 1 | 2;
  name: string;
  blurb: string;
  min: number;
  next: number | null; // null = max level
  progressPct: number; // 0–100 toward next level
  inLevel: number; // petals into current level
  span: number; // petals between current and next
};

const TIERS = [
  { name: "Seeker", min: 0, next: 10, blurb: "You are listening with a curious heart." },
  { name: "Disciple", min: 10, next: 30, blurb: "You are walking the path with quiet steps." },
  { name: "Dharma Keeper", min: 30, next: null, blurb: "You carry the light for others." },
] as const;

export function getLevel(petals: number): LevelInfo {
  let idx: 0 | 1 | 2 = 0;
  if (petals >= 30) idx = 2;
  else if (petals >= 10) idx = 1;
  const tier = TIERS[idx];
  const next = tier.next;
  const span = next ? next - tier.min : 1;
  const inLevel = Math.max(0, petals - tier.min);
  const progressPct = next ? Math.min(100, (inLevel / span) * 100) : 100;
  return {
    index: idx,
    name: tier.name,
    blurb: tier.blurb,
    min: tier.min,
    next,
    inLevel,
    span,
    progressPct,
  };
}

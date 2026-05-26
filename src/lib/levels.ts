/**
 * Level thresholds — calibrated so each level feels earned.
 *
 * Petal economy:
 *   +3 per story completion
 *   +2 per mission completion
 *   +1 per reflection written
 *   +1 per daily visit streak
 *   +2 per chant session (3+ reps)
 *
 * Target pacing:
 *   Seeker     (0–29):   first 5–8 stories + a few missions. ~1 week of daily use.
 *   Disciple  (30–99):  ~8–15 stories + consistent daily habits. ~3–4 weeks.
 *   Dharma Keeper (100+): all 13 stories + strong habit streak. A real achievement.
 *
 * Previous thresholds (0/10/30) made Disciple reachable in 3 completions — not
 * meaningful. These thresholds require genuine engagement with the app.
 */
export type LevelInfo = {
  index: 0 | 1 | 2;
  name: string;
  blurb: string;
  min: number;
  next: number | null;
  progressPct: number;
  inLevel: number;
  span: number;
};

const TIERS = [
  { name: "Seeker",        min: 0,   next: 30,   blurb: "You are listening with a curious heart." },
  { name: "Disciple",      min: 30,  next: 100,  blurb: "You are walking the path with quiet steps." },
  { name: "Dharma Keeper", min: 100, next: null, blurb: "You carry the light for others." },
] as const;

export function getLevel(petals: number): LevelInfo {
  let idx: 0 | 1 | 2 = 0;
  if (petals >= 100) idx = 2;
  else if (petals >= 30) idx = 1;
  const tier = TIERS[idx];
  const next = tier.next;
  const span = next ? next - tier.min : 1;
  const inLevel = Math.max(0, petals - tier.min);
  const progressPct = next ? Math.min(100, (inLevel / span) * 100) : 100;
  return { index: idx, name: tier.name, blurb: tier.blurb, min: tier.min, next, inLevel, span, progressPct };
}

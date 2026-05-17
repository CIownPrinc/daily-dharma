/**
 * BadgeRing — the animated reward shown on story completion.
 *
 * Design decision: the badge is rendered as a glowing ring rather than a flat
 * card so it feels "earned" — the animation plays once on mount and creates a
 * moment of delight without being overwhelming. The ring color comes from the
 * story's sceneColor so each badge feels distinct.
 *
 * The character quote renders below the ring to reinforce identity formation:
 * the child hears the character speaking to them directly.
 */
import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/dharma-data";

type Props = {
  badge: Badge;
  sceneColor?: string;
  /** If true, renders in compact shelf mode (no animation, smaller) */
  compact?: boolean;
};

export function BadgeRing({ badge, sceneColor = "#1a237e", compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-card rounded-2xl p-4 ring-1 ring-ink/5 shadow-soft">
        <div
          className="size-12 rounded-full flex items-center justify-center text-2xl shrink-0 ring-2"
          style={{ background: `${sceneColor}18`, outline: `2px solid ${sceneColor}35` }}
          aria-hidden
        >
          {badge.icon}
        </div>
        <div>
          <div className="font-bold text-sm text-ink leading-tight">{badge.name}</div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mt-0.5">
            {badge.virtue}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Outer glow ring — CSS animation, no JS */}
      <div className="relative mb-5">
        <div
          className="size-32 rounded-full flex items-center justify-center text-5xl animate-badge-in"
          style={{
            background: `radial-gradient(circle at 40% 35%, ${sceneColor}30, ${sceneColor}10)`,
            boxShadow: `0 0 0 4px ${sceneColor}40, 0 0 0 8px ${sceneColor}15, 0 8px 40px ${sceneColor}25`,
          }}
          aria-hidden
        >
          {badge.icon}
        </div>
        {/* Rotating outer ring — pure CSS */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, ${sceneColor}50, transparent 60%, ${sceneColor}30, transparent 100%)`,
            borderRadius: "50%",
          }}
        />
      </div>

      <div
        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
        style={{ color: sceneColor }}
      >
        Badge Unlocked
      </div>
      <h3 className="font-serif text-2xl text-ink mb-1">{badge.name}</h3>
      <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-4">
        {badge.virtue}
      </div>

      {/* Character voice quote */}
      <p
        className={cn(
          "font-serif italic text-ink-soft text-[15px] leading-relaxed max-w-xs px-4 py-3 rounded-2xl",
        )}
        style={{ background: `${sceneColor}0c` }}
      >
        {badge.characterQuote}
      </p>
    </div>
  );
}

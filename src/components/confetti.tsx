import { useEffect, useState } from "react";

const COLORS = [
  "var(--lotus)",
  "var(--saffron)",
  "var(--leaf)",
  "var(--lotus-deep)",
];

type Piece = {
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  size: number;
  drift: number;
};

export function Confetti({ count = 32, run = true }: { count?: number; run?: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!run) return;
    setPieces(
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.6 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        rotate: Math.random() * 360,
        size: 8 + Math.random() * 10,
        drift: -30 + Math.random() * 60,
      })),
    );
  }, [run, count]);

  if (!run) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-[-3rem] block opacity-90"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: "60% 40% 60% 40%",
            transform: `rotate(${p.rotate}deg)`,
            animation: `petal-fall ${p.duration}s ${p.delay}s cubic-bezier(.2,.7,.4,1) forwards`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes petal-fall {
          0%   { transform: translate3d(0,-10vh,0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translate3d(var(--drift), 110vh, 0) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

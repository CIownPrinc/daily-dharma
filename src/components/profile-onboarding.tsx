import { useState } from "react";
import { AVATARS, type Avatar, useProfile } from "@/lib/use-profile";
import { cn } from "@/lib/utils";

export function ProfileOnboarding() {
  const { profile, hydrated, save } = useProfile();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<Avatar>(AVATARS[0]);

  if (!hydrated || profile) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim().slice(0, 20);
    if (!trimmed) return;
    save({ name: trimmed, avatar, createdAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <form
        onSubmit={onSubmit}
        className="bg-card rounded-[2rem] shadow-petal ring-1 ring-ink/5 p-7 md:p-9 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-2" aria-hidden>✿</div>
          <h2 className="font-serif text-2xl text-ink mb-1">Welcome, little wanderer.</h2>
          <p className="text-ink-soft text-sm font-medium">
            Tell us your name and pick a friend for your journey.
          </p>
        </div>

        <label className="block mb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2 block">
            Your name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="e.g. Aanya"
            autoFocus
            className="w-full rounded-2xl bg-jasmine/70 ring-1 ring-ink/10 focus:ring-lotus/40 focus:outline-none px-4 py-3 font-serif text-lg text-ink placeholder:text-ink-soft/60"
          />
        </label>

        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2 block">
            Choose your avatar
          </span>
          <div className="grid grid-cols-5 gap-2">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAvatar(a)}
                className={cn(
                  "aspect-square rounded-2xl text-3xl flex items-center justify-center ring-1 transition-all",
                  avatar === a
                    ? "bg-lotus-soft ring-lotus scale-105"
                    : "bg-jasmine/60 ring-ink/5 hover:bg-lotus-soft/60",
                )}
                aria-label={`Choose avatar ${a}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-lotus text-primary-foreground py-3.5 rounded-full font-bold hover:bg-lotus-deep transition-colors disabled:opacity-40 shadow-petal"
        >
          Begin the journey ✿
        </button>
      </form>
    </div>
  );
}

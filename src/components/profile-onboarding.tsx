/**
 * ProfileOnboarding — two-step welcome flow.
 *
 * Step 1: Name + avatar (unchanged from original)
 * Step 2 (NEW): Age stage selection — three illustrated cards for
 *   Little Ones (4–6), Curious Hearts (7–9), Young Seekers (10+)
 *
 * WHY a two-step flow instead of adding age to step 1:
 *   - Cognitive load: one decision at a time. Name+avatar is identity ("who am I?"),
 *     age stage is configuration ("what's right for me?"). Mixing them makes the
 *     form feel longer and the age question feel administrative.
 *   - The age stage card format lets us show what each tier means (with a preview
 *     character emoji and short description) rather than a bare dropdown.
 *   - Step 2 can be skipped — defaulting to "Curious" — so very young children
 *     whose parents are filling this in don't get blocked.
 *
 * The ageStage is saved on the Profile and also informs the library's default
 * filter via store.resolvedAgeStage().
 */
import { useState } from "react";
import { AVATARS, type Avatar, useProfile } from "@/lib/use-profile";
import { AGE_STAGES, type AgeStage } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

const STAGE_META: Record<AgeStage, { emoji: string; description: string; color: string }> = {
  Little:  { emoji: "🐘", description: "Simple stories about kindness, friendship, and bravery.", color: "bg-leaf-soft ring-leaf/20" },
  Curious: { emoji: "🪈", description: "Stories with meaning, character motives, and gentle challenges.", color: "bg-lotus-soft ring-lotus/20" },
  Seeker:  { emoji: "🎯", description: "Deeper tales exploring dharma, karma, and the self.", color: "bg-saffron-soft ring-saffron/30" },
};

export function ProfileOnboarding() {
  const { profile, hydrated, save } = useProfile();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<Avatar>(AVATARS[0]);
  const [ageStage, setAgeStage] = useState<AgeStage>("Curious");

  if (!hydrated || profile) return null;

  const onStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  const onStep2Submit = () => {
    const trimmed = name.trim().slice(0, 20);
    if (!trimmed) return;
    save({ name: trimmed, avatar, ageStage, createdAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card rounded-[2rem] shadow-petal ring-1 ring-ink/5 p-7 md:p-9 w-full max-w-md">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-lotus" : s < step ? "w-4 bg-lotus/50" : "w-4 bg-ink/10",
              )}
              aria-hidden
            />
          ))}
        </div>

        {step === 1 ? (
          <form onSubmit={onStep1Submit}>
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
                Choose your guide
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
                    aria-pressed={avatar === a}
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
              Next →
            </button>
          </form>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2" aria-hidden>{avatar}</div>
              <h2 className="font-serif text-2xl text-ink mb-1">
                Hello, {name.trim().split(" ")[0]}!
              </h2>
              <p className="text-ink-soft text-sm font-medium">
                Which stories are right for you?
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {AGE_STAGES.map((stage) => {
                const meta = STAGE_META[stage.id];
                const active = ageStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setAgeStage(stage.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl ring-1 text-left transition-all",
                      active
                        ? `${meta.color} ring-2 scale-[1.01]`
                        : "bg-card ring-ink/8 hover:ring-ink/15",
                    )}
                    aria-pressed={active}
                  >
                    <div
                      className={cn(
                        "size-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all",
                        active ? "bg-white/60" : "bg-jasmine/60",
                      )}
                      aria-hidden
                    >
                      {meta.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-ink text-sm leading-tight">
                        {stage.label}
                        <span className="ml-2 text-[11px] font-bold text-ink-soft uppercase tracking-widest">
                          {stage.range}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft font-medium mt-0.5 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>
                    {active && (
                      <div className="size-5 rounded-full bg-lotus flex items-center justify-center text-[10px] text-white font-bold shrink-0 ml-auto">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-full font-bold text-sm text-ink-soft hover:text-ink transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={onStep2Submit}
                className="flex-1 bg-lotus text-primary-foreground py-3 rounded-full font-bold hover:bg-lotus-deep transition-colors shadow-petal"
              >
                Begin the journey ✿
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

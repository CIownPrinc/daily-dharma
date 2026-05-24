/**
 * Settings route — /settings
 *
 * Three sections:
 *   1. Story experience — narrator on/off, dark mode
 *   2. Age & stories — child's current stage, link to change it
 *      (age-stage override requires the parent gate so a child can't override
 *      it themselves; we link to /parents rather than gating inline here)
 *   3. About — app version, reset progress (danger zone)
 *
 * DESIGN DECISION: The narrator toggle and dark mode are not parent-gated
 * because they're purely experiential preferences — a child toggling dark mode
 * or turning off narration harms nothing. The age-stage override IS parent-gated
 * because it changes what content the child sees, which is a parental decision.
 *
 * DARK MODE: We apply the "dark" class to <html> immediately on toggle via
 * the store's setDarkMode action, and persist it. On app mount, _hydrateProgress
 * re-applies the class so it survives page reloads.
 */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ParentGate } from "@/components/parent-gate";
import { useDharmaStore } from "@/lib/store";
import { useProfile } from "@/lib/use-profile";
import { AGE_STAGES, type AgeStage } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Dharma Quest" },
      { name: "description", content: "Adjust your story experience." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useProfile();
  const settings = useDharmaStore((s) => s.settings);
  const setNarratorEnabled = useDharmaStore((s) => s.setNarratorEnabled);
  const setDarkMode = useDharmaStore((s) => s.setDarkMode);
  const setAgeStageOverride = useDharmaStore((s) => s.setAgeStageOverride);
  const clearProfile = useDharmaStore((s) => s.clearProfile);
  const resolvedAgeStage = useDharmaStore((s) => s.resolvedAgeStage)();

  const [showParentGate, setShowParentGate] = useState(false);
  const [showResetGate, setShowResetGate] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<AgeStage | null>(null);

  const firstName = profile?.name?.split(" ")[0] ?? "your child";

  const handleAgeOverride = (stage: AgeStage) => {
    // If different from current, require parent gate
    if (stage === resolvedAgeStage) {
      setAgeStageOverride(null); // reset to profile default
      return;
    }
    setPendingStage(stage);
    setAgeGateOpen(true);
  };

  const handleResetProgress = () => {
    // Clear all progress but keep profile — child keeps their name/avatar
    useDharmaStore.setState((_s) => ({
      progress: {
        petals: 0,
        streak: 0,
        lastVisit: null,
        completedStories: [],
        completedMissions: [],
        reflections: {},
        earnedBadges: [],
        completionDates: {},
      },
    }));
    setShowResetConfirm(false);
  };

  return (
    <AppShell>
      {/* Parent gate for age override */}
      {ageGateOpen && (
        <ParentGate
          onPass={() => {
            if (pendingStage) setAgeStageOverride(pendingStage);
            setAgeGateOpen(false);
            setPendingStage(null);
          }}
          onCancel={() => {
            setAgeGateOpen(false);
            setPendingStage(null);
          }}
        />
      )}

      {/* Parent gate for progress reset */}
      {showResetGate && (
        <ParentGate
          onPass={() => {
            setShowResetGate(false);
            setShowResetConfirm(true);
          }}
          onCancel={() => setShowResetGate(false)}
        />
      )}

      <header className="mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
          Settings
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          Your story, your way.
        </h1>
      </header>

      {/* ── Story experience ── */}
      <section className="mb-8">
        <h2 className="font-serif text-lg text-ink mb-4">Story experience</h2>
        <div className="bg-card rounded-3xl ring-1 ring-ink/5 shadow-soft divide-y divide-border/50 overflow-hidden">

          {/* Narrator toggle */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <div className="font-bold text-sm text-ink">Read stories aloud</div>
              <p className="text-xs text-ink-soft font-medium mt-0.5">
                Narrate each page automatically as it loads.
              </p>
            </div>
            <Toggle
              checked={settings.narratorEnabled}
              onChange={setNarratorEnabled}
              label="Narrator"
            />
          </div>

          {/* Dark mode */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <div className="font-bold text-sm text-ink">Dark mode</div>
              <p className="text-xs text-ink-soft font-medium mt-0.5">
                Easier on the eyes at night.
              </p>
            </div>
            <Toggle
              checked={settings.darkMode}
              onChange={setDarkMode}
              label="Dark mode"
            />
          </div>
        </div>
      </section>

      {/* ── Age & stories ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-ink">Age & stories</h2>
          {settings.ageStageOverride && (
            <button
              onClick={() => setAgeStageOverride(null)}
              className="text-xs font-bold text-lotus hover:underline"
            >
              Reset to default
            </button>
          )}
        </div>

        <div className="bg-card rounded-3xl ring-1 ring-ink/5 shadow-soft p-5 mb-3">
          <p className="text-sm text-ink-soft font-medium mb-4">
            {firstName}'s library shows stories for{" "}
            <span className="font-bold text-ink">
              {AGE_STAGES.find((s) => s.id === resolvedAgeStage)?.label}
            </span>
            {settings.ageStageOverride
              ? " (parent override)"
              : profile?.ageStage
              ? " (from profile)"
              : " (default)"}
            .
          </p>

          <div className="grid grid-cols-3 gap-2">
            {AGE_STAGES.map((stage) => {
              const active = resolvedAgeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleAgeOverride(stage.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl ring-1 text-center transition-all text-sm",
                    active
                      ? "bg-lotus-soft ring-lotus ring-2"
                      : "bg-jasmine/60 ring-ink/8 hover:ring-lotus/30",
                  )}
                  aria-pressed={active}
                >
                  <span className="text-xl" aria-hidden>
                    {["🐘", "🪈", "🎯"][AGE_STAGES.indexOf(stage)]}
                  </span>
                  <div className="font-bold text-xs text-ink leading-tight">{stage.label}</div>
                  <div className="text-[10px] text-ink-soft">{stage.range}</div>
                  {active && <div className="text-[10px] font-bold text-lotus">Current</div>}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-ink-soft font-medium mt-3">
            🔒 Changing the age stage requires a parent to verify.
          </p>
        </div>
      </section>

      {/* ── About & account ── */}
      <section className="mb-8">
        <h2 className="font-serif text-lg text-ink mb-4">About</h2>
        <div className="bg-card rounded-3xl ring-1 ring-ink/5 shadow-soft divide-y divide-border/50 overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div className="font-bold text-sm text-ink">Version</div>
            <div className="text-sm text-ink-soft font-medium">1.0.0 — Phase 3</div>
          </div>
          <Link
            to="/parents"
            className="flex items-center justify-between p-5 hover:bg-jasmine/40 transition-colors"
          >
            <div className="font-bold text-sm text-ink">Parent dashboard</div>
            <span className="text-lotus text-sm" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ── Danger zone ── */}
      <section className="mb-8">
        <h2 className="font-serif text-lg text-ink mb-4">Progress</h2>
        <div className="bg-card rounded-3xl ring-1 ring-ink/5 shadow-soft p-5">
          {!showResetConfirm ? (
            <>
              <p className="text-sm text-ink-soft font-medium mb-4">
                Reset all story progress, petals, and badges. {firstName}'s name and avatar will be kept.
                This cannot be undone.
              </p>
              <button
                onClick={() => setShowResetGate(true)}
                className="px-5 py-2.5 rounded-full font-bold text-sm text-red-600 ring-1 ring-red-200 bg-red-50 hover:bg-red-100 transition-colors"
              >
                Reset progress
              </button>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-ink mb-4">
                Are you sure? All petals, badges, and completed stories will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm text-ink-soft hover:text-ink ring-1 ring-ink/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Yes, reset
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
}

/** Accessible toggle switch component */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full ring-1 transition-colors duration-200",
        checked ? "bg-lotus ring-lotus" : "bg-ink/10 ring-ink/20",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 my-1",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

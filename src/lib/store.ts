/**
 * Central application store — Zustand with localStorage persistence.
 *
 * Slices:
 *   profile   — name, avatar, ageStage, createdAt
 *   progress  — petals, streak, completedStories, reflections, earnedBadges, ...
 *   settings  — narrator on/off, darkMode, ageStageOverride (parent-set)
 *
 * Phase 3 additions:
 *   - settings slice with narratorEnabled, darkMode, ageStageOverride
 *   - Profile gains ageStage (was optional, now always set during onboarding)
 *   - toggleDarkMode applies/removes the "dark" class on <html> and persists
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Avatar } from "@/lib/use-profile";
import type { AgeStage } from "@/lib/dharma-data";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Profile = {
  name: string;
  avatar: Avatar;
  ageStage: AgeStage;
  createdAt: string;
};

export type EarnedBadge = {
  slug: string;
  name: string;
  icon: string;
  virtue: string;
  earnedAt: string;
};

export type Progress = {
  petals: number;
  streak: number;
  lastVisit: string | null;
  completedStories: string[];
  completedMissions: string[];
  reflections: Record<string, { text: string; date: string }>;
  earnedBadges: EarnedBadge[];
};

export type Settings = {
  /** Whether the Web Speech API narrator auto-reads story pages */
  narratorEnabled: boolean;
  /** Dark mode — applied as class on <html> */
  darkMode: boolean;
  /**
   * Parent-overridden age stage. When set, the library uses this instead of
   * profile.ageStage. Allows a parent to adjust the filter without changing
   * the child's profile identity.
   */
  ageStageOverride: AgeStage | null;
};

// ─── STORE SHAPE ──────────────────────────────────────────────────────────────

type DharmaStore = {
  // Profile
  profile: Profile | null;
  profileHydrated: boolean;
  saveProfile: (p: Profile) => void;
  clearProfile: () => void;

  // Progress
  progress: Progress;
  progressHydrated: boolean;
  completeStory: (slug: string, badge?: EarnedBadge) => void;
  completeMission: (id: string) => void;
  isMissionCompletedToday: (id: string) => boolean;
  saveReflection: (slug: string, text: string) => void;
  _hydrateProgress: () => void;

  // Settings
  settings: Settings;
  setNarratorEnabled: (v: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
  setAgeStageOverride: (v: AgeStage | null) => void;
  /** Resolved age stage: override → profile → default "Curious" */
  resolvedAgeStage: () => AgeStage;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Apply or remove the "dark" class on <html> */
function applyDarkMode(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}

const initialProgress: Progress = {
  petals: 0,
  streak: 0,
  lastVisit: null,
  completedStories: [],
  completedMissions: [],
  reflections: {},
  earnedBadges: [],
};

const initialSettings: Settings = {
  narratorEnabled: true,
  darkMode: false,
  ageStageOverride: null,
};

// ─── STORE ────────────────────────────────────────────────────────────────────

export const useDharmaStore = create<DharmaStore>()(
  persist(
    (set, get) => ({
      // ── Profile ──────────────────────────────────────────────────────────────
      profile: null,
      profileHydrated: false,

      saveProfile: (p) => set({ profile: p }),
      clearProfile: () => set({ profile: null }),

      // ── Progress ─────────────────────────────────────────────────────────────
      progress: initialProgress,
      progressHydrated: false,

      _hydrateProgress: () => {
        const today = todayStr();
        const p = get().progress;

        if (p.lastVisit === today) {
          set({ progressHydrated: true, profileHydrated: true });
          return;
        }

        const newStreak =
          p.lastVisit === yesterdayStr() ? p.streak + 1 : 1;

        set({
          progress: { ...p, streak: newStreak, lastVisit: today },
          progressHydrated: true,
          profileHydrated: true,
        });

        // Re-apply dark mode on hydration (class is lost on page reload)
        applyDarkMode(get().settings.darkMode);
      },

      completeStory: (slug, badge) =>
        set((state) => {
          const p = state.progress;
          if (p.completedStories.includes(slug)) return state;

          const updatedBadges = badge
            ? [...p.earnedBadges, { ...badge, earnedAt: todayStr() }]
            : p.earnedBadges;

          return {
            progress: {
              ...p,
              completedStories: [...p.completedStories, slug],
              petals: p.petals + 3,
              earnedBadges: updatedBadges,
            },
          };
        }),

      completeMission: (id) => {
        const key = `${id}:${todayStr()}`;
        set((state) => {
          const p = state.progress;
          if (p.completedMissions.includes(key)) return state;
          return {
            progress: {
              ...p,
              completedMissions: [...p.completedMissions, key],
              petals: p.petals + 1,
            },
          };
        });
      },

      isMissionCompletedToday: (id) => {
        return get().progress.completedMissions.includes(`${id}:${todayStr()}`);
      },

      saveReflection: (slug, text) => {
        const trimmed = text.trim();
        set((state) => {
          const p = state.progress;
          const had = !!p.reflections[slug];
          const reflections = { ...p.reflections };

          if (!trimmed) {
            delete reflections[slug];
            return { progress: { ...p, reflections } };
          }

          reflections[slug] = { text: trimmed, date: todayStr() };
          const petals = had ? p.petals : p.petals + 1;
          return { progress: { ...p, reflections, petals } };
        });
      },

      // ── Settings ─────────────────────────────────────────────────────────────
      settings: initialSettings,

      setNarratorEnabled: (v) =>
        set((s) => ({ settings: { ...s.settings, narratorEnabled: v } })),

      toggleDarkMode: () => {
        const next = !get().settings.darkMode;
        applyDarkMode(next);
        set((s) => ({ settings: { ...s.settings, darkMode: next } }));
      },

      setDarkMode: (v) => {
        applyDarkMode(v);
        set((s) => ({ settings: { ...s.settings, darkMode: v } }));
      },

      setAgeStageOverride: (v) =>
        set((s) => ({ settings: { ...s.settings, ageStageOverride: v } })),

      resolvedAgeStage: () => {
        const { settings, profile } = get();
        return settings.ageStageOverride ?? profile?.ageStage ?? "Curious";
      },
    }),
    {
      name: "dharma-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        progress: state.progress,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state || typeof window === "undefined") return;

        // Migrate from old dual-key storage
        const oldProfile = localStorage.getItem("dharma-profile-v1");
        const oldProgress = localStorage.getItem("dharma-progress-v1");

        if (oldProfile && !state.profile) {
          try {
            const op = JSON.parse(oldProfile);
            state.profile = { ageStage: "Curious", ...op };
          } catch { /* ignore */ }
        }

        if (oldProgress) {
          try {
            const op = JSON.parse(oldProgress);
            const hasOldData = op.petals > 0 || (op.completedStories?.length ?? 0) > 0;
            if (hasOldData) {
              state.progress = {
                ...initialProgress,
                ...op,
                earnedBadges: state.progress.earnedBadges ?? [],
              };
            }
          } catch { /* ignore */ }
        }

        // Re-apply dark mode class after rehydration
        if (state.settings?.darkMode) applyDarkMode(true);
      },
    },
  ),
);

// ─── SELECTORS ────────────────────────────────────────────────────────────────
export const selectProfile = (s: DharmaStore) => s.profile;
export const selectProgress = (s: DharmaStore) => s.progress;
export const selectHydrated = (s: DharmaStore) => s.progressHydrated;
export const selectEarnedBadges = (s: DharmaStore) => s.progress.earnedBadges;
export const selectSettings = (s: DharmaStore) => s.settings;

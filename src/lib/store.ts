/**
 * Central application store using Zustand with localStorage persistence.
 *
 * ARCHITECTURAL DECISION: Why Zustand instead of keeping useProgress/useProfile?
 *
 * The original dual-hook pattern (useProgress + useProfile) creates two problems:
 *   1. Multiple components calling useProgress() each get their own useState
 *      instance. While they all read from the same localStorage key, they are
 *      NOT synchronized — a mutation in one component triggers a re-render only
 *      in that component's hook instance. This causes stale-read bugs as the app
 *      grows and more components subscribe to progress state.
 *   2. The narrator stops on route change because it's scoped to a component
 *      lifecycle. We need a store-level singleton for audio.
 *
 * Zustand with the persist middleware solves both:
 *   - Single in-memory state shared across all subscribers
 *   - React's useSyncExternalStore under the hood — all subscribers update atomically
 *   - Persistence is declarative, not imperative
 *   - Selectors prevent unnecessary re-renders
 *
 * MIGRATION STRATEGY: The existing useProgress and useProfile hooks are kept as
 * thin compatibility shims (see bottom of this file and the original hook files).
 * This means zero changes are needed in route files for Phase 1. The shims delegate
 * to this store, so the store is the single source of truth immediately.
 *
 * TRADEOFF: Zustand adds ~3KB gzipped to the bundle. This is acceptable given it
 * eliminates a class of state-sync bugs and enables the narrator singleton pattern.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Avatar } from "@/lib/use-profile";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Profile = {
  name: string;
  avatar: Avatar;
  ageStage: "Little" | "Curious" | "Seeker";
  createdAt: string;
};

export type EarnedBadge = {
  slug: string; // story slug this badge came from
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
  completedMissions: string[]; // format: "missionId:yyyy-mm-dd"
  reflections: Record<string, { text: string; date: string }>;
  earnedBadges: EarnedBadge[];
};

// ─── STORE SHAPE ──────────────────────────────────────────────────────────────

type DharmaStore = {
  // Profile slice
  profile: Profile | null;
  profileHydrated: boolean;
  saveProfile: (p: Profile) => void;
  clearProfile: () => void;

  // Progress slice
  progress: Progress;
  progressHydrated: boolean;
  completeStory: (slug: string, badge?: EarnedBadge) => void;
  completeMission: (id: string) => void;
  isMissionCompletedToday: (id: string) => boolean;
  saveReflection: (slug: string, text: string) => void;

  // Internal: called on first hydration to update streak
  _hydrateProgress: () => void;
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

const initialProgress: Progress = {
  petals: 0,
  streak: 0,
  lastVisit: null,
  completedStories: [],
  completedMissions: [],
  reflections: {},
  earnedBadges: [],
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

      /**
       * Called once on app mount (from AppShell) to update the streak and
       * mark today as visited. Uses the persisted lastVisit date to decide
       * whether to increment, reset, or leave the streak unchanged.
       */
      _hydrateProgress: () => {
        const today = todayStr();
        const yesterday = yesterdayStr();
        const p = get().progress;

        if (p.lastVisit === today) {
          // Already visited today — just mark hydrated
          set({ progressHydrated: true, profileHydrated: true });
          return;
        }

        const newStreak =
          p.lastVisit === yesterday ? p.streak + 1 : 1;

        set({
          progress: { ...p, streak: newStreak, lastVisit: today },
          progressHydrated: true,
          profileHydrated: true,
        });
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
        const key = `${id}:${todayStr()}`;
        return get().progress.completedMissions.includes(key);
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
          // Award 1 petal the first time a reflection is written for a story
          const petals = had ? p.petals : p.petals + 1;
          return { progress: { ...p, reflections, petals } };
        });
      },
    }),
    {
      name: "dharma-store-v1",
      storage: createJSONStorage(() => localStorage),
      /**
       * Only persist the data that needs to survive page reloads.
       * profileHydrated and progressHydrated are runtime flags — always false on load.
       */
      partialize: (state) => ({
        profile: state.profile,
        progress: state.progress,
      }),
      /**
       * Migration from the old dual-key storage format (dharma-profile-v1 +
       * dharma-progress-v1). On first load of the new store, if the old keys
       * exist we merge them in and the user loses nothing.
       */
      onRehydrateStorage: () => (state) => {
        if (!state || typeof window === "undefined") return;

        // Attempt migration from old storage keys
        const oldProfile = localStorage.getItem("dharma-profile-v1");
        const oldProgress = localStorage.getItem("dharma-progress-v1");

        if (oldProfile && !state.profile) {
          try {
            state.profile = JSON.parse(oldProfile);
          } catch {
            // ignore corrupt data
          }
        }

        if (oldProgress) {
          try {
            const op = JSON.parse(oldProgress);
            const hasOldData =
              op.petals > 0 ||
              (op.completedStories?.length ?? 0) > 0;
            if (hasOldData) {
              state.progress = {
                ...initialProgress,
                ...op,
                // earnedBadges didn't exist in old format — start fresh
                earnedBadges: state.progress.earnedBadges ?? [],
              };
            }
          } catch {
            // ignore corrupt data
          }
        }
      },
    },
  ),
);

// ─── COMPATIBILITY SELECTORS ──────────────────────────────────────────────────
// These thin selectors allow existing route files to keep using the old hook
// signatures during the transition. They read from the Zustand store instead
// of from their own useState instances.

export const selectProfile = (s: DharmaStore) => s.profile;
export const selectProgress = (s: DharmaStore) => s.progress;
export const selectHydrated = (s: DharmaStore) => s.progressHydrated;
export const selectEarnedBadges = (s: DharmaStore) =>
  s.progress.earnedBadges;

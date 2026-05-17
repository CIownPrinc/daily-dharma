/**
 * Compatibility shim — delegates to the central Zustand store.
 *
 * This file preserves the original hook signature so all existing route files
 * work without modification. Internally, all reads/writes go through
 * useDharmaStore — there is no longer a separate useState or localStorage call
 * in this hook. The store is the single source of truth.
 *
 * Long-term: route files can migrate to importing from "@/lib/store" directly
 * and this shim can be removed. For now it keeps the diff minimal.
 */
import { useDharmaStore } from "@/lib/store";

export type { Progress } from "@/lib/store";

export function useProgress() {
  const progress = useDharmaStore((s) => s.progress);
  const hydrated = useDharmaStore((s) => s.progressHydrated);
  const completeStory = useDharmaStore((s) => s.completeStory);
  const completeMission = useDharmaStore((s) => s.completeMission);
  const isMissionCompletedToday = useDharmaStore((s) => s.isMissionCompletedToday);
  const saveReflection = useDharmaStore((s) => s.saveReflection);

  // Expose a generic update for legacy call sites (e.g. streak hydration).
  // New code should use specific actions instead.
  const update = (patch: Partial<typeof progress>) =>
    useDharmaStore.setState((s) => ({ progress: { ...s.progress, ...patch } }));

  return {
    progress,
    hydrated,
    completeStory,
    completeMission,
    isMissionCompletedToday,
    saveReflection,
    update,
  };
}

/**
 * useNarrator — thin React adapter over the Narrator singleton.
 *
 * This hook no longer owns any SpeechSynthesis state. It:
 *   1. Gets the singleton via getNarrator()
 *   2. Subscribes to speaking-state changes and reflects them in React state
 *   3. Reads narratorEnabled from the Zustand store and syncs it to the
 *      singleton when it changes
 *
 * The singleton is NOT cancelled on unmount, so narration survives route
 * changes. If the child navigates from page 2 → page 3, the current
 * utterance finishes naturally before the next one starts.
 */
import { useEffect, useState, useCallback } from "react";
import { getNarrator } from "@/lib/narrator";
import { useDharmaStore } from "@/lib/store";

export function useNarrator() {
  const narrator = getNarrator();
  const [speaking, setSpeaking] = useState(narrator.speaking);
  const narratorEnabled = useDharmaStore((s) => s.settings.narratorEnabled);

  // Sync the enabled flag into the singleton whenever the setting changes.
  useEffect(() => {
    narrator.setEnabled(narratorEnabled);
  }, [narratorEnabled, narrator]);

  // Subscribe to speaking state — update React state when it changes.
  // The subscription is cleaned up on unmount but the narrator keeps running.
  useEffect(() => {
    const unsub = narrator.subscribe(setSpeaking);
    return () => unsub();
  }, [narrator]);

  const speak = useCallback((text: string) => narrator.speak(text), [narrator]);
  const stop  = useCallback(() => narrator.stop(),         [narrator]);

  return {
    supported: narrator.supported,
    speaking,
    speak,
    stop,
  };
}

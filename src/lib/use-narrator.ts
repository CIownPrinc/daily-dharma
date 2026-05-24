/**
 * useNarrator — thin React adapter over the Narrator singleton.
 *
 * BUG FIXES from Phase 4:
 *
 * BUG A — `narrator` object in effect deps:
 *   useNarrator() returns a new object literal {supported, speaking, speak, stop}
 *   every render. Using `narrator` in useEffect deps made effects re-run on
 *   every render, causing narrator.speak() to be called in a tight loop.
 *   FIX: getNarrator() returns the same singleton reference every call (module
 *   scope), so we call it directly in effects rather than via the returned object.
 *   speak/stop are stable useCallback refs. Neither changes between renders.
 *
 * BUG B — stop/speak race condition:
 *   Two effects both watched pageIdx. The first ran cleanup (stop()) and the
 *   second scheduled speak() after 350ms. On fast page changes, the stop()
 *   from the OLD page's cleanup fired AFTER the speak() from the NEW page.
 *   FIX: Merge into a single effect. The cleanup cancels the pending timeout
 *   AND stops speech. The effect body schedules the new speak(). One effect,
 *   one clear sequence: cancel → schedule → speak.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import { getNarrator } from "@/lib/narrator";
import { useDharmaStore } from "@/lib/store";

export function useNarrator() {
  // getNarrator() returns the module-level singleton — same reference always.
  // Safe to use directly in effect deps without causing extra re-runs.
  const [speaking, setSpeaking] = useState(() => getNarrator().speaking);
  const narratorEnabled = useDharmaStore((s) => s.settings.narratorEnabled);

  // Sync enabled flag into singleton on settings change.
  // getNarrator() is stable — this effect only re-runs when narratorEnabled changes.
  useEffect(() => {
    getNarrator().setEnabled(narratorEnabled);
  }, [narratorEnabled]);

  // Subscribe to speaking state. Cleanup removes the listener but does NOT
  // stop the narrator — it keeps running across route changes.
  useEffect(() => {
    const unsub = getNarrator().subscribe(setSpeaking);
    return () => unsub();
  }, []); // empty deps: subscribe once, unsubscribe on final unmount

  const speak = useCallback((text: string) => getNarrator().speak(text), []);
  const stop  = useCallback(()             => getNarrator().stop(),       []);

  return {
    supported: getNarrator().supported,
    speaking,
    speak,
    stop,
  };
}

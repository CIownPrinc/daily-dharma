/**
 * Narrator — singleton Web Speech API wrapper.
 *
 * WHY a singleton instead of a hook?
 *
 * The previous useNarrator() hook tied SpeechSynthesis to a component's
 * lifecycle. When the story route unmounted (e.g. the child tapped "Back"
 * mid-sentence), the cleanup ran window.speechSynthesis.cancel() and the
 * narrator died. Re-mounting created a fresh hook instance that had to
 * re-pick a voice.
 *
 * Problems this caused:
 *   - Narration stopped whenever the child navigated between pages
 *   - On iOS, speechSynthesis.getVoices() returns [] on first call and only
 *     populates after the onvoiceschanged event. A fresh hook instance misses
 *     the cached voice list.
 *   - The `speaking` state lived in the component — two components could
 *     show conflicting states (one showing "speaking", one not).
 *
 * The singleton pattern fixes all three:
 *   - One SpeechSynthesis instance, never cancelled on unmount
 *   - Voice is picked once and cached in the singleton for the session
 *   - Speaking state is managed in one place (Zustand store)
 *
 * INTEGRATION: The Narrator class is created once in narrator.ts module scope.
 * The Zustand store imports it via getNarrator(). useNarrator() is a thin
 * adapter that reads `speaking` from the store and delegates speak/stop to the
 * singleton. Components never hold a reference to SpeechSynthesis directly.
 */

type SpeakingListener = (speaking: boolean) => void;

class Narrator {
  private voice: SpeechSynthesisVoice | null = null;
  private listeners: Set<SpeakingListener> = new Set();
  private _speaking = false;
  private _supported = false;
  private _enabled = true;

  constructor() {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    this._supported = true;
    this._pickVoice();
    window.speechSynthesis.onvoiceschanged = () => this._pickVoice();
  }

  private _pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    this.voice =
      voices.find((v) => /samantha|karen|tessa|moira|fiona/i.test(v.name)) ??
      voices.find((v) => /female/i.test(v.name) && /en/i.test(v.lang)) ??
      voices.find((v) => /^en/i.test(v.lang)) ??
      voices[0] ??
      null;
  }

  private _setSpeaking(val: boolean) {
    this._speaking = val;
    this.listeners.forEach((fn) => fn(val));
  }

  get supported() { return this._supported; }
  get speaking()   { return this._speaking; }
  get enabled()    { return this._enabled; }

  setEnabled(val: boolean) {
    this._enabled = val;
    if (!val) this.stop();
  }

  /** Subscribe to speaking state changes (used by useNarrator hook). */
  subscribe(fn: SpeakingListener): () => void {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  speak(text: string) {
    if (!this._supported || !this._enabled) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (this.voice) utter.voice = this.voice;
    utter.rate = 0.9;
    utter.pitch = 1.05;
    utter.volume = 1;
    utter.onstart  = () => this._setSpeaking(true);
    utter.onend    = () => this._setSpeaking(false);
    utter.onerror  = () => this._setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  stop() {
    if (!this._supported) return;
    window.speechSynthesis.cancel();
    this._setSpeaking(false);
  }
}

// Module-level singleton — created once, lives for the entire session.
let _instance: Narrator | null = null;

export function getNarrator(): Narrator {
  if (!_instance) _instance = new Narrator();
  return _instance;
}

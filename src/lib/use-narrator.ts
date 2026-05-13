import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Browser-native narrator using the Web Speech API.
 * Free, offline, and works on iOS/Android/desktop. Picks the warmest
 * available voice (prefers female English voices).
 */
export function useNarrator() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      // Warm/female English voices first; fallback to any English voice.
      const preferred =
        voices.find((v) => /samantha|karen|tessa|moira|fiona/i.test(v.name)) ||
        voices.find((v) => /female/i.test(v.name) && /en/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        voices[0];
      voiceRef.current = preferred ?? null;
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utter.voice = voiceRef.current;
    utter.rate = 0.9; // gentle, bedtime-tale pace
    utter.pitch = 1.05;
    utter.volume = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);

  return { supported, speaking, speak, stop };
}

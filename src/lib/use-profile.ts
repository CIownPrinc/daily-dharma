import { useEffect, useState, useCallback } from "react";

const KEY = "dharma-profile-v1";

export const AVATARS = ["🦚", "🐘", "🪷", "🌟", "🐒", "🦁", "🌙", "🌸", "🪈", "🦋"] as const;
export type Avatar = (typeof AVATARS)[number];

export type Profile = {
  name: string;
  avatar: Avatar;
  createdAt: string;
};

function load(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(load());
    setHydrated(true);
  }, []);

  const save = useCallback((p: Profile) => {
    setProfile(p);
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(p));
    }
  }, []);

  const clear = useCallback(() => {
    setProfile(null);
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  }, []);

  return { profile, hydrated, save, clear };
}

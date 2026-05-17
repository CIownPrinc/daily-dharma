/**
 * Compatibility shim — delegates to the central Zustand store.
 * See use-progress.ts for rationale.
 */
import { useCallback } from "react";
import { useDharmaStore } from "@/lib/store";

export const AVATARS = ["🦚", "🐘", "🪷", "🌟", "🐒", "🦁", "🌙", "🌸", "🪈", "🦋"] as const;
export type Avatar = (typeof AVATARS)[number];

export type Profile = {
  name: string;
  avatar: Avatar;
  createdAt: string;
  ageStage?: "Little" | "Curious" | "Seeker";
};

export function useProfile() {
  const profile = useDharmaStore((s) => s.profile);
  const hydrated = useDharmaStore((s) => s.profileHydrated);
  const _saveProfile = useDharmaStore((s) => s.saveProfile);
  const _clearProfile = useDharmaStore((s) => s.clearProfile);

  const save = useCallback(
    (p: Profile) => {
      _saveProfile({
        name: p.name,
        avatar: p.avatar as Avatar,
        ageStage: p.ageStage ?? "Curious",
        createdAt: p.createdAt,
      });
    },
    [_saveProfile],
  );

  const clear = useCallback(() => _clearProfile(), [_clearProfile]);

  return { profile, hydrated, save, clear };
}

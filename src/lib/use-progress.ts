import { useEffect, useState } from "react";

const KEY = "dharma-progress-v1";

export type Progress = {
  petals: number;
  streak: number;
  lastVisit: string | null;
  completedStories: string[];
  completedMissions: string[]; // includes date suffix yyyy-mm-dd
  todaysMissionId: string | null;
  todaysMissionDate: string | null;
};

const initial: Progress = {
  petals: 0,
  streak: 0,
  lastVisit: null,
  completedStories: [],
  completedMissions: [],
  todaysMissionId: null,
  todaysMissionDate: null,
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function load(): Progress {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

function save(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = load();
    // Update streak on first visit per day
    const today = todayStr();
    if (p.lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      p.streak = p.lastVisit === yStr ? p.streak + 1 : 1;
      p.lastVisit = today;
      save(p);
    }
    setProgress(p);
    setHydrated(true);
  }, []);

  const update = (patch: Partial<Progress> | ((p: Progress) => Progress)) => {
    setProgress((prev) => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      save(next);
      return next;
    });
  };

  const completeStory = (slug: string) =>
    update((p) =>
      p.completedStories.includes(slug)
        ? p
        : { ...p, completedStories: [...p.completedStories, slug], petals: p.petals + 3 },
    );

  const completeMission = (id: string) => {
    const key = `${id}:${todayStr()}`;
    update((p) =>
      p.completedMissions.includes(key)
        ? p
        : { ...p, completedMissions: [...p.completedMissions, key], petals: p.petals + 1 },
    );
  };

  const isMissionCompletedToday = (id: string) =>
    progress.completedMissions.includes(`${id}:${todayStr()}`);

  return { progress, hydrated, completeStory, completeMission, isMissionCompletedToday, update };
}

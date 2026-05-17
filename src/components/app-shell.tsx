/**
 * AppShell — root layout wrapper.
 *
 * Changes from original:
 *   1. Calls _hydrateProgress() on mount (exactly once) to update streak and
 *      mark today as visited. This was previously scattered across useProgress
 *      hook instances; centralizing it here prevents it running N times.
 *   2. Reads profile from the Zustand store via useProfile shim (same API).
 *   3. Story route gets no padding/overflow so the immersive image fills the
 *      viewport edge-to-edge on mobile.
 */
import { useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ProfileOnboarding } from "@/components/profile-onboarding";
import { useProfile } from "@/lib/use-profile";
import { useDharmaStore } from "@/lib/store";

const items = [
  { to: "/", label: "Today", icon: "☀" },
  { to: "/library", label: "Stories", icon: "✦" },
  { to: "/journey", label: "Journey", icon: "✿" },
  { to: "/sanctuary", label: "Sanctuary", icon: "❀" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { profile } = useProfile();
  const hydrateProgress = useDharmaStore((s) => s._hydrateProgress);
  const progressHydrated = useDharmaStore((s) => s.progressHydrated);

  // Hydrate streak / lastVisit exactly once per session.
  // AppShell mounts once at the root so this fires once regardless of how many
  // child components call useProgress().
  useEffect(() => {
    if (!progressHydrated) hydrateProgress();
  }, [hydrateProgress, progressHydrated]);

  const isStoryRoute = pathname.startsWith("/story/");

  return (
    <div className="min-h-dvh bg-page-glow text-foreground">
      <ProfileOnboarding />

      {!isStoryRoute && (
        <header className="md:hidden sticky top-0 z-20 backdrop-blur bg-jasmine/80 border-b border-border/50">
          <div className="px-5 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <LotusMark />
              <span className="font-serif text-lg text-lotus">Dharma Quest</span>
            </Link>
            {profile && (
              <Link to="/sanctuary" className="flex items-center gap-2 bg-lotus-soft rounded-full pl-1 pr-3 py-1 ring-1 ring-lotus/15">
                <span className="text-xl" aria-hidden>{profile.avatar}</span>
                <span className="text-xs font-bold text-ink truncate max-w-[6rem]">{profile.name}</span>
              </Link>
            )}
          </div>
        </header>
      )}

      <div className="md:flex md:max-w-[1280px] md:mx-auto md:px-8 md:py-10 md:gap-10">
        <aside className="hidden md:flex w-56 shrink-0 flex-col gap-8 sticky top-10 self-start">
          <Link to="/" className="flex items-center gap-3">
            <LotusMark />
            <div>
              <div className="font-serif text-xl text-lotus leading-tight">Dharma Quest</div>
              <div className="text-xs text-ink-soft font-medium">Quiet moments.</div>
            </div>
          </Link>
          <nav className="flex flex-col gap-1.5">
            {items.map((it) => {
              const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
              return (
                <Link key={it.to} to={it.to}
                  className={cn(
                    "px-4 py-3 rounded-2xl font-bold text-sm transition-colors flex items-center gap-3",
                    active ? "bg-lotus-soft text-lotus ring-1 ring-lotus/15" : "text-ink-soft hover:text-ink hover:bg-black/5",
                  )}
                >
                  <span aria-hidden className="text-base">{it.icon}</span>
                  {it.label}
                </Link>
              );
            })}
          </nav>
          {profile ? (
            <div className="mt-auto bg-card rounded-2xl p-3 ring-1 ring-ink/5 flex items-center gap-3">
              <span className="text-2xl" aria-hidden>{profile.avatar}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate">{profile.name}</div>
                <Link to="/parents" className="text-[10px] font-bold text-lotus hover:underline">For grown-ups →</Link>
              </div>
            </div>
          ) : (
            <Link to="/parents" className="text-[11px] font-bold text-ink-soft hover:text-lotus mt-auto">For grown-ups →</Link>
          )}
        </aside>

        <main className={cn("flex-1 min-w-0", !isStoryRoute && "px-5 py-6 md:p-0 md:pb-20 pb-28")}>
          {children}
        </main>
      </div>

      {!isStoryRoute && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-jasmine/90 backdrop-blur border-t border-border/60 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]" aria-label="Main navigation">
          <div className="flex items-center justify-around">
            {items.map((it) => {
              const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
              return (
                <Link key={it.to} to={it.to}
                  className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors min-w-16", active ? "text-lotus" : "text-ink-soft")}
                  aria-current={active ? "page" : undefined}
                >
                  <span aria-hidden className={cn("text-xl", active && "animate-gentle-pulse")}>{it.icon}</span>
                  <span className="text-[11px] font-bold">{it.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

function LotusMark() {
  return (
    <div className="size-9 rounded-full bg-lotus-soft ring-1 ring-lotus/20 flex items-center justify-center text-lotus text-lg shrink-0">✿</div>
  );
}

import { useProgress } from "@/lib/use-progress";
import { stories } from "@/lib/dharma-data";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function CharacterGallery() {
  const { progress, hydrated } = useProgress();
  const completed = new Set(hydrated ? progress.completedStories : []);

  // De-duplicate by character name; keep the first story for each.
  const seen = new Set<string>();
  const items = stories
    .filter((s) => {
      if (seen.has(s.character.name)) return false;
      seen.add(s.character.name);
      return true;
    })
    .map((s) => ({
      story: s,
      character: s.character,
      met: completed.has(s.slug),
    }));

  const metCount = items.filter((i) => i.met).length;

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
        <h2 className="font-serif text-xl text-ink">Friends you've met</h2>
        <div className="text-[11px] font-bold uppercase tracking-widest text-ink-soft tabular-nums">
          {metCount} / {items.length} characters
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map(({ story, character, met }) => (
          <Link
            key={character.name}
            to="/story/$slug"
            params={{ slug: story.slug }}
            className={cn(
              "group bg-card rounded-3xl p-4 ring-1 ring-ink/5 shadow-soft hover:shadow-petal transition-all flex flex-col items-center text-center",
              !met && "opacity-80",
            )}
          >
            <div
              className={cn(
                "size-16 rounded-full flex items-center justify-center text-3xl mb-3 ring-2 transition-all",
                met
                  ? "bg-gradient-to-br from-lotus-soft to-saffron-soft ring-lotus/40 group-hover:scale-105"
                  : "bg-ink/5 ring-ink/10 grayscale",
              )}
              aria-hidden
            >
              {met ? character.emoji : "🔒"}
            </div>
            <div className="font-serif text-base text-ink leading-tight mb-1">
              {met ? character.name : "Not yet met"}
            </div>
            <p className="text-[12px] text-ink-soft font-medium leading-snug">
              {met ? character.blurb : `Read "${story.title}" to meet them.`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import type { Story } from "@/lib/dharma-data";

export function StoryCard({
  story,
  featured = false,
  done = false,
}: {
  story: Story;
  featured?: boolean;
  done?: boolean;
}) {
  if (featured) {
    return (
      <Link
        to="/story/$slug"
        params={{ slug: story.slug }}
        className="group block bg-card rounded-[2rem] p-3 ring-1 ring-ink/5 shadow-soft hover:shadow-petal transition-shadow"
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch bg-gradient-to-br from-card to-lotus-soft rounded-3xl overflow-hidden p-5 md:p-8">
          <div className="md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-lotus-soft ring-1 ring-ink/5 shrink-0">
            <img
              src={story.image}
              alt={story.title}
              width={1024}
              height={768}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="md:w-1/2 flex flex-col items-start justify-center">
            <div className="px-3 py-1 bg-card text-lotus text-[11px] font-bold uppercase tracking-widest rounded-full ring-1 ring-ink/5 mb-4">
              Today's Tale · {story.duration}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-3 text-balance">
              {story.title}
            </h3>
            <p className="text-ink-soft leading-relaxed mb-6 text-pretty">{story.blurb}</p>
            <span className="bg-lotus text-primary-foreground px-7 py-3.5 rounded-full font-bold text-base shadow-petal group-hover:bg-lotus-deep transition-colors">
              Listen to Story →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/story/$slug"
      params={{ slug: story.slug }}
      className="group block bg-card rounded-3xl p-3 ring-1 ring-ink/5 shadow-soft hover:shadow-petal transition-shadow relative"
    >
      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-lotus-soft mb-4 relative">
        <img
          src={story.image}
          alt={story.title}
          width={1024}
          height={768}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-card/90 text-ink-soft px-2 py-0.5 rounded-full ring-1 ring-ink/5">
          {story.ageStage}
        </span>
        {done && (
          <span
            className="absolute top-2 right-2 size-7 rounded-full bg-leaf text-primary-foreground flex items-center justify-center text-xs font-bold shadow-petal"
            aria-label="Finished"
          >
            ✓
          </span>
        )}
      </div>
      <div className="px-3 pb-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-1">
          {story.realm} · {story.duration}
        </div>
        <h4 className="font-serif text-lg text-ink leading-snug text-balance">{story.title}</h4>
      </div>
    </Link>
  );
}

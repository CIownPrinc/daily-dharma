/**
 * StoryCard — story thumbnail card with image shimmer skeleton.
 *
 * BUG FIX (Phase 5 regression): The previous version called useImageLoad()
 * at the top level AND again inside the non-featured branch, violating
 * React's Rules of Hooks. When featured=true, React saw 1 hook call;
 * when featured=false, it saw 2. This corrupted hook state, causing images
 * to stay at opacity-0 forever (never firing the onLoad transition).
 *
 * FIX: Both hook calls are now at the top level unconditionally. The
 * featured branch uses heroStatus/heroImgProps; the compact branch uses
 * thumbStatus/thumbImgProps. Both hooks always run regardless of `featured`.
 *
 * Also added referrerPolicy="no-referrer" on all img elements. Wikimedia's
 * CDN requires either no Referer header or a same-origin one. Some deployment
 * environments (Lovable, Vercel) send the app origin as Referer, which
 * Wikimedia's rate-limiter can reject. no-referrer ensures clean requests.
 */
import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import type { Story } from "@/lib/dharma-data";
import { cn } from "@/lib/utils";

function useImageLoad() {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  return {
    status,
    imgProps: {
      onLoad:  () => setStatus("loaded"),
      onError: () => setStatus("error"),
    } as ImgHTMLAttributes<HTMLImageElement>,
  };
}

function ImageFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center text-lotus/40 text-4xl bg-lotus-soft", className)}>
      ✿
    </div>
  );
}

export function StoryCard({
  story,
  featured = false,
  done = false,
}: {
  story: Story;
  featured?: boolean;
  done?: boolean;
}) {
  // Both hooks MUST be called unconditionally at the top level.
  // featured branch uses hero*, compact branch uses thumb*.
  // Previously thumb* was called INSIDE the non-featured branch — a Rules of
  // Hooks violation that caused images to never transition from opacity-0.
  const { status: heroStatus, imgProps: heroImgProps } = useImageLoad();
  const { status: thumbStatus, imgProps: thumbImgProps } = useImageLoad();

  if (featured) {
    return (
      <Link
        to="/story/$slug"
        params={{ slug: story.slug }}
        className="group block bg-card rounded-[2rem] p-3 ring-1 ring-ink/5 shadow-soft hover:shadow-petal transition-shadow"
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch bg-gradient-to-br from-card to-lotus-soft rounded-3xl overflow-hidden p-5 md:p-8">
          <div className={cn(
            "md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-ink/5 shrink-0",
            heroStatus === "loading" && "img-shimmer",
          )}>
            {heroStatus === "error" ? (
              <ImageFallback className="w-full h-full" />
            ) : (
              <img
                src={story.image}
                alt={story.title}
                width={1024}
                height={768}
                referrerPolicy="no-referrer"
                className={cn(
                  "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
                  heroStatus === "loaded" ? "opacity-100" : "opacity-0",
                )}
                {...heroImgProps}
              />
            )}
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
      <div className={cn(
        "aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative",
        thumbStatus === "loading" && "img-shimmer",
      )}>
        {thumbStatus === "error" ? (
          <ImageFallback className="w-full h-full" />
        ) : (
          <img
            src={story.image}
            alt={story.title}
            width={1024}
            height={768}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
              thumbStatus === "loaded" ? "opacity-100" : "opacity-0",
            )}
            {...thumbImgProps}
          />
        )}
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest bg-card/90 text-ink-soft px-2 py-0.5 rounded-full ring-1 ring-ink/5 backdrop-blur-sm">
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

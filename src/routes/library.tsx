import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StoryCard } from "@/components/story-card";
import { stories } from "@/lib/dharma-data";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "The Library — Dharma Quest" },
      {
        name: "description",
        content: "A gentle library of stories from the Ramayana, Mahabharata, and beyond — for children.",
      },
      { property: "og:title", content: "The Library — Dharma Quest" },
      {
        property: "og:description",
        content: "Browse all our bedtime stories and tales.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const groups = Array.from(new Set(stories.map((s) => s.realm)));

  return (
    <AppShell>
      <header className="mb-8 md:mb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-lotus mb-2">
          The Library of Tales
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink text-balance">
          Every story is a small seed.
        </h1>
        <p className="text-ink-soft font-medium mt-2 max-w-prose">
          Choose any tale that calls to you. Each one is a few quiet minutes long.
        </p>
      </header>

      {groups.map((realm) => (
        <section key={realm} className="mb-10">
          <h2 className="font-serif text-xl text-ink mb-4">{realm}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {stories
              .filter((s) => s.realm === realm)
              .map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
          </div>
        </section>
      ))}
    </AppShell>
  );
}

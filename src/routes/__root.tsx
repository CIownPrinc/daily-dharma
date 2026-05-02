import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page-glow px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4" aria-hidden>✿</div>
        <h1 className="font-serif text-5xl text-lotus">404</h1>
        <h2 className="mt-3 font-serif text-xl text-ink">This path is hidden</h2>
        <p className="mt-2 text-sm text-ink-soft">
          The page you're looking for has wandered off into the forest.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-lotus px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-lotus-deep transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dharma Quest — Stories, habits, and wonder for kids" },
      {
        name: "description",
        content:
          "A gentle daily app teaching children Hinduism through interactive stories, small habits, and sacred sounds.",
      },
      { property: "og:title", content: "Dharma Quest" },
      {
        property: "og:description",
        content:
          "Stories, missions, and chants — a quiet daily practice for kids ages 5–13.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}

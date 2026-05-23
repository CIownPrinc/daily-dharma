/**
 * Vite config — extends Lovable's locked wrapper.
 *
 * The @lovable.dev/vite-tanstack-config wrapper manages all core plugins
 * (TanStack Start, React, Tailwind, path aliases, Cloudflare). We only add
 * plugins the wrapper doesn't include.
 *
 * PWA DECISION: vite-plugin-pwa is added here for:
 *   1. Install prompt — children/parents can add the app to their home screen
 *   2. Offline support — the narrator (Web Speech API) works offline; the
 *      rest of the app should too. Story pages are cached so a child on an
 *      airplane can still read.
 *   3. App-like feel on iOS/Android — standalone display mode, splash screen
 *
 * Workbox strategy:
 *   - Shell (HTML, JS, CSS): NetworkFirst with cache fallback
 *   - Fonts + icons: CacheFirst (they never change)
 *   - Story images (Wikimedia CDN): CacheFirst, max 30 entries, 30-day TTL
 *     so the child's 13 stories are all available offline after first visit
 *   - API / dynamic routes: NetworkOnly (no caching needed)
 *
 * TRADEOFF: The SW adds ~5KB to the initial load. This is worth it for the
 * offline experience and install prompt which dramatically improves retention
 * for a daily-habit app.
 */
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      // Don't use devOptions in production; only enable SW in build
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: "Dharma Quest",
        short_name: "Dharma Quest",
        description: "Daily stories, habits, and wonder for children — inspired by the great Hindu epics.",
        start_url: "/",
        display: "standalone",
        background_color: "#fdf6e3",
        theme_color: "#ff6f00",
        orientation: "portrait-primary",
        categories: ["education", "kids"],
        lang: "en",
        icons: [
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Cache the app shell
        globPatterns: ["**/*.{js,css,html,woff2}"],
        // Runtime caching strategies
        runtimeCaching: [
          {
            // Story images from Wikimedia CDN — cache aggressively
            urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "wikimedia-images",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Google Fonts — cache forever (versioned URLs)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // App pages — NetworkFirst so updates reach users quickly
            urlPattern: /^https:\/\/[^/]+\/(|library|journey|sanctuary|settings|parents|story\/.+)$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "app-pages",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// The Lovable assets proxy plugin (bundled in @lovable.dev/vite-tanstack-config)
// forwards /__l5e/assets-v1/* requests to the project's Lovable preview host so
// catalogue photos resolve when running locally. It reads LOVABLE_PREVIEW_HOST
// from process.env — since the variable is not prefixed with VITE_, Vite does
// not expose it automatically, so we load it from .env files explicitly here,
// before the plugins are instantiated.
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
if (env.LOVABLE_PREVIEW_HOST && !process.env.LOVABLE_PREVIEW_HOST) {
  process.env.LOVABLE_PREVIEW_HOST = env.LOVABLE_PREVIEW_HOST;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    prerender: {
      routes: ["/"],
    },
  },
});

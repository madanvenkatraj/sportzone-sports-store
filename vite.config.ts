import { defineConfig } from "vite";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ServerResponse } from "node:http";
import type { createApp } from "./server/app.ts";

interface AppModule {
  createApp: typeof createApp;
}

function isAppModule(mod: unknown): mod is AppModule {
  return typeof mod === "object" && mod !== null && "createApp" in mod && typeof mod.createApp === "function";
}

function isApiRequest(url: string | undefined): boolean {
  if (!url) return false;
  return url === "/api" || url.startsWith("/api/") || url.startsWith("/api?");
}

/** Same envelope as server/lib/errors.ts, for when the API module itself fails to load. */
function sendLoadError(res: ServerResponse): void {
  if (res.headersSent) return;
  res.statusCode = 500;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      error: { code: "INTERNAL_ERROR", message: "Something went wrong on our side. Please try again." },
    }),
  );
}

/**
 * Runs the Express API (server/app.ts) inside the Vite dev and preview servers, so whatever
 * starts Vite (`npm run dev`, the workspace preview, `npm run preview`) also answers /api,
 * with no second process or proxy port. `npm start` runs the same app standalone in production.
 */
function nexoraApi(): Plugin {
  return {
    name: "nexora-api",
    configureServer(server: ViteDevServer) {
      const dataDir = path.join(server.config.root, "data");
      let current: { factory: AppModule["createApp"]; app: ReturnType<AppModule["createApp"]> } | undefined;
      server.middlewares.use((req, res, next) => {
        if (!isApiRequest(req.url)) return next();
        // ssrLoadModule picks up edits to server/ and the shared chat data without restarting Vite.
        server
          .ssrLoadModule("/server/app.ts")
          .then((mod) => {
            if (!isAppModule(mod)) throw new Error("server/app.ts does not export createApp");
            if (!current || current.factory !== mod.createApp) {
              current = { factory: mod.createApp, app: mod.createApp({ dataDir }) };
            }
            current.app(req, res);
          })
          .catch((err: unknown) => {
            if (err instanceof Error) server.ssrFixStacktrace(err);
            const detail = err instanceof Error ? (err.stack ?? err.message) : String(err);
            server.config.logger.error(`[api] could not load server/app.ts: ${detail}`);
            sendLoadError(res);
          });
      });
    },
    configurePreviewServer(server: PreviewServer) {
      const dataDir = path.join(server.config.root, "data");
      // A runtime URL keeps the server out of the bundled config; Node strips the types itself.
      const appUrl = pathToFileURL(path.join(server.config.root, "server", "app.ts")).href;
      const ready = import(appUrl).then((mod: unknown) => {
        if (!isAppModule(mod)) throw new Error("server/app.ts does not export createApp");
        return mod.createApp({ dataDir });
      });
      server.middlewares.use((req, res, next) => {
        if (!isApiRequest(req.url)) return next();
        ready
          .then((app) => app(req, res))
          .catch((err: unknown) => {
            server.config.logger.error(`[api] could not load server/app.ts: ${err instanceof Error ? err.message : String(err)}`);
            sendLoadError(res);
          });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), nexoraApi()],
  server: { port: 3000, host: true, strictPort: true },
  // The three.js scene is a lazy chunk loaded only on capable devices near the
  // showcase section; it never blocks the initial page load.
  build: { chunkSizeWarningLimit: 900 },
});

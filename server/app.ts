import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { healthRouter } from "./routes/health.ts";
import { createContactRouter } from "./routes/contact.ts";
import type { ContactRateLimit } from "./routes/contact.ts";
import { createChatRouter } from "./routes/chat.ts";
import type { ChatRateLimit } from "./routes/chat.ts";
import { sendError } from "./lib/errors.ts";

export interface AppOptions {
  /** Directory where file-backed data (e.g. contact submissions) is stored. */
  dataDir: string;
  /** Optional built frontend directory to serve (production). */
  staticDir?: string;
  /**
   * Express "trust proxy" setting (see server/lib/trustProxy.ts). Off by default, so rate
   * limits key on the socket address and X-Forwarded-For is ignored.
   */
  trustProxy?: boolean | number | string;
  /** Per-IP rate limits; each router keeps its own default when omitted. */
  rateLimits?: { contact?: ContactRateLimit; chat?: ChatRateLimit };
}

export function createApp(options: AppOptions): Express {
  const app = express();
  app.disable("x-powered-by");
  if (options.trustProxy !== undefined) app.set("trust proxy", options.trustProxy);
  app.use(express.json({ limit: "16kb" }));

  // Router mount order is fixed: health, contact, chat.
  app.use("/api/health", healthRouter);
  app.use(
    "/api/contact",
    createContactRouter({ dataDir: options.dataDir, rateLimit: options.rateLimits?.contact }),
  );
  app.use("/api/chat", createChatRouter({ rateLimit: options.rateLimits?.chat }));

  app.use("/api", (_req: Request, res: Response) => {
    sendError(res, 404, "NOT_FOUND", "This API endpoint does not exist.");
  });

  if (options.staticDir && existsSync(options.staticDir)) {
    const staticDir = options.staticDir;
    app.use(express.static(staticDir));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  }

  // Malformed JSON and any unexpected errors end up here.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (isBodyParseError(err)) {
      sendError(res, 400, "INVALID_JSON", "The request body is not valid JSON.");
      return;
    }
    console.error("[api] unhandled error:", err instanceof Error ? err.message : err);
    sendError(res, 500, "INTERNAL_ERROR", "Something went wrong on our side. Please try again.");
  });

  return app;
}

function isBodyParseError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const type = (err as { type?: unknown }).type;
  return type === "entity.parse.failed" || type === "entity.too.large";
}

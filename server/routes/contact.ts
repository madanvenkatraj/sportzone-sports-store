import { Router } from "express";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { sendError } from "../lib/errors.ts";
import { validateContact } from "../lib/contactValidation.ts";
import { createContactStore } from "../lib/contactStore.ts";
import type { ContactRecord } from "../lib/contactStore.ts";

export interface ContactRateLimit {
  /** Maximum submissions per IP inside one window. */
  max: number;
  windowMs: number;
}

export interface ContactRouterOptions {
  dataDir: string;
  /**
   * Defaults to 5 per IP per 10 minutes. Keyed on `req.ip`, which only reflects
   * X-Forwarded-For when the app's "trust proxy" setting is on (AppOptions.trustProxy).
   */
  rateLimit?: ContactRateLimit;
}

const DEFAULT_RATE_LIMIT: ContactRateLimit = { max: 5, windowMs: 10 * 60 * 1000 };

export function createContactRouter(options: ContactRouterOptions): Router {
  const router = Router();
  const store = createContactStore(options.dataDir);
  const limit = options.rateLimit ?? DEFAULT_RATE_LIMIT;
  const hits = new Map<string, number[]>();

  /** Returns seconds until the client may retry, or 0 when the request is allowed (and counted). */
  function takeSlot(ip: string, now: number): number {
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < limit.windowMs);
    if (recent.length >= limit.max) {
      hits.set(ip, recent);
      const oldest = recent[0] ?? now;
      return Math.max(1, Math.ceil((oldest + limit.windowMs - now) / 1000));
    }
    recent.push(now);
    hits.set(ip, recent);
    // Opportunistic cleanup so the map cannot grow forever.
    if (hits.size > 10_000) {
      for (const [key, times] of hits) {
        if (times.every((t) => now - t >= limit.windowMs)) hits.delete(key);
      }
    }
    return 0;
  }

  router.post("/", async (req: Request, res: Response) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const retryAfter = takeSlot(ip, Date.now());
    if (retryAfter > 0) {
      res.setHeader("Retry-After", String(retryAfter));
      sendError(res, 429, "RATE_LIMITED", "You've sent several messages in a short time. Please wait a few minutes and try again.");
      return;
    }

    const result = validateContact(req.body);
    if (!result.ok) {
      sendError(res, 400, "VALIDATION_ERROR", "Please check the highlighted fields.", result.errors);
      return;
    }

    const id = randomUUID();
    const receivedAt = new Date().toISOString();

    // Honeypot filled: pretend success so bots learn nothing, but store nothing.
    if (result.value.website) {
      res.status(201).json({ data: { id, receivedAt } });
      return;
    }

    const record: ContactRecord = {
      id,
      receivedAt,
      name: result.value.name,
      email: result.value.email,
      message: result.value.message,
    };
    if (result.value.company) record.company = result.value.company;

    try {
      await store.append(record);
    } catch (err) {
      console.error("[contact] failed to store submission:", err instanceof Error ? err.message : "unknown error");
      sendError(res, 500, "INTERNAL_ERROR", "We couldn't send your message right now. Please try again in a moment.");
      return;
    }

    res.status(201).json({ data: { id, receivedAt } });
  });

  return router;
}

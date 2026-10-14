import { Router } from "express";
import type { Request, Response } from "express";
import { sendError } from "../lib/errors.ts";
import { findReply } from "../../src/lib/chatReply.ts";

export interface ChatRateLimit {
  max: number;
  windowMs: number;
}

export interface ChatRouterOptions {
  /**
   * Per-IP limit; defaults to 30 requests per minute. Keyed on `req.ip`, which only reflects
   * X-Forwarded-For when the app's "trust proxy" setting is on (AppOptions.trustProxy).
   */
  rateLimit?: ChatRateLimit;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const MAX_MESSAGE_LENGTH = 500;
const VALIDATION_MESSAGE = `Please type a message (up to ${MAX_MESSAGE_LENGTH} characters).`;

/** POST /api/chat — answers a visitor message with a predefined reply. */
export function createChatRouter(options?: ChatRouterOptions): Router {
  const { max, windowMs } = options?.rateLimit ?? { max: 30, windowMs: 60_000 };
  const buckets = new Map<string, Bucket>();
  const router = Router();

  router.post("/", (req: Request, res: Response) => {
    // Fixed-window in-memory rate limit per client IP.
    const now = Date.now();
    if (buckets.size > 10_000) {
      for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
    }
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    let bucket = buckets.get(ip);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(ip, bucket);
    }
    bucket.count += 1;
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - bucket.count)));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));
    if (bucket.count > max) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))));
      sendError(res, 429, "RATE_LIMITED", "You're sending messages too quickly. Please wait a moment and try again.");
      return;
    }

    // Validate by hand; message contents are never logged.
    const body: unknown = req.body;
    const message =
      typeof body === "object" && body !== null ? (body as { message?: unknown }).message : undefined;
    if (typeof message !== "string") {
      sendError(res, 400, "VALIDATION_ERROR", VALIDATION_MESSAGE, [
        { field: "message", message: "Message must be text." },
      ]);
      return;
    }
    const text = message.trim();
    if (text.length < 1 || text.length > MAX_MESSAGE_LENGTH) {
      sendError(res, 400, "VALIDATION_ERROR", VALIDATION_MESSAGE, [
        {
          field: "message",
          message: text.length < 1 ? "Message cannot be empty." : `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
        },
      ]);
      return;
    }

    const result = findReply(text);
    res.status(200).json({ data: { ...result, timestamp: new Date().toISOString() } });
  });

  return router;
}

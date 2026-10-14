import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createApp } from "../../server/app.ts";
import type { AppOptions } from "../../server/app.ts";

export interface TestServer {
  baseUrl: string;
  dataDir: string;
  close: () => Promise<void>;
}

/** Limits high enough that no test in a file can use them up, whatever order the tests run in. */
const GENEROUS = { max: 10_000, windowMs: 60_000 };

/**
 * Boots the real Express app on a random port with a throwaway data directory.
 * Rate limits default to GENEROUS; tests that exercise limiting pass their own.
 */
export async function startTestServer(overrides: Omit<AppOptions, "dataDir"> = {}): Promise<TestServer> {
  const dataDir = mkdtempSync(path.join(tmpdir(), "nexora-api-"));
  const app = createApp({
    ...overrides,
    dataDir,
    rateLimits: { contact: GENEROUS, chat: GENEROUS, ...overrides.rateLimits },
  });
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    dataDir,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => {
          rmSync(dataDir, { recursive: true, force: true });
          if (err) reject(err);
          else resolve();
        });
      }),
  };
}

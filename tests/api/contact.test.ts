import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import express from "express";
import { startTestServer } from "./helpers.ts";
import type { TestServer } from "./helpers.ts";
import { createContactRouter } from "../../server/routes/contact.ts";

interface ErrorBody {
  error: { code: string; message: string; details?: { field: string; message: string }[] };
}

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "We would like an AI roadmap." };

function readLines(dataDir: string): Record<string, unknown>[] {
  const file = path.join(dataDir, "contact-submissions.jsonl");
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

describe("POST /api/contact", () => {
  let srv: TestServer;
  before(async () => {
    srv = await startTestServer();
  });
  after(async () => {
    await srv.close();
  });

  const post = (body: unknown, raw = false) =>
    fetch(`${srv.baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw ? String(body) : JSON.stringify(body),
    });

  test("stores a valid submission with trimmed values and returns 201", async () => {
    const res = await post({ name: "  Ada Lovelace ", email: " ada@example.com", message: "  Hello there, team!  ", company: " Acme " });
    assert.equal(res.status, 201);
    const body = (await res.json()) as { data: { id: string; receivedAt: string } };
    assert.match(body.data.id, /^[0-9a-f-]{36}$/);
    assert.ok(!Number.isNaN(Date.parse(body.data.receivedAt)));

    const stored = readLines(srv.dataDir).filter((l) => l.id === body.data.id);
    assert.equal(stored.length, 1);
    assert.deepEqual(stored[0], {
      id: body.data.id,
      receivedAt: body.data.receivedAt,
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello there, team!",
      company: "Acme",
    });
  });

  test("returns 400 naming each invalid field", async () => {
    const res = await post({ name: "", email: "not-an-email", message: "short" });
    assert.equal(res.status, 400);
    const body = (await res.json()) as ErrorBody;
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.equal(body.error.message, "Please check the highlighted fields.");
    const fields = (body.error.details ?? []).map((d) => d.field).sort();
    assert.deepEqual(fields, ["email", "message", "name"]);
  });

  test("returns 400 for a non-object body", async () => {
    const res = await post(["not", "an", "object"]);
    assert.equal(res.status, 400);
    const body = (await res.json()) as ErrorBody;
    assert.equal(body.error.code, "VALIDATION_ERROR");
  });

  test("honeypot submissions get 201 but neither the submission nor the honeypot value is stored", async () => {
    const before = readLines(srv.dataDir).length;
    const res = await post({ ...valid, website: "http://spam.example" });
    assert.equal(res.status, 201);
    const body = (await res.json()) as { data: { id: string } };
    const lines = readLines(srv.dataDir);
    assert.equal(lines.length, before);
    assert.equal(lines.some((l) => l.id === body.data.id), false);
    assert.equal(lines.some((l) => JSON.stringify(l).includes("spam.example")), false);
  });

  test("an empty honeypot is a normal submission and the website key is not stored", async () => {
    const res = await post({ ...valid, website: "" });
    assert.equal(res.status, 201);
    const body = (await res.json()) as { data: { id: string } };
    const stored = readLines(srv.dataDir).find((l) => l.id === body.data.id);
    assert.ok(stored, "submission with an empty honeypot should be stored");
    assert.equal("website" in stored, false);
  });

  test("unknown fields are not stored", async () => {
    const res = await post({ ...valid, isAdmin: true, extra: "x" });
    assert.equal(res.status, 201);
    const body = (await res.json()) as { data: { id: string } };
    const stored = readLines(srv.dataDir).find((l) => l.id === body.data.id);
    assert.ok(stored, "submission should be stored");
    assert.equal("isAdmin" in stored, false);
    assert.equal("extra" in stored, false);
    assert.equal("website" in stored, false);
  });
});

async function startRouterServer(max: number): Promise<{ baseUrl: string; dataDir: string; close: () => Promise<void> }> {
  const dataDir = mkdtempSync(path.join(tmpdir(), "nexora-contact-"));
  const app = express();
  app.use(express.json());
  app.use("/api/contact", createContactRouter({ dataDir, rateLimit: { max, windowMs: 60_000 } }));
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  return {
    baseUrl: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    dataDir,
    close: () =>
      new Promise<void>((resolve) =>
        server.close(() => {
          rmSync(dataDir, { recursive: true, force: true });
          resolve();
        }),
      ),
  };
}

describe("contact store concurrency", () => {
  test("concurrent submissions each land on their own intact line", async () => {
    const srv = await startRouterServer(100);
    try {
      const results = await Promise.all(
        Array.from({ length: 20 }, (_, i) =>
          fetch(`${srv.baseUrl}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...valid, message: `Concurrent message #${i} ${"x".repeat(500)}` }),
          }),
        ),
      );
      assert.ok(results.every((r) => r.status === 201));
      const lines = readLines(srv.dataDir);
      assert.equal(lines.length, 20);
      assert.equal(new Set(lines.map((l) => l.id)).size, 20);
    } finally {
      await srv.close();
    }
  });
});

describe("contact rate limit", () => {
  let baseUrl: string;
  let dataDir: string;
  let close: () => Promise<void>;

  before(async () => {
    ({ baseUrl, dataDir, close } = await startRouterServer(2));
  });
  after(async () => {
    await close();
  });

  test("the third request in the window gets 429 with Retry-After", async () => {
    const send = () =>
      fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valid),
      });
    assert.equal((await send()).status, 201);
    assert.equal((await send()).status, 201);
    const third = await send();
    assert.equal(third.status, 429);
    const retryAfter = Number(third.headers.get("retry-after"));
    assert.ok(retryAfter > 0 && retryAfter <= 60, `Retry-After was ${retryAfter}`);
    const body = (await third.json()) as ErrorBody;
    assert.equal(body.error.code, "RATE_LIMITED");
    assert.equal(readLines(dataDir).length, 2);
  });
});

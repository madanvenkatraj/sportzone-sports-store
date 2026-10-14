import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { startTestServer } from "./helpers.ts";
import type { TestServer } from "./helpers.ts";
import { createChatRouter } from "../../server/routes/chat.ts";
import { CHAT_FALLBACK, CHAT_RESPONSES } from "../../src/data/content.ts";

interface ChatOk {
  data: { reply: string; topic: string; matched: boolean; section?: string; timestamp: string };
}
interface ChatErr {
  error: { code: string; message: string; details?: { field: string; message: string }[] };
}

let srv: TestServer;
before(async () => {
  srv = await startTestServer();
});
after(async () => {
  await srv.close();
});

function post(baseUrl: string, body: unknown): Promise<Response> {
  return fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("a known keyword returns that group's reply with matched:true", async () => {
  const res = await post(srv.baseUrl, { message: "What is the PRICING like?" });
  assert.equal(res.status, 200);
  const body = (await res.json()) as ChatOk;
  assert.equal(body.data.matched, true);
  assert.equal(body.data.topic, "pricing");
  assert.equal(body.data.reply, CHAT_RESPONSES[1].reply);
  assert.equal(body.data.section, "#pricing");
  assert.ok(!Number.isNaN(Date.parse(body.data.timestamp)));
});

test("gibberish returns the fallback with matched:false", async () => {
  const res = await post(srv.baseUrl, { message: "qwzx blorp", history: [{ junk: true }] });
  assert.equal(res.status, 200);
  const body = (await res.json()) as ChatOk;
  assert.equal(body.data.matched, false);
  assert.equal(body.data.reply, CHAT_FALLBACK);
});

for (const [label, payload] of [
  ["empty string", { message: "" }],
  ["whitespace only", { message: "    " }],
  ["non-string", { message: 42 }],
  ["missing message", {}],
  ["over 500 characters", { message: "a".repeat(501) }],
] as const) {
  test(`rejects ${label} with 400 VALIDATION_ERROR`, async () => {
    const res = await post(srv.baseUrl, payload);
    assert.equal(res.status, 400);
    const body = (await res.json()) as ChatErr;
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.equal(body.error.details?.[0]?.field, "message");
  });
}

test("accepts exactly 500 characters", async () => {
  const res = await post(srv.baseUrl, { message: "b".repeat(500) });
  assert.equal(res.status, 200);
});

test("rate limits per IP with 429 and Retry-After", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api/chat", createChatRouter({ rateLimit: { max: 2, windowMs: 60_000 } }));
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  try {
    const { port } = server.address() as AddressInfo;
    const base = `http://127.0.0.1:${port}`;
    assert.equal((await post(base, { message: "hi" })).status, 200);
    assert.equal((await post(base, { message: "hi" })).status, 200);
    const third = await post(base, { message: "hi" });
    assert.equal(third.status, 429);
    const retryAfter = Number(third.headers.get("retry-after"));
    assert.ok(retryAfter >= 1 && retryAfter <= 60, `Retry-After was ${retryAfter}`);
    const body = (await third.json()) as ChatErr;
    assert.equal(body.error.code, "RATE_LIMITED");
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

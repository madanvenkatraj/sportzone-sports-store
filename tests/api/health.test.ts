import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers.ts";
import type { TestServer } from "./helpers.ts";

let srv: TestServer;
before(async () => {
  srv = await startTestServer();
});
after(async () => {
  await srv.close();
});

test("GET /api/health reports ok", async () => {
  const res = await fetch(`${srv.baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = (await res.json()) as { status: string; timestamp: string };
  assert.equal(body.status, "ok");
  assert.ok(!Number.isNaN(Date.parse(body.timestamp)));
});

test("unknown /api routes return a 404 error envelope", async () => {
  const res = await fetch(`${srv.baseUrl}/api/does-not-exist`);
  assert.equal(res.status, 404);
  const body = (await res.json()) as { error: { code: string } };
  assert.equal(body.error.code, "NOT_FOUND");
});

test("malformed JSON returns 400 INVALID_JSON", async () => {
  const res = await fetch(`${srv.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: { code: string } };
  assert.equal(body.error.code, "INVALID_JSON");
});

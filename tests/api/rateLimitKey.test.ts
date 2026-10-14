import { test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers.ts";

const ONE_PER_MINUTE = { max: 1, windowMs: 60_000 };
const validContact = { name: "Ada Lovelace", email: "ada@example.com", message: "We would like an AI roadmap." };

function post(baseUrl: string, route: "contact" | "chat", forwardedFor: string): Promise<Response> {
  return fetch(`${baseUrl}/api/${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": forwardedFor },
    body: JSON.stringify(route === "contact" ? validContact : { message: "pricing" }),
  });
}

test("without trust proxy, X-Forwarded-For is ignored, so a spoofed header cannot dodge the contact limit", async () => {
  const srv = await startTestServer({ rateLimits: { contact: ONE_PER_MINUTE } });
  try {
    assert.equal((await post(srv.baseUrl, "contact", "203.0.113.1")).status, 201);
    assert.equal((await post(srv.baseUrl, "contact", "203.0.113.2")).status, 429);
  } finally {
    await srv.close();
  }
});

test("with trust proxy (1 hop), each forwarded client gets its own contact bucket", async () => {
  const srv = await startTestServer({ trustProxy: 1, rateLimits: { contact: ONE_PER_MINUTE } });
  try {
    assert.equal((await post(srv.baseUrl, "contact", "203.0.113.1")).status, 201);
    assert.equal((await post(srv.baseUrl, "contact", "203.0.113.2")).status, 201);
    assert.equal((await post(srv.baseUrl, "contact", "203.0.113.1")).status, 429);
  } finally {
    await srv.close();
  }
});

test("with trust proxy (1 hop), chat buckets are keyed per forwarded client too", async () => {
  const srv = await startTestServer({ trustProxy: 1, rateLimits: { chat: ONE_PER_MINUTE } });
  try {
    assert.equal((await post(srv.baseUrl, "chat", "198.51.100.7")).status, 200);
    assert.equal((await post(srv.baseUrl, "chat", "198.51.100.8")).status, 200);
    assert.equal((await post(srv.baseUrl, "chat", "198.51.100.7")).status, 429);
  } finally {
    await srv.close();
  }
});

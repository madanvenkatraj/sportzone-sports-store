import { test } from "node:test";
import assert from "node:assert/strict";
import { findReply } from "../src/lib/chatReply.ts";
import { CHAT_FALLBACK, CHAT_RESPONSES, CHAT_SUGGESTIONS } from "../src/data/content.ts";

test("findReply matches keywords case-insensitively", () => {
  const lower = findReply("how much does it cost?");
  const upper = findReply("HOW MUCH DOES IT COST?");
  assert.equal(lower.matched, true);
  assert.equal(lower.reply, upper.reply);
  assert.equal(lower.topic, "pricing");
  assert.equal(lower.section, "#pricing");
});

test("findReply returns the reply of the group whose keyword matched", () => {
  const r = findReply("What services do you offer?");
  assert.equal(r.matched, true);
  assert.equal(r.topic, "services");
  assert.equal(r.reply, CHAT_RESPONSES[0].reply);
  assert.equal(r.section, "#services");
});

test("every suggestion chip trigger maps to a matched reply", () => {
  for (const chip of CHAT_SUGGESTIONS) {
    const r = findReply(chip.trigger);
    assert.equal(r.matched, true, `chip "${chip.label}" should match a predefined reply`);
    assert.notEqual(r.reply, CHAT_FALLBACK);
    assert.equal(r.section, chip.href, `chip "${chip.label}" should target ${chip.href}`);
  }
});

test("topics without a page section carry no section target", () => {
  const r = findReply("Do you integrate with our CRM?");
  assert.equal(r.matched, true);
  assert.equal(r.topic, "integrations");
  assert.equal(r.section, undefined);
});

test("unknown text falls back gracefully", () => {
  const r = findReply("qwzx blorp");
  assert.equal(r.matched, false);
  assert.equal(r.topic, "fallback");
  assert.equal(r.reply, CHAT_FALLBACK);
  assert.equal(r.section, undefined);
});

test("empty and whitespace-only text fall back instead of throwing", () => {
  assert.equal(findReply("").matched, false);
  assert.equal(findReply("   ").reply, CHAT_FALLBACK);
});

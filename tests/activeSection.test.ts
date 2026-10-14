import { test } from "node:test";
import assert from "node:assert";
import { pickActiveSection } from "../src/lib/activeSection.ts";

const sections = [
  { id: "home", top: 0 },
  { id: "features", top: 900 },
  { id: "pricing", top: 2000 },
];

test("first section is active at the top of the page", () => {
  assert.strictEqual(pickActiveSection(sections, 100), "home");
});

test("a section becomes active once its top passes the offset", () => {
  const scrolled = sections.map((s) => ({ ...s, top: s.top - 850 }));
  assert.strictEqual(pickActiveSection(scrolled, 100), "features");
});

test("the furthest passed section wins", () => {
  const scrolled = sections.map((s) => ({ ...s, top: s.top - 1950 }));
  assert.strictEqual(pickActiveSection(scrolled, 100), "pricing");
});

test("before the first section reaches the offset, the first is still active", () => {
  const below = sections.map((s) => ({ ...s, top: s.top + 400 }));
  assert.strictEqual(pickActiveSection(below, 100), "home");
});

test("at the bottom of the page the last section wins", () => {
  assert.strictEqual(pickActiveSection(sections, 100, true), "pricing");
});

test("empty input returns null", () => {
  assert.strictEqual(pickActiveSection([], 100), null);
});

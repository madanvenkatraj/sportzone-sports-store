import { test } from "node:test";
import assert from "node:assert";
import { scrollFraction } from "../src/lib/scrollFraction.ts";

test("returns 0 at the top of the page", () => {
  assert.strictEqual(scrollFraction(0, 3000, 1000), 0);
});

test("returns 0.5 halfway down the scrollable range", () => {
  assert.strictEqual(scrollFraction(1000, 3000, 1000), 0.5);
});

test("returns 1 at the bottom of the page", () => {
  assert.strictEqual(scrollFraction(2000, 3000, 1000), 1);
});

test("clamps overscroll past the bottom to 1", () => {
  assert.strictEqual(scrollFraction(2600, 3000, 1000), 1);
});

test("clamps negative (rubber-band) scroll to 0", () => {
  assert.strictEqual(scrollFraction(-120, 3000, 1000), 0);
});

test("returns 0 when the page cannot scroll", () => {
  assert.strictEqual(scrollFraction(0, 800, 1000), 0);
  assert.strictEqual(scrollFraction(50, 1000, 1000), 0);
});

test("returns 0 for non-finite input instead of NaN", () => {
  assert.strictEqual(scrollFraction(Number.NaN, 3000, 1000), 0);
});

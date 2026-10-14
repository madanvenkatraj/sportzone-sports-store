import { test } from "node:test";
import assert from "node:assert";
import { decideRenderMode } from "../src/lib/renderMode.ts";

const capable = {
  webgl: true,
  reducedMotion: false,
  cores: 8,
  memoryGb: 8,
  saveData: false,
};

test("capable devices get the 3D scene", () => {
  assert.strictEqual(decideRenderMode(capable), "3d");
});

test("reduced-motion users get the static fallback", () => {
  assert.strictEqual(decideRenderMode({ ...capable, reducedMotion: true }), "static");
});

test("no WebGL falls back to static", () => {
  assert.strictEqual(decideRenderMode({ ...capable, webgl: false }), "static");
});

test("low-end CPU or memory falls back to static", () => {
  assert.strictEqual(decideRenderMode({ ...capable, cores: 2 }), "static");
  assert.strictEqual(decideRenderMode({ ...capable, memoryGb: 2 }), "static");
});

test("data-saver mode falls back to static", () => {
  assert.strictEqual(decideRenderMode({ ...capable, saveData: true }), "static");
});

test("unknown cores/memory (undefined) does not block 3D", () => {
  assert.strictEqual(
    decideRenderMode({ ...capable, cores: undefined, memoryGb: undefined }),
    "3d"
  );
});

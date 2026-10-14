import { test } from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";

const content = readFileSync("src/data/content.ts", "utf8");

test("all required anchor ids appear in content or section files", () => {
  const all = [
    "TrustedBy", "Hero", "Features", "Services", "HowItWorks",
    "Testimonials", "Pricing", "FAQ", "FinalCTA", "Footer",
  ]
    .map((n) => { try { return readFileSync(`src/components/sections/${n}.tsx`, "utf8"); } catch { return ""; } })
    .join("\n");
  for (const id of ["home", "features", "services", "about", "pricing", "faq", "contact"]) {
    assert.ok(all.includes(`id="${id}"`), `anchor target #${id} must exist as an id`);
  }
});

test("content arrays are populated", () => {
  assert.ok(content.includes("AI-Powered Automation"));
  assert.ok(content.includes("AI Application Development"));
  assert.ok(content.includes("Starter"));
  assert.ok(content.includes("Professional"));
  assert.ok(content.includes("Enterprise"));
  assert.ok((content.match(/question:/g) ?? []).length >= 5, "at least 5 FAQs");
  assert.ok((content.match(/quote:/g) ?? []).length >= 3, "at least 3 testimonials");
});

test("tailwind config defines the Nexora palette", () => {
  const cfg = readFileSync("tailwind.config.js", "utf8");
  assert.ok(cfg.includes("#7C3AED"), "violet token present");
  assert.ok(cfg.includes("#0B1437"), "navy token present");
  assert.ok(cfg.includes("#60A5FA"), "sky token present");
});

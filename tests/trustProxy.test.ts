import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseTrustProxy } from "../server/lib/trustProxy.ts";

describe("parseTrustProxy", () => {
  it("leaves trust proxy off when the variable is unset, empty or 'false'", () => {
    assert.equal(parseTrustProxy(undefined), undefined);
    assert.equal(parseTrustProxy(""), undefined);
    assert.equal(parseTrustProxy("  "), undefined);
    assert.equal(parseTrustProxy("false"), undefined);
  });

  it("reads a hop count as a number", () => {
    assert.equal(parseTrustProxy("1"), 1);
    assert.equal(parseTrustProxy(" 2 "), 2);
  });

  it("reads 'true' as trusting every hop", () => {
    assert.equal(parseTrustProxy("true"), true);
    assert.equal(parseTrustProxy("TRUE"), true);
  });

  it("passes subnet and preset lists through for Express to interpret", () => {
    assert.equal(parseTrustProxy("loopback, 10.0.0.0/8"), "loopback, 10.0.0.0/8");
  });
});

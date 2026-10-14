import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../server/lib/contactValidation.ts";

const valid = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello, I need an AI roadmap." };

function fieldsOf(result: ReturnType<typeof validateContact>): string[] {
  return result.ok ? [] : result.errors.map((e) => e.field).sort();
}

describe("validateContact", () => {
  it("accepts a valid submission", () => {
    const result = validateContact(valid);
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.value, valid);
  });

  it("trims every string field and drops an empty company", () => {
    const result = validateContact({
      name: "  Ada  ",
      email: " ada@example.com ",
      message: "   ten chars!!   ",
      company: "   ",
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.value, { name: "Ada", email: "ada@example.com", message: "ten chars!!" });
    }
  });

  it("strips unknown fields", () => {
    const result = validateContact({ ...valid, role: "admin", company: "Acme" });
    assert.equal(result.ok, true);
    if (result.ok) assert.deepEqual(result.value, { ...valid, company: "Acme" });
  });

  it("enforces the 10 and 2000 character message boundaries", () => {
    assert.equal(validateContact({ ...valid, message: "a".repeat(10) }).ok, true);
    assert.equal(validateContact({ ...valid, message: "a".repeat(2000) }).ok, true);
    assert.deepEqual(fieldsOf(validateContact({ ...valid, message: "a".repeat(9) })), ["message"]);
    assert.deepEqual(fieldsOf(validateContact({ ...valid, message: "a".repeat(2001) })), ["message"]);
    // Whitespace padding does not count toward the minimum.
    assert.deepEqual(fieldsOf(validateContact({ ...valid, message: "   short   " })), ["message"]);
  });

  it("enforces name and company length limits", () => {
    assert.equal(validateContact({ ...valid, name: "n".repeat(100) }).ok, true);
    assert.deepEqual(fieldsOf(validateContact({ ...valid, name: "n".repeat(101) })), ["name"]);
    assert.deepEqual(fieldsOf(validateContact({ ...valid, company: "c".repeat(101) })), ["company"]);
  });

  it("rejects bad or overlong emails", () => {
    for (const email of ["ada", "ada@", "ada@example", "a da@example.com", "@example.com"]) {
      assert.deepEqual(fieldsOf(validateContact({ ...valid, email })), ["email"], email);
    }
    const long = `${"a".repeat(250)}@x.io`;
    assert.deepEqual(fieldsOf(validateContact({ ...valid, email: long })), ["email"]);
  });

  it("reports every missing or wrongly typed field", () => {
    assert.deepEqual(fieldsOf(validateContact({})), ["email", "message", "name"]);
    assert.deepEqual(fieldsOf(validateContact({ name: 5, email: [], message: {}, company: 1 })), [
      "company",
      "email",
      "message",
      "name",
    ]);
  });

  it("rejects non-object bodies", () => {
    for (const body of [null, "text", 42, ["a"], undefined]) {
      assert.deepEqual(fieldsOf(validateContact(body)), ["body"]);
    }
  });

  it("passes the honeypot through so the route can drop it", () => {
    const result = validateContact({ ...valid, website: "http://spam.example" });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.value.website, "http://spam.example");
  });
});

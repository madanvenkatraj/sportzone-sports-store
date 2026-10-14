import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addToCart,
  setQty,
  removeFromCart,
  cartCount,
  cartSubtotal,
  toggleWishlist,
  filterProducts,
  discountPercent,
  formatINR,
  isValidEmail,
  kitSavings,
} from "../src/store/logic.ts";
import { PRODUCTS, SPORTS, KITS, REVIEWS, FAQS, BRANDS } from "../src/store/data.ts";
import type { CartItem, Product, Kit } from "../src/store/types.ts";

/** A lookup the cart math can price lines against, like the real store. */
const ALL_ITEMS = new Map<string, Product | Kit>(
  [...PRODUCTS, ...KITS].map((item) => [item.id, item]),
);
const priceOf = (id: string): number => {
  const item = ALL_ITEMS.get(id);
  if (!item) throw new Error(`unknown item ${id}`);
  return item.price;
};

test("formatINR renders Indian-grouped rupees", () => {
  assert.equal(formatINR(123456), "₹1,23,456");
  assert.equal(formatINR(499), "₹499");
});

test("discountPercent returns the rounded percentage saved", () => {
  assert.equal(discountPercent(999, 1499), 33);
  assert.equal(discountPercent(100, 100), 0);
});

test("addToCart merges the same product and option into one line", () => {
  const cart = addToCart([], "p-cricket-bat-1", 1, "Size: SH");
  assert.deepEqual(cart, [{ id: "p-cricket-bat-1", qty: 1, option: "Size: SH" }]);
  const twice = addToCart(cart, "p-cricket-bat-1", 2, "Size: SH");
  assert.deepEqual(twice, [{ id: "p-cricket-bat-1", qty: 3, option: "Size: SH" }]);
});

test("addToCart keeps different options as separate lines", () => {
  const cart = addToCart(
    addToCart([], "p-cricket-bat-1", 1, "Size: SH"),
    "p-cricket-bat-1",
    1,
    "Size: LH",
  );
  assert.equal(cart.length, 2);
});

test("setQty to zero or less removes the line", () => {
  const cart: CartItem[] = [{ id: "p-cricket-bat-1", qty: 2 }];
  assert.deepEqual(setQty(cart, "p-cricket-bat-1", 0), []);
  assert.deepEqual(setQty([{ id: "x", qty: 5 }], "x", -3), []);
  assert.deepEqual(setQty(cart, "p-cricket-bat-1", 1), [{ id: "p-cricket-bat-1", qty: 1 }]);
});

test("removeFromCart drops only the matching line", () => {
  const cart: CartItem[] = [
    { id: "p-cricket-bat-1", qty: 1 },
    { id: "p-football-1", qty: 2 },
  ];
  assert.deepEqual(removeFromCart(cart, "p-cricket-bat-1"), [{ id: "p-football-1", qty: 2 }]);
});

test("cartCount sums quantities", () => {
  assert.equal(cartCount([{ id: "a", qty: 2 }, { id: "b", qty: 3 }]), 5);
  assert.equal(cartCount([]), 0);
});

test("cartSubtotal prices every line through the lookup", () => {
  const id = PRODUCTS[0].id;
  const subtotal = cartSubtotal([{ id, qty: 2 }], priceOf);
  assert.equal(subtotal, PRODUCTS[0].price * 2);
});

test("toggleWishlist adds once and removes on the second call", () => {
  let list = toggleWishlist([], "p-1");
  assert.deepEqual(list, ["p-1"]);
  list = toggleWishlist(list, "p-1");
  assert.deepEqual(list, []);
});

test("filterProducts matches name, brand and category case-insensitively", () => {
  const all = filterProducts(PRODUCTS, { query: "", category: "all" });
  assert.equal(all.length, PRODUCTS.length);
  const byName = filterProducts(PRODUCTS, { query: "yonex", category: "all" });
  assert.ok(byName.length > 0);
  assert.ok(byName.every((p) => `${p.name} ${p.brand}`.toLowerCase().includes("yonex")));
  const byCategory = filterProducts(PRODUCTS, { query: "", category: "cricket" });
  assert.ok(byCategory.length > 0);
  assert.ok(byCategory.every((p) => p.category === "cricket"));
});

test("filterProducts with a query that matches nothing returns an empty list", () => {
  assert.deepEqual(filterProducts(PRODUCTS, { query: "zzzz", category: "all" }), []);
});

test("filterProducts supports the new and best pseudo-categories", () => {
  const fresh = filterProducts(PRODUCTS, { query: "", category: "new" });
  assert.ok(fresh.length > 0);
  assert.ok(fresh.every((p) => p.isNew));
  const best = filterProducts(PRODUCTS, { query: "", category: "best" });
  assert.ok(best.length > 0);
  assert.ok(best.every((p) => p.bestSeller));
});

test("isValidEmail accepts ordinary addresses and rejects broken ones", () => {
  assert.equal(isValidEmail("fan@example.com"), true);
  assert.equal(isValidEmail("fan@example.co.in"), true);
  assert.equal(isValidEmail("nope"), false);
  assert.equal(isValidEmail("a@b"), false);
  assert.equal(isValidEmail(""), false);
});

test("kitSavings compares the kit price with buying the contents separately", () => {
  for (const kit of KITS) {
    assert.equal(kitSavings(kit), kit.originalPrice - kit.price);
    assert.ok(kitSavings(kit) > 0, `${kit.name} should save money`);
  }
});

test("every product has a unique id, a known sport and a valid price", () => {
  const ids = new Set(PRODUCTS.map((p) => p.id));
  assert.equal(ids.size, PRODUCTS.length);
  const sportIds = new Set(SPORTS.map((s) => s.id));
  for (const p of PRODUCTS) {
    assert.ok(sportIds.has(p.category), `${p.name} points at unknown sport ${p.category}`);
    assert.ok(p.price > 0);
    assert.ok(p.rating >= 0 && p.rating <= 5);
    assert.ok(p.reviews >= 0);
  }
});

test("kits reference real products and their original price is at least the kit price", () => {
  const productIds = new Set(PRODUCTS.map((p) => p.id));
  for (const kit of KITS) {
    assert.ok(kit.items.length >= 2, `${kit.name} should bundle several items`);
    for (const id of kit.items) {
      assert.ok(productIds.has(id), `${kit.name} bundles unknown product ${id}`);
    }
    assert.ok(kit.originalPrice >= kit.price);
  }
});

test("every sport tile, review, FAQ and brand row is populated", () => {
  assert.equal(SPORTS.length, 12);
  for (const s of SPORTS) assert.ok(s.name && s.blurb);
  assert.ok(REVIEWS.length >= 3);
  for (const r of REVIEWS) assert.ok(r.name && r.text && r.rating >= 1 && r.rating <= 5);
  assert.ok(FAQS.length >= 6);
  for (const f of FAQS) assert.ok(f.q && f.a);
  assert.ok(BRANDS.length >= 7);
  assert.ok(BRANDS.every((b) => b.length > 0));
});

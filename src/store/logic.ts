/**
 * Pure store logic for SPORTZONE: cart maths, wishlist toggles, catalogue
 * filtering, rupee formatting and email validation.
 * Shared by the browser (StoreContext) and Node tests, so it stays free of
 * React, DOM and browser-only APIs.
 */
import type { CartItem, Kit, Product } from "./types.ts";

/** Formats a rupee amount with Indian digit grouping, e.g. ₹1,23,456. */
export function formatINR(amount: number): string {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(amount))}`;
}

/** Whole-percent discount between price and original price (0 when equal). */
export function discountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** Adds qty of an item to the cart, merging identical id + option lines. */
export function addToCart(cart: readonly CartItem[], id: string, qty: number, option?: string): CartItem[] {
  const index = cart.findIndex((line) => line.id === id && (line.option ?? "") === (option ?? ""));
  if (index >= 0) {
    return cart.map((line, i) => (i === index ? { ...line, qty: line.qty + qty } : line));
  }
  return [...cart, { id, qty, ...(option ? { option } : {}) }];
}

/** Sets a line's quantity; 0 or less removes the line. */
export function setQty(cart: readonly CartItem[], id: string, qty: number): CartItem[] {
  if (qty <= 0) return cart.filter((line) => line.id !== id);
  return cart.map((line) => (line.id === id ? { ...line, qty } : line));
}

/** Removes every line for an item id (all options). */
export function removeFromCart(cart: readonly CartItem[], id: string): CartItem[] {
  return cart.filter((line) => line.id !== id);
}

/** Total number of units in the cart, for the navbar badge. */
export function cartCount(cart: readonly CartItem[]): number {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

/**
 * Prices the cart against a lookup so kit and product prices live in one
 * place. Lines whose id the lookup doesn't know are skipped defensively.
 */
export function cartSubtotal(cart: readonly CartItem[], priceOf: (id: string) => number): number {
  return cart.reduce((sum, line) => {
    const price = priceOf(line.id);
    return Number.isFinite(price) ? sum + price * line.qty : sum;
  }, 0);
}

/** Toggles an item id in the wishlist; returns a new array. */
export function toggleWishlist(list: readonly string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export interface FilterState {
  query: string;
  /** "all" or a SportId. */
  category: string;
}

/** A special pseudo-category for the carousels. */
export type SpecialCategory = "new" | "best";

/** Filters products by free-text query (name + brand) and sport category. */
export function filterProducts(products: readonly Product[], filter: FilterState): Product[] {
  const query = filter.query.trim().toLowerCase();
  const special = filter.category === "new" || filter.category === "best" ? (filter.category as SpecialCategory) : null;
  return products.filter((p) => {
    const matchesCategory =
      filter.category === "all" ||
      p.category === filter.category ||
      (special === "new" && p.isNew) ||
      (special === "best" && p.bestSeller);
    if (!matchesCategory) return false;
    if (!query) return true;
    return `${p.name} ${p.brand}`.toLowerCase().includes(query);
  });
}

/** Emails need local@domain.tld with a two-plus-letter TLD. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** Rupees saved by buying the kit instead of each item separately. */
export function kitSavings(kit: Kit): number {
  return Math.max(0, kit.originalPrice - kit.price);
}

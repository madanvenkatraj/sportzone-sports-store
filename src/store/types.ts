/**
 * Shared types for the SPORTZONE store. Every module (data, logic, UI)
 * imports from here so the Product / Kit shape is defined exactly once.
 */

/** One cart line: an item plus optional variant, e.g. bat + "Size: SH". */
export interface CartItem {
  id: string;
  qty: number;
  /** Human-readable variant label when the buyer picked one. */
  option?: string;
}

export interface Product {
  id: string;
  name: string;
  /** Brand or "SPORTZONE" for house items. */
  brand: string;
  /** Sport id matching a SPORTS tile. */
  category: SportId;
  price: number;
  /** List price shown struck through when higher than price. */
  originalPrice?: number;
  rating: number;
  reviews: number;
  /** e.g. ["Red", "Blue"]; empty when the product has no variant. */
  colors?: string[];
  /** e.g. ["SH", "LH"]; empty when the product has no variant. */
  sizes?: string[];
  /** Best Sellers and New Arrivals carousels are driven by these flags. */
  bestSeller?: boolean;
  isNew?: boolean;
}

export interface Kit {
  id: string;
  name: string;
  /** Short line under the kit name. */
  tagline: string;
  category: SportId;
  price: number;
  /** Sum of buying every included item individually. */
  originalPrice: number;
  /** Product ids bundled in the kit. */
  items: string[];
  rating: number;
  reviews: number;
}

export type SportId =
  | "cricket"
  | "football"
  | "basketball"
  | "badminton"
  | "tennis"
  | "volleyball"
  | "table-tennis"
  | "gym"
  | "running"
  | "swimming"
  | "boxing"
  | "hockey";

export interface Sport {
  id: SportId;
  name: string;
  blurb: string;
  /** Two-letter mark shown on the tile's gradient card. */
  mark: string;
  /** Tailwind gradient classes, e.g. "from-orange-500 to-red-600". */
  gradient: string;
}

export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  /** Initials shown in the circular avatar placeholder. */
  initials: string;
}

export interface Faq {
  q: string;
  a: string;
}

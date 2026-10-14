/**
 * React bindings for the SPORTZONE store: a context provider with
 * localStorage-persisted cart and wishlist, plus a toast queue for feedback.
 * All maths lives in ./logic.ts so tests can cover it without a DOM.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { KITS, PRODUCTS } from "./data.ts";
import { addToCart, cartCount, cartSubtotal, removeFromCart, setQty, toggleWishlist } from "./logic.ts";
import type { CartItem, Kit, Product } from "./types.ts";

export type StoreItem = Product | Kit;

export interface Toast {
  id: number;
  title: string;
  body: string;
}

interface StoreContextValue {
  products: Product[];
  kits: Kit[];
  itemById: (id: string) => StoreItem | undefined;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (id: string, qty?: number, option?: string) => void;
  setQty: (id: string, qty: number, option?: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  quickView: StoreItem | null;
  openQuickView: (item: StoreItem) => void;
  closeQuickView: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  toasts: Toast[];
  notify: (title: string, body: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "sportzone.cart.v1";
const WISHLIST_KEY = "sportzone.wishlist.v1";

function load<T>(key: string, fallback: T, validate: (raw: unknown) => T | null): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = validate(JSON.parse(raw) as unknown);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const isCartItem = (raw: unknown): raw is CartItem =>
  typeof raw === "object" && raw !== null && typeof (raw as { id?: unknown }).id === "string" &&
  typeof (raw as { qty?: unknown }).qty === "number" && Number.isFinite((raw as { qty?: unknown }).qty);

const isStringList = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every((x) => typeof x === "string");

/** Price lookup across products and kits; unknown ids price as 0. */
const PRICES = new Map<string, number>([...PRODUCTS, ...KITS].map((item) => [item.id, item.price]));

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    load<CartItem[]>(CART_KEY, [], (raw) => (Array.isArray(raw) && raw.every(isCartItem) ? (raw as CartItem[]) : null)),
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    load<string[]>(WISHLIST_KEY, [], (raw) => (isStringList(raw) ? raw : null)),
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [quickView, setQuickView] = useState<StoreItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // Storage full or blocked; cart just won't persist.
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // As above; wishlist won't persist.
    }
  }, [wishlist]);

  const notify = useCallback((title: string, body: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, title, body }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const addToCartById = useCallback(
    (id: string, qty = 1, option?: string) => {
      const item = PRICES.has(id) ? PRODUCTS.find((p) => p.id === id) ?? KITS.find((k) => k.id === id) : undefined;
      if (!item) return;
      setCart((prev) => addToCart(prev, id, Math.max(1, qty), option));
      notify("Added to cart", `${item.name}${option ? ` (${option})` : ""} × ${Math.max(1, qty)}`);
    },
    [notify],
  );

  const setQtyById = useCallback((id: string, qty: number, option?: string) => {
    setCart((prev) => {
      // Qty changes without an option touch every line of that item; with an
      // option, only that variant's line moves.
      return option === undefined
        ? prev.map((line) => (line.id === id ? { ...line, qty } : line))
        : setQty(prev, id, qty);
    });
  }, []);

  const removeFromCartById = useCallback((id: string) => {
    setCart((prev) => removeFromCart(prev, id));
  }, []);

  const toggleWishlistById = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const next = toggleWishlist(prev, id);
        const added = next.length > prev.length;
        const item = PRODUCTS.find((p) => p.id === id) ?? KITS.find((k) => k.id === id);
        if (item) notify(added ? "Added to wishlist" : "Removed from wishlist", item.name);
        return next;
      });
    },
    [notify],
  );

  const itemById = useCallback(
    (id: string): StoreItem | undefined => PRODUCTS.find((p) => p.id === id) ?? KITS.find((k) => k.id === id),
    [],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      products: PRODUCTS,
      kits: KITS,
      itemById,
      cart,
      cartCount: cartCount(cart),
      subtotal: cartSubtotal(cart, (id) => PRICES.get(id) ?? 0),
      addToCart: addToCartById,
      setQty: setQtyById,
      removeFromCart: removeFromCartById,
      clearCart: () => setCart([]),
      wishlist,
      toggleWishlist: toggleWishlistById,
      inWishlist: (id: string) => wishlist.includes(id),
      query,
      setQuery,
      category,
      setCategory,
      quickView,
      openQuickView: setQuickView,
      closeQuickView: () => setQuickView(null),
      cartOpen,
      setCartOpen,
      wishlistOpen,
      setWishlistOpen,
      toasts,
      notify,
    }),
    [cart, wishlist, query, category, quickView, cartOpen, wishlistOpen, toasts, itemById, addToCartById, setQtyById, removeFromCartById, toggleWishlistById, notify],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** Typed hook; throws when used outside the provider so bugs surface early. */
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

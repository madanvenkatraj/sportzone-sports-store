/**
 * Overlay layer: toasts, quick-view modal, cart drawer and wishlist drawer.
 * Every overlay is a real dialog: Escape closes it, the backdrop closes it,
 * focus moves in on open and body scroll is locked while it is up.
 */
import { useEffect, useRef, useState } from "react";
import { formatINR } from "../../store/logic.ts";
import { useStore } from "../../store/StoreContext.tsx";
import type { Kit, Product } from "../../store/types.ts";
import { SPORT_EMOJI, Stars, gradientFor } from "./products.tsx";
import { IconHeart } from "./icons.tsx";

/** Runs handler on Escape while `active`. */
function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);
}

/** Locks body scroll while `active` so drawers don't scroll the page. */
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto rounded-xl bg-charcoal-900 px-4 py-3 text-white shadow-lift" data-testid="toast">
          <p className="text-sm font-bold text-orange-400">{t.title}</p>
          <p className="text-xs text-neutral-200">{t.body}</p>
        </div>
      ))}
    </div>
  );
}

function QuickViewProduct({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const wished = inWishlist(product.id);
  const option = [color && `Colour: ${color}`, size && `Size: ${size}`].filter(Boolean).join(" · ") || undefined;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={`relative grid h-64 place-items-center rounded-2xl bg-gradient-to-br ${gradientFor(product.category)}`}>
        <span className="text-8xl drop-shadow-xl" aria-hidden="true">{SPORT_EMOJI[product.category]}</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600">{product.brand}</p>
        <h3 className="mt-1 font-display text-2xl text-charcoal-900">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars rating={product.rating} />
          <span className="text-neutral-500">{product.rating} · {product.reviews} reviews (sample data)</span>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-black text-charcoal-900">{formatINR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-lg text-neutral-400 line-through">{formatINR(product.originalPrice)}</span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Colour</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${color === c ? "bg-charcoal-900 text-white ring-charcoal-900" : "bg-white text-neutral-700 ring-neutral-300 hover:ring-orange-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Size</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${size === s ? "bg-charcoal-900 text-white ring-charcoal-900" : "bg-white text-neutral-700 ring-neutral-300 hover:ring-orange-400"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <div className="flex items-center rounded-full ring-1 ring-neutral-300">
            <button type="button" className="grid h-9 w-9 place-items-center rounded-l-full hover:bg-neutral-100" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-8 text-center text-sm font-bold" aria-live="polite">{qty}</span>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-r-full hover:bg-neutral-100" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button>
          </div>
          <button type="button" onClick={() => { addToCart(product.id, qty, option); onClose(); }}
            className="flex-1 rounded-full bg-orange-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-500" data-testid="quickview-add">
            Add to Cart
          </button>
          <button type="button" onClick={() => toggleWishlist(product.id)} aria-pressed={wished} aria-label={`Wishlist ${product.name}`}
            className={`grid h-11 w-11 place-items-center rounded-full ring-1 transition ${wished ? "bg-rose-50 text-rose-600 ring-rose-200" : "bg-white text-neutral-500 ring-neutral-300 hover:text-rose-600"}`}>
            <IconHeart filled={wished} />
          </button>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Sample catalogue — prices in ₹, no real inventory or payments behind this demo.</p>
        <button type="button" onClick={onClose} className="mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500 underline-offset-4 hover:text-charcoal-900 hover:underline">
          Close quick view
        </button>
      </div>
    </div>
  );
}

function QuickViewKit({ kit, onClose }: { kit: Kit; onClose: () => void }) {
  const { addToCart, toggleWishlist, inWishlist, itemById } = useStore();
  const wished = inWishlist(kit.id);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={`relative grid h-64 place-items-center rounded-2xl bg-gradient-to-br ${gradientFor(kit.category)}`}>
        <span className="text-8xl drop-shadow-xl" aria-hidden="true">🎒</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Complete kit</p>
        <h3 className="mt-1 font-display text-2xl text-charcoal-900">{kit.name}</h3>
        <p className="mt-1 text-sm text-neutral-600">{kit.tagline}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars rating={kit.rating} />
          <span className="text-neutral-500">{kit.rating} · {kit.reviews} reviews (sample data)</span>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-black text-charcoal-900">{formatINR(kit.price)}</span>
          <span className="text-lg text-neutral-400 line-through">{formatINR(kit.originalPrice)}</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
            Save {formatINR(kit.originalPrice - kit.price)}
          </span>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500">In the kit</p>
        <ul className="mt-1.5 space-y-1 text-sm text-neutral-700">
          {kit.items.map((id) => {
            const item = itemById(id);
            return <li key={id} className="flex items-center gap-2"><span aria-hidden="true">✓</span>{item?.name ?? id}</li>;
          })}
        </ul>
        <div className="mt-5 flex items-center gap-3">
          <button type="button" onClick={() => { addToCart(kit.id, 1); onClose(); }}
            className="flex-1 rounded-full bg-orange-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-500" data-testid="quickview-add">
            Add Kit to Cart
          </button>
          <button type="button" onClick={() => toggleWishlist(kit.id)} aria-pressed={wished} aria-label={`Wishlist ${kit.name}`}
            className={`grid h-11 w-11 place-items-center rounded-full ring-1 transition ${wished ? "bg-rose-50 text-rose-600 ring-rose-200" : "bg-white text-neutral-500 ring-neutral-300 hover:text-rose-600"}`}>
            <IconHeart filled={wished} />
          </button>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Sample catalogue — prices in ₹, no real inventory or states behind this demo.</p>
        <button type="button" onClick={onClose} className="mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500 underline-offset-4 hover:text-charcoal-900 hover:underline">
          Close quick view
        </button>
      </div>
    </div>
  );
}

export function QuickViewModal() {
  const { quickView, closeQuickView } = useStore();
  const open = quickView !== null;
  useEscape(open, closeQuickView);
  useScrollLock(open);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" data-testid="quickview-modal">
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={closeQuickView} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={`Quick view: ${quickView.name}`} className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-lift sm:p-8">
        <button ref={closeRef} type="button" onClick={closeQuickView} aria-label="Close quick view"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        {"brand" in quickView
          ? <QuickViewProduct key={quickView.id} product={quickView} onClose={closeQuickView} />
          : <QuickViewKit key={quickView.id} kit={quickView} onClose={closeQuickView} />}
      </div>
    </div>
  );
}

function DrawerShell({ open, onClose, label, title, children }: { open: boolean; onClose: () => void; label: string; title: string; children: React.ReactNode }) {
  useEscape(open, onClose);
  useScrollLock(open);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" data-testid={`${label}-drawer`}>
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label={title}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-display text-lg text-charcoal-900">{title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={`Close ${title}`} data-testid={`${label}-close`}
            className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function CartDrawer() {
  const store = useStore();
  const { cart, cartOpen, setCartOpen, itemById, setQty, removeFromCart, subtotal, notify } = store;

  return (
    <DrawerShell open={cartOpen} onClose={() => setCartOpen(false)} label="cart" title="Your Cart">
      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="text-5xl" aria-hidden="true">🛒</span>
          <p className="font-bold text-charcoal-900">Your cart is empty</p>
          <p className="text-sm text-neutral-600">Add gear and it will show up here — your cart stays saved on this device.</p>
          <button type="button" onClick={() => setCartOpen(false)} className="mt-2 rounded-full bg-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-orange-500">
            Keep shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
            {cart.map((line) => {
              const item = itemById(line.id);
              if (!item) return null;
              return (
                <li key={`${line.id}-${line.option ?? ""}`} className="flex gap-3 py-4">
                  <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-3xl ${gradientFor(item.category)}`} aria-hidden="true">
                    {SPORT_EMOJI[item.category]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-charcoal-900">{item.name}</p>
                    {line.option && <p className="text-xs text-neutral-500">{line.option}</p>}
                    <p className="mt-0.5 text-sm font-black text-charcoal-900">{formatINR(item.price * line.qty)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-full ring-1 ring-neutral-300">
                        <button type="button" className="grid h-7 w-7 place-items-center rounded-l-full hover:bg-neutral-100" aria-label="Decrease quantity"
                          onClick={() => setQty(line.id, line.qty - 1, line.option)}>−</button>
                        <span className="w-7 text-center text-xs font-bold">{line.qty}</span>
                        <button type="button" className="grid h-7 w-7 place-items-center rounded-r-full hover:bg-neutral-100" aria-label="Increase quantity"
                          onClick={() => setQty(line.id, line.qty + 1, line.option)}>+</button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(line.id)} className="text-xs font-semibold text-neutral-500 hover:text-rose-600" data-testid={`remove-${line.id}`}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-neutral-200 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-neutral-600">Subtotal</span>
              <span className="text-xl font-black text-charcoal-900" data-testid="cart-subtotal">{formatINR(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">Shipping calculated at checkout. Demo store — no real payments.</p>
            <button type="button" onClick={() => notify("Demo checkout", "Payments aren't connected in this sample store yet.")}
              className="mt-3 w-full rounded-full bg-orange-600 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-orange-500">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </DrawerShell>
  );
}

export function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, itemById, addToCart, toggleWishlist } = useStore();

  return (
    <DrawerShell open={wishlistOpen} onClose={() => setWishlistOpen(false)} label="wishlist" title="Your Wishlist">
      {wishlist.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="text-5xl" aria-hidden="true">🤍</span>
          <p className="font-bold text-charcoal-900">Nothing saved yet</p>
          <p className="text-sm text-neutral-600">Tap the heart on any product to save it for later.</p>
          <button type="button" onClick={() => setWishlistOpen(false)} className="mt-2 rounded-full bg-charcoal-900 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-charcoal-700">
            Browse gear
          </button>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
          {wishlist.map((id) => {
            const item = itemById(id);
            if (!item) return null;
            return (
              <li key={id} className="flex gap-3 py-4">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-2xl ${gradientFor(item.category)}`} aria-hidden="true">
                  {SPORT_EMOJI[item.category]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-charcoal-900">{item.name}</p>
                  <p className="text-sm font-black text-charcoal-900">{formatINR(item.price)}</p>
                  <div className="mt-1.5 flex gap-3">
                    <button type="button" onClick={() => { addToCart(item.id, 1); toggleWishlist(item.id); }}
                      className="text-xs font-bold uppercase tracking-wide text-orange-600 hover:underline">
                      Move to cart
                    </button>
                    <button type="button" onClick={() => toggleWishlist(item.id)}
                      className="text-xs font-semibold text-neutral-500 hover:text-rose-600">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DrawerShell>
  );
}

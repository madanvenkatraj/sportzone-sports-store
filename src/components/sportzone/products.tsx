/**
 * Commerce layer, part 1: ProductCard, the featured grid with filter chips
 * and empty state, and the Best Sellers / New Arrivals carousels.
 * All pricing/format helpers come from the store logic; state from context.
 */
import { useRef } from "react";
import { SPORTS } from "../../store/data.ts";
import { discountPercent, filterProducts, formatINR } from "../../store/logic.ts";
import { useStore } from "../../store/StoreContext.tsx";
import type { Product, SportId } from "../../store/types.ts";
import { IconHeart } from "./icons.tsx";

export const SPORT_EMOJI: Record<SportId, string> = {
  cricket: "🏏",
  football: "⚽",
  basketball: "🏀",
  badminton: "🏸",
  tennis: "🎾",
  volleyball: "🏐",
  "table-tennis": "🏓",
  gym: "🏋️",
  running: "👟",
  swimming: "🏊",
  boxing: "🥊",
  hockey: "🏑",
};

export function gradientFor(category: SportId): string {
  return SPORTS.find((s) => s.id === category)?.gradient ?? "from-neutral-500 to-neutral-800";
}

/** Five stars, filled to the rounded rating. */
export function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-amber-500" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} aria-hidden="true" className={i <= full ? "" : "text-neutral-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

interface CardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product: p, compact = false }: CardProps) {
  const { addToCart, toggleWishlist, inWishlist, openQuickView } = useStore();
  const wished = inWishlist(p.id);
  const off = discountPercent(p.price, p.originalPrice);

  return (
    <article className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-neutral-100 transition hover:-translate-y-1 hover:shadow-lift ${compact ? "" : ""}`}>
      {/* CSS-art product tile; the whole tile opens quick view */}
      <button
        type="button"
        onClick={() => openQuickView(p)}
        className={`relative grid h-40 w-full place-items-center bg-gradient-to-br ${gradientFor(p.category)} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600`}
        data-testid={`quickview-${p.id}`}
        aria-label={`Quick view ${p.name}`}
      >
        <span className={`select-none drop-shadow-lg ${compact ? "text-5xl" : "text-6xl"}`} aria-hidden="true">
          {SPORT_EMOJI[p.category]}
        </span>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-orange-700">
            {off}% OFF
          </span>
        )}
        {p.isNew && (
          <span className="absolute right-3 top-3 rounded-full bg-charcoal-900/90 px-2.5 py-1 text-[11px] font-bold text-white">
            NEW
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-charcoal-900/80 py-2 text-xs font-bold uppercase tracking-wider text-white">
          Quick View
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-orange-600">{p.brand}</p>
        <h3 className="mt-1 text-sm font-bold leading-snug text-charcoal-900">{p.name}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <Stars rating={p.rating} />
          <span className="text-neutral-500">({p.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-charcoal-900">{formatINR(p.price)}</span>
          {p.originalPrice && p.originalPrice > p.price && (
            <span className="text-sm text-neutral-400 line-through">{formatINR(p.originalPrice)}</span>
          )}
        </div>
        {(p.colors?.length || p.sizes?.length) && (
          <p className="mt-1 text-xs text-neutral-500">
            {p.colors?.length ? `${p.colors.length} colour${p.colors.length > 1 ? "s" : ""}` : ""}
            {p.colors?.length && p.sizes?.length ? " · " : ""}
            {p.sizes?.length ? `${p.sizes.length} sizes` : ""}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => addToCart(p.id, 1, p.sizes?.length ? `Size: ${p.sizes[0]}` : undefined)}
            className="flex-1 rounded-full bg-orange-600 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-orange-500"
            data-testid={`add-${p.id}`}
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(p.id)}
            className={`grid h-10 w-10 place-items-center rounded-full ring-1 transition ${wished ? "bg-rose-50 text-rose-600 ring-rose-200" : "bg-white text-neutral-500 ring-neutral-200 hover:text-rose-600"}`}
            aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
            aria-pressed={wished}
            data-testid={`wish-${p.id}`}
          >
            <IconHeart filled={wished} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

const CHIPS: { label: string; value: string }[] = [
  { label: "All Sports", value: "all" },
  { label: "New Arrivals", value: "new" },
  { label: "Best Sellers", value: "best" },
  ...SPORTS.map((s) => ({ label: s.name, value: s.id })),
];

export function FeaturedProducts() {
  const { products, query, setQuery, category, setCategory } = useStore();
  const visible = filterProducts(products, { query, category });
  const isSpecial = category === "new" || category === "best";

  return (
    <section id="shop" className="bg-white py-16 sm:py-20" aria-labelledby="shop-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Featured Products</p>
            <h2 id="shop-heading" className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
              {isSpecial
                ? category === "new"
                  ? "New Arrivals"
                  : "Best Sellers"
                : SPORTS.find((s) => s.id === category)?.name ?? "The Shop"}
            </h2>
          </div>
          {(query || category !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-600 hover:border-orange-500 hover:text-orange-600"
              data-testid="clear-filters"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by sport">
          {CHIPS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              aria-pressed={category === c.value}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${category === c.value ? "bg-charcoal-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-orange-100 hover:text-orange-700"}`}
              data-testid={`chip-${c.value}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {query && (
          <p className="mt-4 text-sm text-neutral-600" data-testid="search-note">
            Showing results for “{query}” — {visible.length} item{visible.length === 1 ? "" : "s"}
          </p>
        )}

        {visible.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <p className="font-display text-xl text-charcoal-900">No gear matches that search</p>
            <p className="mt-2 text-sm text-neutral-600">Try a different sport or clear the filters to see everything.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-5 rounded-full bg-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-orange-500"
            >
              Show all gear
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Horizontal scroller with arrows; items are normal ProductCards. */
export function Carousel({ id, heading, items, blurb }: { id: string; heading: string; items: Product[]; blurb: string }) {
  const track = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id={id} className="bg-neutral-50 py-16 sm:py-20" aria-labelledby={`${id}-heading`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">{blurb}</p>
            <h2 id={`${id}-heading`} className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
              {heading}
            </h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${heading} left`} className="grid h-10 w-10 place-items-center rounded-full bg-white text-charcoal-900 shadow-card ring-1 ring-neutral-200 hover:bg-orange-50 hover:text-orange-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${heading} right`} className="grid h-10 w-10 place-items-center rounded-full bg-white text-charcoal-900 shadow-card ring-1 ring-neutral-200 hover:bg-orange-50 hover:text-orange-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <div ref={track} className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {items.map((p) => (
            <div key={p.id} className="w-64 shrink-0 snap-start">
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestSellers() {
  const { products } = useStore();
  return <Carousel id="best-sellers" heading="Best Sellers" blurb="Loved by players" items={products.filter((p) => p.bestSeller)} />;
}

export function NewArrivals() {
  const { products } = useStore();
  return <Carousel id="new-arrivals" heading="New Arrivals" blurb="Fresh in store" items={products.filter((p) => p.isNew)} />;
}

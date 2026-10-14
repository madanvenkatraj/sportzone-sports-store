/**
 * Complete Sports Kits: ready-to-buy bundles with what's inside, the kit
 * price and the savings versus buying each item separately.
 */
import { kitSavings, formatINR } from "../../store/logic.ts";
import { useStore } from "../../store/StoreContext.tsx";
import { useReveal } from "../../hooks/useReveal.ts";
import { Stars, gradientFor } from "./products.tsx";
import type { Kit } from "../../store/types.ts";

function KitCard({ kit }: { kit: Kit }) {
  const { addToCart, openQuickView, itemById } = useStore();
  const savings = kitSavings(kit);

  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-neutral-100 transition hover:-translate-y-1 hover:shadow-lift" data-testid={`kit-${kit.id}`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-3xl ${gradientFor(kit.category)}`} aria-hidden="true">🎒</span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          Save {formatINR(savings)}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg text-charcoal-900">{kit.name}</h3>
      <p className="mt-1 text-sm text-neutral-600">{kit.tagline}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <Stars rating={kit.rating} />
        <span className="text-neutral-500">({kit.reviews})</span>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm text-neutral-700">
        {kit.items.map((id) => {
          const item = itemById(id);
          return <li key={id} className="flex items-center gap-2"><span className="text-orange-600" aria-hidden="true">✓</span>{item?.name ?? id}</li>;
        })}
      </ul>
      <div className="mt-auto pt-5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-charcoal-900">{formatINR(kit.price)}</span>
          <span className="text-sm text-neutral-400 line-through">{formatINR(kit.originalPrice)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => addToCart(kit.id, 1)}
            className="flex-1 rounded-full bg-orange-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-orange-500"
            data-testid={`add-kit-${kit.id}`}>
            Add to Cart
          </button>
          <button type="button" onClick={() => openQuickView(kit)}
            className="rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-charcoal-900 ring-1 ring-neutral-300 transition hover:ring-orange-500 hover:text-orange-600">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export function Kits() {
  const { kits } = useStore();
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);

  return (
    <section id="kits" className="bg-white py-16 sm:py-20" aria-labelledby="kits-heading">
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Complete Sports Kits</p>
          <h2 id="kits-heading" className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
            Ready-to-Buy Bundles
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            Everything a season needs in one order — priced below buying the pieces separately.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((k) => <KitCard key={k.id} kit={k} />)}
        </div>
        <div className="mt-10 text-center">
          <a href="#shop" className="inline-block rounded-full bg-charcoal-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-600">
            Shop Complete Kits
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Special offers banner (diagonal, bold discount type) and the four
 * "Why SPORTZONE" feature cards. Feature copy stays within honest demo
 * claims: no certification badges or delivery guarantees.
 */
import { useReveal } from "../../hooks/useReveal.ts";

const OFFER_TILES = [
  { label: "Cricket", off: "Up to 30% off", note: "Bats, pads & kits" },
  { label: "Football", off: "Flat ₹500 off", note: "On boots above ₹4,999" },
  { label: "Badminton", off: "Up to 25% off", note: "Rackets & shuttles" },
  { label: "Gym & Fitness", off: "Bundle & save", note: "Dumbbells + bands" },
];

const FEATURES = [
  { icon: "🏆", title: "Quality Equipment", body: "Match-grade gear from brands players trust, checked before it ships." },
  { icon: "💰", title: "Competitive Prices", body: "Fair, transparent pricing in rupees with real discounts you can verify." },
  { icon: "🔒", title: "Secure Payments", body: "Checkout is a demo for now, designed around standard secure payment flows." },
  { icon: "🚚", title: "Reliable Delivery", body: "Dispatch updates and tracking for every order, metro to non-metro alike." },
];

export function Offers() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  return (
    <section aria-labelledby="offers-heading" className="bg-white py-16 sm:py-20">
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
        <div className="sz-clip-diagonal relative overflow-hidden bg-charcoal-900 px-6 py-14 sm:px-12 text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_40%,rgba(249,115,22,0.25)_50%,transparent_60%)]" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Limited period</p>
              <h2 id="offers-heading" className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
                UPGRADE YOUR GAME.
                <br />
                <span className="text-orange-500">SAVE MORE.</span>
              </h2>
              <p className="mt-4 max-w-md text-neutral-300">
                Season discounts across the store. Sample offers shown — add gear to your cart and see the savings apply.
              </p>
              <a href="#shop" className="mt-7 inline-block rounded-full bg-orange-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:bg-orange-500">
                Shop Offers
              </a>
            </div>
            <ul className="grid grid-cols-2 gap-4">
              {OFFER_TILES.map((o) => (
                <li key={o.label} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-sm font-bold text-orange-400">{o.off}</p>
                  <p className="mt-1 font-semibold">{o.label}</p>
                  <p className="text-xs text-neutral-400">{o.note}</p>
                </li>
              ))}
            </ul>
            <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent lg:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhySportzone() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.15);
  return (
    <section id="why" className="bg-neutral-50 py-16 sm:py-20" aria-labelledby="why-heading">
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Why choose us</p>
          <h2 id="why-heading" className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
            Why SPORTZONE?
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-2xl" aria-hidden="true">{f.icon}</span>
              <h3 className="mt-4 font-bold text-charcoal-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

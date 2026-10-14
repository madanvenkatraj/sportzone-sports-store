/**
 * Shop by Sport: 12 category tiles. Clicking one (or its Explore Gear link)
 * filters the shop grid to that sport and scrolls to #shop.
 */
import { SPORTS } from "../../store/data.ts";
import { useStore } from "../../store/StoreContext.tsx";
import { useReveal } from "../../hooks/useReveal.ts";

export function SportsGrid() {
  const { setCategory } = useStore();
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);

  const pick = (id: string) => {
    setCategory(id);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="sports" className="bg-neutral-50 py-16 sm:py-20" aria-labelledby="sports-heading">
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Shop by Sport</p>
          <h2 id="sports-heading" className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
            Pick Your Arena
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-600">
            Twelve sports, one store. Gear chosen for how you actually play.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SPORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s.id)}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} p-5 text-left text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600`}
              data-testid={`sport-${s.id}`}
            >
              <span className="pointer-events-none absolute -right-3 -top-6 font-display text-7xl text-white/15 select-none" aria-hidden="true">
                {s.mark}
              </span>
              <span className="relative block text-lg font-bold">{s.name}</span>
              <span className="relative mt-1 block text-xs text-white/80">{s.blurb}</span>
              <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider underline-offset-4 group-hover:underline">
                Explore Gear <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

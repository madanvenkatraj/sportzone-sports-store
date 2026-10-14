/**
 * SPORTZONE hero: headline, supporting line, two CTAs and an animated
 * CSS-art equipment showcase (stadium light + floating sport tiles). No
 * photography — everything is gradients and type so nothing is hotlinked.
 */
import { useReveal } from "../../hooks/useReveal.ts";

const TILES = [
  { label: "Cricket", mark: "🏏", className: "from-orange-500 to-red-600", delay: "0s", pos: "left-[6%] top-[14%]" },
  { label: "Football", mark: "⚽", className: "from-emerald-500 to-teal-700", delay: "0.6s", pos: "left-[20%] bottom-[18%]" },
  { label: "Basketball", mark: "🏀", className: "from-amber-500 to-orange-700", delay: "1.2s", pos: "right-[22%] top-[20%]" },
  { label: "Badminton", mark: "🏸", className: "from-sky-500 to-blue-700", delay: "1.8s", pos: "right-[8%] bottom-[24%]" },
  { label: "Tennis", mark: "🎾", className: "from-lime-500 to-green-700", delay: "2.4s", pos: "left-[42%] top-[8%]" },
  { label: "Gym", mark: "🏋️", className: "from-zinc-600 to-zinc-900", delay: "3s", pos: "right-[38%] bottom-[10%]" },
];

export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="relative overflow-hidden bg-charcoal-900 text-white" aria-label="Featured">
      {/* Stadium light sweeps */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-[10%] h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute right-[8%] top-1/3 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>

      <div ref={ref} className={`relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
              New season · 2025 gear drop
            </p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
              EVERY SPORT.
              <br />
              EVERY GEAR.
              <br />
              <span className="text-orange-500">EVERY CHAMPION.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-neutral-300">
              Find everything you need to play harder, train smarter, and perform better.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#shop" className="rounded-full bg-orange-600 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-500 hover:shadow-orange-500/40">
                Shop All Sports
              </a>
              <a href="#sports" className="rounded-full border-2 border-white/25 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:border-orange-400 hover:text-orange-300">
                Explore Collections
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6 text-center sm:text-left">
              <div>
                <dt className="sr-only">Products in stock</dt>
                <dd className="font-display text-2xl text-orange-400">36+</dd>
                <dd className="text-xs text-neutral-400">Gear picks</dd>
              </div>
              <div>
                <dt className="sr-only">Sports covered</dt>
                <dd className="font-display text-2xl text-orange-400">12</dd>
                <dd className="text-xs text-neutral-400">Sports</dd>
              </div>
              <div>
                <dt className="sr-only">Brands stocked</dt>
                <dd className="font-display text-2xl text-orange-400">12</dd>
                <dd className="text-xs text-neutral-400">Brands</dd>
              </div>
            </dl>
          </div>

          {/* Equipment showcase: CSS-art silhouette + floating tiles */}
          <div className="relative mx-auto h-80 w-full max-w-md sm:h-96" aria-hidden="true">
            <div className="absolute inset-x-8 top-10 h-56 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ring-1 ring-white/10" />
            <div className="absolute left-1/2 top-16 -translate-x-1/2 text-[7rem] drop-shadow-2xl">🏏</div>
            <div className="absolute left-10 bottom-16 text-6xl drop-shadow-xl">🏀</div>
            <div className="absolute right-8 bottom-20 text-6xl drop-shadow-xl">🏸</div>
            <div className="absolute right-16 top-24 text-4xl opacity-80">🎾</div>
            {TILES.map((t) => (
              <span
                key={t.label}
                className={`absolute ${t.pos} grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${t.className} text-xl shadow-lg animate-floaty`}
                style={{ animationDelay: t.delay }}
                title={t.label}
              >
                {t.mark}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Trust layer: brand marquee, customer reviews (sample content), newsletter
 * signup with client-side validation, FAQ accordion, and the full footer.
 */
import { useState } from "react";
import { BRANDS, FAQS, REVIEWS } from "../../store/data.ts";
import { isValidEmail } from "../../store/logic.ts";
import { useStore } from "../../store/StoreContext.tsx";
import { useReveal } from "../../hooks/useReveal.ts";

/** Scrolling brand wordmarks (text, since logo assets aren't licensed here). */
export function Brands() {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <section aria-label="Brands we stock" className="border-y border-neutral-200 bg-white py-8">
      <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
        Trusted brands in store
      </p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <ul className="sz-marquee-track flex w-max items-center gap-14">
          {doubled.map((brand, i) => (
            <li key={`${brand}-${i}`} aria-hidden={i >= BRANDS.length} className="font-display text-2xl text-neutral-400 transition hover:text-charcoal-900">
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Reviews() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.1);
  return (
    <section className="bg-neutral-50 py-16 sm:py-20" aria-labelledby="reviews-heading">
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Customer Reviews</p>
          <h2 id="reviews-heading" className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
            What Players Say
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-500">
            Sample reviews shown for demonstration — real customer reviews will replace them as orders come in.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center gap-1 text-amber-500" aria-label={`Rated ${r.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} aria-hidden="true" className={i <= r.rating ? "" : "text-neutral-300"}>★</span>
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-neutral-700">“{r.text}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xs font-bold text-white" aria-hidden="true">
                  {r.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-charcoal-900">{r.name}</p>
                  <p className="text-xs text-neutral-500">{r.location}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  const { notify } = useStore();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    notify("You're on the list", "New arrivals and offers will land in your inbox.");
    setEmail("");
  };

  return (
    <section id="newsletter" className="relative overflow-hidden bg-charcoal-900 py-16 text-white sm:py-20" aria-labelledby="newsletter-heading">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-orange-600/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Newsletter</p>
        <h2 id="newsletter-heading" className="mt-2 font-display text-3xl sm:text-4xl">
          Stay Ahead of the Game
        </h2>
        <p className="mt-3 text-sm text-neutral-300">
          Get new product announcements and special offers in your inbox. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={submit} noValidate className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-neutral-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/40"
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "newsletter-error" : undefined}
            data-testid="newsletter-input"
          />
          <button type="submit" className="rounded-full bg-orange-600 px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:bg-orange-500" data-testid="newsletter-submit">
            Subscribe
          </button>
        </form>
        {status === "error" && (
          <p id="newsletter-error" className="mt-3 text-sm text-rose-400" data-testid="newsletter-error">
            Please enter a valid email address, like name@example.com.
          </p>
        )}
        {status === "done" && (
          <p className="mt-3 text-sm text-emerald-400" data-testid="newsletter-done" role="status">
            You're subscribed — watch out for the next gear drop.
          </p>
        )}
      </div>
    </section>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-16 sm:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">FAQ</p>
          <h2 id="faq-heading" className="mt-2 font-display text-3xl sm:text-4xl text-charcoal-900">
            Questions, Answered
          </h2>
        </div>
        <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {FAQS.map((f, i) => {
            const open = openIndex === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-charcoal-900 hover:bg-orange-50"
                  data-testid={`faq-q-${i}`}
                >
                  {f.q}
                  <span aria-hidden="true" className={`shrink-0 text-orange-600 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                </button>
                <div id={`faq-panel-${i}`} role="region" hidden={!open} className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">
                  {f.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const FOOTER_CATS = [
  { heading: "Shop", links: ["Cricket", "Football", "Basketball", "Badminton", "Gym & Fitness", "Complete Kits"] },
  { heading: "Support", links: ["Shipping & Delivery", "Returns & Exchanges", "Size Guides", "Warranty", "Contact Us"] },
  { heading: "Company", links: ["About Us", "Careers", "Store Locator", "Bulk Orders"] },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-charcoal-900 text-neutral-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="#home" className="flex items-center gap-2 font-display text-xl text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-lg" aria-hidden="true">⚡</span>
            SPORT<span className="text-orange-500">ZONE</span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            India's all-in-one sports store — kits, equipment, footwear and accessories for every game you play, from gully cricket to gym day.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { label: "Instagram", icon: "📸" },
              { label: "X", icon: "𝕏" },
              { label: "YouTube", icon: "▶️" },
              { label: "Facebook", icon: "👍" },
            ].map((s) => (
              <a key={s.label} href="#home" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm transition hover:bg-orange-600">
                <span aria-hidden="true">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>
        {FOOTER_CATS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white">{col.heading}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l}><a href="#shop" className="transition hover:text-orange-400">{l}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row sm:px-6">
          <p>© 2025 SPORTZONE. Demo store — sample catalogue, no real orders or payments.</p>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            <span className="text-neutral-500">We accept</span>
            {["UPI", "VISA", "MC", "RuPay", "COD"].map((p) => (
              <span key={p} className="rounded-md bg-white/10 px-2 py-1 font-bold text-neutral-200">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

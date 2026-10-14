import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "../ui/shared";
import { SERVICES } from "../../data/content";
import { useReveal } from "../../hooks/useReveal";

const ART: Record<number, { from: string; to: string }> = {
  0: { from: "#60A5FA", to: "#7C3AED" },
  1: { from: "#7C3AED", to: "#A78BFA" },
  2: { from: "#60A5FA", to: "#A78BFA" },
};

function ServiceArt({ index }: { index: number }) {
  const { from, to } = ART[index % 3];
  const id = `svc-grad-${index}`;
  return (
    <div className="flex h-40 items-center justify-center rounded-xl" aria-hidden="true">
      <svg viewBox="0 0 200 120" className="h-full w-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity="0.25" />
            <stop offset="100%" stopColor={to} stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect x="10" y="8" width="180" height="104" rx="14" fill={`url(#${id})`} stroke={to} strokeOpacity="0.3" />
        <circle cx="100" cy="52" r="22" fill={to} fillOpacity="0.15" />
        <g transform="translate(86,38)" fill={to}>
          <circle cx="14" cy="14" r="10" fillOpacity="0.25" />
        </g>
        <g transform="translate(88,40)" stroke={to} strokeWidth="1.8" fill="none" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 3" />
        </g>
        <rect x="60" y="88" width="80" height="6" rx="3" fill={from} fillOpacity="0.4" />
      </svg>
    </div>
  );
}

export default function Services() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Solutions built around your goals"
          description="Three focused services that take you from idea to a production AI capability."
        />
        <div
          ref={ref}
          className={`grid gap-8 md:grid-cols-3 ${visible ? "reveal-visible" : "reveal-hidden"}`}
        >
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <ServiceArt index={i} />
              <h3 className="mt-6 text-lg font-bold text-navy-900">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{s.description}</p>
              <ul className="mt-4 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-grad" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet transition-colors hover:text-navy-800"
              >
                Learn More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

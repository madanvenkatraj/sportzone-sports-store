import { Check, Sparkles } from "lucide-react";
import { Container, SectionHeading } from "../ui/shared";
import { PLANS } from "../../data/content";
import { useReveal } from "../../hooks/useReveal";

export default function Pricing() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="pricing" className="bg-slate-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Plans that scale with you"
          description="Placeholder prices — edit them in src/data/content.ts whenever you are ready."
        />
        <div
          ref={ref}
          className={`grid gap-8 lg:grid-cols-3 ${visible ? "reveal-visible" : "reveal-hidden"}`}
        >
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                plan.featured
                  ? "bg-hero-grad text-white shadow-lift ring-2 ring-violet"
                  : "bg-white text-navy-900 shadow-card ring-1 ring-slate-100 hover:shadow-lift"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-brand-grad px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lift">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Most Popular
                </span>
              )}
              <h3 className={`text-lg font-bold ${plan.featured ? "text-white" : "text-navy-900"}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-sm ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
                {plan.description}
              </p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold ${plan.featured ? "text-white" : "text-navy-900"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm font-medium ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
                  {plan.period}
                </span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-sky-glow" : "text-violet"}`}
                      aria-hidden="true"
                    />
                    <span className={plan.featured ? "text-slate-200" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                  plan.featured
                    ? "bg-white text-violet shadow-soft hover:bg-violet-50"
                    : "bg-brand-grad text-white shadow-lift hover:brightness-110"
                }`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

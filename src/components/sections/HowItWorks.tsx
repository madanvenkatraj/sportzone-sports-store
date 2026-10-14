import { Search, Hammer, Rocket } from "lucide-react";
import { Container, SectionHeading } from "../ui/shared";
import { STEPS } from "../../data/content";
import { useReveal } from "../../hooks/useReveal";

const ICONS = [Search, Hammer, Rocket];

export default function HowItWorks() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="From idea to impact in three steps"
          description="A proven, low-friction path from first conversation to a running AI solution."
        />
        <div
          ref={ref}
          className={`relative mx-auto max-w-4xl ${
            visible ? "reveal-visible" : "reveal-hidden"
          }`}
        >
          {/* connecting line (desktop) */}
          <div
            className="absolute left-0 right-0 top-10 hidden h-0.5 bg-brand-grad opacity-30 md:block"
            aria-hidden="true"
          />
          <ol className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = ICONS[i];
              return (
                <li key={step.number} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-card ring-1 ring-violet/10">
                    <Icon className="h-8 w-8 text-violet" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-violet">
                    Step {step.number}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-navy-900">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

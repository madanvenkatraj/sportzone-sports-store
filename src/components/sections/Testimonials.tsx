import { Quote } from "lucide-react";
import { Container, SectionHeading } from "../ui/shared";
import { TESTIMONIALS } from "../../data/content";
import { useReveal } from "../../hooks/useReveal";

export default function Testimonials() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What teams say about working with us"
          description="Demonstration content — replace with real customer quotes when available."
        />
        <div
          ref={ref}
          className={`grid gap-6 md:grid-cols-3 ${visible ? "reveal-visible" : "reveal-hidden"}`}
        >
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl bg-slate-50 p-8 shadow-card transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <Quote className="h-8 w-8 text-violet/30" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-grad text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-bold text-navy-900">{t.name}</span>
                  <span className="block text-xs text-slate-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

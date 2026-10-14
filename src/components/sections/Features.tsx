import { Bot, BarChart3, Workflow, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, SectionHeading } from "../ui/shared";
import { FEATURES } from "../../data/content";
import type { Feature } from "../../data/content";
import { useReveal } from "../../hooks/useReveal";

const ICONS: Record<Feature["icon"], LucideIcon> = {
  bot: Bot,
  chart: BarChart3,
  workflow: Workflow,
  zap: Zap,
};

function FeatureCard({ feature, className = "" }: { feature: Feature; className?: string }) {
  const Icon = ICONS[feature.icon];
  return (
    <article
      className={`group rounded-2xl border border-slate-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-violet/20 ${className}`}
    >
      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 text-violet transition-colors group-hover:bg-brand-grad group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold text-navy-900">{feature.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
    </article>
  );
}

export default function Features() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="features" className="bg-slate-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run smarter"
          description="Purpose-built AI capabilities that plug into the way your business already works."
        />
        <div
          ref={ref}
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${
            visible ? "reveal-visible" : "reveal-hidden"
          }`}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </Container>
    </section>
  );
}

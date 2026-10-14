import { Container } from "../ui/shared";
import { METRICS } from "../../data/content";
import { useReveal } from "../../hooks/useReveal";

const LOGOS = ["Acme Corp", "BluePeak", "Quantia", "NorthLine", "Vertex", "Lumio"];

export default function TrustedBy() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="border-b border-slate-100 bg-white py-14">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500">
          Trusted by innovative teams
        </p>
        <div
          ref={ref}
          className={`mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 ${
            visible ? "reveal-visible" : "reveal-hidden"
          }`}
        >
          {LOGOS.map((name) => (
            <span
              key={name}
              className="select-none text-lg font-bold tracking-tight text-slate-300 transition-colors hover:text-navy-700"
            >
              {name}
            </span>
          ))}
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {METRICS.map((m) => (
            <div
              key={m.value}
              className="rounded-2xl bg-slate-50 p-6 text-center shadow-card transition-transform duration-200 hover:-translate-y-1"
            >
              <dt className="text-3xl font-extrabold text-transparent bg-clip-text bg-text-grad">
                {m.value}
              </dt>
              <dd className="mt-2 text-sm font-medium text-slate-600">{m.label}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-center text-xs text-slate-400">
          All statistics above are sample placeholder figures for demonstration.
        </p>
      </Container>
    </section>
  );
}

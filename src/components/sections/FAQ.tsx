import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, SectionHeading } from "../ui/shared";
import { FAQS } from "../../data/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers about our services, pricing, delivery, and support."
        />
        <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-100 bg-slate-50 px-6 shadow-card">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question} className="py-2">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-navy-900 transition-colors hover:text-violet"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    {faq.question}
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-violet transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

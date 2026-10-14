import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Container } from "../ui/shared";
import { useReveal } from "../../hooks/useReveal";
import { CONTACT_LIMITS, validateContact } from "../../../server/lib/contactValidation.ts";

type FieldName = "name" | "email" | "company" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = { name: "", email: "", company: "", message: "", website: "" };
const FIELD_NAMES: readonly FieldName[] = ["name", "email", "company", "message"];

function isFieldName(value: string): value is FieldName {
  return (FIELD_NAMES as readonly string[]).includes(value);
}

function toFieldErrors(details: readonly { field: string; message: string }[]): FieldErrors {
  const out: FieldErrors = {};
  for (const d of details) {
    if (isFieldName(d.field) && !out[d.field]) out[d.field] = d.message;
  }
  return out;
}

/** Reads `error.details` from an API error envelope without trusting its shape. */
function readDetails(body: unknown): { field: string; message: string }[] {
  if (typeof body !== "object" || body === null || !("error" in body)) return [];
  const error = body.error;
  if (typeof error !== "object" || error === null || !("details" in error) || !Array.isArray(error.details)) return [];
  return error.details.filter(
    (d: unknown): d is { field: string; message: string } =>
      typeof d === "object" && d !== null && "field" in d && "message" in d &&
      typeof d.field === "string" && typeof d.message === "string",
  );
}

const inputBase =
  "mt-1.5 block w-full min-h-[44px] rounded-xl border bg-white/5 px-4 py-2.5 text-base text-white placeholder:text-slate-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-glow focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900";

function inputClass(hasError: boolean): string {
  return `${inputBase} ${hasError ? "border-rose-400" : "border-white/15 hover:border-white/30"}`;
}

export default function FinalCTA() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.05);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [generalError, setGeneralError] = useState("");

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (isFieldName(name) && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setGeneralError("");

    const local = validateContact(values);
    if (!local.ok) {
      setErrors(toFieldErrors(local.errors));
      setStatus("error");
      const first = local.errors.find((er) => isFieldName(er.field));
      if (first) document.getElementById(`contact-${first.field}`)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 201) {
        setStatus("success");
        setValues(EMPTY);
        return;
      }
      const body: unknown = await res.json().catch(() => null);
      setStatus("error");
      if (res.status === 400) {
        const fieldErrors = toFieldErrors(readDetails(body));
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0) {
          setGeneralError("Something in the form needs another look. Please check your details and try again.");
        }
      } else if (res.status === 429) {
        setGeneralError("You've sent several messages in a short time. Please wait a few minutes and try again.");
      } else {
        setGeneralError("We couldn't send your message right now. Please try again in a moment, or email us directly.");
      }
    } catch {
      setStatus("error");
      setGeneralError("We couldn't reach our server. Check your connection and try again.");
    }
  }

  const submitting = status === "submitting";

  function errorFor(field: FieldName) {
    const msg = errors[field];
    if (!msg) return null;
    return (
      <p id={`contact-${field}-error`} className="mt-1.5 text-sm text-rose-300">
        {msg}
      </p>
    );
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-hero-grad py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-violet/40 blur-3xl animate-pulseSlow" />
        <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-sky-glow/30 blur-3xl animate-pulseSlow" style={{ animationDelay: "1.4s" }} />
      </div>
      <Container>
        <div
          ref={ref}
          className={`grid items-start gap-12 lg:grid-cols-2 lg:gap-16 ${visible ? "reveal-visible" : "reveal-hidden"}`}
        >
          <div className="text-center lg:pt-6 lg:text-left">
            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:mx-0 lg:text-5xl">
              Ready to Build Something{" "}
              <span className="text-transparent bg-clip-text bg-text-grad">Extraordinary?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300 lg:mx-0">
              Tell us about your project and we will show you exactly where AI can move the needle
              for your business — starting with a free discovery call.
            </p>
            <a
              href="mailto:hello@nexora.ai"
              className="mt-9 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-glow focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Prefer email? hello@nexora.ai
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-navy-950/40 p-6 shadow-lift backdrop-blur sm:p-8">
            {status === "success" ? (
              <div data-testid="contact-success" role="status" className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-sky-glow" aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-bold text-white">Thanks — your message is on its way!</h3>
                <p className="mt-2 text-slate-300">We'll get back to you within one business day.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex min-h-[44px] items-center rounded-full px-5 text-sm font-semibold text-sky-glow underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-glow"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form data-testid="contact-form" noValidate onSubmit={onSubmit} aria-label="Contact form" className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-200">Name</label>
                    <input
                      id="contact-name" name="name" type="text" autoComplete="name" required
                      maxLength={CONTACT_LIMITS.nameMax}
                      data-testid="contact-name"
                      value={values.name} onChange={onChange}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      className={inputClass(Boolean(errors.name))}
                      placeholder="Jane Doe"
                    />
                    {errorFor("name")}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-200">Email</label>
                    <input
                      id="contact-email" name="email" type="email" autoComplete="email" required
                      maxLength={CONTACT_LIMITS.emailMax}
                      data-testid="contact-email"
                      value={values.email} onChange={onChange}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className={inputClass(Boolean(errors.email))}
                      placeholder="jane@company.com"
                    />
                    {errorFor("email")}
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-medium text-slate-200">
                    Company <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    id="contact-company" name="company" type="text" autoComplete="organization"
                    maxLength={CONTACT_LIMITS.companyMax}
                    data-testid="contact-company"
                    value={values.company} onChange={onChange}
                    aria-invalid={errors.company ? true : undefined}
                    aria-describedby={errors.company ? "contact-company-error" : undefined}
                    className={inputClass(Boolean(errors.company))}
                    placeholder="Acme Inc."
                  />
                  {errorFor("company")}
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-200">Message</label>
                  <textarea
                    id="contact-message" name="message" rows={5} required
                    maxLength={CONTACT_LIMITS.messageMax}
                    data-testid="contact-message"
                    value={values.message} onChange={onChange}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${inputClass(Boolean(errors.message))} resize-y`}
                    placeholder="What would you like to build?"
                  />
                  {errorFor("message")}
                </div>

                {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={values.website} onChange={onChange}
                  />
                </div>

                {generalError && (
                  <p data-testid="contact-error" role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {generalError}
                  </p>
                )}

                <button
                  type="submit"
                  data-testid="contact-submit"
                  disabled={submitting}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-violet shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-glow focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      Start Your Project <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

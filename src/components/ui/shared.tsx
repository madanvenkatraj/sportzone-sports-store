import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2" aria-label="Nexora AI home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-grad shadow-lift">
        <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        Nexora<span className="text-transparent bg-clip-text bg-text-grad"> AI</span>
      </span>
    </a>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost" | "white";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet focus-visible:outline-offset-2 hover:-translate-y-0.5";
  const styles = {
    primary: "bg-brand-grad text-white shadow-lift hover:shadow-soft hover:brightness-110",
    secondary: "bg-white text-navy-900 border border-slate-200 shadow-card hover:border-violet hover:text-violet",
    ghost: "text-white border border-white/30 hover:bg-white/10",
    white: "bg-white text-violet shadow-soft hover:bg-violet-50 hover:-translate-y-0.5",
  } as const;
  return (
    <a href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet">
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-navy-900"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base ${dark ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

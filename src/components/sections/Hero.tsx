import { ArrowRight, Cpu, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Container, Button } from "../ui/shared";
import { useReveal } from "../../hooks/useReveal";

/** Inline SVG AI visual — no image assets, keeps the page fast. */
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg" aria-hidden="true">
      {/* glow blobs */}
      <div className="absolute -inset-8 rounded-full bg-violet/30 blur-3xl opacity-60" />
      <div className="absolute -inset-2 animate-floaty">
        <svg viewBox="0 0 400 400" className="w-full">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          {/* orbit rings */}
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#g2)" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 10" />
          <circle cx="200" cy="200" r="105" fill="none" stroke="url(#g2)" strokeOpacity="0.5" strokeWidth="1.5" />
          {/* core chip */}
          <rect x="140" y="140" width="120" height="120" rx="28" fill="url(#g1)" />
          <rect x="158" y="158" width="84" height="84" rx="20" fill="#0B1437" opacity="0.85" />
          {/* neural nodes */}
          <g fill="#A78BFA">
            <circle cx="200" cy="95" r="7" />
            <circle cx="305" cy="200" r="7" />
            <circle cx="200" cy="305" r="7" />
            <circle cx="95" cy="200" r="7" />
            <circle cx="272" cy="128" r="5" />
            <circle cx="128" cy="272" r="5" />
          </g>
          <g stroke="#60A5FA" strokeOpacity="0.6" strokeWidth="1.5">
            <line x1="200" y1="102" x2="200" y2="140" />
            <line x1="298" y1="200" x2="260" y2="200" />
            <line x1="200" y1="298" x2="200" y2="260" />
            <line x1="102" y1="200" x2="140" y2="200" />
          </g>
        </svg>
      </div>
      {/* floating badges */}
      <div className="absolute left-0 top-6 animate-floaty rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/20" style={{ animationDelay: "1.2s" }}>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Zap className="h-4 w-4 text-sky-glow" /> Real-time insights
        </div>
      </div>
      <div className="absolute right-0 bottom-10 animate-floaty rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/20" style={{ animationDelay: "0.6s" }}>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <ShieldCheck className="h-4 w-4 text-sky-glow" /> Secure by design
        </div>
      </div>
      <div className="absolute bottom-0 left-8 animate-floaty rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/20" style={{ animationDelay: "2s" }}>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Cpu className="h-4 w-4 text-sky-glow" /> 24/7 automation
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.05);

  return (
    <section id="home" className="relative overflow-hidden bg-hero-grad pt-32 pb-20 sm:pt-36 lg:pt-40 lg:pb-28">
      {/* animated decorative dots */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-10 top-24 h-2 w-2 animate-pulseSlow rounded-full bg-violet-soft" />
        <div className="absolute right-24 top-40 h-3 w-3 animate-pulseSlow rounded-full bg-sky-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/3 bottom-16 h-2 w-2 animate-pulseSlow rounded-full bg-violet-soft" style={{ animationDelay: "2s" }} />
        <div className="absolute right-1/3 bottom-32 h-2 w-2 animate-pulseSlow rounded-full bg-white/60" style={{ animationDelay: "1.5s" }} />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div
            ref={ref}
            className={`text-center lg:text-left ${visible ? "reveal-visible" : "reveal-hidden"}`}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-glow ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> AI Solutions for Modern Business
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Transform Your Business with the{" "}
              <span className="text-transparent bg-clip-text bg-text-grad">Power of AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300 lg:mx-0">
              Nexora AI helps businesses automate workflows, unlock real-time insights, and
              improve productivity — so you can grow faster with intelligent technology working
              alongside your team.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button href="#pricing" variant="white" className="w-full sm:w-auto">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#features" variant="ghost" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

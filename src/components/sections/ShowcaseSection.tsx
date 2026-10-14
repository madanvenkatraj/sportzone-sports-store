import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { Bot, BarChart3, ShieldCheck, Plug, ArrowRight, MousePointer2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Button, SectionHeading } from "../ui/shared";
import { SHOWCASE_HOTSPOTS } from "../../data/content";
import type { ShowcaseHotspot } from "../../data/content";
import { useRenderMode, useNearViewport } from "../../hooks/useDeviceCapability";
import { useReveal } from "../../hooks/useReveal";
import type { SceneInputs } from "../three/ShowcaseScene";

type SceneModule = typeof import("../three/ShowcaseScene");

/**
 * three.js + R3F live in their own chunk, fetched only when needed.
 *
 * In dev, Vite rewrites a dynamic import to a root-absolute path ("/src/...").
 * When the app is served under a path prefix (e.g. a preview proxy), that
 * absolute path escapes the prefix and 404s. Resolving the specifier against
 * this module's own URL keeps whatever prefix the page was loaded under.
 * The specifier is held in a variable so Vite's new URL() asset rewrite
 * leaves it alone. Production builds use the plain import() so Rollup still
 * code-splits the scene into a lazy chunk (the DEV branch is dropped).
 */
function loadScene(): Promise<SceneModule> {
  if (import.meta.env.DEV) {
    const specifier = "../three/ShowcaseScene.tsx";
    const href = new URL(specifier, import.meta.url).href;
    return import(/* @vite-ignore */ href);
  }
  return import("../three/ShowcaseScene");
}

const ShowcaseScene = lazy(loadScene);

const ICONS: Record<ShowcaseHotspot["icon"], LucideIcon> = {
  bot: Bot,
  chart: BarChart3,
  shield: ShieldCheck,
  plug: Plug,
};

/** Fixed CSS particles for the section background, cheap and deterministic. */
const BG_DOTS = [
  { t: 8, l: 12, s: 2, d: 0 }, { t: 18, l: 86, s: 3, d: 1.2 }, { t: 34, l: 6, s: 2, d: 2.1 },
  { t: 52, l: 92, s: 2, d: 0.6 }, { t: 68, l: 22, s: 3, d: 1.8 }, { t: 84, l: 70, s: 2, d: 2.6 },
  { t: 90, l: 40, s: 2, d: 0.9 }, { t: 12, l: 52, s: 2, d: 3 }, { t: 44, l: 48, s: 1, d: 1.4 },
  { t: 74, l: 58, s: 2, d: 2.2 },
];

/** If WebGL fails at runtime, show the static visual instead of a blank box. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D showcase fell back to static visual:", error instanceof Error ? error.message : error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Lightweight CSS sphere used for low-end devices, reduced motion, and while loading. */
function StaticOrb() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true" data-testid="showcase-static">
      <div className="relative h-56 w-56 sm:h-72 sm:w-72 animate-floaty">
        <div className="absolute -inset-10 rounded-full bg-violet/30 blur-3xl" />
        <div className="absolute inset-0 rounded-full border border-cyan-300/30 scale-125" />
        <div className="absolute inset-0 rounded-full border border-sky-glow/40 [transform:scale(1.45)_rotateX(70deg)]" />
        <div
          className="absolute inset-0 rounded-full shadow-lift"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #A5B4FC 0%, #7C3AED 32%, #1D2A66 68%, #0B1437 100%)",
            boxShadow: "0 0 80px 10px rgba(124,58,237,0.45), inset -20px -30px 60px rgba(7,11,31,0.8)",
          }}
        />
        <div className="absolute left-[22%] top-[18%] h-10 w-16 rounded-full bg-white/30 blur-md" />
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const mode = useRenderMode();
  const { setRef: setNearRef, near } = useNearViewport<HTMLDivElement>("300px");
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>(0.05);
  const [activeId, setActiveId] = useState<string>(SHOWCASE_HOTSPOTS[0].id);
  const [inView, setInView] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const inputs = useRef<SceneInputs>({
    progress: { current: 0 },
    pointer: { current: { x: 0, y: 0 } },
    drag: { current: { x: 0, y: 0 } },
  }).current;
  const dragState = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: 0, y: 0 });

  const active = SHOWCASE_HOTSPOTS.find((h) => h.id === activeId) ?? SHOWCASE_HOTSPOTS[0];
  const ActiveIcon = ICONS[active.icon];

  // Scroll progress (0..1 through the section), rAF-throttled, no React re-render
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
      inputs.progress.current = p;
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [inputs]);

  // Pause the render loop whenever the section is off screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSectionPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    inputs.pointer.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
    const d = dragState.current;
    if (d.active) {
      inputs.drag.current = {
        x: inputs.drag.current.x + (e.clientY - d.y) * 0.008,
        y: inputs.drag.current.y + (e.clientX - d.x) * 0.01,
      };
      d.x = e.clientX;
      d.y = e.clientY;
    }
  };

  const onVisualPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && e.target.closest("button")) return; // hotspot click, not a drag
    dragState.current = { active: true, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const show3D = mode === "3d" && near;

  return (
    <section
      id="showcase"
      ref={sectionRef}
      onPointerMove={onSectionPointerMove}
      className="relative overflow-hidden bg-navy-950 py-20 lg:py-28"
    >
      {/* animated background: gradient orbs, particles, depth grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet/25 blur-3xl animate-pulseSlow" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky-glow/20 blur-3xl animate-pulseSlow" style={{ animationDelay: "1.6s" }} />
        <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        {BG_DOTS.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-sky-glow animate-pulseSlow"
            style={{ top: `${p.t}%`, left: `${p.l}%`, width: p.s * 2, height: p.s * 2, animationDelay: `${p.d}s` }}
          />
        ))}
      </div>

      {/* scroll progress */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5" aria-hidden="true">
        <div ref={progressBarRef} className="h-full origin-left bg-brand-grad" style={{ transform: "scaleX(0)" }} />
      </div>

      <Container className="relative">
        <SectionHeading
          eyebrow="3D Showcase"
          title="Explore Innovation in 3D"
          description="Move your cursor, drag to rotate, and tap a marker to see what powers the Nexora platform."
          dark
        />

        <div ref={revealRef} className={`grid items-center gap-12 lg:grid-cols-2 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
          {/* 3D visual + hotspots */}
          <div
            ref={setNearRef}
            onPointerDown={onVisualPointerDown}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="relative mx-auto aspect-square w-full max-w-[520px] cursor-grab select-none active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
            data-testid="showcase-visual"
            data-render-mode={show3D ? "3d" : "static"}
          >
            {show3D ? (
              <SceneBoundary fallback={<StaticOrb />}>
                <Suspense fallback={<StaticOrb />}>
                  <div className="absolute inset-0">
                    <ShowcaseScene inputs={inputs} active={inView} />
                  </div>
                </Suspense>
              </SceneBoundary>
            ) : (
              <StaticOrb />
            )}

            {SHOWCASE_HOTSPOTS.map((h) => {
              const Icon = ICONS[h.icon];
              const isActive = h.id === activeId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveId(h.id)}
                  aria-pressed={isActive}
                  aria-controls="showcase-panel"
                  aria-label={`Show details: ${h.label}`}
                  className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                  style={{ top: `${h.top}%`, left: `${h.left}%` }}
                >
                  <span className="relative flex h-11 w-11 items-center justify-center">
                    <span className={`absolute inset-0 rounded-full ${isActive ? "bg-violet/40" : "bg-sky-glow/30"} animate-ping [animation-duration:2.4s]`} />
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md ring-1 transition-all duration-200 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white ${
                        isActive ? "bg-brand-grad ring-white/60 shadow-lift" : "bg-white/10 ring-white/25"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-navy-900/90 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15 sm:block">
                    {h.label}
                  </span>
                </button>
              );
            })}

            <p className="pointer-events-none absolute inset-x-0 -bottom-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <MousePointer2 className="h-3.5 w-3.5" aria-hidden="true" /> Drag to rotate
            </p>
          </div>

          {/* info panel + CTAs */}
          <div>
            <div
              id="showcase-panel"
              role="region"
              aria-live="polite"
              aria-label="Selected capability"
              className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 backdrop-blur-md"
            >
              <div key={active.id} className="animate-[fadeUp_0.35s_ease-out]">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-grad shadow-lift">
                  <ActiveIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl font-bold text-white">{active.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-slate-300">{active.description}</p>
                <p className="mt-5 inline-flex rounded-full bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-300/20">
                  {active.stat}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-5" role="group" aria-label="Capabilities">
                {SHOWCASE_HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveId(h.id)}
                    aria-pressed={h.id === activeId}
                    className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      h.id === activeId ? "bg-white text-navy-900" : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="#features" variant="primary" className="w-full sm:w-auto">
                Discover Our Technology <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#contact" variant="ghost" className="w-full sm:w-auto">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

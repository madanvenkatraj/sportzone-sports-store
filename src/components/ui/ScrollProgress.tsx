import { useEffect, useRef } from "react";
import { scrollFraction } from "../../lib/scrollFraction";

export { scrollFraction };

/**
 * Global reading-progress bar pinned to the top of the viewport.
 * Updates the DOM directly through refs (rAF-throttled, passive listeners),
 * so scrolling never triggers a React re-render. No CSS transition: the fill
 * tracks the user's own scroll, adding no extra motion.
 */
export default function ScrollProgress(): JSX.Element {
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = (): void => {
      frame = 0;
      const doc = document.documentElement;
      const p = scrollFraction(window.scrollY, doc.scrollHeight, window.innerHeight);
      const fill = fillRef.current;
      if (fill) fill.style.transform = `scaleX(${p})`;
      const bar = barRef.current;
      if (bar) bar.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    };

    const schedule = (): void => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={barRef}
      data-testid="scroll-progress"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={fillRef}
        className="h-full w-full origin-left bg-brand-grad"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

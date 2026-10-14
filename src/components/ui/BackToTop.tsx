import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Scroll distance (px) after which the button appears. */
export const BACK_TO_TOP_THRESHOLD = 600;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function BackToTop() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    let frame = 0;
    let last = window.scrollY > BACK_TO_TOP_THRESHOLD;
    setVisible(last);

    const update = () => {
      frame = 0;
      const next = window.scrollY > BACK_TO_TOP_THRESHOLD;
      if (next !== last) {
        last = next;
        setVisible(next);
      }
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });

    const home = document.getElementById("home");
    if (home) {
      if (!home.hasAttribute("tabindex")) home.setAttribute("tabindex", "-1");
      home.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      data-testid="back-to-top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : "true"}
      className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-grad text-white shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet sm:bottom-6 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

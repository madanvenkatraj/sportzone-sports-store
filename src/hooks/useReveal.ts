import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element with a fade-up entrance the first time it scrolls
 * into view. Returns a ref to attach and a boolean for the visible state.
 * Honors prefers-reduced-motion via CSS (index.css overrides the classes).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

import { useEffect, useState } from "react";
import { decideRenderMode } from "../lib/renderMode";
import type { RenderMode } from "../lib/renderMode";

interface NavigatorExtras {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Returns "3d" only for capable devices that have not asked for reduced motion.
 * Starts as "static" so the server/first paint never pays for WebGL.
 */
export function useRenderMode(): RenderMode {
  const [mode, setMode] = useState<RenderMode>("static");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav: Navigator & NavigatorExtras = navigator;
    const evaluate = () =>
      setMode(
        decideRenderMode({
          webgl: hasWebGL(),
          reducedMotion: mq.matches,
          cores: nav.hardwareConcurrency || undefined,
          memoryGb: nav.deviceMemory,
          saveData: Boolean(nav.connection?.saveData),
        })
      );
    evaluate();
    mq.addEventListener("change", evaluate);
    return () => mq.removeEventListener("change", evaluate);
  }, []);

  return mode;
}

/** True once the element comes within `margin` of the viewport (one-shot). */
export function useNearViewport<T extends HTMLElement>(margin = "300px") {
  const [near, setNear] = useState(false);
  const [el, setEl] = useState<T | null>(null);

  useEffect(() => {
    if (!el || near) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, near, margin]);

  return { setRef: setEl, near };
}

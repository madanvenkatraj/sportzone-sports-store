import { useEffect, useState } from "react";
import { pickActiveSection } from "../lib/activeSection";

/**
 * Tracks which of the given section ids the reader is currently viewing.
 * `offset` should be a little more than the sticky nav height so a section
 * counts as active once its heading sits just under the nav.
 * Ids with no matching element are skipped, so a missing section never breaks it.
 */
export function useActiveSection(ids: readonly string[], offset = 120): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const positions = list
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top } : null;
        })
        .filter((p): p is { id: string; top: number } => p !== null)
        .sort((a, b) => a.top - b.top); // document order, regardless of link order
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(pickActiveSection(positions, offset, atBottom));
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
  }, [key, offset]);

  return active;
}

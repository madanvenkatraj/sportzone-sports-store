/**
 * How far down the page the user has scrolled, as a fraction 0..1.
 * Pure math, no DOM: returns 0 when the page cannot scroll or input is not finite.
 */
export function scrollFraction(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const range = scrollHeight - viewportHeight;
  if (!Number.isFinite(scrollY) || !Number.isFinite(range) || range <= 0) return 0;
  const p = scrollY / range;
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p;
}

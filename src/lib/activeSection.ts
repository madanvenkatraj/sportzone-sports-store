export interface SectionPosition {
  id: string;
  /** element.getBoundingClientRect().top, in px relative to the viewport */
  top: number;
}

/**
 * Returns the id of the section the reader is currently in: the last section
 * (in document order) whose top has scrolled above `offset` px from the top of
 * the viewport. Before any section reaches the offset, the first one is active.
 * When the page is scrolled to the very bottom, the last section wins so short
 * final sections (e.g. Contact) can still become active.
 */
export function pickActiveSection(
  positions: readonly SectionPosition[],
  offset: number,
  atBottom = false
): string | null {
  if (positions.length === 0) return null;
  if (atBottom) return positions[positions.length - 1].id;
  let active = positions[0].id;
  for (const p of positions) {
    if (p.top - offset <= 0) active = p.id;
  }
  return active;
}

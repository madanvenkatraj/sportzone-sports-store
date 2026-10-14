/**
 * Inline SVG icons for SPORTZONE. Hand-drawn paths (no icon library) to keep
 * the bundle small and avoid lucide-react's tree-shaking overhead here.
 */
interface IconProps {
  className?: string;
}

const base = "inline-block shrink-0";

export function IconSearch({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconUser({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconHeart({ className = "h-5 w-5", filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21C7 16.5 3 13.3 3 9.2 3 6.4 5.2 4 8 4c1.7 0 3.2.9 4 2.2C12.8 4.9 14.3 4 16 4c2.8 0 5 2.4 5 5.2 0 4.1-4 7.3-9 11.8Z" />
    </svg>
  );
}

export function IconBag({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={`${base} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

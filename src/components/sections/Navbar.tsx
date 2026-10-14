import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container, Logo, Button } from "../ui/shared";
import { NAV_LINKS } from "../../data/content";
import { useActiveSection } from "../../hooks/useActiveSection";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.href.slice(1)), []);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/90 shadow-card backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <div className={scrolled || open ? "" : "[&_span.text-lg]:text-white"}>
          <Logo dark={scrolled || open ? false : true} />
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = link.href.slice(1) === activeId;
            const tone = scrolled
              ? isActive
                ? "text-violet"
                : "text-slate-700"
              : isActive
                ? "text-white"
                : "text-slate-200 hover:text-white";
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-violet ${tone}`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand-grad"
                  />
                )}
              </a>
            );
          })}
          <Button href="#contact" variant={scrolled ? "primary" : "white"} className="!px-5 !py-2.5">
            Get Started
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`md:hidden rounded-lg p-2 ${
            scrolled || open ? "text-navy-900" : "text-white"
          }`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-slate-100 bg-white px-4 pb-6 pt-2 md:hidden"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href.slice(1) === activeId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "location" : undefined}
                className={`block rounded-lg px-3 py-3 text-base font-medium hover:text-violet ${
                  isActive ? "bg-violet/10 text-violet" : "text-navy-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <Button href="#contact" className="mt-3 w-full" variant="primary">
            Get Started
          </Button>
        </nav>
      )}
    </header>
  );
}

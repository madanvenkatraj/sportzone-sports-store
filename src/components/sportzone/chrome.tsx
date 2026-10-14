/**
 * SPORTZONE chrome: announcement bar, sticky navbar with search, and the
 * mobile menu. Search and the icon buttons talk to StoreContext so the
 * navbar, grid, carousels and drawers all read one state.
 */
import { useEffect, useRef, useState } from "react";
import { filterProducts } from "../../store/logic.ts";
import { useStore } from "../../store/StoreContext.tsx";
import { IconBag, IconHeart, IconSearch, IconUser } from "./icons.tsx";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Shop", href: "#shop" },
  { label: "Sports", href: "#sports" },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Best Sellers", href: "#best-sellers" },
  { label: "About Us", href: "#why" },
  { label: "Contact", href: "#contact" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal-900 text-white text-center text-xs sm:text-sm font-medium tracking-wide py-2 px-4">
      <span className="font-semibold text-orange-400">Gear Up for Greatness</span>
      <span className="mx-2 text-white/40">—</span>
      <span>Discover Your Next Game-Changer!</span>
    </div>
  );
}

export function Navbar() {
  const { cartCount, wishlist, query, setQuery, setCategory, setCartOpen, setWishlistOpen, products } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const suggestions =
    query.trim().length >= 2
      ? filterProducts(products, { query, category: "all" }).slice(0, 5)
      : [];

  const navTarget = (href: string) => {
    // "New Arrivals" and "Best Sellers" double as category filters: they scroll
    // to the shop grid AND pre-filter it so the link lands somewhere useful.
    if (href === "#new-arrivals") setCategory("new");
    if (href === "#best-sellers") setCategory("best");
    setMobileOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 transition-shadow ${scrolled ? "shadow-lg shadow-black/10" : ""}`}>
      <AnnouncementBar />
      <nav className={`bg-white border-b border-neutral-200 ${scrolled ? "bg-white/95 backdrop-blur" : ""}`} aria-label="Primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 font-display text-xl font-black tracking-tight text-charcoal-900">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white text-lg" aria-hidden="true">⚡</span>
              SPORT<span className="text-orange-600">ZONE</span>
            </a>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-6 text-sm font-semibold text-neutral-700">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-orange-600 transition-colors" onClick={() => navTarget(l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button type="button" className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label="Search products" onClick={() => setSearchOpen((v) => !v)}>
                <IconSearch />
              </button>
              <button type="button" className="hidden sm:block p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label="Account (demo)">
                <IconUser />
              </button>
              <button type="button" className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label={`Wishlist, ${wishlist.length} items`} onClick={() => setWishlistOpen(true)} data-testid="wishlist-button">
                <IconHeart />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-charcoal-900 px-1 text-[10px] font-bold text-white" data-testid="wishlist-count">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button type="button" className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label={`Cart, ${cartCount} items`} onClick={() => setCartOpen(true)} data-testid="cart-button">
                <IconBag />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </button>
              <button type="button" className="lg:hidden p-2.5 rounded-full hover:bg-neutral-100 text-neutral-700" aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Search bar (collapsible) */}
          {searchOpen && (
            <div className="pb-3">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={searchRef}
                  type="search"
                  className="w-full rounded-full border border-neutral-300 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Search gear, brands, sports…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search products"
                  data-testid="navbar-search"
                />
              </div>
              {suggestions.length > 0 && (
                <ul className="mt-2 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white shadow-lg">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <button type="button" className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-orange-50" onClick={() => setSearchOpen(false)}>
                        <span>{p.name}</span>
                        <span className="text-neutral-500">{p.brand}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <ul className="lg:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-1">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-orange-50 hover:text-orange-600" onClick={() => navTarget(l.href)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}

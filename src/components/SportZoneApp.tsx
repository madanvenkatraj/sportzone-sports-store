import { StoreProvider } from "../store/StoreContext.tsx";
import { Navbar } from "./sportzone/chrome.tsx";
import { Hero } from "./sportzone/hero.tsx";
import { SportsGrid } from "./sportzone/sports.tsx";
import { Offers, WhySportzone } from "./sportzone/offers.tsx";
import { BestSellers, FeaturedProducts, NewArrivals } from "./sportzone/products.tsx";
import { Kits } from "./sportzone/kits.tsx";
import { CartDrawer, QuickViewModal, Toasts, WishlistDrawer } from "./sportzone/overlays.tsx";
import { Brands, Faq, Footer, Newsletter, Reviews } from "./sportzone/trust.tsx";

export default function SportZoneApp() {
  return (
    <StoreProvider>
      <div id="home" className="min-h-screen bg-white text-neutral-900">
        <Navbar />
        <main>
          <Hero />
          <SportsGrid />
          <FeaturedProducts />
          <BestSellers />
          <NewArrivals />
          <Offers />
          <Kits />
          <WhySportzone />
          <Brands />
          <Reviews />
          <Newsletter />
          <Faq />
        </main>
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <QuickViewModal />
        <Toasts />
      </div>
    </StoreProvider>
  );
}

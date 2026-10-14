import { useEffect, useState } from "react";
import Navbar from "./components/sections/Navbar";
import Hero from "./components/sections/Hero";
import TrustedBy from "./components/sections/TrustedBy";
import Features from "./components/sections/Features";
import Services from "./components/sections/Services";
import ShowcaseSection from "./components/sections/ShowcaseSection";
import HowItWorks from "./components/sections/HowItWorks";
import AssistantSection from "./components/sections/AssistantSection";
import Testimonials from "./components/sections/Testimonials";
import Pricing from "./components/sections/Pricing";
import FAQ from "./components/sections/FAQ";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/sections/Footer";
import ScrollProgress from "./components/ui/ScrollProgress";
import BackToTop from "./components/ui/BackToTop";
import SportZoneApp from "./components/SportZoneApp";

/**
 * Route switch: SPORTZONE store is the landing page at "/"; the original
 * Nexora AI landing page stays reachable at "#/ai". Plain anchors like
 * "#shop" do not change the route — they keep scrolling within SPORTZONE.
 */
function currentRoute(): "sportzone" | "nexora" {
  const hash = window.location.hash;
  return hash === "#/ai" ? "nexora" : "sportzone";
}

export default function App() {
  const [route, setRoute] = useState<"sportzone" | "nexora">(currentRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "nexora") {
    return (
      <>
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <TrustedBy />
          <Features />
          <Services />
          <ShowcaseSection />
          <HowItWorks />
          <AssistantSection />
          <Testimonials />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <BackToTop />
      </>
    );
  }

  return <SportZoneApp />;
}

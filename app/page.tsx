import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Marquee from "@/components/Marquee";
import Timeless from "@/components/Timeless";
import WhyOCubed from "@/components/WhyOCubed";
import Story from "@/components/Story";
import Gallery from "@/components/Gallery";
import Journey from "@/components/Journey";
import Testimonials from "@/components/Testimonials";
import ShopPreview from "@/components/ShopPreview";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";

// Rendered per request so the hero image re-randomizes on every reload.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Intro />
      <Marquee />
      <Timeless />
      <WhyOCubed />
      <Story />
      <Gallery />
      <Journey />
      <Testimonials />
      <ShopPreview />
      <ClosingCTA />
      <Footer />
    </>
  );
}

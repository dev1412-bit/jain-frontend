import HeroSection from "@/components/sections/HeroSection";
import AfterHeroSection from "@/components/sections/AfterHeroSection";
import SectorsSection from "@/components/sections/SectorsSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturedProductsSlider from "@/components/sections/FeaturedProductsSlider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AfterHeroSection />
      <SectorsSection />
      <StatsSection />
      <FeaturedProductsSlider />
    </>
  );
}
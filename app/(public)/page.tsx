import HeroSection from "@/components/sections/HeroSection";
import AfterHeroSection from "@/components/sections/AfterHeroSection";
import SectorsSection from "@/components/sections/SectorsSection";
import StatsSection from "@/components/sections/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AfterHeroSection />
      <SectorsSection />
      <StatsSection />
    </>
  );
}
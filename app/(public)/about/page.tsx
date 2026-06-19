import AboutHero from "@/components/sections/about/AboutHero";
import StatsSection from "@/components/sections/StatsSection";
import MissionSection from "@/components/sections/about/MissionSection";
import ValuesSection from "@/components/sections/about/ValuesSection";
import TeamSection from "@/components/sections/about/TeamSection";
import { useCmsStore } from "@/store/cmsStore";

export default function AboutPage() {

  return (
    <>
      <AboutHero />
      <StatsSection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
    </>
  );
}
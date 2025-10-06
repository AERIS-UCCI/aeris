import BentoGrids from "../../components/Sections/BentoGrids";
import HeroSection from "../../components/Sections//HeroSection";
import Team from "../../components/Sections/Team";
import Features from "../../components/Sections/FeaturesSection"

export default function Example() {
  return (
    <div className="bg-white">
      <main>
        <HeroSection />
        <Features/>
        <BentoGrids />
        
        <Team/>
        
      </main>

    </div>
  );
}

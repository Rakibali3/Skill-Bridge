import AboutSection from "../public/AboutSection";
import CommunitiesSection from "../public/CommunitiesSection";
import FeaturesSection from "../public/FeaturesSection";
import HeroSection from "../public/HeroSection";
import HowItWorksSection from "../public/HowItWorksSection";
import PublicHeader from "../public/PublicHeader";


function LandingPage() {
  return (
    <>
     <PublicHeader />

      <main>
        <HeroSection />
        <FeaturesSection/>
        <HowItWorksSection/>
        <CommunitiesSection/>
        <AboutSection/>
      </main>
    </>
  );
}

export default LandingPage;
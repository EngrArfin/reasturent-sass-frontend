import FAQSection from "@/components/About/FAQSection";
import AllRolesSection from "@/components/Home/AllRolesSection";
import HeroSection from "@/components/Home/HeroSection";
import PricingSection from "@/components/Home/PricingSection";
import TickerSection from "@/components/Home/TickerSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <TickerSection />
      <PricingSection />
      <AllRolesSection />
      <FAQSection />
    </div>
  );
};

export default Home;

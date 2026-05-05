import CommonBanner from "@/common/CommonBanner";
import bannerImg from "../assets/About/aboutBanner.png";
import FAQSection from "@/components/About/FAQSection";

const About = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="About Us"
        route="Home / About us"
        bgImage={bannerImg}
      />
      <FAQSection />
    </div>
  );
};

export default About;

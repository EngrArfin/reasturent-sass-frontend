import CommonBanner from "@/common/CommonBanner";
import bannerImg from "@/assets/About/saasbanner.jpg";
import FAQSection from "@/components/About/FAQSection";

const About = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="About Us"
        route="Home / About us"
        bgImage={bannerImg}
        description="Modern restaurants with smart cloud solutions streamlining daily operations, kitchen workflows, and customer dining experiences ."
      />
      <FAQSection />
    </div>
  );
};

export default About;

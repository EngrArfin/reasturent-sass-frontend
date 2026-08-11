import CommonBanner from "@/common/CommonBanner";
import bannerImg from "@/assets/About/saasbanner2.jpg";
import FAQSection from "@/components/About/FAQSection";

const Services = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="Our services"
        route="Home / services"
        bgImage={bannerImg}
      />

      <FAQSection />
    </div>
  );
};

export default Services;

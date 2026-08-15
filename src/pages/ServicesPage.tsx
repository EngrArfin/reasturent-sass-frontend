import CommonBanner from "@/common/CommonBanner";
import bannerImg from "@/assets/About/saasbanner2.jpg";
import FAQSection from "@/components/About/FAQSection";
import Services from "../components/Services/Services";

const ServicesPage = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="Our services"
        route="Home / services"
        bgImage={bannerImg}
      />
      <Services />

      <FAQSection />
    </div>
  );
};

export default ServicesPage;

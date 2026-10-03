import CommonBanner from "@/common/CommonBanner";
import bannerImg from "@/assets/About/saasbanner2.jpg";
import FAQSection from "@/components/About/FAQSection";
import Services from "../components/Services/Services";

const ServicesPage = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="Our Services"
        route="Home / services"
        bgImage={bannerImg}
        description="Explore our end-to-end restaurant ecosystem designed to digitize dining, accelerate kitchen orders, and maximize your profitability."
      />
      <Services />

      <FAQSection />
    </div>
  );
};

export default ServicesPage;

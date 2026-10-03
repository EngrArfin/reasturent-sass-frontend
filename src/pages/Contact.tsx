import bannerImg from "@/assets/About/saasbanner3.jpg";
import CommonBanner from "@/common/CommonBanner";
import GetInTouch from "@/components/Contact/GetInTouch";
import { GoogleMapComponent } from "@/components/Contact/GoogleMapComponent";
import FAQSection from "@/components/About/FAQSection";

const Contact = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="Contact Us"
        route="Home / Contacts"
        bgImage={bannerImg}
        description="Have questions or ready to transform your restaurant? Get in touch with our team for 24/7 support, onboarding, and custom demos."
      />

      <GetInTouch />
      <FAQSection />
      <GoogleMapComponent />
    </div>
  );
};

export default Contact;

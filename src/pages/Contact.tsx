import bannerImg from "@/assets/About/saasbanner3.jpg";
import CommonBanner from "@/common/CommonBanner";
import GetInTouch from "@/components/Contact/GetInTouch";
import { GoogleMapComponent } from "@/components/Contact/GoogleMapComponent";
import FAQSection from "@/components/About/FAQSection";

const Contact = () => {
  return (
    <div className="mt-[70px]">
      <CommonBanner
        title="Contact us"
        route="Home / Contacts"
        bgImage={bannerImg}
      />

      <GetInTouch />
      <FAQSection />
      <GoogleMapComponent />
    </div>
  );
};

export default Contact;

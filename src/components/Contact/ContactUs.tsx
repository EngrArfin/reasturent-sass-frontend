import CommonWrapper from "@/common/CommonWrapper";
import contactUsImage from "../../assets/About/contactUs.png";
import icon1 from "../../assets/About/Frame (2).png";
import icon2 from "../../assets/About/Frame (3).png";
import icon3 from "../../assets/About/Frame (4).png";
import { GoogleMapComponent } from "./GoogleMapComponent";

export default function ContactUs() {
  return (
    <section className="">
      <CommonWrapper className="">
        <div className="text-center bg-[#FFFFFF]">
          <h2 className="text-xl md:text-3xl font-bold text-[#373A41] mb-10">
            Contact Us For Your Any Help & Needs
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-3 px-3 lg:px-32">
            <div className="space-y-10">
              <div className="flex gap-6 py-2 justify-center items-center lg:justify-start">
                <img src={icon1} alt="locationIcon" />
                <div className="text-start">
                  <p className="text-lg font-normal text-[#717680]">
                    Visit us in person at:
                  </p>
                  <h3 className="text-base md:text-lg text-[#717680] font-bold">
                    Dhaka, Bangladesh
                  </h3>
                </div>
              </div>
              <div className="flex gap-6 py-2 justify-center items-center lg:justify-start">
                <img src={icon2} alt="phoneIcon" />
                <div className="text-start">
                  <p className="text-lg font-normal text-[#717680]">
                    Call us at:
                  </p>
                  <h3 className="text-base md:text-lg text-[#717680] font-bold">
                    (319) 555-0115
                  </h3>
                </div>
              </div>
              <div className="flex gap-6 py-2 justify-center items-center lg:justify-start">
                <img src={icon3} alt="emailIcon" />
                <div className="text-start">
                  <p className="text-lg font-normal text-[#717680]">
                    Email us at:
                  </p>
                  <h3 className="text-base md:text-lg text-[#717680] font-bold">
                    felicia.reid@example.com
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <img
                src={contactUsImage}
                alt="contactUs"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </CommonWrapper>
      <GoogleMapComponent />
    </section>
  );
}

import React from "react";
import logo from "../../../assets/icons/logo.svg";
import { Link } from "react-router-dom";
import img1 from "../../../assets/Common/visa.svg";
import img2 from "../../../assets/Common/paypal.svg";
import img3 from "../../../assets/Common/amex.svg";
import img4 from "../../../assets/Common/card.svg";
import img5 from "../../../assets/Common/stripe 1.svg";
import { Mail, MapPin, Phone } from "lucide-react";

const FooterDashboard: React.FC = () => {
  return (
    <div className="bg-[#FDFDFD] pt-10 pb-20 mt-10">
      <footer className=" w-full max-w-[1560px] mx-auto px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About Section */}
            <div>
              <img
                src={logo}
                alt="footerLogo"
                className="mb-6 w-[160px] drop-shadow-md"
              />
              <p className="text-lg text-[#717680] font-normal leading-7">
                Fast, reliable courier services for all your delivery need.
              </p>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="text-xl text-[#414651] font-medium leading-5 mb-6">
                Quick links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="hover:text-gray-700 text-[#717680] text-lg font-normal"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-gray-700 text-[#717680] text-lg font-normal"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-gray-700 text-[#717680] text-lg font-normal"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-gray-700 text-[#717680] text-lg font-normal"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-xl text-[#414651] font-medium leading-5 mb-6">
                Contact us
              </h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-[#717680]" />
                  <p className="text-lg text-[#717680] font-normal">
                    1901 Thornridge Cir. Shiloh, Hawaii 81063
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-[#717680]" />
                  <p className="text-lg text-[#717680] font-normal">
                    felicia.reid@example.com
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-[#717680]" />
                  <p className="text-lg text-[#717680] font-normal">
                    (319) 555-0115
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h3 className="text-xl text-[#414651] font-medium leading-5 mb-6">
                Payment Methods
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <img src={img1} alt="visa" className="h-8 w-auto" />
                <img src={img2} alt="paypal" className="h-8 w-auto" />
                <img src={img3} alt="amex" className="h-8 w-auto" />
                <img src={img4} alt="card" className="h-8 w-auto" />
                <img src={img5} alt="stripe" className="h-8 w-auto" />
              </div>
              <p className="text-lg text-[#717680] font-normal leading-7">
                We accept all major credit cards & payment methods.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterDashboard;

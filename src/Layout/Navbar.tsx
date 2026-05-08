import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import logo from "@/assets/icons/logoSAS.png";
// import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa6";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/contact", label: "Contact" },
];

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-8 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="relative group font-medium text-lg transition"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition ${
                      isActive
                        ? "text-[#F54900]"
                        : "text-gray-600 group-hover:text-[#F54900]"
                    }`}
                  >
                    {link.label}
                  </span>

                  {/* underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#F54900] origin-left transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-4">
          <Link to="/login">
            <button className="px-5 py-2 text-lg font-medium border border-gray-300 rounded-xl hover:bg-gray-100 transition">
              Sign In
            </button>
          </Link>

          <Link to="/signup">
            <button className="px-5 py-2 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-orange-500 to-[#F54900] shadow-md hover:shadow-lg hover:scale-[1.03] transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600"
          >
            {isMenuOpen ? (
              <AiOutlineClose className="text-2xl" />
            ) : (
              <HiOutlineMenuAlt2 className="text-2xl" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full ">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <img src={logo} alt="Logo" className="h-8" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <AiOutlineClose className="text-2xl text-gray-600" />
            </Button>
          </div>

          {/* Links */}
          <div className="flex-1 p-6 flex flex-col gap-4 bg-white ">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium transition ${
                    isActive ? "text-[#F54900]" : "text-gray-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Buttons */}
          <div className="p-6 border-t border-gray-100 flex flex-col gap-4 bg-white rounded-b-lg">
            <Link to="/join">
              <Button
                variant="outline"
                className="w-full border border-gray-300 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Button>
            </Link>

            <Link to="/jobs">
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-[#F54900] text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default NavBar;

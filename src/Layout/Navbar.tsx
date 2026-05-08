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
              className={({ isActive }) =>
                `relative font-medium text-lg transition-colors ${
                  isActive
                    ? "text-[#F54900]"
                    : "text-gray-600 hover:text-[#F54900]"
                }`
              }
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#F54900] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </NavLink>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-4">
          <Link to="/login">
            <button className="px-5 py-2 text-lg font-medium border border-gray-300 rounded-xl hover:bg-gray-100 transition">
              Login
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
                Sign in
              </Button>
            </Link>

            <Link to="/jobs">
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-[#F54900] text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Find a job
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

// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import logo from "../assets/icons/logoSAS.png";
// import UserAvatar from "@/ui/UserAvatar";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
// import {
//   logOut,
//   useCurrentUser,
//   loadUserFromToken,
// } from "@/redux/features/auth/authSlice";
// import { toast } from "sonner";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(loadUserFromToken());
//   }, [dispatch]);

//   const currentUser = useAppSelector(useCurrentUser);
//   const isLoggedIn = Boolean(currentUser);
//   const userRole = currentUser?.role;

//   const handleLogout = () => {
//     dispatch(logOut());
//     toast.success("Logged out successfully!");
//     navigate("/");
//   };

//   const navLinks = [
// { path: "/", label: "Home" },
// { path: "/about", label: "About" },
// { path: "/services", label: "Services" },
// { path: "/contact", label: "Contact" },
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
//       <div className="max-w-[1200px] mx-auto px-4">
//         <div className="flex items-center justify-between h-[70px]">

//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2">
//             <img src={logo} alt="logo" className="h-9" />
//             <span className="font-bold text-lg tracking-tight text-gray-800">
//               SaaSify
//             </span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className="relative group text-lg font-medium text-gray-600 transition"
//               >
//                 <span
//                   className={`transition ${
//                     isActive(link.path)
//                       ? "text-[#F54900]"
//                       : "group-hover:text-[#F54900]"
//                   }`}
//                 >
//                   {link.label}
//                 </span>

//                 {/* underline */}
//                 <span
//                   className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#F54900] origin-left transition-transform duration-300 ${
//                     isActive(link.path)
//                       ? "scale-x-100"
//                       : "scale-x-0 group-hover:scale-x-100"
//                   }`}
//                 />
//               </Link>
//             ))}
//           </div>

//           {/* Right Section */}
//           <div className="hidden md:flex items-center gap-3">

//             {!isLoggedIn ? (
//               <>
//                 <Link to="/login">
//                   <button className="px-5 py-2 text-lg font-medium border border-gray-300 rounded-xl hover:bg-gray-100 transition">
//                     Login
//                   </button>
//                 </Link>

//                 <Link to="/signup">
//                   <button className="px-5 py-2 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-orange-500 to-[#F54900] shadow-md hover:shadow-lg hover:scale-[1.03] transition">
//                     Get Started
//                   </button>
//                 </Link>
//               </>
//             ) : (
//               <Popover>
//                 <PopoverTrigger>
//                   <div className="cursor-pointer">
//                     <UserAvatar userName={currentUser?.name || "User"} />
//                   </div>
//                 </PopoverTrigger>

//                 <PopoverContent className="w-56 rounded-xl shadow-xl border bg-white p-3 mt-3">
//                   <div className="space-y-2">

//                     <div className="px-3 py-2 border-b">
//                       <p className="font-semibold text-gray-800">
//                         {currentUser?.name}
//                       </p>
//                       <p className="text-xs text-gray-500">{userRole}</p>
//                     </div>

//                     <Link
//                       to="/profile"
//                       className="block px-3 py-2 rounded-md hover:bg-gray-100 text-lg"
//                     >
//                       Profile
//                     </Link>

//                     {(userRole === "marchant" || userRole === "admin") && (
//                       <Link
//                         to="/merchant-dashboard"
//                         className="block px-3 py-2 rounded-md hover:bg-gray-100 text-lg"
//                       >
//                         Dashboard
//                       </Link>
//                     )}

//                     {userRole === "admin" && (
//                       <Link
//                         to="/admin-dashboard"
//                         className="block px-3 py-2 rounded-md hover:bg-gray-100 text-lg"
//                       >
//                         Admin Panel
//                       </Link>
//                     )}

//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-red-50 text-lg"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </PopoverContent>
//               </Popover>
//             )}
//           </div>

//           {/* Mobile Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-xl"
//           >
//             {isOpen ? "✕" : "☰"}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden mt-3 bg-white rounded-2xl shadow-xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">

//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 onClick={() => setIsOpen(false)}
//                 className={`block py-2 text-lg font-medium ${
//                   isActive(link.path)
//                     ? "text-[#F54900]"
//                     : "text-gray-700"
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}

//             {!isLoggedIn ? (
//               <>
//                 <Link to="/login">
//                   <button className="w-full py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
//                     Login
//                   </button>
//                 </Link>

//                 <Link to="/signup">
//                   <button className="w-full mt-2 py-2 rounded-xl bg-orange-500 text-white">
//                     Get Started
//                   </button>
//                 </Link>
//               </>
//             ) : (
//               <button
//                 onClick={handleLogout}
//                 className="w-full py-2 rounded-xl text-red-500 border"
//               >
//                 Logout
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

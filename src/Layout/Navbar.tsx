import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import logo from "../assets/icons/logoSAS.png";
import UserAvatar from "@/ui/UserAvatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  logOut,
  useCurrentUser,
  loadUserFromToken,
} from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  const currentUser = useAppSelector(useCurrentUser);
  const isLoggedIn = Boolean(currentUser);
  const userRole = currentUser?.role;

  const handleLogout = () => {
    dispatch(logOut());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-9" />
            <span className="font-bold text-lg tracking-tight text-gray-800">
              SaaSify
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group text-lg font-medium text-gray-600 transition"
              >
                <span
                  className={`transition ${
                    isActive(link.path)
                      ? "text-[#F54900]"
                      : "group-hover:text-[#F54900]"
                  }`}
                >
                  {link.label}
                </span>

                {/* underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#F54900] origin-left transition-transform duration-300 ${
                    isActive(link.path)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">

            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <Popover>
                <PopoverTrigger>
                  <div className="cursor-pointer">
                    <UserAvatar userName={currentUser?.name || "User"} />
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-56 rounded-xl shadow-xl border bg-white p-3 mt-3">
                  <div className="space-y-2">

                    <div className="px-3 py-2 border-b">
                      <p className="font-semibold text-gray-800">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-500">{userRole}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md hover:bg-gray-100 text-lg"
                    >
                      Profile
                    </Link>

                    {(userRole === "marchant" || userRole === "admin") && (
                      <Link
                        to="/merchant-dashboard"
                        className="block px-3 py-2 rounded-md hover:bg-gray-100 text-lg"
                      >
                        Dashboard
                      </Link>
                    )}

                    {userRole === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        className="block px-3 py-2 rounded-md hover:bg-gray-100 text-lg"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-red-50 text-lg"
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-xl"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 bg-white rounded-2xl shadow-xl p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-lg font-medium ${
                  isActive(link.path)
                    ? "text-[#F54900]"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <button className="w-full py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                    Login
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="w-full mt-2 py-2 rounded-xl bg-orange-500 text-white">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-xl text-red-500 border"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

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

//   // Load user from token on initial render
//   useEffect(() => {
//     dispatch(loadUserFromToken());
//   }, [dispatch]);

//   const currentUser = useAppSelector(useCurrentUser);
//   console.log("user: ", currentUser);
//   const isLoggedIn = Boolean(currentUser);
//   const userRole = currentUser?.role;

//   const handleLogout = () => {
//     dispatch(logOut());
//     toast.success("Logged out successfully!");
//     navigate("/");
//   };

//   const toggleMenu = () => setIsOpen(!isOpen);
//   const handleLinkClick = () => setIsOpen(false);

//   const navLinks = [
//     { path: "/", label: "Home" },
//     { path: "/about", label: "About" },
//     { path: "/services", label: "Services" },
//     { path: "/contact", label: "Contact" },
//   ];

//   const isActive = (path: string) => location.pathname === path;

//   return (
//    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
//   <div className="max-w-[1200px] mx-auto">
//     <div className="flex items-center justify-between py-3">

//       {/* Logo */}
//       <Link to="/" className="flex items-center gap-2">
//         <img src={logo} alt="logo" className="h-10" />
       
//       </Link>

//       {/* Desktop Nav */}
//       <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
//         {navLinks.map((link) => (
//           <Link
//             key={link.path}
//             to={link.path}
//             className={`relative transition ${
//               isActive(link.path)
//                 ? "text-[#F54900]"
//                 : "hover:text-[#F54900]"
//             }`}
//           >
//             {link.label}

//             {/* underline animation */}
//             <span
//               className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#F54900] transition-transform duration-300 ${
//                 isActive(link.path)
//                   ? "scale-x-100"
//                   : "scale-x-0 group-hover:scale-x-100"
//               }`}
//             ></span>
//           </Link>
//         ))}
//       </div>

//       {/* Right Section */}
//       <div className="hidden md:flex items-center gap-4">

//         {!isLoggedIn ? (
//           <>
//             {/* Login */}
//             <Link
//               to="/login"
//                  className="border border-gray-400 hover:bg-[#F54900] hover:text-white hover:border-[#F54900] px-6 py-2.5 rounded-2xl font-semibold transition">
            
//               Login
//             </Link>

//             {/* Get Started (Hero Style) */}
//             <Link to="/signup">
//               <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg shadow-orange-500/30 transition">
//                 Get Started
//               </button>
//             </Link>

          
//           </>
//         ) : (
//           <Popover>
//             <PopoverTrigger>
//               <UserAvatar userName={currentUser?.name || "User"} />
//             </PopoverTrigger>

//             <PopoverContent className="mt-3 w-56 rounded-xl shadow-xl border bg-white p-3">
//               <div className="space-y-2">
//                 <div className="px-3 py-2 border-b">
//                   <p className="font-semibold">{currentUser?.name}</p>
//                   <p className="text-xs text-gray-500">{userRole}</p>
//                 </div>

//                 <Link to="/profile" className="block px-3 py-2 rounded-md hover:bg-gray-100">
//                   Profile
//                 </Link>

//                 {(userRole === "marchant" || userRole === "admin") && (
//                   <Link to="/merchant-dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100">
//                     Dashboard
//                   </Link>
//                 )}

//                 {userRole === "admin" && (
//                   <Link to="/admin-dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100">
//                     Admin Panel
//                   </Link>
//                 )}

//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         )}
//       </div>

//       {/* Mobile Button */}
//       <button
//         onClick={toggleMenu}
//         className="md:hidden text-gray-700"
//       >
//         {isOpen ? "✕" : "☰"}
//       </button>
//     </div>

//    {/* Mobile Menu */}
// {isOpen && (
//   <div className="md:hidden mt-4">
//     <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

//       {/* Nav Links */}
//       <div className="flex flex-col divide-y">
//         {navLinks.map((link) => (
//           <Link
//             key={link.path}
//             to={link.path}
//             onClick={handleLinkClick}
//             className={`flex items-center justify-between py-3 text-base font-medium transition ${
//               isActive(link.path)
//                 ? "text-[#F54900]"
//                 : "text-gray-700 hover:text-[#F54900]"
//             }`}
//           >
//             {link.label}

//             {/* active indicator */}
//             {isActive(link.path) && (
//               <span className="h-2 w-2 rounded-full bg-[#F54900]"></span>
//             )}
//           </Link>
//         ))}
//       </div>

//       {/* Auth Section */}
//       <div className="pt-3 space-y-3">

//         {!isLoggedIn ? (
//           <>
//            <div className="space-y-2">
//              {/* Login */}
//            <div>
//              <Link to="/login" onClick={handleLinkClick}>
//               <button className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition">
//                 Login
//               </button>
//             </Link>
//            </div>

//             {/* Get Started */}
//             <Link to="/signup" onClick={handleLinkClick}>
//               <button className="w-full py-2.5 rounded-xl bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20 hover:bg-orange-600 transition">
//                 Get Started
//               </button>
//             </Link>
//            </div>

//           </>
//         ) : (
//           <>
//             {/* User Info */}
//             <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
//               <UserAvatar userName={currentUser?.name || "User"} />
//               <div>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {currentUser?.name}
//                 </p>
//                 <p className="text-xs text-gray-500">{userRole}</p>
//               </div>
//             </div>

//             {/* Dashboard Links */}
//             {(userRole === "marchant" || userRole === "admin") && (
//               <Link
//                 to="/merchant-dashboard"
//                 onClick={handleLinkClick}
//                 className="block py-2 text-gray-700 hover:text-[#F54900]"
//               >
//                 Dashboard
//               </Link>
//             )}

//             {userRole === "admin" && (
//               <Link
//                 to="/admin-dashboard"
//                 onClick={handleLinkClick}
//                 className="block py-2 text-gray-700 hover:text-[#F54900]"
//               >
//                 Admin Panel
//               </Link>
//             )}

//             {/* Logout */}
//             <button
//               onClick={() => {
//                 handleLogout();
//                 handleLinkClick();
//               }}
//               className="w-full py-2.5 rounded-xl text-red-500 font-medium border border-red-100 hover:bg-red-50 transition"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// )}
//   </div>
// </nav>
//   );
// }

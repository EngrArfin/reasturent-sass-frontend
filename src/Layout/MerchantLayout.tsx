import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MerchantDashboardNavbar from "@/components/MerchantDashboard/Shared/MerchantDashboardNavbar";
import FooterDashboard from "@/components/MerchantDashboard/Shared/FooterDashboard";

const MerchantLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/seller-dashboard/invoice-form";

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      {!shouldHideNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50 mt-5 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
          <MerchantDashboardNavbar
            onMobileMenuToggle={handleMobileMenuToggle}
          />
        </div>
      )}

      {/* Remove this overlay or make it transparent if needed */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 pt-[100px] relative z-30 transition-all duration-300">
        <div className="mt-10 w-full max-w-[1560px] mx-auto px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
          <Outlet />
        </div>
        <FooterDashboard />
      </main>
    </div>
  );
};

export default MerchantLayout;

// import { useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import MerchantDashboardNavbar from "@/components/MerchantDashboard/Shared/MerchantDashboardNavbar";
// import Footer from "./Footer";

// const MerchantLayout = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { pathname } = useLocation();

//   const shouldHideNavbar = pathname === "/seller-dashboard/invoice-form";

//   const handleMobileMenuToggle = () => {
//     setIsMobileMenuOpen((prev) => !prev);
//   };

//   return (
//     <div className="relative flex flex-col min-h-screen bg-gray-50">
//       {/* Fixed Navbar */}
//       {!shouldHideNavbar && (
//         <div className="fixed top-0 left-0 right-0 z-50 mt-5 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
//           <MerchantDashboardNavbar
//             onMobileMenuToggle={handleMobileMenuToggle}
//           />
//         </div>
//       )}

//       {/* Overlay on toggle open */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <main
//         className={`flex-1 pt-[130px] relative z-30 transition-all duration-300 ${
//           isMobileMenuOpen ? "blur-sm pointer-events-none select-none" : ""
//         }`}
//       >
//         <div className="w-full max-w-[1560px] mx-auto px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
//           <Outlet />
//         </div>
//         <Footer />
//       </main>
//     </div>
//   );
// };

// export default MerchantLayout;

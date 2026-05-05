import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboardNavBar from "@/components/AdminDashboard/Shared/AdminDashboardNavBar";
import FooterDashboard from "@/components/MerchantDashboard/Shared/FooterDashboard";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/seller-dashboard/invoice-form";

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      {!shouldHideNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50 mt-5 px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
          <AdminDashboardNavBar onMobileMenuToggle={handleMobileMenuToggle} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-[130px]">
        {" "}
        {/* 96px = approx height of navbar */}
        <div className=" w-full max-w-[1560px] mx-auto px-4 md:px-4 lg:px-4 xl:px-4 2xl:px-0">
          <Outlet />
        </div>{" "}
        <FooterDashboard />
      </main>
    </div>
  );
};

export default AdminLayout;

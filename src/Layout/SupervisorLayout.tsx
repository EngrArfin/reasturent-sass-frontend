import SupervisorSidebar from "@/components/SupervisorDashboard/Shared/SupervisorSidebar";
import ManagerDashboardNavBar from "@/components/ManagerDashboard/Shared/ManagerDashboardNavBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const SupervisorLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-[#052318] via-[#0A1C19] to-[#0F131B]">
      {/* Sidebar - Fixed on Desktop */}
      <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30 bg-[#052218]">
        <SupervisorSidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 transition-all duration-200 ease-in-out lg:ml-72">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-20 bg-white">
          <ManagerDashboardNavBar
            onMobileMenuToggle={handleMobileMenuToggle}
            notificationCount={2}
            userName="Supervisor (Owner)"
            isSidebarOpen={false}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-[#0E131A] border-none">
            <SupervisorSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto mt-16 text-white bg-[#121826] p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupervisorLayout;

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Outlet } from "react-router-dom";
import KitchenNavbar from "@/components/Kitchen/Shared/KitchenNavbar";
import KitchenSidebar from "@/components/Kitchen/Shared/KitchenSidebar";

const KitchenLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar - Fixed on Desktop */}
      <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-[#131b2e]">
        <KitchenSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64 min-w-0 transition-all duration-200 ease-in-out">
        {/* Kitchen Header Navbar */}
        <div className="fixed top-0 left-0 lg:left-64 right-0 z-20">
          <KitchenNavbar onMobileMenuToggle={handleMobileMenuToggle} />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="hidden" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 p-0 bg-[#131b2e] border-r border-[#1F2E4D]"
          >
            <KitchenSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Scrollable Page Outlet Content */}
        <main className="flex-1 overflow-y-auto mt-16 bg-[#F8FAFC] text-slate-900 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default KitchenLayout;

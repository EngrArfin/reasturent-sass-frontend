import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import user from "@/assets/Photo/Group (3).png";
import { Link } from "react-router-dom";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const AdminDashboardNavBar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,

  userName = "Gemini Chachi",
  isSidebarOpen,
}) => {
  return (
    <div className="bg-[#131b2e] border-b border-[#1F2E4D] text-white">
      <header
        className={`flex items-center justify-between h-16 px-4 md:px-8 mb-2 ${
          isSidebarOpen ? "max-w-[1400px] mx-auto" : ""
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-black cursor-pointer"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Logo + Dashboard text */}
          <div className="flex items-center space-x-2 pl-0 md:pl-2 lg:pl-70">
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-white">Dashboard</span>
              <span className="text-sm md:text-base font-medium text-white">
                HELLO, {userName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Dashboard Icon */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white cursor-pointer"
              >
                <img src={user} alt="User" className="w-6 h-6 rounded-full" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[#131b2e] text-white w-60 shadow-2xl rounded-3xl border border-[#3A5CFF]/40 backdrop-blur-md overflow-hidden animate-fadeIn"
            >
              <Link to="/admin-dashboard/settings">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[#FEF7ED] hover:text-black transition-colors cursor-pointer">
                  {/* <IoMdSettings className="text-white hover:text-black transition-colors duration-300 cursor-pointer" /> */}
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[#FEF7ED] hover:text-black transition-colors cursor-pointer">
                {/* <RiFileList3Fill className="text-white hover:text-black" /> */}
                <span className="font-medium">Terms & Conditions</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-[#FEF7ED] hover:text-black transition-colors cursor-pointer">
                {/* <MdPrivacyTip className="text-white hover:text-black" /> */}
                <span className="font-medium">Privacy Policy</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 rounded-3xl hover:bg-red-600 hover:text-black transition-colors cursor-pointer">
                {/* <RiLogoutBoxRLine className="text-red-500" /> */}
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default AdminDashboardNavBar;

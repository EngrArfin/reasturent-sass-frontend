import React from "react";
import {
  Menu,
  Settings,
  Users,
  UtensilsCrossed,
  Boxes,
  LifeBuoy,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import user from "@/assets/Photo/Group (3).png";
import { Link, useNavigate } from "react-router-dom";
import NotificationPannel from "@/components/AdminDashboard/Shared/NotificationPannel";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import { logOut } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const ManagerDashboardNavBar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  userName = "Manager",
  isSidebarOpen,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const displayName = authUser?.name || userName;
  const displayEmail = authUser?.email || "manager@restaurant.com";
  const displayRole = authUser?.role
    ? authUser.role.toString().toUpperCase().replace("_", " ")
    : "MANAGER";

  const handleSignOut = () => {
    dispatch(logOut());
    toast.success("Signed out successfully");
    navigate("/login");
  };

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
            className="lg:hidden text-white hover:bg-slate-800 cursor-pointer"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Logo + Dashboard text */}
          <div className="flex items-center space-x-2 pl-0 md:pl-2 lg:pl-70">
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-slate-400">Dashboard</span>
              <span className="text-sm md:text-base font-medium text-white">
                HELLO, {displayName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Notifications + User Profile */}
        <div className="flex items-center space-x-3">
          {/* Notification Icon & Dropdown Panel */}
          <NotificationPannel notificationsUrl="/manager-dashboard/notifications" />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-[#26375c] hover:border-orange-500/50 p-0 cursor-pointer overflow-hidden flex items-center justify-center transition-all bg-[#1b253d] hover:bg-[#26375c] focus:outline-none focus:ring-2 focus:ring-[#F54900]/40"
                title="User profile"
              >
                <img
                  src={authUser?.avatar || user}
                  alt="User"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="bg-[#131b2e] text-white w-64 shadow-2xl rounded-2xl border border-[#26375c] p-2 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50"
            >
              {/* User Info Header */}
              <div className="px-3 py-2.5 mb-1.5 rounded-xl bg-[#1b253d]/80 border border-[#26375c]/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white truncate max-w-[130px]">
                    {displayName}
                  </p>
                  <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded font-medium">
                    {displayRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {displayEmail}
                </p>
              </div>

              {/* 1. Account Settings */}
              <DropdownMenuItem
                asChild
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#1b253d] active:bg-[#26375c] transition-all cursor-pointer group border border-transparent hover:border-[#26375c]"
              >
                <Link to="/manager-dashboard/settings">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#1b253d] text-slate-300 group-hover:text-orange-400 group-hover:bg-orange-500/10 transition-colors">
                      <Settings className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Account Settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </DropdownMenuItem>

              {/* 2. Staff & Employees */}
              <DropdownMenuItem
                asChild
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#1b253d] active:bg-[#26375c] transition-all cursor-pointer group border border-transparent hover:border-[#26375c]"
              >
                <Link to="/manager-dashboard/employees">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#1b253d] text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Staff & Employees</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </DropdownMenuItem>

              {/* 3. Food & Menu */}
              <DropdownMenuItem
                asChild
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#1b253d] active:bg-[#26375c] transition-all cursor-pointer group border border-transparent hover:border-[#26375c]"
              >
                <Link to="/manager-dashboard/manage-food">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#1b253d] text-slate-300 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Food & Menu</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </DropdownMenuItem>

              {/* 4. Inventory Stock */}
              <DropdownMenuItem
                asChild
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#1b253d] active:bg-[#26375c] transition-all cursor-pointer group border border-transparent hover:border-[#26375c]"
              >
                <Link to="/manager-dashboard/inventory">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#1b253d] text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Inventory Stock</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </DropdownMenuItem>

              {/* 5. Support Desk / Manager Tickets */}
              <DropdownMenuItem
                asChild
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-[#1b253d] active:bg-[#26375c] transition-all cursor-pointer group border border-transparent hover:border-[#26375c]"
              >
                <Link to="/manager-dashboard/manager-ticket">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#1b253d] text-slate-300 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Support Desk</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </DropdownMenuItem>

              {/* Divider */}
              <div className="my-1.5 border-t border-[#1F2E4D]" />

              {/* Sign Out Button */}
              <DropdownMenuItem
                onClick={handleSignOut}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/15 active:bg-red-500/25 transition-all cursor-pointer group border border-transparent hover:border-red-500/30"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold">Sign Out</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-red-400/60 group-hover:text-red-300 transition-transform group-hover:translate-x-0.5" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default ManagerDashboardNavBar;

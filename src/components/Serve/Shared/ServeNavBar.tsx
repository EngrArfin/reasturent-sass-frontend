import React from "react";
import { Menu, LogOut, Bell, LayoutGrid, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import userPhoto from "@/assets/Photo/Group (3).png";

export interface ServeNavBarProps {
  onMobileMenuToggle: () => void;
  stationName?: string;
  floorName?: string;
}

const ServeNavBar: React.FC<ServeNavBarProps> = ({
  onMobileMenuToggle,
  stationName = "Service Station",
  floorName = "Dining Floor",
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const displayName =
    authUser?.name ||
    (authUser?.email ? authUser.email.split("@")[0] : "Server Attendant");

  const displayRole = authUser?.role
    ? `${authUser.role} Server`
    : "Service Waiter";
  const displayEmail = authUser?.email || "server@restaurant.com";

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div className="bg-[#131b2e] border-b border-[#1F2E4D] text-white shadow-sm">
      <header className="flex items-center justify-between h-16 px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Left Section: Mobile Menu & Station Info */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-slate-800 cursor-pointer"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  {stationName}
                </span>

              </div>
              <span className="text-sm md:text-base font-bold text-white">
                {floorName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Notification & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Notification Icon */}
          <Link
            to="/serve-dashboard/orders"
            className="relative p-2 rounded-full bg-[#1b253d] hover:bg-[#26375c] text-slate-300 hover:text-white border border-[#26375c] transition-all shadow-xs flex items-center justify-center cursor-pointer"
            title="Order Notifications"
          >
            <Bell className="w-4 h-4 text-orange-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#131b2e] animate-pulse" />
          </Link>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full border border-[#26375c] hover:border-orange-500/50 p-0 cursor-pointer overflow-hidden flex items-center justify-center transition-colors"
              >
                <img
                  src={userPhoto}
                  alt="User"
                  className="w-full h-full object-cover rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[#131b2e] text-white w-60 shadow-2xl rounded-2xl border border-[#3A5CFF]/30 backdrop-blur-md p-1.5 animate-fadeIn"
            >
              <div className="px-3 py-2 border-b border-[#1F2E4D]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">
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

              <Link to="/serve-dashboard">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-slate-200">
                  <LayoutGrid className="w-4 h-4 text-orange-400" />
                  <span>Table Map</span>
                </DropdownMenuItem>
              </Link>

              <Link to="/serve-dashboard/orders">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Table Order Status</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator className="bg-[#1F2E4D]" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="font-semibold">Sign Out / End Shift</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default ServeNavBar;

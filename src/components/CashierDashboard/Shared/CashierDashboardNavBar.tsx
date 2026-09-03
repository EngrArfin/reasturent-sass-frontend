import React from "react";
import { Menu, User, LogOut, Clock, Sparkles, Utensils } from "lucide-react";
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

export interface CashierNavbarProps {
  onMobileMenuToggle: () => void;
  cashierName?: string;
  terminalName?: string;
}

const CashierDashboardNavBar: React.FC<CashierNavbarProps> = ({
  onMobileMenuToggle,
  terminalName = "POS Terminal 1",
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const displayName =
    authUser?.name ||
    (authUser?.email ? authUser.email.split("@")[0] : "Cashier Staff");
  const displayEmail = authUser?.email || "cashier@restaurant.com";

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div className="bg-[#131b2e] border-b border-[#1F2E4D] text-white font-sans">
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
                <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">
                  Cashier Station
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Shift
                </span>
              </div>
              <span className="text-sm md:text-base font-bold text-white">
                {terminalName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Time & User Icon Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Quick Date/Time Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b253d] border border-[#26375c] text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* User Profile Icon Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full bg-[#1b253d] hover:bg-[#26375c] border border-[#26375c] hover:border-orange-500/50 text-white flex items-center justify-center shadow-xs cursor-pointer transition-all active:scale-95 focus:outline-none"
                title={displayName}
              >
                <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-[#131b2e] text-white w-60 shadow-2xl rounded-2xl border border-[#1F2E4D] backdrop-blur-md p-1.5 animate-fadeIn"
            >
              <div className="px-3 py-2.5 border-b border-[#1F2E4D] mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                  </div>
                </div>
              </div>

              <Link to="/cashier-dashboard/dashboard">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-slate-200">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Cashier POS Hub</span>
                </DropdownMenuItem>
              </Link>

              <Link to="/cashier-dashboard/table-menu">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-slate-200">
                  <Utensils className="w-4 h-4 text-orange-400" />
                  <span>Order Menu</span>
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

export default CashierDashboardNavBar;

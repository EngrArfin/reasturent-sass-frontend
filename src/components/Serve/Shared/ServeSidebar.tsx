import React from "react";
import logo from "@/assets/icons/logoSAS.png";
import { LayoutGrid, ClipboardList, LogOut, type LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";

export interface ServeSidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const defaultServeSidebarItems: ServeSidebarItem[] = [
  {
    icon: LayoutGrid,
    label: "Table Map",
    href: "/serve-dashboard",
  },
  {
    icon: ClipboardList,
    label: "Table Order Status",
    href: "/serve-dashboard/orders",
  },
];

export interface ServeSidebarProps {
  onItemClick?: () => void;
}

const ServeSidebar: React.FC<ServeSidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col h-full bg-[#131b2e] text-white"
      style={{ boxShadow: "3px 4px 42.3px 0px #131b2e" }}
    >
      {/* Brand Logo */}
      <Link to="/serve-dashboard" onClick={onItemClick}>
        <div className="flex items-center justify-center p-3 border-b border-[#1F2E4D] mt-2">
          <img src={logo} alt="Restaurant SaaS Logo" className="h-8 w-auto" />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4">
        <div className="space-y-3">
          {defaultServeSidebarItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href === "/serve-dashboard" &&
                location.pathname === "/serve-dashboard/dashboard");

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onItemClick}
                className={`group flex items-center justify-between w-full px-3.5 py-3 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "text-white bg-orange-600 shadow-md shadow-orange-600/30"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-white" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout / End Shift Section */}
      <div className="p-4 border-t border-[#1F2E4D]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white 
                     bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 
                     rounded-xl transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out / End Shift</span>
        </button>
      </div>
    </div>
  );
};

export default ServeSidebar;

// AdminSidebar.tsx
import logo from "@/assets/icons/logoSAS.png";
import { Badge } from "@/components/ui/badge";

import { ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { RxDashboard } from "react-icons/rx";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { TbCalendarUser } from "react-icons/tb";
import { BiSolidUserBadge } from "react-icons/bi";
import { HiOutlineUserMinus } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { RiShareBoxLine } from "react-icons/ri";

import { IconType } from "react-icons";

// Types
export interface SidebarItem {
  icon: IconType;
  label: string;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  onItemClick?: () => void;
}

// Sidebar Items
const defaultSidebarItems: SidebarItem[] = [
  { icon: RxDashboard, label: "Dashboard", href: "/admin-dashboard/dashboard" },
  {
    icon: FaUsers,
    label: "User Management",
    href: "/admin-dashboard/user-management",
  },
  {
    icon: HiOutlineUserMinus,
    label: "Patients",
    href: "/admin-dashboard/patients",
  },
  {
    icon: FaUserPlus,
    label: "Patient Assignment",
    href: "/admin-dashboard/patient-assignment",
  },
  {
    icon: BiSolidUserBadge,
    label: "Protocol Management",
    href: "/admin-dashboard/protocol-management",
  },
  {
    icon: TbCalendarUser,
    label: "Audit Log",
    href: "/admin-dashboard/audit-log",
  },
  {
    icon: IoSettingsOutline,
    label: "Settings",
    href: "/admin-dashboard/settings",
  },
];

const AdminSidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  onItemClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // adjust based on your auth system
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col h-full bg-[#29424C]"
      style={{ boxShadow: "3px 4px 42.3px 0px #0000001A" }}
    >
      {/* Logo */}
      <Link to="/admin-dashboard/dashboard">
        <div className="flex items-center justify-center p-2 sm:p-3 border-b border-[#C9C6C3] mt-1">
          <img src={logo} alt="Logo" className="h-8 w-35" />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4">
        <div className="space-y-4 md:space-y-6">
          {items.map((item) => {
            const isActive =
              location.pathname === item.href ||
              item.children?.some((child) => location.pathname === child.href);

            const isOpen = openMenu === item.label;

            return (
              <div key={item.label}>
                {item.href && !item.children ? (
                  <Link
                    to={item.href}
                    onClick={onItemClick}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm transition-all duration-300 ${
                      isActive
                        ? "text-[#F3AA4B] bg-[#FEF7ED] rounded-xl shadow-md"
                        : "text-white hover:text-[#F3AA4B] hover:bg-[#FEF7ED] hover:rounded-xl hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-[#F3AA4B]"
                            : "text-white group-hover:text-[#F3AA4B]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "text-[#3A5CFF] bg-[#1C1D28] rounded-xl shadow-md"
                        : "text-white hover:text-[#3A5CFF] hover:bg-[#1C1D28]/80 hover:rounded-xl hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-[#3A5CFF]"
                            : "text-white group-hover:text-[#3A5CFF]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}

                    {item.badge && (
                      <Badge className="text-xs bg-[#3A5CFF]/10 text-[#3A5CFF] border border-[#3A5CFF]/30">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )}

                {item.children && isOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {item.children.map((child) => {
                      const childActive = location.pathname === child.href;

                      return (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={onItemClick}
                          className={`block px-3 py-2 text-sm rounded-lg transition-all ${
                            childActive
                              ? "text-[#3A5CFF] bg-[#1C1D28]"
                              : "text-gray-300 hover:text-[#3A5CFF] hover:bg-[#1C1D28]/70"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-2 md:p-4 border-t border-[#C9C6C3]">
        <div className="flex justify-center mb-3">
          <img src={logo} alt="Logo" className="h-5 w-auto opacity-70" />
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white 
                     bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 
                     rounded-xl transition-all duration-300"
        >
          <RiShareBoxLine className="w-4 h-4 rotate-180 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

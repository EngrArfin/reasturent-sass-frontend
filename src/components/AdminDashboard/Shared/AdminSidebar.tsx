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
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";

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

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div
      className="flex flex-col h-full bg-[#1b2233]"
      style={{ boxShadow: "3px 4px 42.3px 0px #1b2233" }}
    >
      {/* Logo */}
      <Link to="/admin-dashboard/dashboard">
        <div className="flex items-center justify-center p-2 sm:p-3 border-b border-[#1b2233] mt-1">
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
                        ? "text-white bg-orange-600 rounded-xl shadow-md"
                        : "text-white hover:text-white hover:bg-orange-600 hover:rounded-xl hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 text-white`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "text-white bg-orange-600 rounded-xl shadow-md"
                        : "text-white hover:text-white hover:bg-orange-600 hover:rounded-xl hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon
                        className={`w-5 h-5 text-white`}
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
                      <Badge className={`text-xs transition-colors duration-300 ${isActive ? "bg-white text-orange-600" : "bg-orange-600 text-white group-hover:bg-white group-hover:text-orange-600"} border-none`}>
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
                              ? "text-white bg-orange-600"
                              : "text-gray-300 hover:text-white hover:bg-orange-600"
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
      <div className="p-2 md:p-4 border-t border-[#1b2233]">
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

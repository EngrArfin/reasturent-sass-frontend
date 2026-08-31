// ManagerSidebar.tsx
import logo from "@/assets/icons/logoSAS.png";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  PieChart,
  Box,
  Users,
  Utensils,
  Ticket,
  ScanLine,
  LifeBuoy,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, type ElementType } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";

// Types
export interface SidebarItem {
  icon: LucideIcon | ElementType;
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
  {
    icon: PieChart,
    label: "Overview",
    href: "/manager-dashboard/dashboard",
  },
  {
    icon: Box,
    label: "Inventory",
    href: "/manager-dashboard/inventory",
  },
  {
    icon: Users,
    label: "Employees",
    href: "/manager-dashboard/employees",
  },
  {
    icon: Utensils,
    label: "Manage Food",
    href: "/manager-dashboard/manage-food",
  },
  {
    icon: Ticket,
    label: "Vouchers",
    href: "/manager-dashboard/voucher",
  },

  {
    icon: ScanLine,
    label: "QRScanner",
    href: "/manager-dashboard/qrscanner",
  },
  {
    icon: LifeBuoy,
    label: "Manager Ticket",
    href: "/manager-dashboard/manager-ticket",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/manager-dashboard/settings",
  },
];

const ManagerSidebar: React.FC<SidebarProps> = ({
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
      className="flex flex-col h-full bg-[#131b2e]"
      style={{ boxShadow: "3px 4px 42.3px 0px #131b2e" }}
    >
      {/* Logo */}
      <Link to="/manager-dashboard/dashboard">
        <div className="flex items-center justify-center p-2 sm:p-3 border-b border-[#1F2E4D] mt-3.5">
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
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm transition-all duration-300 ${isActive
                      ? "text-white bg-orange-600 rounded-xl shadow-md"
                      : "text-white hover:text-white hover:bg-orange-600 hover:rounded-xl hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon className={`w-5 h-5 text-white`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`group flex items-center justify-between w-full px-3 py-2 text-sm transition-all duration-300 cursor-pointer ${isActive
                      ? "text-white bg-orange-600 rounded-xl shadow-md"
                      : "text-white hover:text-white hover:bg-orange-600 hover:rounded-xl hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center space-x-2 md:text-lg">
                      <item.icon className={`w-5 h-5 text-white`} />
                      <span>{item.label}</span>
                    </div>

                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    )}

                    {item.badge && (
                      <Badge
                        className={`text-xs transition-colors duration-300 ${isActive ? "bg-white text-orange-600" : "bg-orange-600 text-white group-hover:bg-white group-hover:text-orange-600"} border-none`}
                      >
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
                          className={`block px-3 py-2 text-sm rounded-lg transition-all ${childActive
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
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;

import logo from "@/assets/icons/logoSAS.png";
import {
  PieChart,
  Box,
  Users,
  Utensils,
  Ticket,
  ScanLine,
  LifeBuoy,
  Settings,
  LogOut,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { type ElementType } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";

export interface SidebarItem {
  icon: LucideIcon | ElementType;
  label: string;
  href: string;
  badge?: string;
}

export interface SupervisorSidebarProps {
  onItemClick?: () => void;
}

const supervisorSidebarItems: SidebarItem[] = [
  {
    icon: PieChart,
    label: "Overview",
    href: "/supervisor-dashboard/dashboard",
  },
  {
    icon: ShieldCheck,
    label: "Staff Approvals",
    href: "/supervisor-dashboard/approvals",
    badge: "2 Pending",
  },
  {
    icon: Users,
    label: "Employees",
    href: "/supervisor-dashboard/employees",
  },
  {
    icon: Utensils,
    label: "Manage Food",
    href: "/supervisor-dashboard/manage-food",
  },
  {
    icon: Box,
    label: "Inventory",
    href: "/supervisor-dashboard/inventory",
  },
  {
    icon: Ticket,
    label: "Vouchers",
    href: "/supervisor-dashboard/voucher",
  },
  {
    icon: ScanLine,
    label: "QRScanner",
    href: "/supervisor-dashboard/qrscanner",
  },
  {
    icon: LifeBuoy,
    label: "Support Ticket",
    href: "/supervisor-dashboard/manager-ticket",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/supervisor-dashboard/settings",
  },
];

const SupervisorSidebar: React.FC<SupervisorSidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const isItemActive = (href: string) => {
    if (href === "/supervisor-dashboard/dashboard") {
      return (
        location.pathname === "/supervisor-dashboard" ||
        location.pathname === "/supervisor-dashboard/dashboard"
      );
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className="flex flex-col h-full bg-[#131b2e]"
      style={{ boxShadow: "3px 4px 42.3px 0px #131b2e" }}
    >
      {/* Logo and Brand Header */}
      <Link to="/supervisor-dashboard/dashboard">
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 border-b border-[#1F2E4D] mt-2">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>Supervisor Portal</span>
          </div>
        </div>
      </Link>

      {/* Navigation list */}
      <nav className="flex-1 p-2 md:p-4 overflow-y-auto">
        <div className="space-y-2 md:space-y-3">
          {supervisorSidebarItems.map((item) => {
            const isActive = isItemActive(item.href);
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <Link
                  to={item.href}
                  onClick={onItemClick}
                  className={`group flex items-center justify-between w-full px-3.5 py-2.5 text-sm transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-white bg-orange-600 rounded-xl shadow-md"
                      : "text-white hover:text-white hover:bg-orange-600 hover:rounded-xl hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-3 text-sm md:text-base font-medium">
                    <Icon className="w-5 h-5 text-white shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-white text-orange-600"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40 group-hover:bg-white group-hover:text-orange-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-2 md:p-4 border-t border-[#1b2233]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 rounded-xl transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SupervisorSidebar;

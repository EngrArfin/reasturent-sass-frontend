import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  Info,
  AlertTriangle,
  ShoppingBag,
  Sparkles,
  Ticket,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "order" | "ticket" | "system" | "warning" | "success";
  isRead: boolean;
  link?: string;
}

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Support Ticket #8821",
    message: "Hardware/Printer timeout error reported on Terminal 2.",
    time: "2 mins ago",
    type: "ticket",
    isRead: false,
    link: "/admin-dashboard/submit-ticket",
  },
  {
    id: "notif-2",
    title: "New Subscription Upgraded",
    message: "Foodies Hub Restaurant renewed Annual Enterprise POS Plan.",
    time: "15 mins ago",
    type: "success",
    isRead: false,
    link: "/admin-dashboard/subscription",
  },
  {
    id: "notif-3",
    title: "POS Inventory Auto-Sync Alert",
    message: "Daily barcode and raw ingredient ledger synced with cloud database.",
    time: "1 hour ago",
    type: "system",
    isRead: false,
    link: "/manager-dashboard/inventory",
  },
  {
    id: "notif-4",
    title: "High Table Demand on Floor",
    message: "Table #4 and Table #5 requested instant invoice printout.",
    time: "3 hours ago",
    type: "order",
    isRead: true,
    link: "/serve-dashboard/orders",
  },
  {
    id: "notif-5",
    title: "Low Ingredient Threshold",
    message: "Whole Milk and Farm Chicken stock is running below 15 units.",
    time: "5 hours ago",
    type: "warning",
    isRead: true,
    link: "/manager-dashboard/inventory",
  },
];

interface NotificationPanelProps {
  notificationsUrl?: string;
}

const NotificationPannel: React.FC<NotificationPanelProps> = ({
  notificationsUrl,
}) => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications
  );
  const [isOpen, setIsOpen] = useState(false);

  // Determine current dashboard base URL for all-notifications link
  const currentPath = location.pathname;
  let defaultViewAllUrl = "/admin-dashboard/notifications";
  if (currentPath.startsWith("/manager-dashboard")) {
    defaultViewAllUrl = "/manager-dashboard/notifications";
  } else if (currentPath.startsWith("/supervisor-dashboard")) {
    defaultViewAllUrl = "/supervisor-dashboard/notifications";
  } else if (currentPath.startsWith("/cashier-dashboard")) {
    defaultViewAllUrl = "/cashier-dashboard/notifications";
  } else if (currentPath.startsWith("/kitchen-dashboard")) {
    defaultViewAllUrl = "/kitchen-dashboard/notifications";
  } else if (currentPath.startsWith("/serve-dashboard")) {
    defaultViewAllUrl = "/serve-dashboard/notifications";
  }

  const targetViewAllUrl = notificationsUrl || defaultViewAllUrl;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case "ticket":
        return <Ticket className="w-4 h-4 text-blue-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "success":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "system":
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "ticket":
        return "bg-blue-500/10 border-blue-500/20";
      case "warning":
        return "bg-amber-500/10 border-amber-500/20";
      case "success":
        return "bg-purple-500/10 border-purple-500/20";
      case "system":
      default:
        return "bg-cyan-500/10 border-cyan-500/20";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2.5 rounded-full bg-[#1b253d] hover:bg-[#26375c] border border-[#26375c] hover:border-blue-500/50 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#131b2e] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="bg-[#131b2e] text-white w-[340px] sm:w-[380px] shadow-2xl rounded-3xl border border-[#1F2E4D] backdrop-blur-md p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50"
      >
        {/* Dropdown Header */}
        <div className="p-4 border-b border-[#1F2E4D] bg-[#0e1626]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="bg-[#052350] text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#1F2E4D]/60 scrollbar-thin">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id)}
                className={`p-3.5 sm:p-4 hover:bg-[#1a243d]/60 transition-colors flex items-start gap-3 cursor-pointer relative ${
                  !item.isRead ? "bg-[#0b1220]/50" : ""
                }`}
              >
                {/* Icon Box */}
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4
                      className={`text-xs font-bold truncate ${
                        !item.isRead ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-slate-500 text-xs">
              No notifications at this moment.
            </div>
          )}
        </div>

        {/* Dropdown Footer: Link to Full Page */}
        <div className="p-3 bg-[#0b1220] border-t border-[#1F2E4D] text-center">
          <Link
            to={targetViewAllUrl}
            onClick={() => setIsOpen(false)}
            className="w-full py-2 px-4 rounded-xl bg-[#131b2e] hover:bg-[#052350] border border-[#1F2E4D] hover:border-blue-500/50 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>View All Notifications</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationPannel;

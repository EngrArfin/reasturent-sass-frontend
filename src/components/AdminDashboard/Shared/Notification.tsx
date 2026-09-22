import React, { useState, useMemo } from "react";
import {
  CheckCheck,
  Clock,
  Search,
  Trash2,
  Check,
  ShoppingBag,
  Ticket,
  AlertTriangle,
  Sparkles,
  Info,
  ExternalLink,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  NotificationItem,
  initialNotifications,
} from "./NotificationPannel";

// Extended realistic static notifications for the full view
const fullStaticNotifications: NotificationItem[] = [
  ...initialNotifications,
  {
    id: "notif-6",
    title: "Voucher Campaign Live",
    message: "Promo voucher 'CHICKEN-15' was successfully activated by Manager Sarah.",
    time: "Yesterday, 14:20",
    type: "success",
    isRead: true,
    link: "/manager-dashboard/voucher",
  },
  {
    id: "notif-7",
    title: "Kitchen Station Latency Check",
    message: "KDS 01 average preparation duration is optimal at 14.5 mins per ticket.",
    time: "Yesterday, 11:05",
    type: "system",
    isRead: true,
    link: "/kitchen-dashboard",
  },
  {
    id: "notif-8",
    title: "New Employee Onboarded",
    message: "Cashier Emily was provisioned terminal PIN authentication.",
    time: "Sep 20, 2026",
    type: "system",
    isRead: true,
    link: "/manager-dashboard/employees",
  },
  {
    id: "notif-9",
    title: "Printer Thermal Paper Low",
    message: "Cashier Station 1 printer reported low roll sensor trigger.",
    time: "Sep 19, 2026",
    type: "warning",
    isRead: true,
    link: "/cashier-dashboard",
  },
  {
    id: "notif-10",
    title: "System Security & SSL Renewed",
    message: "Global SSL certificate and multi-tenant webhook encryption refreshed.",
    time: "Sep 18, 2026",
    type: "system",
    isRead: true,
  },
];

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    fullStaticNotifications
  );
  const [activeTab, setActiveTab] = useState<
    "ALL" | "UNREAD" | "SYSTEM" | "TICKETS" | "ORDERS"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab === "UNREAD" && item.isRead) return false;
      if (activeTab === "SYSTEM" && item.type !== "system") return false;
      if (activeTab === "TICKETS" && item.type !== "ticket") return false;
      if (activeTab === "ORDERS" && item.type !== "order") return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMsg = item.message.toLowerCase().includes(query);
        return matchesTitle || matchesMsg;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case "ticket":
        return <Ticket className="w-5 h-5 text-blue-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "success":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "system":
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
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
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">
              Notifications & Activity Alerts
            </h1>
            {unreadCount > 0 && (
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time feed of restaurant operations, hardware diagnostics, ticket queue, and billing updates
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-[#1b253d] hover:bg-[#26375c] border border-[#26375c] text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#131b2e] rounded-2xl p-3 sm:p-4 border border-[#1F2E4D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(["ALL", "UNREAD", "SYSTEM", "TICKETS", "ORDERS"] as const).map(
            (tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-[#052350] text-white border-blue-500/60 shadow-sm"
                      : "bg-[#0b1220] hover:bg-[#1a243d] text-slate-400 hover:text-white border-[#1F2E4D]"
                  }`}
                >
                  {tab}
                </button>
              );
            }
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0b1220] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`w-full bg-[#131b2e] rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.isRead
                  ? "border-blue-500/40 bg-[#131b2e] shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20"
                  : "border-[#1F2E4D] hover:border-slate-700 opacity-90"
              }`}
            >
              {/* Left Side: Icon & Details */}
              <div className="flex items-start gap-4 flex-1">
                {/* Icon Box */}
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${getIconBg(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-sm font-bold truncate ${
                        !item.isRead ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1F2E4D]/60 justify-end">
                {item.link && (
                  <Link
                    to={item.link}
                    className="px-3 py-1.5 rounded-xl bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </Link>
                )}

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Mark as Read"
                    className="p-2 rounded-xl bg-[#0b1220] hover:bg-[#1a243d] border border-[#1F2E4D] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteNotification(item.id)}
                  title="Dismiss Notification"
                  className="p-2 rounded-xl bg-[#0b1220] hover:bg-red-500/10 border border-[#1F2E4D] hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#131b2e] rounded-3xl p-16 border border-[#1F2E4D] text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Inbox className="w-12 h-12 stroke-[1.5] text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">
              No notifications found
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery
                ? "Try adjusting your search filter."
                : "You're all caught up! New alerts and activity feeds will show up here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;

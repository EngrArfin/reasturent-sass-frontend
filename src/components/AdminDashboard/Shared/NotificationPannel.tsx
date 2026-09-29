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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/redux/features/manager/Notifications/notificationsApi";
import { NotificationItem } from "@/redux/features/manager/Notifications/notificationsType";

interface NotificationPanelProps {
  notificationsUrl?: string;
}

const NotificationPannel: React.FC<NotificationPanelProps> = ({
  notificationsUrl,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch unread count for badge (polls every 30s or refetches on invalidation)
  const { data: countData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });

  // Fetch recent notifications for dropdown
  const {
    data: notifData,
    isLoading,
    isFetching,
  } = useGetNotificationsQuery(
    { page: 1, limit: 5 },
    {
      pollingInterval: 30000,
    }
  );

  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const notifications = notifData?.items || [];
  const unreadCount = countData?.unreadCount ?? notifData?.unreadCount ?? 0;

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

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
    if (item.link) {
      setIsOpen(false);
      navigate(item.link);
    }
  };

  const getIcon = (type: string) => {
    const normalizedType = type?.toUpperCase() || "";
    switch (normalizedType) {
      case "ORDERS":
      case "ORDER":
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case "TICKETS":
      case "TICKET":
        return <Ticket className="w-4 h-4 text-blue-400" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "SUCCESS":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "SYSTEM":
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getIconBg = (type: string) => {
    const normalizedType = type?.toUpperCase() || "";
    switch (normalizedType) {
      case "ORDERS":
      case "ORDER":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "TICKETS":
      case "TICKET":
        return "bg-blue-500/10 border-blue-500/20";
      case "WARNING":
        return "bg-amber-500/10 border-amber-500/20";
      case "SUCCESS":
        return "bg-purple-500/10 border-purple-500/20";
      case "SYSTEM":
      default:
        return "bg-cyan-500/10 border-cyan-500/20";
    }
  };

  const formatDisplayTime = (item: NotificationItem) => {
    if (item.relativeTime) return item.relativeTime;
    if (item.createdAt) {
      try {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return item.createdAt;
      }
    }
    return "Recently";
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
              {unreadCount > 99 ? "99+" : unreadCount}
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
            {isFetching && !isLoading && (
              <Loader2 className="w-3 h-3 text-blue-400 animate-spin ml-1" />
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              disabled={isMarkingAll}
              onClick={handleMarkAllAsRead}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isMarkingAll ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#1F2E4D]/60 scrollbar-thin">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span>Loading notifications...</span>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
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
                    <span>{formatDisplayTime(item)}</span>
                    {item.category && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-blue-400/80 font-medium">
                          {item.category}
                        </span>
                      </>
                    )}
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

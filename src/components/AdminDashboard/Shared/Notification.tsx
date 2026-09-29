import React, { useState, useEffect } from "react";
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
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  useClearAllNotificationsMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useToggleNotificationReadMutation,
} from "@/redux/features/manager/Notifications/notificationsApi";
import {
  NotificationCategoryType,
  NotificationItem,
} from "@/redux/features/manager/Notifications/notificationsType";

const Notification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NotificationCategoryType>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset to page 1 on tab filter change
  const handleTabChange = (tab: NotificationCategoryType) => {
    setActiveTab(tab);
    setPage(1);
  };

  // RTK Query hooks
  const {
    data: notifData,
    isLoading,
    isFetching,
    refetch,
  } = useGetNotificationsQuery(
    {
      filter: activeTab,
      search: debouncedSearch,
      page,
      limit,
    },
    {
      pollingInterval: 30000,
    }
  );

  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();
  const [clearAll, { isLoading: isClearingAll }] =
    useClearAllNotificationsMutation();
  const [markAsRead, { isLoading: isMarkingSingle }] =
    useMarkNotificationAsReadMutation();
  const [toggleRead, { isLoading: isTogglingRead }] =
    useToggleNotificationReadMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const notifications = notifData?.items || [];
  const total = notifData?.total || 0;
  const unreadCount = notifData?.unreadCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Action handlers
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markAsRead(id).unwrap();
      toast.success(res?.message || "Notification marked as read");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark notification as read");
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const res = await toggleRead(id).unwrap();
      toast.success(
        res?.message ||
          (res.isRead ? "Marked as read" : "Marked as unread")
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle read status");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await markAllAsRead().unwrap();
      toast.success(res?.message || "All notifications marked as read");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await deleteNotification(id).unwrap();
      toast.success(res?.message || "Notification removed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove notification");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to permanently clear all notifications?")) {
      return;
    }
    try {
      const res = await clearAll().unwrap();
      toast.success(res?.message || "All notifications cleared");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear notifications");
    }
  };

  const getIcon = (type: string) => {
    const normalizedType = type?.toUpperCase() || "";
    switch (normalizedType) {
      case "ORDERS":
      case "ORDER":
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case "TICKETS":
      case "TICKET":
        return <Ticket className="w-5 h-5 text-blue-400" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "SUCCESS":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "SYSTEM":
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
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
            {isFetching && !isLoading && (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
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
              disabled={isMarkingAll}
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-[#1b253d] hover:bg-[#26375c] border border-[#26375c] text-white text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isMarkingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              disabled={isClearingAll}
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isClearingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
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
                  onClick={() => handleTabChange(tab)}
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-[#0b1220] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-[#131b2e] rounded-3xl p-16 border border-[#1F2E4D] text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">
              Loading notification feed...
            </p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`w-full bg-[#131b2e] rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.isRead
                  ? "border-blue-500/40 bg-[#131b2e] shadow-md shadow-blue-500/5 ring-1 ring-blue-500/20"
                  : "border-[#1F2E4D] hover:border-slate-700 opacity-90"
              }`}
            >
              {/* Left Side: Icon & Details */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
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
                    {item.category && (
                      <span className="bg-[#0b1220] text-slate-400 border border-[#1F2E4D] text-[10px] font-medium px-2 py-0.2 rounded-md">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl break-words">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDisplayTime(item)}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1F2E4D]/60 justify-end">
                {item.link && (
                  <Link
                    to={item.link}
                    onClick={() => {
                      if (!item.isRead) handleMarkAsRead(item.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </Link>
                )}

                {/* Toggle Read/Unread */}
                <button
                  type="button"
                  onClick={() => handleToggleRead(item.id)}
                  title={item.isRead ? "Mark as Unread" : "Mark as Read"}
                  className={`p-2 rounded-xl bg-[#0b1220] border border-[#1F2E4D] transition-colors cursor-pointer ${
                    item.isRead
                      ? "hover:bg-[#1a243d] text-slate-400 hover:text-blue-400"
                      : "hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {item.isRead ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>

                {/* Delete button */}
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
              {searchInput
                ? "Try adjusting your search filter."
                : "You're all caught up! New alerts and activity feeds will show up here."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#131b2e] px-4 py-3 rounded-2xl border border-[#1F2E4D]">
          <div className="text-xs text-slate-400">
            Showing <span className="text-white font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="text-white font-medium">
              {Math.min(page * limit, total)}
            </span>{" "}
            of <span className="text-white font-medium">{total}</span> alerts
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-[#0b1220] border border-[#1F2E4D] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-300 px-2 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#0b1220] border border-[#1F2E4D] text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/redux/features/manager/Notifications/notificationsApi";

interface NotificationsProps {
  onPreferencesChange?: (preferences: {
    emailAlerts: boolean;
    inventoryAlerts: boolean;
    syncAlerts: boolean;
  }) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  onPreferencesChange,
}) => {
  const { data: preferences, isLoading } = useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isUpdating }] =
    useUpdateNotificationPreferencesMutation();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [syncErrorAlerts, setSyncErrorAlerts] = useState(false);

  useEffect(() => {
    if (preferences) {
      setEmailAlerts(preferences.emailAlerts ?? true);
      setLowStockAlerts(preferences.lowStockAlerts ?? true);
      setSyncErrorAlerts(preferences.syncErrorAlerts ?? false);
    }
  }, [preferences]);

  const handleUpdate = async (patch: {
    emailAlerts?: boolean;
    lowStockAlerts?: boolean;
    syncErrorAlerts?: boolean;
  }) => {
    try {
      const res = await updatePreferences(patch).unwrap();
      toast.success(res?.message || "Notification preferences updated");
      if (onPreferencesChange) {
        onPreferencesChange({
          emailAlerts: patch.emailAlerts ?? emailAlerts,
          inventoryAlerts: patch.lowStockAlerts ?? lowStockAlerts,
          syncAlerts: patch.syncErrorAlerts ?? syncErrorAlerts,
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update preferences");
    }
  };

  const toggleEmail = () => {
    const updated = !emailAlerts;
    setEmailAlerts(updated);
    handleUpdate({ emailAlerts: updated });
  };

  const toggleLowStock = () => {
    const updated = !lowStockAlerts;
    setLowStockAlerts(updated);
    handleUpdate({ lowStockAlerts: updated });
  };

  const toggleSync = () => {
    const updated = !syncErrorAlerts;
    setSyncErrorAlerts(updated);
    handleUpdate({ syncErrorAlerts: updated });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#131b2e] rounded-3xl p-12 border border-[#1F2E4D] shadow-sm flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300 animate-in fade-in duration-300 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Notification Preferences
        </h2>
        {isUpdating && (
          <div className="flex items-center gap-1.5 text-xs text-blue-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>
      <div className="w-full h-px bg-[#1F2E4D]" />

      <div className="space-y-4 max-w-2xl">
        {/* Email Alerts */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b1220] border border-[#1F2E4D]">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Email Alerts
            </h4>
            <p className="text-xs text-slate-400">
              Receive daily sales and settlement reports via email.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleEmail}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              emailAlerts ? "bg-orange-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                emailAlerts ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Inventory / Low Stock Alerts */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b1220] border border-[#1F2E4D]">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Low Stock Notifications
            </h4>
            <p className="text-xs text-slate-400">
              Get notified when products drop below 5 units.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleLowStock}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              lowStockAlerts ? "bg-orange-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                lowStockAlerts ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* POS Sync Alerts */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b1220] border border-[#1F2E4D]">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Sync Error Notifications
            </h4>
            <p className="text-xs text-slate-400">
              Instant alert when a POS terminal fails to synchronize.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSync}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              syncErrorAlerts ? "bg-orange-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                syncErrorAlerts ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

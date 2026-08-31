import React, { useState } from "react";

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
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [syncAlerts, setSyncAlerts] = useState(false);

  const toggleEmail = () => {
    const updated = !emailAlerts;
    setEmailAlerts(updated);
    if (onPreferencesChange) {
      onPreferencesChange({
        emailAlerts: updated,
        inventoryAlerts,
        syncAlerts,
      });
    }
  };

  const toggleInventory = () => {
    const updated = !inventoryAlerts;
    setInventoryAlerts(updated);
    if (onPreferencesChange) {
      onPreferencesChange({
        emailAlerts,
        inventoryAlerts: updated,
        syncAlerts,
      });
    }
  };

  const toggleSync = () => {
    const updated = !syncAlerts;
    setSyncAlerts(updated);
    if (onPreferencesChange) {
      onPreferencesChange({
        emailAlerts,
        inventoryAlerts,
        syncAlerts: updated,
      });
    }
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300 animate-in fade-in duration-300 space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Notification Preferences
        </h2>
        <div className="w-full h-px bg-[#1F2E4D] mt-3" />
      </div>

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

        {/* Inventory Alerts */}
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
            onClick={toggleInventory}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              inventoryAlerts ? "bg-orange-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                inventoryAlerts ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Sync Alerts */}
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
              syncAlerts ? "bg-orange-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                syncAlerts ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

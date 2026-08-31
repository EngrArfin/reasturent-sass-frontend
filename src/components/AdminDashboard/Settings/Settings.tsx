import React, { useState } from "react";
import { User, Shield, Bell } from "lucide-react";
import AccountDetails from "./AccountDetails";
import SecurityAndPin from "./SecurityAndPin";
import Notifications from "./Notifications";

type SettingsTab = "profile" | "security" | "notifications";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="w-full space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Settings & Preferences
        </h1>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1F2E4D] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & PIN</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* ================= TAB CONTENTS ================= */}
      {activeTab === "profile" && <AccountDetails />}
      {activeTab === "security" && <SecurityAndPin />}
      {activeTab === "notifications" && <Notifications />}
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import { Save, User, Shield, Bell, Lock } from "lucide-react";
import { toast } from "sonner";

interface ProfileState {
    fullName: string;
    role: string;
    email: string;
    loginPin: string;
    avatar: string;
}

const initialProfile: ProfileState = {
    fullName: "Olivia Rhye",
    role: "Store Manager",
    email: "manager@rene-pos.com",
    loginPin: "1234",
    avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<ProfileState>(initialProfile);
    const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

    // Security password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Notification toggles
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [inventoryAlerts, setInventoryAlerts] = useState(true);
    const [syncAlerts, setSyncAlerts] = useState(false);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile.fullName.trim()) {
            toast.error("Please enter full name");
            return;
        }

        if (!profile.email.trim()) {
            toast.error("Please enter professional email");
            return;
        }

        if (!profile.loginPin.trim() || profile.loginPin.length < 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        toast.success("Account identity details updated successfully!");
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword) {
            toast.error("Please enter current password");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

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
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${activeTab === "profile"
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
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${activeTab === "security"
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
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${activeTab === "notifications"
                        ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
                        }`}
                >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                </button>
            </div>

            {/* ================= TAB 1: ACCOUNT DETAILS ================= */}
            {activeTab === "profile" && (
                <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300 animate-in fade-in duration-300">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                        {/* Header / Profile Info */}
                        <div className="space-y-4">
                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                Account Details
                            </h2>
                            <div className="w-full h-px bg-[#1F2E4D]" />

                            <div className="flex items-center gap-4 pt-2">
                                <div className="relative">
                                    <img
                                        src={profile.avatar}
                                        alt={profile.fullName}
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#1F2E4D] shadow-sm"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#131b2e]" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                        Manager Profile
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-400">
                                        Manage your personal account details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Inputs Grid (2 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) =>
                                        setProfile({ ...profile, fullName: e.target.value })
                                    }
                                    placeholder="Olivia Rhye"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={profile.role}
                                    onChange={(e) =>
                                        setProfile({ ...profile, role: e.target.value })
                                    }
                                    placeholder="Store Manager"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
                                />
                            </div>

                            {/* Professional Email */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    Professional Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) =>
                                        setProfile({ ...profile, email: e.target.value })
                                    }
                                    placeholder="manager@rene-pos.com"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
                                />
                            </div>

                            {/* Login Pin */}
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    Login Pin
                                </label>
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={profile.loginPin}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            loginPin: e.target.value.replace(/\D/g, ""),
                                        })
                                    }
                                    placeholder="1234"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner font-mono tracking-widest"
                                />
                            </div>
                        </div>

                        {/* Bottom Right Action Button */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>Update identity</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ================= TAB 2: SECURITY ================= */}
            {activeTab === "security" && (
                <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300 animate-in fade-in duration-300">
                    <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
                        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            Change Password
                        </h2>
                        <div className="w-full h-px bg-[#1F2E4D]" />

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-slate-300">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350]"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Save New Password</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ================= TAB 3: NOTIFICATIONS ================= */}
            {activeTab === "notifications" && (
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
                                <h4 className="text-sm font-semibold text-white">Email Alerts</h4>
                                <p className="text-xs text-slate-400">
                                    Receive daily sales and settlement reports via email.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${emailAlerts ? "bg-emerald-500" : "bg-slate-700"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${emailAlerts ? "right-0.5" : "left-0.5"
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
                                onClick={() => setInventoryAlerts(!inventoryAlerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${inventoryAlerts ? "bg-emerald-500" : "bg-slate-700"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${inventoryAlerts ? "right-0.5" : "left-0.5"
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
                                onClick={() => setSyncAlerts(!syncAlerts)}
                                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${syncAlerts ? "bg-emerald-500" : "bg-slate-700"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${syncAlerts ? "right-0.5" : "left-0.5"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;

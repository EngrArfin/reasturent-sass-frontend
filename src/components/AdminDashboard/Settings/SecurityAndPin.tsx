import React, { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
} from "@/redux/features/auth/authApi";
import { useChangeUserPinMutation } from "@/redux/features/auth/userApi";

const SecurityAndPin: React.FC = () => {
  const { data: profile } = useGetProfileQuery();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [changePin, { isLoading: isChangingPin }] = useChangeUserPinMutation();

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Quick Login PIN fields
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
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

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      toast.success(res?.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.error || "Failed to update password. Check your current password."
      );
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    if (!profile?.id) {
      toast.error("User ID not available");
      return;
    }

    try {
      const res = await changePin({
        id: profile.id,
        pin: newPin,
      }).unwrap();
      toast.success(res?.message || "Quick-login PIN updated successfully!");
      setNewPin("");
      setConfirmPin("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quick-login PIN");
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* 1. Change Account Password Card */}
      <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300">
        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Change Password
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              Min. 6 characters
            </span>
          </div>
          <div className="w-full h-px bg-[#1F2E4D]" />

          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-5 pr-12 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-5 pr-12 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-5 pr-12 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{isChangingPassword ? "Updating Password..." : "Save New Password"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Quick Login POS PIN Card */}
      <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300">
        <form onSubmit={handleUpdatePin} className="space-y-6 max-w-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Quick-Login PIN
                </h2>
                <p className="text-xs text-slate-400">
                  4-digit numerical code for rapid terminal & POS sign-in
                </p>
              </div>
            </div>
            {profile?.pin && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-[11px] font-mono tracking-widest text-slate-300">
                Current: {profile.pin}
              </span>
            )}
          </div>
          <div className="w-full h-px bg-[#1F2E4D]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                New 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="4 digits (e.g. 1234)"
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 text-center font-mono tracking-widest focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300">
                Confirm 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Repeat 4 digits"
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 text-center font-mono tracking-widest focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              type="submit"
              disabled={isChangingPin || newPin.length !== 4}
              className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-purple-500/40 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isChangingPin ? (
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              )}
              <span>{isChangingPin ? "Updating PIN..." : "Update Quick-Login PIN"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityAndPin;

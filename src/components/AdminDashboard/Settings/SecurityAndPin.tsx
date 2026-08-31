import React, { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface SecurityAndPinProps {
  onPasswordChange?: (current: string, next: string) => void;
}

const SecurityAndPin: React.FC<SecurityAndPinProps> = ({
  onPasswordChange,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (onPasswordChange) {
      onPasswordChange(currentPassword, newPassword);
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
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
  );
};

export default SecurityAndPin;

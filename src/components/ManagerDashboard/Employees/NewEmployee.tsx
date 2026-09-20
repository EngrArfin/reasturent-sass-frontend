import React, { useState } from "react";
import { X, Save, UserPlus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCreateEmployeeMutation } from "@/redux/features/auth/userApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";

export type EmployeeRole = "Manager" | "Server" | "Kitchen" | "Cashier";

interface NewEmployeeProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const roleOptions: { label: string; value: string; desc: string }[] = [
  { label: "Manager", value: "manager", desc: "Full floor & staff access" },
  { label: "Server", value: "server", desc: "Table ordering & order status" },
  { label: "Kitchen", value: "kitchen", desc: "Kitchen Display System (KDS)" },
  { label: "Cashier", value: "cashier", desc: "Billing, checkout & payments" },
];

const NewEmployee: React.FC<NewEmployeeProps> = ({ onClose, onSuccess }) => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("server");
  const [pin, setPin] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleGeneratePin = () => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(randomPin);
    toast.info(`Generated 4-digit PIN: ${randomPin}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter the employee name");
      return;
    }

    if (!role) {
      toast.error("Please select a system role");
      return;
    }

    if (!pin.trim() || pin.length !== 4) {
      toast.error("Please enter a valid 4-digit quick-login PIN");
      return;
    }

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      name.trim()
    )}`;

    try {
      const currentRole = (
        currentUser?.role ||
        currentUser?.systemRole ||
        ""
      ).toLowerCase();
      const isManager = currentRole === "manager";

      const payload: {
        name: string;
        role: string;
        pin: string;
        email?: string;
        password?: string;
        avatar?: string;
        businessId?: string;
        status?: string;
        isApproved?: boolean;
        isActive?: boolean;
      } = {
        name: name.trim(),
        role: role.toLowerCase(),
        pin: pin.trim(),
        avatar: avatarUrl,
        status: isManager ? "PENDING" : "APPROVED",
        isApproved: !isManager,
        isActive: !isManager,
      };

      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      if (password.trim()) {
        payload.password = password.trim();
      }

      if (currentUser?.businessId) {
        payload.businessId = currentUser.businessId;
      }

      await createEmployee(payload).unwrap();

      if (isManager) {
        toast.success(
          `Employee "${name.trim()}" created! Awaiting Supervisor approval before login access.`
        );
      } else {
        toast.success(
          `Employee "${name.trim()}" created & approved with PIN ${pin}!`
        );
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      const message =
        err?.data?.message || err?.error || "Failed to create employee profile";
      toast.error(typeof message === "string" ? message : JSON.stringify(message));
    }
  };

  const selectedRoleObj = roleOptions.find(
    (r) => r.value === role || r.label.toLowerCase() === role.toLowerCase()
  );

  return (
    <div className="w-full bg-[#131b2e] rounded-2xl p-6 sm:p-7 border border-[#1F2E4D] shadow-xl mb-8 transition-all animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-sm">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Add New Employee Profile
            </h2>
            <p className="text-xs text-slate-400">
              Create a staff account with role permissions and quick 4-digit POS
              PIN.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a243b] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Employee Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Employee Name *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#0b101d] text-white placeholder-slate-500 border border-[#1F2E4D] focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all shadow-inner"
              required
            />
          </div>

          {/* System Role */}
          <div className="space-y-2 relative">
            <label className="text-xs font-semibold text-slate-300">
              System Role *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full bg-[#0b101d] text-left text-white border border-[#1F2E4D] focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm flex items-center justify-between transition-all cursor-pointer shadow-inner"
              >
                <span className="capitalize font-medium">
                  {selectedRoleObj?.label || "Select role"}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isRoleDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-[#131b2e] border border-[#1F2E4D] rounded-xl shadow-2xl overflow-hidden py-1 divide-y divide-[#1F2E4D]/40 animate-in fade-in zoom-in-95 duration-150">
                  {roleOptions.map((roleOption) => (
                    <button
                      key={roleOption.value}
                      type="button"
                      onClick={() => {
                        setRole(roleOption.value);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                        role.toLowerCase() === roleOption.value.toLowerCase()
                          ? "bg-blue-600/20 text-blue-400 font-semibold"
                          : "text-slate-300 hover:bg-[#1a243b] hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {roleOption.label}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {roleOption.desc}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick-Login PIN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                4-Digit POS PIN *
              </label>
              <button
                type="button"
                onClick={handleGeneratePin}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto PIN</span>
              </button>
            </div>
            <input
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="1234"
              className="w-full bg-[#0b101d] text-white placeholder-slate-500 border border-[#1F2E4D] focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all font-mono tracking-widest font-bold shadow-inner text-center sm:text-left"
              required
            />
          </div>

          {/* Login Email Address (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[11px] text-slate-500 font-normal">
                (Optional)
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@restaurant.com"
              className="w-full bg-[#0b101d] text-white placeholder-slate-500 border border-[#1F2E4D] focus:border-blue-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F2E4D]/40">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Secure defaults will automatically be configured if optional credentials
            are omitted.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Employee...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Employee</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;

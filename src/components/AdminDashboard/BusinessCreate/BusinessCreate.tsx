import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { toast } from "react-hot-toast";

interface RoleOption {
  id: string;
  name: string;
  label: string;
  required?: boolean;
}

const roleOptions: RoleOption[] = [
  {
    id: "supervisor",
    name: "supervisor",
    label: "Supervisor / Owner (Required)",
    required: true,
  },
  {
    id: "manager",
    name: "manager",
    label: "Manager (Requires Supervisor Approval)",
  },
  {
    id: "server",
    name: "server",
    label: "Server",
  },
  {
    id: "cashier",
    name: "cashier",
    label: "Cashier",
  },
  {
    id: "kitchen_staff",
    name: "kitchen_staff",
    label: "Kitchen Staff",
  },
];

const availableRoles = [
  "Supervisor (Restaurant Owner)",
  "Manager",
  "Server",
  "Cashier",
  "Kitchen Staff",
  "Restaurant Admin",
  "Super Admin",
];

const BusinessCreate: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>("");
  const [supervisorEmail, setSupervisorEmail] = useState<string>("");
  const [supervisorPin, setSupervisorPin] = useState<string>("");
  const [roleType, setRoleType] = useState<string>("");
  const [subscriptionFee, setSubscriptionFee] = useState<string>("");

  // Selected roles state (Supervisor is always true/required)
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: boolean }>({
    supervisor: true,
    manager: true,
    server: true,
    cashier: true,
    kitchen_staff: true,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle role selection
  const handleToggleRole = (roleId: string, required?: boolean) => {
    if (required) return;
    setSelectedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  // Active roles labels
  const activeRolesLabels = roleOptions
    .filter((role) => selectedRoles[role.id])
    .map((role) => (role.required ? "Supervisor" : role.label));

  const totalEnabledCount = activeRolesLabels.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      toast.error("Please enter a business name");
      return;
    }

    if (!supervisorEmail.trim()) {
      toast.error("Please enter supervisor (owner) email address");
      return;
    }

    if (!supervisorPin.trim() || supervisorPin.length < 4) {
      toast.error("Please enter a valid 4-digit supervisor PIN");
      return;
    }

    toast.success(
      `Tenant "${businessName.trim()}" registered! Supervisor: ${supervisorEmail} (PIN: ${supervisorPin}) with ${totalEnabledCount} roles.`
    );

    setBusinessName("");
    setSupervisorEmail("");
    setSupervisorPin("");
    setRoleType("");
    setSubscriptionFee("");
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-2xl border border-[#1F2E4D] shadow-sm p-5 sm:p-8 lg:p-10 text-white min-h-[calc(100vh-140px)]">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2">
        Create New Business
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 mb-8">
        Register a new restaurant tenant with its primary Supervisor (Restaurant Owner). The Supervisor will control all staff & manager login approvals.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business & Supervisor Credentials Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Business Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Business Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Le Bistro Douala"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
                required
              />
            </div>
          </div>

          {/* Supervisor Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Supervisor (Owner) Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="supervisor@restaurant.com"
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
                required
              />
            </div>
          </div>

          {/* Supervisor 4-Digit PIN */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Supervisor 4-Digit PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                placeholder="e.g. 1234"
                value={supervisorPin}
                onChange={(e) => setSupervisorPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner tracking-widest font-mono"
                required
              />
            </div>
          </div>

          {/* Role Type Dropdown */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Role Type / Plan
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm font-medium text-white flex items-center justify-between hover:bg-[#0e172a] focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all cursor-pointer text-left shadow-inner"
              >
                <span className={roleType ? "text-white" : "text-slate-400"}>
                  {roleType || "Select role"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-[#131b2e] rounded-2xl border border-[#1F2E4D] shadow-xl py-2 max-h-60 overflow-y-auto">
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setRoleType(role);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-slate-300 hover:bg-[#0b1220] hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{role}</span>
                      {roleType === role && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Monthly Subscription Fee */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Monthly Subscription Fee
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="$49.99 / month"
                value={subscriptionFee}
                onChange={(e) => setSubscriptionFee(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Enabled Roles Section */}
        <div className="pt-4">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Enabled Roles for this Business
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Select which employee roles this business needs, Manager is always included,
            </p>
          </div>

          {/* Role Pill Rows */}
          <div className="space-y-3">
            {roleOptions.map((role) => {
              const isChecked = !!selectedRoles[role.id];
              const isRequired = role.required;

              return (
                <div
                  key={role.id}
                  onClick={() => handleToggleRole(role.id, isRequired)}
                  className={`w-full px-5 py-3 rounded-full border flex items-center gap-3 transition-all select-none ${isRequired
                    ? "bg-[#0b1220]/60 border-[#1F2E4D]/60 cursor-default opacity-85"
                    : isChecked
                      ? "bg-[#0b1220] border-[#1F2E4D] hover:bg-[#0e172a] cursor-pointer shadow-sm ring-1 ring-blue-500/20"
                      : "bg-[#0b1220]/70 border-[#1F2E4D] hover:bg-[#0e172a] cursor-pointer hover:border-slate-600"
                    }`}
                >
                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${isRequired
                      ? "bg-[#1a243d] text-slate-400"
                      : isChecked
                        ? "bg-[#052350] border border-blue-500/50 text-blue-400 shadow-sm"
                        : "border-2 border-slate-600 bg-transparent"
                      }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Role Label */}
                  <span
                    className={`text-sm font-medium ${isRequired
                      ? "text-slate-400"
                      : isChecked
                        ? "text-white"
                        : "text-slate-300"
                      }`}
                  >
                    {role.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Roles Dynamic Text */}
          <div className="mt-4 text-xs sm:text-sm text-slate-400">
            Selected:{" "}
            <span className="text-emerald-400 font-semibold">
              {activeRolesLabels.join(", ")}
            </span>
          </div>
        </div>

        {/* Bottom Right Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            Create Tenant ({totalEnabledCount} roles enabled)
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessCreate;

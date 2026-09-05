import React, { useState } from "react";
import { X, Save, UserPlus } from "lucide-react";
import { toast } from "sonner";

export type EmployeeRole = "Manager" | "Server" | "Kitchen" | "Cashier";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  pin: string;
  avatar: string;
}

interface NewEmployeeProps {
  onAddEmployee: (employee: Omit<Employee, "id">) => void;
  onClose: () => void;
}

const roleOptions: EmployeeRole[] = ["Manager", "Server", "Kitchen", "Cashier"];

const NewEmployee: React.FC<NewEmployeeProps> = ({ onAddEmployee, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<EmployeeRole | "">("");
  const [pin, setPin] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter the employee name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter employee login email");
      return;
    }

    if (!role) {
      toast.error("Please select a system role");
      return;
    }

    if (!pin.trim() || pin.length < 4) {
      toast.error("Please enter a valid 4-digit PIN");
      return;
    }

    const randomAvatar = `https://images.unsplash.com/photo-${
      1500000000000 + Math.floor(Math.random() * 90000000)
    }?auto=format&fit=crop&w=150&q=80`;

    onAddEmployee({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role as EmployeeRole,
      pin: pin.trim(),
      avatar: randomAvatar,
    });

    toast.success(`Employee ${name} added successfully with PIN ${pin}!`);
    onClose();
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-2xl p-6 sm:p-7 border border-[#1F2E4D] shadow-lg mb-8 transition-all animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            New Employee Profile
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a243b] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Employee Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">
              Employee Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#0b101d] text-white placeholder-slate-500 border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Employee Email */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">
              Login Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. cashier1@restaurant.com"
              className="w-full bg-[#0b101d] text-white placeholder-slate-500 border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* System Role */}
          <div className="space-y-2 relative">
            <label className="text-xs font-medium text-slate-400">
              System Role
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full bg-[#0b101d] text-left text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm flex items-center justify-between focus:outline-none focus:border-blue-500 transition-all"
              >
                <span className={role ? "text-white" : "text-slate-500"}>
                  {role || "Select role"}
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
                <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-[#131b2e] border border-[#1F2E4D] rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                  {roleOptions.map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => {
                        setRole(roleOption);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        role === roleOption
                          ? "bg-blue-500/20 text-blue-400 font-medium"
                          : "text-slate-300 hover:bg-[#1a243b] hover:text-white"
                      }`}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick-Login PIN */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400">
              Quick-Login PIN (4 digits)
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 1234"
              className="w-full bg-[#0b101d] text-white placeholder-slate-500 border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono tracking-widest"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewEmployee;

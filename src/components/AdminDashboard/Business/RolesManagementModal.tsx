import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { IBusiness } from "@/redux/features/admin/business/businessType";
import { useUpdateBusinessMutation } from "@/redux/features/admin/business/businessApi";

interface RolesManagementModalProps {
  business: IBusiness;
  onClose: () => void;
  onSuccess?: (updatedRoles: string[]) => void;
}

const AVAILABLE_ROLES = [
  {
    id: "supervisor",
    label: "Supervisor / Owner",
    description: "Tenant owner with administrative privileges (Always enabled)",
    required: true,
  },
  {
    id: "manager",
    label: "Manager",
    description: "Day-to-day operations, staff & inventory management",
  },
  {
    id: "server",
    label: "Server",
    description: "Order taking and table management",
  },
  {
    id: "cashier",
    label: "Cashier",
    description: "Payment processing and billing",
  },
  {
    id: "kitchen",
    label: "Kitchen Staff",
    description: "Order preparation and status updates",
  },
];

const RolesManagementModal = ({
  business,
  onClose,
  onSuccess,
}: RolesManagementModalProps) => {
  const [updateBusiness, { isLoading }] = useUpdateBusinessMutation();

  const [rolesState, setRolesState] = useState<Record<string, boolean>>({
    supervisor: true,
    manager: true,
    server: false,
    kitchen: false,
    cashier: false,
  });

  useEffect(() => {
    if (business?.allowedRoles) {
      const state: Record<string, boolean> = {
        supervisor: true,
      };
      AVAILABLE_ROLES.forEach((r) => {
        state[r.id] = business.allowedRoles.includes(r.id);
      });
      // Ensure supervisor is true
      state.supervisor = true;
      setRolesState(state);
    }
  }, [business]);

  const handleRoleChange = (roleId: string, required?: boolean) => {
    if (required) return;
    setRolesState((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const allowedRoles = Object.keys(rolesState).filter((key) => rolesState[key]);

      await updateBusiness({
        id: business.id,
        payload: {
          allowedRoles,
        },
      }).unwrap();

      toast.success("Allowed roles updated successfully");
      if (onSuccess) {
        onSuccess(allowedRoles);
      }
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.error || "Failed to update business roles.";
      toast.error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[0.5px]">
      <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl shadow-xl w-full max-w-xl mx-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2E4D]">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Manage Allowed Roles
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {business.businessName || business.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1 hover:bg-[#1a243d] rounded-full"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-300">
                Enable or disable roles for this business. Changes take effect immediately across all tenant logins.
              </p>
            </div>

            {AVAILABLE_ROLES.map((role) => {
              const isChecked = !!rolesState[role.id];
              return (
                <div
                  key={role.id}
                  className={`flex items-center justify-between p-3.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl transition ${
                    role.required ? "opacity-80" : "hover:border-slate-500"
                  }`}
                >
                  <div className="flex-1">
                    <label
                      className={`flex items-center gap-3 ${
                        role.required ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={role.required}
                        checked={isChecked}
                        onChange={() => handleRoleChange(role.id, role.required)}
                        className="w-5 h-5 rounded border-[#1F2E4D] bg-[#131b2e] text-[#052350] focus:ring-[#052350] cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{role.label}</span>
                          {role.required && (
                            <span className="text-[10px] uppercase font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {role.description}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1F2E4D]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#1a243d] border border-[#1F2E4D] rounded-lg hover:bg-[#232f4c] hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#052350] border border-[#1F2E4D] rounded-lg hover:bg-[#061E49] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesManagementModal;

import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

export interface Business {
  id: string;
  name: string;
  industry: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  subscriptionFee: number;
  lastSync: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface RolesManagementModalProps {
  business: Business;
  roles: Role[];
  onClose: () => void;
  onSuccess?: (updatedRoles: { server: boolean; kitchen: boolean; cashier: boolean }) => void;
}

const RolesManagementModal = ({
  business,
  roles,
  onClose,
  onSuccess,
}: RolesManagementModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [rolesState, setRolesState] = useState({
    server: false,
    kitchen: false,
    cashier: false,
  });

  useEffect(() => {
    if (roles) {
      // Initialize checkboxes based on existing roles
      const initialRoles = {
        server: roles.some((role) => role.name === "server" && role.isActive),
        kitchen: roles.some((role) => role.name === "kitchen" && role.isActive),
        cashier: roles.some((role) => role.name === "cashier" && role.isActive),
      };
      setRolesState(initialRoles);
    }
  }, [roles]);

  const handleRoleChange = (roleName: keyof typeof rolesState) => {
    setRolesState((prev) => ({
      ...prev,
      [roleName]: !prev[roleName],
    }));
  };

  const handleSubmit = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Roles updated successfully");
      onSuccess?.(rolesState);
      onClose();
    }, 600);
  };

  const getRoleDetails = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName);
    if (role) {
      return {
        id: role.id,
        isActive: role.isActive,
        createdAt: new Date(role.createdAt).toLocaleDateString(),
      };
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[0.5px]">
      <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl shadow-xl w-full max-w-xl mx-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2E4D]">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Manage Roles
            </h2>
            <p className="text-sm text-slate-400 mt-1">{business.name}</p>
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
                Enable or disable roles for this business. Changes will take
                effect immediately.
              </p>
            </div>

            {/* Server Role */}
            <div className="flex items-center justify-between p-3 bg-[#1a243d] border border-[#1F2E4D] rounded-lg">
              <div className="flex-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rolesState.server}
                    onChange={() => handleRoleChange("server")}
                    className="w-5 h-5 rounded border-[#1F2E4D] bg-[#131b2e] text-[#052350] focus:ring-[#052350]"
                  />
                  <div>
                    <span className="font-medium text-white">Server</span>
                    <p className="text-sm text-slate-400">
                      Order taking and table management
                    </p>
                  </div>
                </label>
              </div>
              {getRoleDetails("server") && (
                <span className="text-xs text-slate-400">
                  ID: {getRoleDetails("server")?.id.slice(0, 8)}...
                </span>
              )}
            </div>

            {/* Kitchen Role */}
            <div className="flex items-center justify-between p-3 bg-[#1a243d] border border-[#1F2E4D] rounded-lg">
              <div className="flex-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rolesState.kitchen}
                    onChange={() => handleRoleChange("kitchen")}
                    className="w-5 h-5 rounded border-[#1F2E4D] bg-[#131b2e] text-[#052350] focus:ring-[#052350]"
                  />
                  <div>
                    <span className="font-medium text-white">Kitchen</span>
                    <p className="text-sm text-slate-400">
                      Order preparation and status updates
                    </p>
                  </div>
                </label>
              </div>
              {getRoleDetails("kitchen") && (
                <span className="text-xs text-slate-400">
                  ID: {getRoleDetails("kitchen")?.id.slice(0, 8)}...
                </span>
              )}
            </div>

            {/* Cashier Role */}
            <div className="flex items-center justify-between p-3 bg-[#1a243d] border border-[#1F2E4D] rounded-lg">
              <div className="flex-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rolesState.cashier}
                    onChange={() => handleRoleChange("cashier")}
                    className="w-5 h-5 rounded border-[#1F2E4D] bg-[#131b2e] text-[#052350] focus:ring-[#052350]"
                  />
                  <div>
                    <span className="font-medium text-white">Cashier</span>
                    <p className="text-sm text-slate-400">
                      Payment processing and billing
                    </p>
                  </div>
                </label>
              </div>
              {getRoleDetails("cashier") && (
                <span className="text-xs text-slate-400">
                  ID: {getRoleDetails("cashier")?.id.slice(0, 8)}...
                </span>
              )}
            </div>

            {/* Manager Role Info */}
            <div className="mt-4 p-3 bg-[#1a243d] border border-[#1F2E4D] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
                <div>
                  <span className="font-medium text-white">Manager</span>
                  <p className="text-sm text-slate-400">
                    This role is always enabled for all businesses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1F2E4D]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#1a243d] border border-[#1F2E4D] rounded-lg hover:bg-[#232f4c] hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#052350] border border-[#1F2E4D] rounded-lg hover:bg-[#061E49] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolesManagementModal;

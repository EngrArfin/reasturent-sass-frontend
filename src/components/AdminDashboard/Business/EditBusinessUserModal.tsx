import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { IBusinessUser } from "@/redux/features/admin/business/businessType";
import { useChangeUserStatusMutation, useChangeUserRoleMutation } from "@/redux/features/auth/userApi";
import { Loader2 } from "lucide-react";

interface EditBusinessUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  user: IBusinessUser;
  allowedRoles?: string[];
  onSuccess?: () => void;
}

export const EditBusinessUserModal = ({
  isOpen,
  onClose,
  user,
  allowedRoles = ["manager", "server", "cashier", "kitchen"],
  onSuccess,
}: EditBusinessUserModalProps) => {
  const [changeUserStatus, { isLoading: isStatusLoading }] = useChangeUserStatusMutation();
  const [changeUserRole, { isLoading: isRoleLoading }] = useChangeUserRoleMutation();

  const [role, setRole] = useState(user?.role || "server");
  const [isActive, setIsActive] = useState<boolean>(user?.isActive ?? true);

  useEffect(() => {
    if (user) {
      setRole(user.role || "");
      setIsActive(user.isActive);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      if (user.role !== role) {
        await changeUserRole({
          id: user.id,
          payload: { role },
        }).unwrap();
      }

      if (user.isActive !== isActive) {
        await changeUserStatus({
          id: user.id,
          payload: { status: isActive ? "ACTIVE" : "INACTIVE" },
        }).unwrap();
      }

      toast.success(`User "${user.name}" updated successfully!`);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.error || "Failed to update user profile.";
      toast.error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const isSubmitting = isStatusLoading || isRoleLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#131b2e] border border-[#1F2E4D] text-white rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Edit User - {user?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email Info */}
          <div>
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full mt-1 border rounded-lg px-3 py-2 bg-[#1a243d]/60 border-[#1F2E4D] text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="text-sm font-medium text-slate-300">Role</label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-full mt-1 bg-[#1a243d] border-[#1F2E4D] text-white cursor-pointer">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-[#131b2e] border border-[#1F2E4D] text-white rounded-lg">
                {allowedRoles.map((roleName) => (
                  <SelectItem
                    key={roleName}
                    value={roleName}
                    className="hover:bg-[#1a243d] focus:bg-[#1a243d] capitalize cursor-pointer"
                  >
                    {roleName.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Field */}
          <div>
            <label className="text-sm font-medium text-slate-300">Status</label>
            <Select
              value={isActive ? "ACTIVE" : "INACTIVE"}
              onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                setIsActive(value === "ACTIVE")
              }
            >
              <SelectTrigger className="w-full mt-1 bg-[#1a243d] border-[#1F2E4D] text-white cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#131b2e] border border-[#1F2E4D] text-white rounded-lg">
                <SelectItem value="ACTIVE" className="hover:bg-[#1a243d] focus:bg-[#1a243d] cursor-pointer">
                  Active
                </SelectItem>
                <SelectItem value="INACTIVE" className="hover:bg-[#1a243d] focus:bg-[#1a243d] cursor-pointer">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-slate-300 bg-[#1a243d] border border-[#1F2E4D] hover:bg-[#232f4c] hover:text-white rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-white bg-[#052350] border border-[#1F2E4D] hover:bg-[#061E49] rounded-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

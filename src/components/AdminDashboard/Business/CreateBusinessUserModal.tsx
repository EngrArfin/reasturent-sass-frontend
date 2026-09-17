import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { useCreateBusinessUserMutation } from "@/redux/features/admin/business/businessApi";
import { IBusinessUser } from "@/redux/features/admin/business/businessType";

interface CreateBusinessUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName?: string;
  allowedRoles?: string[];
  onSuccess?: (createdUser: IBusinessUser) => void;
}

export const CreateBusinessUserModal = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  allowedRoles = ["manager", "server", "cashier", "kitchen"],
  onSuccess,
}: CreateBusinessUserModalProps) => {
  const [createBusinessUser, { isLoading }] = useCreateBusinessUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pin: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    pin: "",
    role: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    pin: false,
    role: false,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        email: "",
        pin: "",
        role: "",
        password: "",
      });
      setErrors({
        name: "",
        email: "",
        pin: "",
        role: "",
      });
      setTouched({
        name: false,
        email: false,
        pin: false,
        role: false,
      });
    }
  }, [isOpen]);

  const validateField = (field: keyof typeof formData, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          return "Please enter a valid email address";
        return "";
      case "pin":
        if (!value) return "PIN is required";
        if (!/^\d{4}$/.test(value)) return "PIN must be exactly 4 digits";
        return "";
      case "role":
        if (!value) return "Role is required";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      pin: validateField("pin", formData.pin),
      role: validateField("role", formData.role),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field as keyof typeof touched]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, pin: true, role: true });

    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        pin: formData.pin.trim(),
        role: formData.role.trim().toLowerCase(),
        password: formData.password.trim() || undefined,
        businessId,
      };

      const result = await createBusinessUser(payload).unwrap();

      toast.success(`User "${formData.name.trim()}" created successfully!`);
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.error || "Failed to create business user.";
      toast.error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  // Filter out supervisor if needed or format role names
  const selectableRoles = allowedRoles.length > 0 ? allowedRoles : ["manager", "server", "cashier", "kitchen"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border border-[#1F2E4D] shadow-2xl rounded-2xl bg-[#131b2e]">
        <div className="px-6 py-6 space-y-6 bg-[#131b2e]">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-0 top-0 text-slate-400 hover:text-white cursor-pointer transition-colors rounded-full p-1 hover:bg-[#1a243d]"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Add New Employee / User
              </DialogTitle>
              <p className="text-sm text-slate-400 mt-1">
                {businessName ? `Add a user to ${businessName}` : "Create a new user profile"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="e.g. John Doe"
                className={`w-full border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 bg-[#1a243d] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1F2E4D] transition-all duration-200 ${
                  errors.name && touched.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#1F2E4D] hover:border-[#26354D]"
                }`}
              />
              {errors.name && touched.name && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="user@restaurant.com"
                className={`w-full border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 bg-[#1a243d] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1F2E4D] transition-all duration-200 ${
                  errors.email && touched.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#1F2E4D] hover:border-[#26354D]"
                }`}
              />
              {errors.email && touched.email && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* PIN Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                4-Digit Login PIN <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                maxLength={4}
                value={formData.pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 4) {
                    handleFieldChange("pin", value);
                  }
                }}
                onBlur={() => handleBlur("pin")}
                placeholder="e.g. 1234"
                className={`w-full border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 bg-[#1a243d] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1F2E4D] transition-all duration-200 font-mono tracking-widest ${
                  errors.pin && touched.pin
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#1F2E4D] hover:border-[#26354D]"
                }`}
              />
              {errors.pin && touched.pin && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.pin}</span>
                </div>
              )}
            </div>

            {/* Optional Password Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                Password <span className="text-slate-500 text-xs">(Optional)</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                placeholder="Optional password"
                className="w-full border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 bg-[#1a243d] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1F2E4D] transition-all duration-200"
              />
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-sm font-medium text-slate-300">
                Role <span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleFieldChange("role", value)}
              >
                <SelectTrigger
                  className={`w-full rounded-xl px-4 py-2.5 h-auto cursor-pointer bg-[#1a243d] border-[#1F2E4D] text-white hover:border-[#26354D] focus:ring-blue-500/20 ${
                    errors.role && touched.role ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select an assigned role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-[#131b2e] border border-[#1F2E4D] text-white cursor-pointer">
                  {selectableRoles.map((roleName) => (
                    <SelectItem
                      key={roleName}
                      value={roleName}
                      className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d] focus:text-white capitalize"
                    >
                      {roleName.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && touched.role && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.role}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex pt-4 justify-end gap-3 border-t border-[#1F2E4D]/50">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 cursor-pointer text-slate-300 bg-[#1a243d] border border-[#1F2E4D] hover:bg-[#232f4c] hover:text-white rounded-full transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2.5 cursor-pointer text-white bg-gradient-to-r from-[#052350] to-[#0a3a6e] border border-[#1F2E4D] rounded-full hover:from-[#061E49] hover:to-[#052350] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating User...</span>
                </>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
import { X, AlertCircle } from "lucide-react";

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface CreateBusinessUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  roles: Role[];
  onSuccess: (data: { name: string; email: string; pin: string; role: string }) => void;
}

export const CreateBusinessUserModal = ({
  isOpen,
  onClose,
  businessId,
  roles,
  onSuccess,
}: CreateBusinessUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pin: "",
    role: "",
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
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (value.trim().length > 50)
          return "Name must be less than 50 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
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
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = () => {
    setTouched({ name: true, email: true, pin: true, role: true });

    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`✨ User "${formData.name.trim()}" created successfully`);
      onSuccess(formData);
      onClose();
    }, 600);
  };

  const availableRoles = roles.filter((role) => role.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[0.2px]">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="px-6 py-0 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="relative pt-4">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-black hover:text-gray-800 cursor-pointer transition-colors rounded-full p-1 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div>
                    <DialogTitle className="text-xl font-semibold text-black">
                      Add New User
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Create a new user for this business
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
                      onBlur={() => handleBlur("name")}
                      placeholder="e.g., John Doe"
                      className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#052350]/20 focus:border-[#052350]
                  transition-all duration-200 ${
                    errors.name && touched.name
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                    />
                    {errors.name && touched.name && (
                      <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      onBlur={() => handleBlur("email")}
                      placeholder="user@example.com"
                      className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#052350]/20 focus:border-[#052350]
                  transition-all duration-200 ${
                    errors.email && touched.email
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                    />
                    {errors.email && touched.email && (
                      <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PIN Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    4-Digit PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
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
                      placeholder="Enter 4-digit PIN"
                      className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#052350]/20 focus:border-[#052350]
                  transition-all duration-200 font-mono text-lg tracking-wider ${
                    errors.pin && touched.pin
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                    />
                    {errors.pin && touched.pin && (
                      <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
                        <span>{errors.pin}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Secure 4-digit numeric PIN for user authentication
                  </p>
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleFieldChange("role", value)}
                  >
                    <SelectTrigger
                      className={`w-full rounded-xl px-4 py-2.5 h-auto cursor-pointer ${
                        errors.role && touched.role
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <SelectValue placeholder="Select a role for the user" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-white border-none cursor-pointer">
                      {availableRoles.length === 0 ? (
                        <div className="px-3 py-8 text-center">
                          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No roles available
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Please enable roles for this business first
                          </p>
                        </div>
                      ) : (
                        availableRoles.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={role.name}
                            className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 capitalize">
                                {role.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.role && touched.role && (
                    <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.role}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex pb-4 pt-4 justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 cursor-pointer text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200
              transition-all duration-200 font-medium focus:outline-none focus:ring-2
              focus:ring-gray-300 focus:ring-offset-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 cursor-pointer text-white bg-gradient-to-r from-[#052350] to-[#0a3a6e]
              rounded-full hover:from-[#061E49] hover:to-[#052350] transition-all duration-200
              font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
              hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#052350]/50
              focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <span>Create User</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

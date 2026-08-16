import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { AlertCircle } from "lucide-react";

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: "FREE" | "MONTHLY" | "YEARLY";
  amount: number;
  currency: string;
  description: string;
  isActive: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: SubscriptionPlan) => void;
  editPlan: SubscriptionPlan | null;
}

const SubscriptionModal = ({
  isOpen,
  onClose,
  onSave,
  editPlan,
}: SubscriptionModalProps) => {
  const [type, setType] = useState<"FREE" | "MONTHLY" | "YEARLY">("MONTHLY");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("0");
  const [currency, setCurrency] = useState("USD");
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState({
    description: "",
    amount: "",
  });

  const [touched, setTouched] = useState({
    description: false,
    amount: false,
  });

  // Sync state with editPlan or set defaults
  useEffect(() => {
    if (isOpen) {
      if (editPlan) {
        setType(editPlan.type);
        setDescription(editPlan.description);
        setAmount(editPlan.amount.toString());
        setCurrency(editPlan.currency);
        setIsActive(editPlan.isActive);
      } else {
        setType("MONTHLY");
        setDescription("");
        setAmount("0");
        setCurrency("USD");
        setIsActive(true);
      }
      setErrors({ description: "", amount: "" });
      setTouched({ description: false, amount: false });
    }
  }, [isOpen, editPlan]);

  // Adjust amount when type becomes FREE
  useEffect(() => {
    if (type === "FREE") {
      setAmount("0");
    }
  }, [type]);

  const validateField = (field: "description" | "amount", value: string) => {
    if (field === "description") {
      if (!value.trim()) return "Description is required";
      if (value.trim().length < 5) return "Description must be at least 5 characters";
      return "";
    }
    if (field === "amount") {
      if (type === "FREE") return "";
      if (!value.trim()) return "Amount is required";
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) return "Please enter a valid positive number";
      return "";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      description: validateField("description", description),
      amount: validateField("amount", amount),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleBlur = (field: "description" | "amount") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, field === "description" ? description : amount);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = () => {
    setTouched({ description: true, amount: true });
    if (!validateForm()) {
      toast.error("Please resolve the validation errors first.");
      return;
    }

    const planName =
      type === "FREE"
        ? "Free Plan"
        : type === "MONTHLY"
        ? "Monthly Plan"
        : "Yearly Plan";

    const savedPlan: SubscriptionPlan = {
      id: editPlan ? editPlan.id : Math.random().toString(36).substring(2, 9),
      name: planName,
      type,
      amount: type === "FREE" ? 0 : parseFloat(amount),
      currency,
      description: description.trim(),
      isActive,
    };

    onSave(savedPlan);
    toast.success(editPlan ? "Plan updated successfully!" : "Plan created successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#131b2e] border border-[#1F2E4D] text-white rounded-2xl shadow-xl p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            {editPlan ? "Edit Subscription Plan" : "Create Subscription Plan"}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Configure plan details and pricing information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {/* Plan Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">Plan Type</label>
            <Select
              value={type}
              onValueChange={(val: "FREE" | "MONTHLY" | "YEARLY") => setType(val)}
            >
              <SelectTrigger className="w-full bg-[#1a243d] border-[#1F2E4D] text-white rounded-xl py-2.5 h-auto hover:border-[#26354D] focus:ring-[#052350]/20 cursor-pointer">
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-[#131b2e] border border-[#1F2E4D] text-white">
                <SelectItem
                  value="FREE"
                  className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d] focus:text-white"
                >
                  Free Plan
                </SelectItem>
                <SelectItem
                  value="MONTHLY"
                  className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d] focus:text-white"
                >
                  Monthly Plan
                </SelectItem>
                <SelectItem
                  value="YEARLY"
                  className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d] focus:text-white"
                >
                  Yearly Plan
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (touched.description) {
                  setErrors((prev) => ({
                    ...prev,
                    description: validateField("description", e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("description")}
              placeholder="Enter plan description..."
              rows={3}
              className={`w-full border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 bg-[#1a243d] focus:outline-none focus:ring-2 focus:ring-[#052350]/20 focus:border-[#1F2E4D] transition-all duration-200 resize-none ${
                errors.description && touched.description
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : "border-[#1F2E4D] hover:border-[#26354D]"
              }`}
            />
            {errors.description && touched.description && (
              <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Amount</label>
              <input
                type="number"
                disabled={type === "FREE"}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (touched.amount) {
                    setErrors((prev) => ({
                      ...prev,
                      amount: validateField("amount", e.target.value),
                    }));
                  }
                }}
                onBlur={() => handleBlur("amount")}
                className={`w-full border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 bg-[#1a243d] focus:outline-none focus:ring-2 focus:ring-[#052350]/20 focus:border-[#1F2E4D] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.amount && touched.amount
                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                    : "border-[#1F2E4D] hover:border-[#26354D]"
                }`}
              />
              {errors.amount && touched.amount && (
                <div className="flex items-center gap-1.5 mt-1 text-red-400 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.amount}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Currency</label>
              <Select
                value={currency}
                disabled={type === "FREE"}
                onValueChange={(val) => setCurrency(val)}
              >
                <SelectTrigger className="w-full bg-[#1a243d] border-[#1F2E4D] text-white rounded-xl py-2.5 h-auto hover:border-[#26354D] focus:ring-[#052350]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-[#131b2e] border border-[#1F2E4D] text-white">
                  <SelectItem
                    value="USD"
                    className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d]"
                  >
                    USD - US Dollar
                  </SelectItem>
                  <SelectItem
                    value="EUR"
                    className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d]"
                  >
                    EUR - Euro
                  </SelectItem>
                  <SelectItem
                    value="GBP"
                    className="cursor-pointer text-white hover:bg-[#1a243d] focus:bg-[#1a243d]"
                  >
                    GBP - British Pound
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Plan Switch */}
          <div className="flex items-center justify-between p-3.5 bg-[#1a243d]/30 border border-[#1F2E4D]/30 rounded-xl">
            <span className="text-sm font-semibold text-slate-200">Active Plan</span>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                isActive ? "bg-[#0b2545]" : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  isActive ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-300 bg-[#1a243d] border border-[#1F2E4D] rounded-xl hover:bg-[#232f4c] hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-bold text-white bg-[#052350] border border-[#1F2E4D] rounded-xl hover:bg-[#061E49] transition cursor-pointer"
          >
            {editPlan ? "Save Changes" : "Create Plan"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;

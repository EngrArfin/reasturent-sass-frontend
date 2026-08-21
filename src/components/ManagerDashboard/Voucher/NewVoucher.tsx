import React, { useState, useEffect } from "react";
import { Save, ChevronDown, Check, X } from "lucide-react";
import { toast } from "sonner";

export interface VoucherItem {
  id: string;
  name: string;
  requestedBy: string;
  minPrice: number;
  originalPrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
}

interface NewVoucherProps {
  onAddVoucher: (voucher: Omit<VoucherItem, "id">) => void;
  onCancel: () => void;
  initialData?: VoucherItem | null;
}

const discountOptions = [2, 5, 10, 15, 20, 25, 30, 50];

const NewVoucher: React.FC<NewVoucherProps> = ({
  onAddVoucher,
  onCancel,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [minPrice, setMinPrice] = useState<number | string>(
    initialData?.minPrice ?? ""
  );
  const [originalPrice, setOriginalPrice] = useState<number | string>(
    initialData?.originalPrice ?? 3.5
  );
  const [discountPercent, setDiscountPercent] = useState<number>(
    initialData?.discountPercent ?? 2
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMinPrice(initialData.minPrice);
      setOriginalPrice(initialData.originalPrice);
      setDiscountPercent(initialData.discountPercent);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter voucher/product name");
      return;
    }

    const parsedMin = Number(minPrice) || 0;
    const parsedOriginal = Number(originalPrice) || 0;
    const calcDiscount = (parsedOriginal * discountPercent) / 100;
    const calcFinal = Math.max(0, parsedOriginal - calcDiscount);

    onAddVoucher({
      name: name.trim(),
      requestedBy: initialData?.requestedBy || "JOHN",
      minPrice: parsedMin,
      originalPrice: parsedOriginal,
      discountPercent: discountPercent,
      discountAmount: Number(calcDiscount.toFixed(2)),
      finalPrice: Number(calcFinal.toFixed(2)),
    });

    toast.success(
      initialData
        ? `Voucher for "${name}" updated!`
        : `Voucher for "${name}" created successfully!`
    );
    onCancel();
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-5 sm:p-7 md:p-8 border border-[#1F2E4D] shadow-sm transition-all animate-in fade-in duration-300 mb-6 text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {initialData ? "Edit Voucher" : "Add Voucher"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a243d] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Farm Chicken"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
            />
          </div>

          {/* Minimum Price */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Minimum Price
            </label>
            <input
              type="text"
              placeholder="e.g. $72"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
            />
          </div>

          {/* Off Price (Discount %) */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Off Price
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm font-medium text-white flex items-center justify-between hover:bg-[#0e172a] focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all cursor-pointer text-left shadow-inner"
              >
                <span>{discountPercent}%</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-[#131b2e] rounded-2xl border border-[#1F2E4D] shadow-xl py-2 max-h-56 overflow-y-auto">
                  {discountOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setDiscountPercent(opt);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-2.5 text-sm text-slate-300 hover:bg-[#0b1220] hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{opt}% Discount</span>
                      {discountPercent === opt && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]/60">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVoucher;

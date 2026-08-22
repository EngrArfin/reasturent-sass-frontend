import React, { useState } from "react";
import { X, CheckCircle2, CreditCard, Banknote, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { TableItem } from "./CashierCard";

interface CheckoutProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (tableId: number) => void;
}

interface DiscountOption {
  id: string;
  name: string;
  percentage: number;
}

const discountOptions: DiscountOption[] = [
  { id: "voucher-2", name: "2% Off Voucher", percentage: 2 },
  { id: "voucher-5", name: "5% Loyalty Discount", percentage: 5 },
  { id: "voucher-10", name: "10% Staff / VIP Discount", percentage: 10 },
  { id: "none", name: "No Discount (0%)", percentage: 0 },
];

const Checkout: React.FC<CheckoutProps> = ({
  table,
  isOpen,
  onClose,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountOption>(
    discountOptions[0]
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !table) return null;

  // Default items if table doesn't have custom items
  const items = table.items && table.items.length > 0
    ? table.items
    : [
        { name: "Chicken Biryani", quantity: 4, price: 12.99 },
        { name: "Mango Lassi", quantity: 4, price: 4.5 },
        { name: "Bottled Water", quantity: 2, price: 1.5 },
      ];

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * selectedDiscount.percentage) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleDone = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `Payment of $${finalTotal.toFixed(2)} received via ${
          paymentMethod === "card" ? "Card" : "Cash"
        } for Table ${table.tableNumber}!`
      );
      onPaymentComplete(table.id);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Modal Dialog Box */}
      <div
        className="relative w-full max-w-[420px] rounded-3xl bg-[#131b2e] border border-[#1F2E4D] p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F2E4D]">
          <h2 className="text-xl font-bold text-white tracking-tight">Checkout</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ordered Items Box */}
        <div className="mt-4 bg-[#0b1220] border border-[#1F2E4D] rounded-2xl p-4 space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm text-slate-300"
            >
              <span className="font-medium">
                {item.quantity}x {item.name}
              </span>
              <span className="font-bold text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Applied Discount Section */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-300 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Applied Discount:</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium ml-1">
              Discount:
            </label>
            <div className="relative">
              <select
                value={selectedDiscount.id}
                onChange={(e) => {
                  const opt = discountOptions.find((d) => d.id === e.target.value);
                  if (opt) setSelectedDiscount(opt);
                }}
                className="w-full appearance-none bg-[#0b1220] rounded-full py-2.5 px-4 pr-10 text-xs sm:text-sm font-medium text-white border border-[#1F2E4D] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 cursor-pointer shadow-inner"
              >
                {discountOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#131b2e] text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Total Price Row */}
        <div className="mt-5 flex items-center justify-between text-slate-300 border-t border-[#1F2E4D] pt-4">
          <span className="text-sm sm:text-base font-semibold">Total:</span>
          <div className="flex items-baseline gap-2">
            {selectedDiscount.percentage > 0 && (
              <span className="text-xs sm:text-sm text-slate-500 line-through">
                ${discountAmount.toFixed(2)}
              </span>
            )}
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mt-5 space-y-2.5">
          <span className="text-xs sm:text-sm font-semibold text-slate-400 ml-1">
            Select Payment Method
          </span>
          <div className="grid grid-cols-2 gap-3">
            {/* Card Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                paymentMethod === "card"
                  ? "bg-orange-600/20 border-orange-500 text-white shadow-md shadow-orange-600/10"
                  : "bg-[#0b1220] border-[#1F2E4D] text-slate-400 hover:text-white hover:bg-[#18233c]"
              }`}
            >
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              <span className="text-xs sm:text-sm font-bold">Card</span>
            </button>

            {/* Cash Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                paymentMethod === "cash"
                  ? "bg-orange-600/20 border-orange-500 text-white shadow-md shadow-orange-600/10"
                  : "bg-[#0b1220] border-[#1F2E4D] text-slate-400 hover:text-white hover:bg-[#18233c]"
              }`}
            >
              <Banknote className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              <span className="text-xs sm:text-sm font-bold">Cash</span>
            </button>
          </div>
        </div>

        {/* Action Button: Done */}
        <div className="mt-6">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDone}
            className="w-full py-3.5 rounded-full bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-semibold text-sm sm:text-base shadow-lg shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isProcessing ? "Processing..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

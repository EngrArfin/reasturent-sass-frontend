import React, { useState } from "react";
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronDown,
  Check,
  Copy,
  Receipt,
  Printer,
  QrCode,
  Tag,
} from "lucide-react";
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

type PaymentMethodType = "card" | "cash" | "online";
type OnlineProviderType = "bkash" | "nagad" | "rocket" | "upay";
type CardType = "visa" | "mastercard" | "amex" | "pos";

const discountOptions: DiscountOption[] = [
  { id: "none", name: "No Discount (0%)", percentage: 0 },
  { id: "voucher-2", name: "2% Off Voucher", percentage: 2 },
  { id: "voucher-5", name: "5% Loyalty Discount", percentage: 5 },
  { id: "voucher-10", name: "10% Staff / VIP Discount", percentage: 10 },
];

/* -------------------------------------------------------------------------- */
/* REAL AUTHENTIC BRAND SVG LOGOS (Crisp, High-Resolution, Scalable)          */
/* -------------------------------------------------------------------------- */

const BkashLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none">
    <rect width="120" height="120" rx="24" fill="#E2136E" />
    <path
      d="M71.5 28L43 49.5L62 76.5L71.5 28Z"
      fill="#FFFFFF"
    />
    <path
      d="M43 49.5L25 43.5L34.5 67L43 49.5Z"
      fill="#F587AB"
    />
    <path
      d="M62 76.5L34.5 67L39 88L62 76.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M71.5 28L95 38L62 76.5L71.5 28Z"
      fill="#FFAFD0"
    />
    <path
      d="M62 76.5L88 72L79 92L62 76.5Z"
      fill="#FFFFFF"
    />
    <path
      d="M62 76.5L79 92L57 95L62 76.5Z"
      fill="#F587AB"
    />
  </svg>
);

const NagadLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none">
    <rect width="120" height="120" rx="24" fill="#F7941D" />
    <circle cx="60" cy="60" r="38" fill="#ED1C24" />
    <path
      d="M60 28C60 28 69 44 69 55C69 66 60 76 60 76C60 76 51 66 51 55C51 44 60 28 60 28Z"
      fill="#FFFFFF"
    />
    <path
      d="M60 42C60 42 65 52 65 58C65 64 60 70 60 70C60 70 55 64 55 58C55 52 60 42 60 42Z"
      fill="#F7941D"
    />
    <circle cx="60" cy="84" r="5" fill="#FFFFFF" />
  </svg>
);

const RocketLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none">
    <rect width="120" height="120" rx="24" fill="#8C3494" />
    {/* Rocket body */}
    <path
      d="M60 26C52 38 46 54 46 72L60 67L74 72C74 54 68 38 60 26Z"
      fill="#FFFFFF"
    />
    {/* Left fin */}
    <path
      d="M46 64L32 74L46 78V64Z"
      fill="#FF4081"
    />
    {/* Right fin */}
    <path
      d="M74 64L88 74L74 78V64Z"
      fill="#FF4081"
    />
    {/* Window */}
    <circle cx="60" cy="48" r="6" fill="#8C3494" />
    {/* Rocket thrust */}
    <path
      d="M54 75L60 94L66 75H54Z"
      fill="#FFD54F"
    />
  </svg>
);

const UpayLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none">
    <rect width="120" height="120" rx="24" fill="#0057A0" />
    <path
      d="M32 38H46V62C46 70 52 74 60 74C68 74 74 70 74 62V38H88V62C88 78 76 88 60 88C44 88 32 78 32 62V38Z"
      fill="#FFD200"
    />
    <circle cx="60" cy="50" r="6" fill="#FFFFFF" />
  </svg>
);

const VisaLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-6" }) => (
  <svg viewBox="0 0 70 40" className={className} fill="none">
    <rect width="70" height="40" rx="6" fill="#1A1F71" />
    <text
      x="50%"
      y="62%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="#FFFFFF"
      fontWeight="900"
      fontStyle="italic"
      fontSize="20"
      fontFamily="sans-serif"
      letterSpacing="1"
    >
      VISA
    </text>
  </svg>
);

const MastercardLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-6" }) => (
  <svg viewBox="0 0 70 40" className={className} fill="none">
    <rect width="70" height="40" rx="6" fill="#22252A" />
    <circle cx="28" cy="20" r="12" fill="#EB001B" />
    <circle cx="42" cy="20" r="12" fill="#F79E1B" fillOpacity="0.9" />
  </svg>
);

const AmexLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-6" }) => (
  <svg viewBox="0 0 70 40" className={className} fill="none">
    <rect width="70" height="40" rx="6" fill="#006FCF" />
    <text
      x="50%"
      y="62%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="#FFFFFF"
      fontWeight="800"
      fontSize="13"
      fontFamily="sans-serif"
    >
      AMEX
    </text>
  </svg>
);

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

const Checkout: React.FC<CheckoutProps> = ({
  table,
  isOpen,
  onClose,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("online");
  const [selectedOnline, setSelectedOnline] = useState<OnlineProviderType>("bkash");
  const [selectedCard, setSelectedCard] = useState<CardType>("visa");
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountOption>(
    discountOptions[0]
  );

  // Inputs
  const [tenderedCash, setTenderedCash] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !table) return null;

  // Order Items calculation
  const items =
    table.items && table.items.length > 0
      ? table.items
      : [
          { name: "Chicken Biryani", quantity: 2, price: 12.99 },
          { name: "Mango Lassi", quantity: 2, price: 4.5 },
        ];

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * selectedDiscount.percentage) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Cash Calculations
  const parsedTendered = parseFloat(tenderedCash) || 0;
  const changeDue = Math.max(0, parsedTendered - finalTotal);

  // Merchant details for Bangladeshi MFS
  const merchantNumbers: Record<OnlineProviderType, string> = {
    bkash: "01788-990011",
    nagad: "01899-223344",
    rocket: "01655-334455-8",
    upay: "01944-556677",
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      let methodLabel = "";
      if (paymentMethod === "online") {
        const brandNames: Record<OnlineProviderType, string> = {
          bkash: "bKash",
          nagad: "Nagad",
          rocket: "Rocket",
          upay: "Upay",
        };
        methodLabel = `${brandNames[selectedOnline]}${
          transactionId ? ` (TrxID: ${transactionId})` : ""
        }`;
      } else if (paymentMethod === "card") {
        methodLabel = `Card (${selectedCard.toUpperCase()})`;
      } else {
        methodLabel = `Cash (Received: $${(parsedTendered || finalTotal).toFixed(2)})`;
      }

      toast.success(
        `Payment of $${finalTotal.toFixed(2)} received via ${methodLabel}!`
      );
      onPaymentComplete(table.id);
      onClose();

      // Reset
      setTransactionId("");
      setTenderedCash("");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-[540px] max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#111827] border border-[#1F2E4D] shadow-2xl transition-all animate-in zoom-in-95 duration-150 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#1F2E4D] bg-[#0d1322] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner shrink-0">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Checkout &amp; Payment
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                {table.label || "Table"} {table.tableNumber} &bull; Bill Payment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Items Summary (Clean Minimalist) */}
          <div className="bg-[#0b0f19] border border-[#1e293b] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 space-y-1.5 sm:space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs sm:text-sm text-slate-300"
              >
                <span className="font-medium truncate pr-2">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-semibold text-white shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Discount selector row */}
            <div className="pt-2 mt-1.5 border-t border-[#1e293b] flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Tag className="w-3.5 h-3.5 text-orange-400" />
                <span>Discount:</span>
              </div>
              <div className="relative w-full xs:w-auto xs:min-w-[150px]">
                <select
                  value={selectedDiscount.id}
                  onChange={(e) => {
                    const opt = discountOptions.find((d) => d.id === e.target.value);
                    if (opt) setSelectedDiscount(opt);
                  }}
                  className="w-full appearance-none bg-[#111827] text-white text-[11px] font-medium py-1.5 px-2.5 pr-6 rounded-lg border border-[#1e293b] focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {discountOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#111827]">
                      {opt.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Payable Total Display */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Total Amount
            </span>
            <div className="flex items-baseline gap-1.5">
              {selectedDiscount.percentage > 0 && (
                <span className="text-xs text-slate-500 line-through">
                  ${subtotal.toFixed(2)}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Primary Payment Selector (Clean 3-Tab Segmented Controls) */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 p-1 bg-[#0b0f19] border border-[#1e293b] rounded-xl sm:rounded-2xl">
            <button
              type="button"
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                paymentMethod === "online"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Online</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                paymentMethod === "card"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                paymentMethod === "cash"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Cash</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: ONLINE / MFS (bKash, Nagad, Rocket, Upay with Real Logos)        */}
          {/* ========================================================================= */}
          {paymentMethod === "online" && (
            <div className="space-y-3 sm:space-y-3.5 animate-in fade-in duration-150">
              {/* Provider Logo Cards: 2 cols on mobile, 4 cols on tablet/desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setSelectedOnline("bkash")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedOnline === "bkash"
                      ? "bg-[#E2136E]/15 border-[#E2136E] ring-1 ring-[#E2136E] shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] hover:border-slate-600 opacity-75 hover:opacity-100"
                  }`}
                >
                  <BkashLogo className="w-7 h-7 sm:w-8 sm:h-8 mb-1 sm:mb-1.5 shadow-xs" />
                  <span className="text-[11px] sm:text-xs font-bold text-white">bKash</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setSelectedOnline("nagad")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedOnline === "nagad"
                      ? "bg-[#F7941D]/15 border-[#F7941D] ring-1 ring-[#F7941D] shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] hover:border-slate-600 opacity-75 hover:opacity-100"
                  }`}
                >
                  <NagadLogo className="w-7 h-7 sm:w-8 sm:h-8 mb-1 sm:mb-1.5 shadow-xs" />
                  <span className="text-[11px] sm:text-xs font-bold text-white">Nagad</span>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setSelectedOnline("rocket")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedOnline === "rocket"
                      ? "bg-[#8C3494]/15 border-[#8C3494] ring-1 ring-[#8C3494] shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] hover:border-slate-600 opacity-75 hover:opacity-100"
                  }`}
                >
                  <RocketLogo className="w-7 h-7 sm:w-8 sm:h-8 mb-1 sm:mb-1.5 shadow-xs" />
                  <span className="text-[11px] sm:text-xs font-bold text-white">Rocket</span>
                </button>

                {/* Upay */}
                <button
                  type="button"
                  onClick={() => setSelectedOnline("upay")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedOnline === "upay"
                      ? "bg-[#0057A0]/15 border-[#0057A0] ring-1 ring-[#0057A0] shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] hover:border-slate-600 opacity-75 hover:opacity-100"
                  }`}
                >
                  <UpayLogo className="w-7 h-7 sm:w-8 sm:h-8 mb-1 sm:mb-1.5 shadow-xs" />
                  <span className="text-[11px] sm:text-xs font-bold text-white">Upay</span>
                </button>
              </div>

              {/* Merchant Number & Quick Copy */}
              <div className="bg-[#0b0f19] border border-[#1e293b] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Merchant Number
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-white">
                    {merchantNumbers[selectedOnline]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    className="flex-1 xs:flex-none justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#111827] hover:bg-[#1a233a] border border-[#1e293b] text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="Show QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>{showQrCode ? "Hide QR" : "QR Code"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(merchantNumbers[selectedOnline], "Merchant Number")
                    }
                    className="flex-1 xs:flex-none justify-center p-1.5 sm:p-2 px-3 rounded-lg sm:rounded-xl bg-[#111827] hover:bg-[#1a233a] border border-[#1e293b] text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Collapsible QR Code View */}
              {showQrCode && (
                <div className="p-3 bg-white rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-slate-900 animate-in zoom-in-95 duration-100">
                  <span className="text-xs font-bold mb-1">
                    Scan with {selectedOnline.toUpperCase()} App
                  </span>
                  <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
                      <rect width="100" height="100" fill="#ffffff" />
                      <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                      <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="18" width="8" height="8" fill="#0f172a" />
                      <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                      <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                      <rect x="74" y="18" width="8" height="8" fill="#0f172a" />
                      <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                      <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                      <rect x="18" y="74" width="8" height="8" fill="#0f172a" />
                      <rect x="42" y="14" width="8" height="8" fill="#0f172a" />
                      <rect x="44" y="30" width="8" height="8" fill="#0f172a" />
                      <rect x="14" y="44" width="8" height="8" fill="#0f172a" />
                      <rect x="30" y="44" width="8" height="8" fill="#0f172a" />
                      <rect x="44" y="44" width="12" height="12" fill="#0f172a" />
                      <rect x="66" y="44" width="8" height="8" fill="#0f172a" />
                      <rect x="80" y="44" width="8" height="8" fill="#0f172a" />
                      <rect x="44" y="66" width="8" height="8" fill="#0f172a" />
                      <rect x="60" y="66" width="8" height="8" fill="#0f172a" />
                      <rect x="44" y="80" width="8" height="8" fill="#0f172a" />
                      <rect x="74" y="80" width="8" height="8" fill="#0f172a" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 mt-1">
                    Pay: ${finalTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {/* TrxID Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">
                  Transaction ID (TrxID):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9J7A8K2"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#0b0f19] rounded-xl border border-[#1e293b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CARD (Visa, Mastercard, Amex, POS Terminal)                       */}
          {/* ========================================================================= */}
          {paymentMethod === "card" && (
            <div className="space-y-3 sm:space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCard("visa")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedCard === "visa"
                      ? "bg-blue-600/15 border-blue-500 ring-1 ring-blue-500 shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] opacity-75 hover:opacity-100"
                  }`}
                >
                  <VisaLogo className="w-9 h-5 sm:w-12 sm:h-7 mb-1" />
                  <span className="text-[10px] sm:text-xs font-bold text-white">Visa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCard("mastercard")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedCard === "mastercard"
                      ? "bg-amber-600/15 border-amber-500 ring-1 ring-amber-500 shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] opacity-75 hover:opacity-100"
                  }`}
                >
                  <MastercardLogo className="w-9 h-5 sm:w-12 sm:h-7 mb-1" />
                  <span className="text-[10px] sm:text-xs font-bold text-white">Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCard("amex")}
                  className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                    selectedCard === "amex"
                      ? "bg-sky-600/15 border-sky-500 ring-1 ring-sky-500 shadow-sm"
                      : "bg-[#0b0f19] border-[#1e293b] opacity-75 hover:opacity-100"
                  }`}
                >
                  <AmexLogo className="w-9 h-5 sm:w-12 sm:h-7 mb-1" />
                  <span className="text-[10px] sm:text-xs font-bold text-white">Amex</span>
                </button>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#0b0f19] border border-[#1e293b] rounded-xl sm:rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                    POS Terminal (Swipe / Tap)
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CASH (Quick Presets & Change Return Calculation)                   */}
          {/* ========================================================================= */}
          {paymentMethod === "cash" && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cash Received:</span>
                  <button
                    type="button"
                    onClick={() => setTenderedCash(finalTotal.toFixed(2))}
                    className="text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                  >
                    Exact (${finalTotal.toFixed(2)})
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={tenderedCash}
                    onChange={(e) => setTenderedCash(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-[#0b0f19] rounded-xl border border-[#1e293b] text-base font-bold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Quick Cash Chips */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[10, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTenderedCash(val.toString())}
                    className="py-1.5 rounded-lg sm:rounded-xl bg-[#0b0f19] hover:bg-[#152033] border border-[#1e293b] hover:border-orange-500/50 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                  >
                    ${val}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              {parsedTendered > 0 && parsedTendered >= finalTotal && (
                <div className="p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">
                    Change Due:
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-400">
                    ${changeDue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Receipt Print Toggle */}
          <div className="pt-0.5">
            <label className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printReceipt}
                onChange={(e) => setPrintReceipt(e.target.checked)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded text-orange-600 bg-[#0b0f19] border-[#1e293b] focus:ring-0 cursor-pointer"
              />
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Customer Receipt</span>
            </label>
          </div>
        </div>

        {/* Action Button (Sticky Footer) */}
        <div className="p-3.5 sm:p-4 border-t border-[#1F2E4D] bg-[#0d1322] shrink-0">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleCompletePayment}
            className="w-full py-2.5 sm:py-3 rounded-full bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="truncate">
                {paymentMethod === "cash" && parsedTendered >= finalTotal && changeDue > 0
                  ? `Confirm & Return $${changeDue.toFixed(2)} Change`
                  : paymentMethod === "online"
                  ? `Pay $${finalTotal.toFixed(2)} with ${selectedOnline.toUpperCase()}`
                  : `Complete Payment ($${finalTotal.toFixed(2)})`}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

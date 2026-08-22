import React from "react";
import { Badge } from "@/components/ui/badge";

export interface TableItem {
  id: number;
  tableNumber: number;
  type: "table" | "bar";
  label: string;
  status: "served" | "occupied" | "empty" | "billing";
  totalAmount?: number;
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  guestCount?: number;
  orderTime?: string;
}

interface CashierCardProps {
  table: TableItem;
  onClick: (table: TableItem) => void;
}

const CashierCard: React.FC<CashierCardProps> = ({ table, onClick }) => {
  const isEmpty = table.status === "empty";

  return (
    <button
      type="button"
      onClick={() => onClick(table)}
      className={`group relative flex flex-col justify-between w-full h-[150px] sm:h-[160px] p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-orange-500/50 ${
        isEmpty
          ? "bg-[#131b2e] hover:bg-[#18233c] border-[#1F2E4D] hover:border-slate-600"
          : "bg-[#101e38] hover:bg-[#14284b] border-emerald-500/40 hover:border-emerald-400"
      }`}
    >
      {/* Top row: Table number badge and label */}
      <div className="flex items-center gap-2.5">
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center border shadow-xs ${
            isEmpty
              ? "bg-[#1b253d] border-[#26375c] text-slate-300"
              : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
          }`}
        >
          {table.tableNumber}
        </div>
        <span
          className={`text-sm sm:text-base font-semibold ${
            isEmpty ? "text-slate-400" : "text-white"
          }`}
        >
          {table.label || "Table"}
        </span>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 my-1">
        {isEmpty ? (
          <span className="text-slate-500 font-medium text-sm sm:text-base tracking-wide">
            Empty
          </span>
        ) : (
          <div className="text-center space-y-1.5">
            <span className="text-lg sm:text-2xl font-black text-emerald-400 tracking-tight">
              ${table.totalAmount?.toFixed(2) ?? "0.00"}
            </span>
            <div>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full"
              >
                {table.status}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Subtle indicator for active state */}
      {!isEmpty && (
        <div className="flex justify-end">
          <span className="text-[11px] text-slate-400 group-hover:text-emerald-300 font-medium transition-colors">
            Tap to view &rarr;
          </span>
        </div>
      )}
    </button>
  );
};

export default CashierCard;

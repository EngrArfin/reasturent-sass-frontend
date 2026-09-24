// src/components/CashierDashboard/Dashboard/CashierCard.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ICashierPosTable } from "@/redux/features/cashier/cashierHubAndOrderMenuType";

// Backwards compatibility alias
export type TableItem = ICashierPosTable;

interface CashierCardProps {
  table: ICashierPosTable;
  onClick: (table: ICashierPosTable) => void;
}

const CashierCard: React.FC<CashierCardProps> = ({ table, onClick }) => {
  const statusLower = (table.status || "empty").toLowerCase();
  const isEmpty = statusLower === "empty" || statusLower === "available";
  const isServed = statusLower === "served";
  const isOccupied = statusLower === "occupied";
  const isBilling = statusLower === "billing";

  return (
    <button
      type="button"
      onClick={() => onClick(table)}
      className={`group relative flex flex-col justify-between w-full h-[155px] sm:h-[165px] p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-orange-500/50 hover:-translate-y-0.5 ${
        isEmpty
          ? "bg-[#131b2e] hover:bg-[#18233c] border-[#1F2E4D] hover:border-slate-600"
          : isServed
          ? "bg-[#101e38] hover:bg-[#14284b] border-emerald-500/40 hover:border-emerald-400"
          : isBilling
          ? "bg-[#25172e] hover:bg-[#311f3d] border-purple-500/40 hover:border-purple-400"
          : isOccupied
          ? "bg-[#221c17] hover:bg-[#2e251e] border-amber-500/40 hover:border-amber-400"
          : "bg-[#182033] hover:bg-[#1e2a44] border-slate-600/40 hover:border-slate-500"
      }`}
    >
      {/* Top row: Table number badge and label */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center border shadow-xs ${
              isEmpty
                ? "bg-[#1b253d] border-[#26375c] text-slate-300"
                : isServed
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : isBilling
                ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                : isOccupied
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                : "bg-slate-700/40 border-slate-600 text-slate-200"
            }`}
          >
            {table.tableNumber}
          </div>
          <span
            className={`text-sm sm:text-base font-semibold ${
              isEmpty ? "text-slate-400" : "text-white"
            }`}
          >
            {table.label || (table.type === "bar" ? `Bar ${table.tableNumber}` : `Table ${table.tableNumber}`)}
          </span>
        </div>

        {table.type === "bar" && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            BAR
          </span>
        )}
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 my-1">
        {isEmpty ? (
          <span className="text-slate-500 font-medium text-sm sm:text-base tracking-wide">
            Empty (Available)
          </span>
        ) : (
          <div className="text-center space-y-1.5">
            <span
              className={`text-lg sm:text-2xl font-black tracking-tight ${
                isServed
                  ? "text-emerald-400"
                  : isBilling
                  ? "text-purple-400"
                  : "text-amber-400"
              }`}
            >
              ${Number(table.totalAmount || 0).toFixed(2)}
            </span>
            <div>
              <Badge
                variant="outline"
                className={`font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                  isServed
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : isBilling
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {table.status}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Bottom indicator */}
      <div className="flex justify-between items-center w-full text-[11px] text-slate-400">
        <span>
          {table.items && table.items.length > 0 ? `${table.items.length} items` : ""}
        </span>
        <span
          className={`font-medium transition-colors ${
            isEmpty
              ? "group-hover:text-orange-400"
              : "group-hover:text-emerald-300"
          }`}
        >
          {isEmpty ? "+ New Order" : "Checkout →"}
        </span>
      </div>
    </button>
  );
};

export default CashierCard;

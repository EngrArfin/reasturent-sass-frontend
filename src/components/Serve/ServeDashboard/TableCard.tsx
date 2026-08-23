import React from "react";
import { ChevronDown } from "lucide-react";

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "SERVED";

export interface TableData {
  id: number;
  tableNumber: number;
  seats: number;
  status: TableStatus;
  isServed?: boolean;
}

interface TableCardProps {
  table: TableData;
  onSelectTable: (table: TableData) => void;
  onStatusChange: (id: number, status: TableStatus) => void;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  onSelectTable,
  onStatusChange,
}) => {
  const isAvailable = table.status === "AVAILABLE";

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onStatusChange(table.id, e.target.value as TableStatus);
  };

  return (
    <div
      onClick={() => onSelectTable(table)}
      className="group relative bg-[#131b2e] hover:bg-[#18233c] transition-all duration-300 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[230px] border border-[#1F2E4D] hover:border-slate-600"
    >
      {/* Top Section: Number Badge, Title, Seats */}
      <div>
        {/* Table Number Circle */}
        <div className="w-8 h-8 rounded-full bg-[#1b253d] text-slate-200 font-bold text-xs flex items-center justify-center shadow-xs border border-[#26375c] mb-3">
          {table.tableNumber}
        </div>

        {/* Title and Seats */}
        <h3 className="text-xl font-bold text-white tracking-tight">
          Table
        </h3>
        <p className="text-sm font-medium text-slate-400 mt-0.5">
          {table.seats} Seat
        </p>

        {/* Status Badges */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {isAvailable ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AVAILABLE
            </span>
          ) : (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                OCCUPIED
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {table.isServed ? "SERVED" : "SERVED"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bottom Section: Table Status Select */}
      <div className="mt-5 pt-3 border-t border-[#1F2E4D]/60" onClick={(e) => e.stopPropagation()}>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide">
          Table Status
        </label>
        <div className="relative">
          <select
            value={table.status}
            onChange={handleDropdownChange}
            className="w-full appearance-none bg-[#101827] border border-[#1F2E4D] hover:border-slate-600 rounded-2xl py-2 px-3.5 pr-8 text-xs font-bold text-slate-200 tracking-wider uppercase shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TableCard;

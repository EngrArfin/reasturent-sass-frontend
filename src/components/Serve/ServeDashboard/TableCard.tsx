import React from "react";
import { ChevronDown, MapPin, Users } from "lucide-react";
import { IServeTable, ServeTableStatus } from "@/redux/features/server/serverTableAndStatusType";

export interface TableData extends IServeTable {
  seats?: number;
  isServed?: boolean;
}

interface TableCardProps {
  table: TableData;
  onSelectTable: (table: TableData) => void;
  onStatusChange: (id: string, status: ServeTableStatus, subStatus?: string) => void;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  onSelectTable,
  onStatusChange,
}) => {
  const isAvailable = table.status === "AVAILABLE";
  const isOccupied = table.status === "OCCUPIED";
  const isReserved = table.status === "RESERVED";

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newStatus = e.target.value as ServeTableStatus;
    const subStatus = newStatus === "OCCUPIED" ? table.subStatus || "SERVED" : "-";
    onStatusChange(table.id, newStatus, subStatus);
  };

  const displayCapacity =
    table.capacity || (table.seats ? `${table.seats} Persons` : "4 Persons");

  return (
    <div
      onClick={() => onSelectTable(table)}
      className="group relative bg-[#131b2e] hover:bg-[#18233c] transition-all duration-300 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[240px] border border-[#1F2E4D] hover:border-orange-500/40"
    >
      {/* Top Section: Number Badge, Title, Seats & Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          {/* Table Number Circle */}
          <div className="w-9 h-9 rounded-full bg-[#1b253d] text-slate-200 font-bold text-xs flex items-center justify-center shadow-xs border border-[#26375c]">
            {table.tableNumber}
          </div>

          {/* Section Indicator */}
          {table.section && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-[#1a243d] px-2.5 py-0.5 rounded-full border border-[#1F2E4D]">
              <MapPin className="w-3 h-3 text-orange-400" />
              {table.section.trim()}
            </span>
          )}
        </div>

        {/* Title and Seats */}
        <h3 className="text-xl font-bold text-white tracking-tight">
          Table #{table.tableNumber}
        </h3>
        <p className="text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1">
          <Users className="w-3 h-3 text-slate-400" />
          {displayCapacity}
        </p>

        {/* Status Badges */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {isAvailable && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AVAILABLE
            </span>
          )}
          {isOccupied && (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                OCCUPIED
              </span>
              {table.subStatus && table.subStatus !== "-" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {table.subStatus}
                </span>
              )}
            </>
          )}
          {isReserved && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              RESERVED
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section: Table Status Select */}
      <div className="mt-5 pt-3 border-t border-[#1F2E4D]/60" onClick={(e) => e.stopPropagation()}>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide">
          Quick Status Change
        </label>
        <div className="relative">
          <select
            value={table.status}
            onChange={handleDropdownChange}
            className="w-full appearance-none bg-[#101827] border border-[#1F2E4D] hover:border-slate-600 rounded-2xl py-2 px-3.5 pr-8 text-xs font-bold text-slate-200 tracking-wider uppercase shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="RESERVED">RESERVED</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TableCard;

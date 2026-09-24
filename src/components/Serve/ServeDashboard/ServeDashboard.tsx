import React, { useState } from "react";
import TableCard, { TableData } from "./TableCard";
import TableMenu from "./TableMenu";
import { Search, Filter, ChevronDown, Utensils } from "lucide-react";
import { toast } from "sonner";
import {
  useGetServeTablesQuery,
  useUpdateServeTableStatusMutation,
} from "@/redux/features/server/serverTableAndStatusApi";
import { ServeTableStatus } from "@/redux/features/server/serverTableAndStatusType";

const fallbackTables: TableData[] = [
  { id: "1", tableNumber: "1", capacity: "4 Persons", section: "Main Hall", status: "OCCUPIED", subStatus: "SERVED" },
  { id: "2", tableNumber: "2", capacity: "4 Persons", section: "Bar Area", status: "AVAILABLE", subStatus: "-" },
  { id: "3", tableNumber: "3", capacity: "4 Persons", section: "Patio Terrace", status: "OCCUPIED", subStatus: "SERVED" },
  { id: "4", tableNumber: "4", capacity: "4 Persons", section: "Patio Terrace", status: "OCCUPIED", subStatus: "PREPARING" },
  { id: "5", tableNumber: "5", capacity: "2 Persons", section: "Window Bay", status: "OCCUPIED", subStatus: "SERVED" },
  { id: "6", tableNumber: "6", capacity: "2 Persons", section: "Window Bay", status: "AVAILABLE", subStatus: "-" },
  { id: "7", tableNumber: "7", capacity: "4 Persons", section: "Main Hall", status: "AVAILABLE", subStatus: "-" },
  { id: "8", tableNumber: "8", capacity: "4 Persons", section: "Main Hall", status: "AVAILABLE", subStatus: "-" },
  { id: "9", tableNumber: "9", capacity: "4 Persons", section: "Main Hall", status: "AVAILABLE", subStatus: "-" },
  { id: "10", tableNumber: "10", capacity: "4 Persons", section: "VIP Lounge", status: "OCCUPIED", subStatus: "PREPARING" },
  { id: "11", tableNumber: "11", capacity: "2 Persons", section: "Window Bay", status: "AVAILABLE", subStatus: "-" },
  { id: "12", tableNumber: "12", capacity: "8 Persons", section: "VIP Lounge", status: "AVAILABLE", subStatus: "-" },
];

const ServeDashboard: React.FC = () => {
  const { data: tablesData, isLoading, isFetching } = useGetServeTablesQuery(undefined, {
    pollingInterval: 3000,
  });
  const [updateTableStatus] = useUpdateServeTableStatusMutation();

  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OCCUPIED" | "RESERVED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const apiTables = tablesData?.data;
  const tables: TableData[] =
    apiTables && apiTables.length > 0 ? (apiTables as TableData[]) : fallbackTables;

  const handleSelectTable = (table: TableData) => {
    setSelectedTable(table);
    setIsMenuOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    status: ServeTableStatus,
    subStatus?: string
  ) => {
    try {
      const res = await updateTableStatus({ id, status, subStatus }).unwrap();
      toast.success(res.message || `Table status marked as ${status}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update table status");
    }
  };

  const totalCount = tablesData?.summary?.total ?? tables.length;
  const availableCount =
    tablesData?.summary?.available ??
    tables.filter((t) => t.status === "AVAILABLE").length;
  const occupiedCount =
    tablesData?.summary?.occupied ??
    tables.filter((t) => t.status === "OCCUPIED").length;
  const reservedCount =
    tablesData?.summary?.reserved ??
    tables.filter((t) => t.status === "RESERVED").length;

  const filteredTables = tables.filter((table) => {
    const matchesFilter =
      filter === "ALL" || table.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      table.tableNumber.toString().includes(searchLower) ||
      `Table #${table.tableNumber}`.toLowerCase().includes(searchLower) ||
      (table.section && table.section.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Floor Table Map
            </h1>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                Live
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase mt-1">
            Real-time table seating & instant ordering terminal
          </p>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table or section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-full text-xs font-medium bg-[#131b2e] border border-[#1F2E4D] focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-white placeholder-slate-500 w-44 sm:w-56 shadow-xs"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative flex items-center bg-[#131b2e] hover:bg-[#18233c] border border-[#1F2E4D] hover:border-orange-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
            <div className="flex items-center gap-2 pointer-events-none">
              <Filter className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
              <span className="text-xs font-bold text-white capitalize">
                {filter === "ALL"
                  ? `All (${totalCount})`
                  : filter === "AVAILABLE"
                  ? `Available (${availableCount})`
                  : filter === "OCCUPIED"
                  ? `Occupied (${occupiedCount})`
                  : `Reserved (${reservedCount})`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors ml-1" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "ALL" | "AVAILABLE" | "OCCUPIED" | "RESERVED")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#131b2e] text-white">All Tables ({totalCount})</option>
              <option value="AVAILABLE" className="bg-[#131b2e] text-white">Available ({availableCount})</option>
              <option value="OCCUPIED" className="bg-[#131b2e] text-white">Occupied ({occupiedCount})</option>
              <option value="RESERVED" className="bg-[#131b2e] text-white">Reserved ({reservedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Table Cards */}
      {isLoading && !tablesData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-[#131b2e] rounded-[28px] p-5 border border-[#1F2E4D] min-h-[220px] animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div className="w-20 h-5 rounded-full bg-slate-800" />
                </div>
                <div className="h-4 w-24 bg-slate-800 rounded" />
                <div className="h-4 w-32 bg-slate-800 rounded" />
              </div>
              <div className="h-8 w-full bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onSelectTable={handleSelectTable}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-slate-400 bg-[#131b2e] rounded-3xl border border-[#1F2E4D]">
          <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-sm font-semibold text-slate-300">No tables match your filter</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your search query or status filter</p>
        </div>
      )}

      {/* Table Menu Modal */}
      <TableMenu
        table={selectedTable}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
};

export default ServeDashboard;

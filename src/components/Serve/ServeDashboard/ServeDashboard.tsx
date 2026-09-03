import React, { useState } from "react";
import TableCard, { TableData, TableStatus } from "./TableCard";
import TableMenu, { OrderCustomization } from "./TableMenu";
import { Search, Filter, ChevronDown } from "lucide-react";

const initialTables: TableData[] = [
  { id: 1, tableNumber: 1, seats: 4, status: "OCCUPIED", isServed: true },
  { id: 2, tableNumber: 2, seats: 4, status: "AVAILABLE" },
  { id: 3, tableNumber: 3, seats: 4, status: "OCCUPIED", isServed: true },
  { id: 4, tableNumber: 4, seats: 4, status: "OCCUPIED", isServed: true },
  { id: 5, tableNumber: 5, seats: 2, status: "OCCUPIED", isServed: true },
  { id: 6, tableNumber: 6, seats: 2, status: "AVAILABLE" },
  { id: 7, tableNumber: 7, seats: 4, status: "AVAILABLE" },
  { id: 8, tableNumber: 8, seats: 4, status: "AVAILABLE" },
  { id: 9, tableNumber: 9, seats: 4, status: "AVAILABLE" },
  { id: 10, tableNumber: 10, seats: 4, status: "AVAILABLE" },
  { id: 11, tableNumber: 11, seats: 2, status: "AVAILABLE" },
  { id: 12, tableNumber: 12, seats: 2, status: "AVAILABLE" },
];

const ServeDashboard: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "OCCUPIED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectTable = (table: TableData) => {
    setSelectedTable(table);
    setIsMenuOpen(true);
  };

  const handleStatusChange = (id: number, status: TableStatus) => {
    setTables((prev) =>
      prev.map((tbl) =>
        tbl.id === id
          ? {
              ...tbl,
              status,
              isServed: status === "OCCUPIED" ? tbl.isServed ?? true : false,
            }
          : tbl
      )
    );
  };

  const handleSendToKitchen = (
    tableId: number,
    _orderItems: OrderCustomization[],
    _total: number
  ) => {
    setTables((prev) =>
      prev.map((tbl) =>
        tbl.id === tableId
          ? {
              ...tbl,
              status: "OCCUPIED",
              isServed: false,
            }
          : tbl
      )
    );
  };

  const filteredTables = tables.filter((table) => {
    const matchesFilter =
      filter === "ALL" || table.status === filter;
    const matchesSearch =
      table.tableNumber.toString().includes(searchQuery) ||
      `Table ${table.tableNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-white">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Table Map
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wider uppercase mt-1">
            SELECT A TABLE TO START AN ORDER
          </p>
        </div>

        {/* Quick Filter & Search Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-full text-xs font-medium bg-[#131b2e] border border-[#1F2E4D] focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-white placeholder-slate-500 w-36 sm:w-48 shadow-xs"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative flex items-center bg-[#131b2e] hover:bg-[#18233c] border border-[#1F2E4D] hover:border-orange-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
            <div className="flex items-center gap-2 pointer-events-none">
              <Filter className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
              <span className="text-xs font-bold text-white capitalize">
                {filter === "ALL"
                  ? `All (${tables.length})`
                  : filter === "AVAILABLE"
                  ? `Available (${tables.filter((t) => t.status === "AVAILABLE").length})`
                  : `Occupied (${tables.filter((t) => t.status === "OCCUPIED").length})`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors ml-1" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "ALL" | "AVAILABLE" | "OCCUPIED")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#131b2e] text-white">All ({tables.length})</option>
              <option value="AVAILABLE" className="bg-[#131b2e] text-white">Available ({tables.filter((t) => t.status === "AVAILABLE").length})</option>
              <option value="OCCUPIED" className="bg-[#131b2e] text-white">Occupied ({tables.filter((t) => t.status === "OCCUPIED").length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Table Cards */}
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

      {/* Table Menu Modal */}
      <TableMenu
        table={selectedTable}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSendToKitchen={handleSendToKitchen}
      />
    </div>
  );
};

export default ServeDashboard;

import React, { useState } from "react";
import CashierCard, { TableItem } from "./CashierCard";
import Checkout from "./Checkout";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, RefreshCw, Filter, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const initialTables: TableItem[] = [
  {
    id: 1,
    tableNumber: 1,
    type: "table",
    label: "Table",
    status: "served",
    totalAmount: 17.49,
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 12.99 },
      { name: "Mango Lassi", quantity: 1, price: 4.5 },
    ],
  },
  {
    id: 2,
    tableNumber: 2,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 3,
    tableNumber: 3,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 4,
    tableNumber: 4,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 5,
    tableNumber: 5,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 6,
    tableNumber: 6,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 7,
    tableNumber: 7,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 8,
    tableNumber: 8,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 9,
    tableNumber: 9,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 10,
    tableNumber: 10,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 11,
    tableNumber: 11,
    type: "table",
    label: "Table",
    status: "empty",
  },
  {
    id: 12,
    tableNumber: 12,
    type: "table",
    label: "Table",
    status: "empty",
  },
];

const barTables: TableItem[] = [
  {
    id: 101,
    tableNumber: 1,
    type: "bar",
    label: "Bar Seat",
    status: "served",
    totalAmount: 9.0,
    items: [{ name: "Mango Lassi", quantity: 2, price: 4.5 }],
  },
  {
    id: 102,
    tableNumber: 2,
    type: "bar",
    label: "Bar Seat",
    status: "empty",
  },
  {
    id: 103,
    tableNumber: 3,
    type: "bar",
    label: "Bar Seat",
    status: "empty",
  },
  {
    id: 104,
    tableNumber: 4,
    type: "bar",
    label: "Bar Seat",
    status: "empty",
  },
  {
    id: 105,
    tableNumber: 5,
    type: "bar",
    label: "Bar Seat",
    status: "empty",
  },
  {
    id: 106,
    tableNumber: 6,
    type: "bar",
    label: "Bar Seat",
    status: "empty",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"table" | "bar">("table");
  const [tables, setTables] = useState<TableItem[]>(initialTables);
  const [bars, setBars] = useState<TableItem[]>(barTables);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const currentList = viewType === "table" ? tables : bars;
  const filteredList = currentList.filter((item) => {
    const matchesSearch =
      item.tableNumber.toString().includes(searchQuery) ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCardClick = (table: TableItem) => {
    if (table.status === "empty") {
      // Direct to table menu ordering
      navigate(`/cashier-dashboard/table-menu?table=${table.tableNumber}&type=${table.type}`);
    } else {
      // Open checkout for occupied/served table
      setSelectedTable(table);
      setIsCheckoutOpen(true);
    }
  };

  const handlePaymentComplete = (tableId: number) => {
    if (viewType === "table") {
      setTables((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? { ...t, status: "empty", totalAmount: undefined, items: undefined }
            : t
        )
      );
    } else {
      setBars((prev) =>
        prev.map((t) =>
          t.id === tableId
            ? { ...t, status: "empty", totalAmount: undefined, items: undefined }
            : t
        )
      );
    }
  };

  const handleResetTables = () => {
    setTables(initialTables);
    setBars(barTables);
    toast.info("Station tables refreshed!");
  };

  return (
    <div className="min-h-full p-3 sm:p-6 lg:p-8 space-y-6 text-white font-sans">
      {/* Top Header Row matching Manager / Admin Dashboard styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cashier Hub
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            Main POS Station
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex items-center gap-3">
          {/* Segmented Pill Toggle Switch (Table / Bar/Drinks) */}
          <div className="inline-flex p-1 bg-[#131b2e] rounded-full border border-[#1F2E4D] shadow-xs">
            <button
              type="button"
              onClick={() => setViewType("table")}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                viewType === "table"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewType("bar")}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                viewType === "bar"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Bar/Drinks
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetTables}
            title="Refresh Stations"
            className="p-2.5 rounded-full bg-[#131b2e] text-slate-300 hover:text-white hover:bg-[#1b253d] border border-[#1F2E4D] transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Search & Professional Filter Toolbar */}
      <div className="bg-[#131b2e] p-3.5 sm:p-4 rounded-2xl border border-[#1F2E4D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tables by number or label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a243d] rounded-xl border border-[#1F2E4D] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner"
            />
          </div>

          {/* Status Dropdown Filter */}
          <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-orange-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="w-5 h-5 rounded-md bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Filter className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Status:
              </span>
              <span className="text-xs font-bold text-white">
                {statusFilter === "ALL"
                  ? "All Status"
                  : statusFilter === "empty"
                  ? "Available (Empty)"
                  : statusFilter === "served"
                  ? "Served"
                  : statusFilter === "occupied"
                  ? "Occupied"
                  : "Billing"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors ml-1" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#131b2e] text-white">All Status</option>
              <option value="empty" className="bg-[#131b2e] text-white">Available (Empty)</option>
              <option value="served" className="bg-[#131b2e] text-white">Served</option>
              <option value="occupied" className="bg-[#131b2e] text-white">Occupied</option>
              <option value="billing" className="bg-[#131b2e] text-white">Billing</option>
            </select>
          </div>
        </div>

        {/* New Order Button */}
        <button
          type="button"
          onClick={() => navigate("/cashier-dashboard/table-menu")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-orange-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Grid of 12 Tables (4 columns on large screens) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
        {filteredList.map((table) => (
          <CashierCard
            key={table.id}
            table={table}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-16 bg-[#131b2e] rounded-2xl border border-[#1F2E4D] text-slate-400 font-medium">
          No stations found matching &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Checkout Modal */}
      <Checkout
        table={selectedTable}
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setSelectedTable(null);
        }}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default Dashboard;

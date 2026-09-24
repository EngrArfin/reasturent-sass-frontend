// src/components/CashierDashboard/Dashboard/Dashboard.tsx
import React, { useState } from "react";
import CashierCard from "./CashierCard";
import Checkout from "./Checkout";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, RefreshCw, Filter, ChevronDown, Utensils } from "lucide-react";
import { toast } from "sonner";
import { useGetCashierTablesQuery } from "@/redux/features/cashier/cashierHubAndOrderMenuApi";
import { ICashierPosTable } from "@/redux/features/cashier/cashierHubAndOrderMenuType";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"table" | "bar">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTable, setSelectedTable] = useState<ICashierPosTable | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // RTK Query with live 3s background auto-sync
  const {
    data: tablesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetCashierTablesQuery(
    {
      type: viewType,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      search: searchQuery.trim() || undefined,
    },
    {
      pollingInterval: 3000,
    }
  );

  const tables: ICashierPosTable[] = tablesData || [];

  const handleCardClick = (table: ICashierPosTable) => {
    const statusLower = (table.status || "empty").toLowerCase();
    if (statusLower === "empty" || statusLower === "available") {
      // Direct to table menu ordering for empty table
      navigate(`/cashier-dashboard/table-menu?table=${table.tableNumber}&type=${table.type}&tableId=${table.id}`);
    } else {
      // Open checkout for occupied/served/billing table
      setSelectedTable(table);
      setIsCheckoutOpen(true);
    }
  };

  const handlePaymentComplete = () => {
    refetch();
    setSelectedTable(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-full p-3 sm:p-6 lg:p-8 space-y-6 text-white font-sans">
      {/* Top Header Row matching POS Hub specification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cashier Hub
            </h1>
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                Live
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">
            Main POS Billing &amp; Table Settlement Terminal
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex items-center gap-3">
          {/* Segmented Pill Toggle Switch (Table / Bar Stations) */}
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
              Floor Tables
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
              Bar Stations
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              refetch();
              toast.info("Refreshed POS tables stream");
            }}
            title="Refresh Stations"
            className="p-2.5 rounded-full bg-[#131b2e] text-slate-300 hover:text-white hover:bg-[#1b253d] border border-[#1F2E4D] transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-orange-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Quick Search & Filter Toolbar */}
      <div className="bg-[#131b2e] p-3.5 sm:p-4 rounded-2xl border border-[#1F2E4D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tables by number, label, or items..."
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
              <span className="text-xs font-bold text-white capitalize">
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
          onClick={() => navigate(`/cashier-dashboard/table-menu?type=${viewType}`)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-orange-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Grid of POS Tables */}
      {isLoading && !tablesData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-[#131b2e] rounded-2xl p-5 border border-[#1F2E4D] h-[155px] sm:h-[165px] animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-slate-800" />
                <div className="w-16 h-4 rounded bg-slate-800" />
              </div>
              <div className="h-6 w-20 mx-auto bg-slate-800 rounded" />
              <div className="h-3 w-16 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : tables.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {tables.map((table) => (
            <CashierCard
              key={table.id}
              table={table}
              onClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#131b2e] rounded-3xl border border-[#1F2E4D] text-slate-400 font-medium max-w-md mx-auto">
          <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-sm font-bold text-white">No {viewType} stations found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try clearing search keywords or selecting a different status filter.
          </p>
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

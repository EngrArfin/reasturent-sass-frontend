import React, { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Search,
  Utensils,
  X,
  AlertCircle,
  MapPin,
  Clock,
  Filter,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

export interface RestaurantTable {
  id: number | string;
  capacity: number;
  status: "OCCUPIED" | "AVAILABLE" | "RESERVED" | "CLEANING";
  subStatus: "SERVED" | "ORDER_PLACED" | "PREPARING" | "PAYMENT_PENDING" | "-";
  section?: string;
  waiter?: string;
  seatedTime?: string;
  activeOrderNumber?: string;
  totalBill?: number;
  orderItems?: { name: string; quantity: number; price: number }[];
}

export const initialTablesData: RestaurantTable[] = [
  {
    id: 1,
    capacity: 4,
    status: "OCCUPIED",
    subStatus: "SERVED",
    section: "Main Dining Hall",
    waiter: "Sarah Jenkins",
    seatedTime: "45 mins ago",
    activeOrderNumber: "ORD-9021",
    totalBill: 74.5,
    orderItems: [
      { name: "Grilled Salmon Steak", quantity: 2, price: 24.5 },
      { name: "Caesar Salad", quantity: 1, price: 12.0 },
      { name: "Lemon Mint Mocktail", quantity: 2, price: 6.75 },
    ],
  },
  {
    id: 2,
    capacity: 4,
    status: "AVAILABLE",
    subStatus: "-",
    section: "Main Dining Hall",
  },
  {
    id: 3,
    capacity: 4,
    status: "OCCUPIED",
    subStatus: "SERVED",
    section: "Patio Terrace",
    waiter: "John Doe",
    seatedTime: "30 mins ago",
    activeOrderNumber: "ORD-9023",
    totalBill: 58.0,
    orderItems: [
      { name: "Classic Beef Burger", quantity: 2, price: 18.0 },
      { name: "Crispy French Fries", quantity: 2, price: 5.5 },
      { name: "Iced Tea", quantity: 2, price: 5.5 },
    ],
  },
  {
    id: 4,
    capacity: 4,
    status: "OCCUPIED",
    subStatus: "SERVED",
    section: "Patio Terrace",
    waiter: "Emily Watson",
    seatedTime: "15 mins ago",
    activeOrderNumber: "ORD-9025",
    totalBill: 42.0,
    orderItems: [
      { name: "Margherita Pizza", quantity: 1, price: 19.0 },
      { name: "Garlic Bread", quantity: 1, price: 7.0 },
      { name: "Craft Soda", quantity: 2, price: 8.0 },
    ],
  },
  {
    id: 5,
    capacity: 2,
    status: "OCCUPIED",
    subStatus: "SERVED",
    section: "Window Bay",
    waiter: "Sarah Jenkins",
    seatedTime: "25 mins ago",
    activeOrderNumber: "ORD-9028",
    totalBill: 36.5,
    orderItems: [
      { name: "Truffle Mushroom Pasta", quantity: 1, price: 22.5 },
      { name: "Cappuccino", quantity: 2, price: 7.0 },
    ],
  },
  {
    id: 6,
    capacity: 2,
    status: "AVAILABLE",
    subStatus: "-",
    section: "Window Bay",
  },
  {
    id: 7,
    capacity: 6,
    status: "RESERVED",
    subStatus: "-",
    section: "VIP Lounge",
    waiter: "David Khan",
    seatedTime: "Reserved for 8:30 PM",
  },
  {
    id: 8,
    capacity: 8,
    status: "AVAILABLE",
    subStatus: "-",
    section: "VIP Lounge",
  },
];

interface FootTableProps {
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
  onOpenAddModal?: () => void;
}

export const FootTable: React.FC<FootTableProps> = ({
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [tables, setTables] = useState<RestaurantTable[]>(initialTablesData);
  const [localAddModalOpen, setLocalAddModalOpen] = useState(false);
  const [viewTable, setViewTable] = useState<RestaurantTable | null>(null);
  const [editTable, setEditTable] = useState<RestaurantTable | null>(null);
  const [deleteTableId, setDeleteTableId] = useState<number | string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sectionFilter, setSectionFilter] = useState<string>("ALL");

  const showAddModal = isAddModalOpen || localAddModalOpen;
  const handleCloseAdd = () => {
    setLocalAddModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Add Table Form State
  const [newTable, setNewTable] = useState<{
    id: string;
    capacity: number;
    status: RestaurantTable["status"];
    subStatus: RestaurantTable["subStatus"];
    section: string;
  }>({
    id: "",
    capacity: 4,
    status: "AVAILABLE",
    subStatus: "-",
    section: "Main Dining Hall",
  });

  // Add Table Submit
  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tableId = newTable.id.trim() ? newTable.id.trim() : (tables.length + 1).toString();

    if (tables.some((t) => t.id.toString() === tableId.toString())) {
      toast.error(`Table ${tableId} already exists!`);
      return;
    }

    const createdTable: RestaurantTable = {
      id: isNaN(Number(tableId)) ? tableId : Number(tableId),
      capacity: Number(newTable.capacity) || 4,
      status: newTable.status,
      subStatus: newTable.status === "AVAILABLE" ? "-" : newTable.subStatus,
      section: newTable.section || "Main Dining Hall",
    };

    setTables((prev) => [...prev, createdTable]);
    toast.success(`Table #${tableId} added successfully!`);
    setNewTable({
      id: "",
      capacity: 4,
      status: "AVAILABLE",
      subStatus: "-",
      section: "Main Dining Hall",
    });
    handleCloseAdd();
  };

  // Edit Table Submit
  const handleUpdateTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTable) return;

    setTables((prev) =>
      prev.map((t) =>
        t.id === editTable.id
          ? {
            ...editTable,
            subStatus: editTable.status === "AVAILABLE" ? "-" : editTable.subStatus,
          }
          : t
      )
    );
    toast.success(`Table #${editTable.id} updated successfully!`);
    setEditTable(null);
  };

  // Delete Table
  const confirmDelete = () => {
    if (deleteTableId !== null) {
      setTables((prev) => prev.filter((t) => t.id !== deleteTableId));
      toast.success(`Table #${deleteTableId} deleted successfully!`);
      setDeleteTableId(null);
    }
  };

  // Quick Status Toggle
  const handleQuickStatusChange = (
    tableId: number | string,
    newStatus: RestaurantTable["status"],
    newSubStatus: RestaurantTable["subStatus"] = "-"
  ) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? {
            ...t,
            status: newStatus,
            subStatus: newStatus === "AVAILABLE" ? "-" : newSubStatus,
          }
          : t
      )
    );
    if (viewTable && viewTable.id === tableId) {
      setViewTable((prev) =>
        prev
          ? {
            ...prev,
            status: newStatus,
            subStatus: newStatus === "AVAILABLE" ? "-" : newSubStatus,
          }
          : null
      );
    }
    toast.success(`Table #${tableId} marked as ${newStatus}`);
  };

  // Filtered Tables
  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      (table.section && table.section.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (table.waiter && table.waiter.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || table.status.toUpperCase() === statusFilter.toUpperCase();

    const matchesSection =
      sectionFilter === "ALL" || (table.section && table.section === sectionFilter);

    return matchesSearch && matchesStatus && matchesSection;
  });

  const occupiedCount = tables.filter((t) => t.status === "OCCUPIED").length;
  const availableCount = tables.filter((t) => t.status === "AVAILABLE").length;
  const reservedCount = tables.filter((t) => t.status === "RESERVED").length;

  return (
    <div className="w-full space-y-6">
      {/* Top Search & Professional Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131b2e] p-4 sm:p-5 rounded-2xl border border-[#1F2E4D] shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by table ID, capacity, section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] focus:border-blue-500/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350] transition-all"
          />
        </div>

        {/* Right Side Professional Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
            <div className="flex items-center gap-2 pointer-events-none">
              <div className="w-5 h-5 rounded-md bg-[#052350] border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Filter className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
              <span className="text-xs font-bold text-white capitalize">
                {statusFilter === "ALL" ? `All (${tables.length})` : statusFilter.toLowerCase()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#131b2e] text-white">All Tables ({tables.length})</option>
              <option value="OCCUPIED" className="bg-[#131b2e] text-white">Occupied ({occupiedCount})</option>
              <option value="AVAILABLE" className="bg-[#131b2e] text-white">Available ({availableCount})</option>
              <option value="RESERVED" className="bg-[#131b2e] text-white">Reserved ({reservedCount})</option>
            </select>
          </div>

          {/* Section Dropdown */}
          <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
            <div className="flex items-center gap-2 pointer-events-none">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Zone:</span>
              <span className="text-xs font-bold text-white">
                {sectionFilter === "ALL" ? "All Sections" : sectionFilter}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
            </div>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#131b2e] text-white">All Sections</option>
              <option value="Main Dining Hall" className="bg-[#131b2e] text-white">Main Dining Hall</option>
              <option value="Patio Terrace" className="bg-[#131b2e] text-white">Patio Terrace</option>
              <option value="Window Bay" className="bg-[#131b2e] text-white">Window Bay</option>
              <option value="VIP Lounge" className="bg-[#131b2e] text-white">VIP Lounge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card (Harmonized with Dark Theme Dashboard) */}
      <div className="bg-[#131b2e] rounded-2xl border border-[#1F2E4D] shadow-sm overflow-hidden text-slate-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b border-[#1F2E4D] bg-[#1a243d] text-slate-300 text-sm">
                <th className="py-4.5 px-6 sm:px-8 font-semibold">ID</th>
                <th className="py-4.5 px-6 sm:px-8 font-semibold">Capacity</th>
                <th className="py-4.5 px-6 sm:px-8 font-semibold">Status</th>
                <th className="py-4.5 px-6 sm:px-8 font-semibold">Sub Status</th>
                <th className="py-4.5 px-6 sm:px-8 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            {/* Rows */}
            <tbody className="divide-y divide-[#1F2E4D]/60 text-sm">
              {filteredTables.length > 0 ? (
                filteredTables.map((table) => {
                  const isOccupied = table.status === "OCCUPIED";
                  const isAvailable = table.status === "AVAILABLE";
                  const isReserved = table.status === "RESERVED";

                  return (
                    <tr
                      key={table.id}
                      className="hover:bg-[#1a243d]/45 transition-colors duration-150"
                    >
                      {/* ID */}
                      <td className="py-4.5 px-6 sm:px-8 font-semibold text-white">
                        {table.id}
                      </td>

                      {/* Capacity */}
                      <td className="py-4.5 px-6 sm:px-8 text-slate-300 font-medium">
                        {table.capacity} Persons
                      </td>

                      {/* Status */}
                      <td className="py-4.5 px-6 sm:px-8">
                        {isOccupied && (
                          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            OCCUPIED
                          </span>
                        )}
                        {isAvailable && (
                          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            AVAILABLE
                          </span>
                        )}
                        {isReserved && (
                          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            RESERVED
                          </span>
                        )}
                        {!isOccupied && !isAvailable && !isReserved && (
                          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">
                            {table.status}
                          </span>
                        )}
                      </td>

                      {/* Sub Status */}
                      <td className="py-4.5 px-6 sm:px-8 font-medium text-slate-400 text-xs sm:text-sm">
                        {table.subStatus}
                      </td>

                      {/* Actions: Eye, Edit, Delete */}
                      <td className="py-4.5 px-6 sm:px-8">
                        <div className="flex items-center justify-center gap-2">
                          {/* View (Blue Eye) */}
                          <button
                            type="button"
                            onClick={() => setViewTable(table)}
                            title="View Table Details"
                            className="w-9 h-9 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors cursor-pointer border border-blue-500/20"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit (Orange Pencil) */}
                          <button
                            type="button"
                            onClick={() => setEditTable(table)}
                            title="Edit Table"
                            className="w-9 h-9 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition-colors cursor-pointer border border-amber-500/20"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete (Red Trash) */}
                          <button
                            type="button"
                            onClick={() => setDeleteTableId(table.id)}
                            title="Delete Table"
                            className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-300">No tables found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try clearing filters or add a new table.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-4 bg-[#1a243d]/60 border-t border-[#1F2E4D] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Showing <span className="font-semibold text-white">{filteredTables.length}</span> of{" "}
            <span className="font-semibold text-white">{tables.length}</span> total tables
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available: {availableCount}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span> Occupied: {occupiedCount}
            </span>
          </div>
        </div>
      </div>

      {/* ================= ADD TABLE MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#1F2E4D] relative text-white">
            <button
              onClick={handleCloseAdd}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1a243d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#052350] border border-[#1F2E4D] flex items-center justify-center text-white">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add New Table</h3>
                <p className="text-xs text-slate-400">Configure table capacity and section</p>
              </div>
            </div>

            <form onSubmit={handleAddTableSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Table Number / ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7 or T-07"
                  value={newTable.id}
                  onChange={(e) => setNewTable({ ...newTable, id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Capacity (Seats)
                  </label>
                  <select
                    value={newTable.capacity}
                    onChange={(e) =>
                      setNewTable({ ...newTable, capacity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value={2} className="bg-[#131b2e] text-white">2 Persons</option>
                    <option value={4} className="bg-[#131b2e] text-white">4 Persons</option>
                    <option value={6} className="bg-[#131b2e] text-white">6 Persons</option>
                    <option value={8} className="bg-[#131b2e] text-white">8 Persons</option>
                    <option value={10} className="bg-[#131b2e] text-white">10+ Persons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Section / Zone
                  </label>
                  <select
                    value={newTable.section}
                    onChange={(e) => setNewTable({ ...newTable, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="Main Dining Hall" className="bg-[#131b2e] text-white">Main Hall</option>
                    <option value="Patio Terrace" className="bg-[#131b2e] text-white">Patio Terrace</option>
                    <option value="Window Bay" className="bg-[#131b2e] text-white">Window Bay</option>
                    <option value="VIP Lounge" className="bg-[#131b2e] text-white">VIP Lounge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Initial Status
                </label>
                <select
                  value={newTable.status}
                  onChange={(e) =>
                    setNewTable({
                      ...newTable,
                      status: e.target.value as RestaurantTable["status"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                >
                  <option value="AVAILABLE" className="bg-[#131b2e] text-white">AVAILABLE</option>
                  <option value="OCCUPIED" className="bg-[#131b2e] text-white">OCCUPIED</option>
                  <option value="RESERVED" className="bg-[#131b2e] text-white">RESERVED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]">
                <button
                  type="button"
                  onClick={handleCloseAdd}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white text-sm font-semibold rounded-full shadow-sm transition-all cursor-pointer"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT TABLE MODAL ================= */}
      {editTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#1F2E4D] relative text-white">
            <button
              onClick={() => setEditTable(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1a243d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Edit Table #{editTable.id}
                </h3>
                <p className="text-xs text-slate-400">Update capacity, status, and sub-status</p>
              </div>
            </div>

            <form onSubmit={handleUpdateTableSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Capacity
                  </label>
                  <select
                    value={editTable.capacity}
                    onChange={(e) =>
                      setEditTable({
                        ...editTable,
                        capacity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value={2} className="bg-[#131b2e] text-white">2 Persons</option>
                    <option value={4} className="bg-[#131b2e] text-white">4 Persons</option>
                    <option value={6} className="bg-[#131b2e] text-white">6 Persons</option>
                    <option value={8} className="bg-[#131b2e] text-white">8 Persons</option>
                    <option value={10} className="bg-[#131b2e] text-white">10+ Persons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Section
                  </label>
                  <select
                    value={editTable.section || "Main Dining Hall"}
                    onChange={(e) =>
                      setEditTable({ ...editTable, section: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="Main Dining Hall" className="bg-[#131b2e] text-white">Main Hall</option>
                    <option value="Patio Terrace" className="bg-[#131b2e] text-white">Patio Terrace</option>
                    <option value="Window Bay" className="bg-[#131b2e] text-white">Window Bay</option>
                    <option value="VIP Lounge" className="bg-[#131b2e] text-white">VIP Lounge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  value={editTable.status}
                  onChange={(e) =>
                    setEditTable({
                      ...editTable,
                      status: e.target.value as RestaurantTable["status"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                >
                  <option value="AVAILABLE" className="bg-[#131b2e] text-white">AVAILABLE</option>
                  <option value="OCCUPIED" className="bg-[#131b2e] text-white">OCCUPIED</option>
                  <option value="RESERVED" className="bg-[#131b2e] text-white">RESERVED</option>
                </select>
              </div>

              {editTable.status === "OCCUPIED" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Sub Status
                  </label>
                  <select
                    value={editTable.subStatus}
                    onChange={(e) =>
                      setEditTable({
                        ...editTable,
                        subStatus: e.target.value as RestaurantTable["subStatus"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="SERVED" className="bg-[#131b2e] text-white">SERVED</option>
                    <option value="ORDER_PLACED" className="bg-[#131b2e] text-white">ORDER_PLACED</option>
                    <option value="PREPARING" className="bg-[#131b2e] text-white">PREPARING</option>
                    <option value="PAYMENT_PENDING" className="bg-[#131b2e] text-white">PAYMENT_PENDING</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]">
                <button
                  type="button"
                  onClick={() => setEditTable(null)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white text-sm font-semibold rounded-full shadow-sm transition-all cursor-pointer"
                >
                  Update Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW TABLE DETAILS MODAL ================= */}
      {viewTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#1F2E4D] relative text-white">
            <button
              onClick={() => setViewTable(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1a243d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#052350] border border-[#1F2E4D] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                #{viewTable.id}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Table #{viewTable.id} Overview
                </h3>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {viewTable.section || "Main Dining Hall"}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-medium text-slate-400">
                    Capacity: {viewTable.capacity} Seats
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-[#1a243d] rounded-2xl mb-5 border border-[#1F2E4D]">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Status</span>
                <span
                  className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${viewTable.status === "OCCUPIED"
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : viewTable.status === "AVAILABLE"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                >
                  {viewTable.status}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Sub Status</span>
                <span className="text-sm font-semibold text-white mt-1 block">
                  {viewTable.subStatus}
                </span>
              </div>
              {viewTable.waiter && (
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Server</span>
                  <span className="text-sm font-semibold text-white mt-1 block">
                    {viewTable.waiter}
                  </span>
                </div>
              )}
              {viewTable.seatedTime && (
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Seated Duration</span>
                  <span className="text-sm font-semibold text-white mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {viewTable.seatedTime}
                  </span>
                </div>
              )}
            </div>

            {viewTable.status === "OCCUPIED" && viewTable.orderItems && (
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Current Active Order ({viewTable.activeOrderNumber})</span>
                  <span className="text-sm font-bold text-white">
                    Total: ${viewTable.totalBill?.toFixed(2)}
                  </span>
                </div>
                <div className="bg-[#1a243d] rounded-2xl p-3.5 max-h-40 overflow-y-auto space-y-2 border border-[#1F2E4D]">
                  {viewTable.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-slate-300"
                    >
                      <span className="font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-white font-mono font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1F2E4D]">
              <div className="flex items-center gap-2">
                {viewTable.status === "OCCUPIED" ? (
                  <button
                    onClick={() => handleQuickStatusChange(viewTable.id, "AVAILABLE", "-")}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 transition-colors cursor-pointer"
                  >
                    Mark as Available
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuickStatusChange(viewTable.id, "OCCUPIED", "SERVED")}
                    className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold rounded-full border border-orange-500/20 transition-colors cursor-pointer"
                  >
                    Mark as Occupied
                  </button>
                )}
              </div>

              <button
                onClick={() => setViewTable(null)}
                className="px-5 py-2 bg-[#1a243d] hover:bg-[#1a243d]/80 border border-[#1F2E4D] text-slate-300 hover:text-white text-xs font-semibold rounded-full shadow-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      {deleteTableId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#1F2E4D] text-center text-white">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Delete Table #{deleteTableId}?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to delete this table? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTableId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FootTable;

// src/components/CashierDashboard/TableMenu/TableMenu.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Search,
  ArrowLeft,
  Check,
  CreditCard,
  Filter,
  ChevronDown,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import Checkout from "../Dashboard/Checkout";
import {
  useGetCashierMenuQuery,
  useGetCashierTablesQuery,
} from "@/redux/features/cashier/cashierHubAndOrderMenuApi";
import {
  ICashierMenuItem,
  ICashierPosTable,
} from "@/redux/features/cashier/cashierHubAndOrderMenuType";

interface CartItem {
  item: ICashierMenuItem;
  quantity: number;
}

const CATEGORIES = [
  { id: "all", label: "All Dishes" },
  { id: "Main Course", label: "Main Course" },
  { id: "Starters", label: "Starters" },
  { id: "Breads", label: "Breads" },
  { id: "Beverages", label: "Beverages" },
  { id: "Desserts", label: "Desserts" },
];

const fallbackFoodImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";

const TableMenu: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableParam = searchParams.get("table") || "1";
  const typeParam = (searchParams.get("type") || "table") as "table" | "bar";
  const tableIdParam = searchParams.get("tableId") || tableParam;

  const [selectedTableNumber, setSelectedTableNumber] = useState<string | number>(
    tableParam
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Fetch live menu items
  const { data: menuData, isLoading: isMenuLoading } = useGetCashierMenuQuery({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchQuery.trim() || undefined,
  });

  // Fetch available tables for table switcher
  const { data: tablesData } = useGetCashierTablesQuery({
    type: typeParam,
  });

  const menuItems: ICashierMenuItem[] = menuData || [];
  const availableTables = tablesData || [];

  const handleAddToCart = (item: ICashierMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to order`);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const subtotal = cart.reduce(
    (acc, ci) => acc + (ci.item.price || 0) * ci.quantity,
    0
  );

  const activeTableObject: ICashierPosTable = {
    id: tableIdParam,
    tableNumber: selectedTableNumber,
    type: typeParam,
    label: `${typeParam === "bar" ? "Bar Seat" : "Table"} ${selectedTableNumber}`,
    status: "occupied",
    totalAmount: subtotal,
    items: cart.map((ci) => ({
      name: ci.item.name,
      quantity: ci.quantity,
      price: ci.item.price,
    })),
  };

  return (
    <div className="min-h-full p-3 sm:p-6 lg:p-8 space-y-6 text-white font-sans">
      {/* Header & Table Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cashier-dashboard/dashboard")}
            className="p-2.5 rounded-full bg-[#131b2e] text-slate-300 hover:text-white hover:bg-[#1b253d] border border-[#1F2E4D] transition-colors cursor-pointer shadow-xs"
            title="Back to Stations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Order Menu Dishes
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Live menu selection &amp; instant POS ticket dispatch
            </p>
          </div>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-[#131b2e] hover:bg-[#18233c] px-4 py-2 rounded-full border border-[#1F2E4D] hover:border-orange-500/40 shadow-xs cursor-pointer group transition-all">
            <div className="flex items-center gap-2 pointer-events-none">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Serving:
              </span>
              <span className="font-bold text-sm text-orange-400">
                {typeParam === "bar" ? `Bar Seat ${selectedTableNumber}` : `Table ${selectedTableNumber}`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors ml-1" />
            </div>
            <select
              aria-label="Select Serving Table"
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm"
            >
              {availableTables.length > 0 ? (
                availableTables.map((t) => (
                  <option key={t.id} value={t.tableNumber} className="bg-[#131b2e] text-white">
                    {t.label || (t.type === "bar" ? `Bar Seat ${t.tableNumber}` : `Table ${t.tableNumber}`)} ({t.status})
                  </option>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num} className="bg-[#131b2e] text-white">
                    Table {num}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Menu Items (Left) + Order Summary Cart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Items List */}
        <div className="lg:col-span-8 space-y-5">
          {/* Search Bar & Category Filter Toolbar */}
          <div className="bg-[#131b2e] p-3.5 sm:p-4 rounded-2xl border border-[#1F2E4D] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search menu dishes by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a243d] rounded-xl border border-[#1F2E4D] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner"
              />
            </div>

            {/* Category Dropdown Filter */}
            <div className="flex items-center">
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-orange-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group min-w-[170px]">
                <div className="flex items-center justify-between w-full gap-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                      <Filter className="w-3 h-3" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Category:
                    </span>
                    <span className="text-xs font-bold text-white capitalize">
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors shrink-0" />
                </div>
                <select
                  aria-label="Filter food by category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#131b2e] text-white">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Food Cards Grid */}
          {isMenuLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-[#131b2e] rounded-2xl p-4 border border-[#1F2E4D] animate-pulse flex items-center gap-4 h-32"
                >
                  <div className="w-24 h-24 rounded-xl bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-slate-800 rounded" />
                    <div className="h-3 w-48 bg-slate-800 rounded" />
                    <div className="h-5 w-16 bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : menuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#131b2e] rounded-2xl p-3.5 border border-[#1F2E4D] shadow-sm hover:shadow-md hover:border-slate-600 transition-all duration-200 flex items-center gap-4 group"
                >
                  {/* Food Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#0b1220] border border-[#1F2E4D]">
                    <img
                      src={item.image || fallbackFoodImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackFoodImage;
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-sm sm:text-base leading-tight">
                          {item.name}
                        </h3>
                        {item.isVeg && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded-xs leading-none">
                            VEG
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description || item.category}
                      </p>
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-base sm:text-lg font-black text-emerald-400">
                        ${Number(item.price || 0).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-600/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#131b2e] rounded-3xl border border-[#1F2E4D] text-slate-400 font-medium">
              <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-bold text-white">No menu dishes found</p>
              <p className="text-xs text-slate-500 mt-1">Try another category or clear search keyword.</p>
            </div>
          )}
        </div>

        {/* Right Panel: Order Summary & Cart */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 bg-[#131b2e] rounded-3xl p-5 border border-[#1F2E4D] shadow-sm space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-400" />
                <h2 className="font-bold text-white text-base">
                  Current Order
                </h2>
              </div>
              <span className="bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                {typeParam === "bar" ? `Bar ${selectedTableNumber}` : `Table ${selectedTableNumber}`}
              </span>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No items added yet. Click &quot;+ Add&quot; on menu items to start.
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {cart.map((ci) => (
                  <div
                    key={ci.item.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0b1220] border border-[#1F2E4D] text-xs sm:text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {ci.item.name}
                      </p>
                      <p className="text-slate-400 text-xs">
                        ${Number(ci.item.price || 0).toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(ci.item.id, -1)}
                        className="w-6 h-6 rounded-full bg-[#1b253d] border border-[#26375c] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#26375c] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white min-w-4 text-center">
                        {ci.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(ci.item.id, 1)}
                        className="w-6 h-6 rounded-full bg-[#1b253d] border border-[#26375c] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#26375c] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(ci.item.id)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations & Checkout Trigger */}
            <div className="border-t border-[#1F2E4D] pt-4 space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-white font-bold text-base pt-1">
                <span>Total Amount</span>
                <span className="text-2xl text-emerald-400 font-black">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => {
                    toast.success(
                      `Order sent to Kitchen for Table ${selectedTableNumber}!`
                    );
                    navigate("/cashier-dashboard/dashboard");
                  }}
                  className="w-full py-2.5 rounded-full bg-[#1b253d] hover:bg-[#26375c] border border-[#26375c] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Send to Kitchen (KOT)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Checkout
        table={activeTableObject}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPaymentComplete={() => {
          setCart([]);
          navigate("/cashier-dashboard/dashboard");
        }}
      />
    </div>
  );
};

export default TableMenu;

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
} from "lucide-react";
import { toast } from "sonner";
import Checkout from "../Dashboard/Checkout";
import { TableItem } from "../Dashboard/CashierCard";

export interface MenuItem {
  id: string;
  name: string;
  category: "all" | "mains" | "starters" | "breads" | "drinks" | "desserts";
  description: string;
  price: number;
  image: string;
  isVeg?: boolean;
}

const menuItemsData: MenuItem[] = [
  {
    id: "item-1",
    name: "Chicken Biryani",
    category: "mains",
    description: "Fragrant basmati rice with spiced chicken",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop",
    isVeg: false,
  },
  {
    id: "item-2",
    name: "Paneer Tikka",
    category: "starters",
    description: "Grilled cottage cheese with spices",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop",
    isVeg: true,
  },
  {
    id: "item-3",
    name: "Garlic Naan",
    category: "breads",
    description: "Soft leavened bread with garlic",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
    isVeg: true,
  },
  {
    id: "item-4",
    name: "Mango Lassi",
    category: "drinks",
    description: "Sweet yogurt drink with mango",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    isVeg: true,
  },
  {
    id: "item-5",
    name: "Butter Chicken",
    category: "mains",
    description: "Tender chicken cooked in creamy tomato gravy",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop",
    isVeg: false,
  },
  {
    id: "item-6",
    name: "Crispy Samosa (2 pcs)",
    category: "starters",
    description: "Crispy pastry stuffed with spiced potato and peas",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
    isVeg: true,
  },
  {
    id: "item-7",
    name: "Bottled Mineral Water",
    category: "drinks",
    description: "Chilled fresh natural spring water (500ml)",
    price: 1.5,
    image:
      "https://images.unsplash.com/photo-1559839914-ba2a9390234a?q=80&w=600&auto=format&fit=crop",
    isVeg: true,
  },
  {
    id: "item-8",
    name: "Gulab Jamun (2 pcs)",
    category: "desserts",
    description: "Warm milk dough balls soaked in rose flavored syrup",
    price: 4.0,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop",
    isVeg: true,
  },
];

interface CartItem {
  item: MenuItem;
  quantity: number;
}

const TableMenu: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tableParam = searchParams.get("table") || "1";
  const typeParam = searchParams.get("type") || "table";

  const [selectedTableNumber, setSelectedTableNumber] = useState(
    Number(tableParam) || 1
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    { item: menuItemsData[0], quantity: 4 }, // 4x Chicken Biryani
    { item: menuItemsData[3], quantity: 4 }, // 4x Mango Lassi
    { item: menuItemsData[6], quantity: 2 }, // 2x Bottled Water
  ]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Filter items
  const filteredItems = menuItemsData.filter((item) => {
    const matchesCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
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
    (acc, ci) => acc + ci.item.price * ci.quantity,
    0
  );

  const activeTableObject: TableItem = {
    id: selectedTableNumber,
    tableNumber: selectedTableNumber,
    type: typeParam as "table" | "bar",
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
    <div className="min-h-full p-3 sm:p-6 lg:p-8 space-y-6 text-white">
      {/* Header & Table Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cashier-dashboard/dashboard")}
            className="p-2.5 rounded-full bg-[#131b2e] text-slate-300 hover:text-white hover:bg-[#1b253d] border border-[#1F2E4D] transition-colors cursor-pointer"
            title="Back to Stations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Order Menu
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Select items for Table / Bar Stations
            </p>
          </div>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#131b2e] px-4 py-2 rounded-full border border-[#1F2E4D] shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Serving:
            </span>
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(Number(e.target.value))}
              className="font-bold text-sm text-white bg-transparent focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num} className="bg-[#131b2e] text-white">
                  Table {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Menu Items (Left) + Order Summary Cart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Items List */}
        <div className="lg:col-span-8 space-y-5">
          {/* Category Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#131b2e] rounded-full border border-[#1F2E4D] text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all shadow-inner"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: "all", label: "All" },
                { id: "mains", label: "Mains" },
                { id: "starters", label: "Starters" },
                { id: "breads", label: "Breads" },
                { id: "drinks", label: "Drinks" },
                { id: "desserts", label: "Desserts" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? "bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30"
                      : "bg-[#131b2e] text-slate-300 hover:text-white hover:bg-[#1b253d] border-[#1F2E4D]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Cards Grid matching Manager / Admin aesthetic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#131b2e] rounded-2xl p-3.5 border border-[#1F2E4D] shadow-sm hover:shadow-md hover:border-slate-600 transition-all duration-200 flex items-center gap-4 group"
              >
                {/* Square Food Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#0b1220] border border-[#1F2E4D]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
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
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      ${item.price.toFixed(2)}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-[#131b2e] rounded-2xl border border-[#1F2E4D] text-slate-400 font-medium">
              No menu items match your search.
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
                Table {selectedTableNumber}
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
                        ${ci.item.price.toFixed(2)} each
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

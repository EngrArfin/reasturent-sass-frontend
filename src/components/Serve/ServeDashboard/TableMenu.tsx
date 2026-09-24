import React, { useState } from "react";
import { X, Plus, Minus, Send, Loader2, Utensils, Search } from "lucide-react";
import { toast } from "sonner";
import { TableData } from "./TableCard";
import {
  useGetServeMenuQuery,
  useSendOrderToKitchenMutation,
} from "@/redux/features/server/serverTableAndStatusApi";
import { IServeMenuItem } from "@/redux/features/server/serverTableAndStatusType";

export interface MenuItem extends IServeMenuItem {
  image?: string;
}

export interface OrderCustomization {
  item: IServeMenuItem;
  quantity: number;
  selectedTags: string[];
}

interface TableMenuProps {
  table: TableData | null;
  isOpen: boolean;
  onClose: () => void;
  onSendToKitchen?: (tableId: string, orderItems: OrderCustomization[], total: number) => void;
}

const defaultFallbackMenuItems: IServeMenuItem[] = [
  {
    id: "item-1",
    name: "Chicken Biriyani",
    description: "Fragrant basmati rice with spiced chicken",
    category: "Main Course",
    price: 12.99,
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-2",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices",
    category: "Appetizer",
    price: 9.99,
    imageUrl:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-3",
    name: "Garlic Naan",
    description: "Soft leavened bread with garlic",
    category: "Appetizer",
    price: 3.5,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-4",
    name: "Mango Lassi",
    description: "Sweet yogurt drink with mango",
    category: "Beverage",
    price: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-5",
    name: "Lamb Curry",
    description: "Tender lamb in rich gravy",
    category: "Main Course",
    price: 15.99,
    imageUrl:
      "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
  },
  {
    id: "item-6",
    name: "Samosa",
    description: "Crispy pastry with potato filling",
    category: "Appetizer",
    price: 5.99,
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
  },
];

const availableModifierTags = [
  "Extra Spicy",
  "No Onion",
  "Less salt",
  "Less oil",
  "No Garlic",
];

const TableMenu: React.FC<TableMenuProps> = ({
  table,
  isOpen,
  onClose,
  onSendToKitchen,
}) => {
  const { data: menuData, isLoading: isMenuLoading } = useGetServeMenuQuery(undefined, {
    skip: !isOpen,
  });
  const [sendOrder, { isLoading: isSendingOrder }] = useSendOrderToKitchenMutation();

  const menuItems =
    menuData?.data && menuData.data.length > 0
      ? menuData.data
      : defaultFallbackMenuItems;

  const [currentOrder, setCurrentOrder] = useState<OrderCustomization[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen || !table) return null;

  const formattedTableNumber = table.tableNumber;

  const handleAddItem = (item: IServeMenuItem) => {
    setCurrentOrder((prev) => {
      const existingIndex = prev.findIndex((o) => o.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          item,
          quantity: 1,
          selectedTags: [],
        },
      ];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCurrentOrder((prev) => prev.filter((o) => o.item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCurrentOrder((prev) =>
      prev
        .map((o) => {
          if (o.item.id === itemId) {
            const newQty = o.quantity + delta;
            return newQty > 0 ? { ...o, quantity: newQty } : null;
          }
          return o;
        })
        .filter(Boolean) as OrderCustomization[]
    );
  };

  const handleToggleTag = (itemId: string, tag: string) => {
    setCurrentOrder((prev) =>
      prev.map((o) => {
        if (o.item.id === itemId) {
          const tags = o.selectedTags.includes(tag)
            ? o.selectedTags.filter((t) => t !== tag)
            : [...o.selectedTags, tag];
          return { ...o, selectedTags: tags };
        }
        return o;
      })
    );
  };

  const subtotal = currentOrder.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  const handleSendToKitchenClick = async () => {
    if (currentOrder.length === 0) {
      toast.error("Please select at least one item!");
      return;
    }

    const payload = {
      tableNumber: table.tableNumber.toString(),
      tableId: table.id,
      notes: orderNotes.trim() || undefined,
      items: currentOrder.map((order) => ({
        menuItemId: order.item.id,
        name: order.item.name,
        quantity: order.quantity,
        unitPrice: order.item.price,
        notes: order.selectedTags.length > 0 ? order.selectedTags.join(", ") : undefined,
      })),
    };

    try {
      const response = await sendOrder(payload).unwrap();
      toast.success(
        response.message || `Order sent to kitchen for Table #${table.tableNumber}!`
      );
      if (onSendToKitchen) {
        onSendToKitchen(table.id, currentOrder, subtotal);
      }
      setCurrentOrder([]);
      setOrderNotes("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send order to kitchen");
    }
  };

  // Filter Dishes
  const categories = ["ALL", ...Array.from(new Set(menuItems.map((m) => m.category)))];

  const filteredDishes = menuItems.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "ALL" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#101827] rounded-[28px] max-w-5xl w-full h-[90vh] max-h-[800px] shadow-2xl border border-[#1F2E4D] flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1F2E4D] bg-[#131b2e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-sm flex items-center justify-center">
              #{formattedTableNumber}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Table #{formattedTableNumber} Order Menu
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {table.section ? `${table.section.trim()} • ` : ""}
                {table.capacity || "4 Seats"} • Status: {table.status}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#18233c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Left (Menu Selection), Right (Cart & Customization) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT 7 COLS: Menu Catalog */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1F2E4D] overflow-hidden bg-[#131b2e]/50">
            {/* Search and Category Filter */}
            <div className="space-y-3 shrink-0 mb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search menu dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#131b2e] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-[#131b2e] text-slate-400 hover:text-white border border-[#1F2E4D]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
              {isMenuLoading ? (
                <div className="py-16 text-center text-slate-400">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-orange-400" />
                  <p className="text-xs">Loading available menu...</p>
                </div>
              ) : filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDishes.map((item) => {
                    const inCart = currentOrder.find((o) => o.item.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => item.isAvailable && handleAddItem(item)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          !item.isAvailable
                            ? "bg-[#131b2e]/30 border-[#1F2E4D]/40 opacity-40 cursor-not-allowed"
                            : inCart
                            ? "bg-[#18233c] border-orange-500/50 shadow-xs"
                            : "bg-[#131b2e] hover:bg-[#18233c] border-[#1F2E4D]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-orange-400 font-mono">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        {item.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1F2E4D]/60">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.isAvailable
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {item.isAvailable ? "In Stock" : "Unavailable"}
                          </span>
                          <span className="text-xs text-orange-400 font-semibold hover:underline flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <Utensils className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-300">No dishes found</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLS: Current Order Ticket & Modifiers */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-[#101827] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1F2E4D] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                    Current Order Ticket
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {currentOrder.reduce((a, b) => a + b.quantity, 0)} items selected
                  </p>
                </div>
                {currentOrder.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentOrder([])}
                    className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {currentOrder.length > 0 ? (
                  currentOrder.map((order) => (
                    <div
                      key={order.item.id}
                      className="bg-[#131b2e] p-3 rounded-2xl border border-[#1F2E4D] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {order.item.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ${order.item.price.toFixed(2)} each
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(order.item.id, -1)}
                            className="w-6 h-6 rounded-md bg-[#18233c] hover:bg-[#202c4b] text-slate-300 flex items-center justify-center cursor-pointer border border-[#1F2E4D]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-white text-xs font-mono">
                            {order.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(order.item.id, 1)}
                            className="w-6 h-6 rounded-md bg-[#18233c] hover:bg-[#202c4b] text-slate-300 flex items-center justify-center cursor-pointer border border-[#1F2E4D]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(order.item.id)}
                            className="w-6 h-6 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center cursor-pointer border border-red-500/20 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Dietary Modifier Tags */}
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                          Dietary Tags / Modifiers:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {availableModifierTags.map((tag) => {
                            const isSelected = order.selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleToggleTag(order.item.id, tag)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                                    : "bg-[#18233c] text-slate-400 hover:text-white border border-[#1F2E4D]/60"
                                }`}
                              >
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-xs">No dishes added yet.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Click items on the left catalog to add to order.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Kitchen Notes / Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Serve appetizers first, extra spicy..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#131b2e] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>

            {/* Bottom Total & Actions */}
            <div className="pt-4 border-t border-[#1F2E4D] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-400">Total Order Bill:</span>
                <span className="text-xl font-bold text-orange-400 font-mono">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-[#131b2e] hover:bg-[#18233c] border border-[#1F2E4D] text-slate-300 hover:text-white text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendToKitchenClick}
                  disabled={isSendingOrder || currentOrder.length === 0}
                  className="flex-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSendingOrder ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send to Kitchen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMenu;

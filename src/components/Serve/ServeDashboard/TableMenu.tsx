import React, { useState } from "react";
import { X, Plus, Minus, Send } from "lucide-react";
import { toast } from "sonner";
import { TableData } from "./TableCard";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface OrderCustomization {
  item: MenuItem;
  quantity: number;
  selectedTags: string[];
}

interface TableMenuProps {
  table: TableData | null;
  isOpen: boolean;
  onClose: () => void;
  onSendToKitchen: (tableId: number, orderItems: OrderCustomization[], total: number) => void;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Chicken Biriyani",
    description: "Fragrant basmati rice with spiced chicken",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "item-2",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "item-3",
    name: "Garlic Naan",
    description: "Soft leavened bread with garlic",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "item-4",
    name: "Mango Lassi",
    description: "Sweet yogurt drink with mango",
    price: 4.5,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "item-5",
    name: "Lamb Curry",
    description: "Tender lamb in rich gravy",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "item-6",
    name: "Samosa",
    description: "Crispy pastry with potato filling",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
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
  const [currentOrder, setCurrentOrder] = useState<OrderCustomization[]>([
    {
      item: defaultMenuItems[0],
      quantity: 1,
      selectedTags: ["Extra Spicy", "No Onion"],
    },
    {
      item: defaultMenuItems[3],
      quantity: 1,
      selectedTags: ["Extra Spicy"],
    },
  ]);

  if (!isOpen || !table) return null;

  const formattedTableNumber =
    table.tableNumber < 10 ? `0${table.tableNumber}` : `${table.tableNumber}`;

  const handleAddItem = (item: MenuItem) => {
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
          selectedTags: ["Extra Spicy"],
        },
      ];
    });
    toast.success(`Added ${item.name} to order`);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCurrentOrder((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCurrentOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleTag = (orderIndex: number, tag: string) => {
    setCurrentOrder((prev) => {
      const updated = [...prev];
      const currentTags = updated[orderIndex].selectedTags;
      if (currentTags.includes(tag)) {
        updated[orderIndex].selectedTags = currentTags.filter((t) => t !== tag);
      } else {
        updated[orderIndex].selectedTags = [...currentTags, tag];
      }
      return updated;
    });
  };

  const subtotal = currentOrder.reduce(
    (sum, order) => sum + order.item.price * order.quantity,
    0
  );

  const handleSend = () => {
    if (currentOrder.length === 0) {
      toast.error("Please add at least one item to current order");
      return;
    }
    onSendToKitchen(table.id, currentOrder, subtotal);
    toast.success(
      `Order sent to Kitchen for Table ${table.tableNumber}! Total: $${subtotal.toFixed(2)}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn text-white">
      <div
        className="relative bg-[#121826] w-full max-w-5xl max-h-[92vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-[#1F2E4D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2E4D]">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Table {formattedTableNumber} Menu
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1b253d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto p-4 sm:p-6 gap-6">
          {/* Left: Food Menu Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
            {defaultMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[4/4.2] bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end border border-[#1F2E4D]/80"
              >
                {/* Background Food Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                {/* Bottom Content Info */}
                <div className="relative p-4 sm:p-5 flex items-end justify-between gap-2 z-10">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-base sm:text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-base sm:text-xl font-black text-[#FFB800] tracking-tight">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Hover Quick Add Badge */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md rounded-full px-2.5 py-1 text-[11px] font-bold text-white flex items-center gap-1 border border-white/20">
                  <Plus className="w-3.5 h-3.5 text-orange-400" />
                  <span>Add</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: CURRENT ORDER Panel */}
          <div className="w-full lg:w-[360px] bg-[#131b2e] rounded-[28px] p-4 sm:p-5 flex flex-col justify-between border border-[#1F2E4D]">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase mb-3.5">
                CURRENT ORDER
              </h3>

              {/* Order Items List */}
              {currentOrder.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  <p className="text-sm font-medium">No items in current order</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click any menu item on the left to add
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {currentOrder.map((order, idx) => (
                    <div
                      key={`${order.item.id}-${idx}`}
                      className="bg-[#1b253d] rounded-2xl p-3.5 shadow-xs border border-[#26375c]"
                    >
                      {/* Name, Price and Quantity Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {order.item.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">
                            ${order.item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(idx, -1)}
                            className="w-6 h-6 rounded-full border border-[#26375c] bg-[#131b2e] text-slate-300 flex items-center justify-center hover:bg-[#26375c] hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-white min-w-4 text-center">
                            {order.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(idx, 1)}
                            className="w-6 h-6 rounded-full border border-[#26375c] bg-[#131b2e] text-slate-300 flex items-center justify-center hover:bg-[#26375c] hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="w-6 h-6 rounded-full text-red-400 hover:bg-red-500/20 flex items-center justify-center ml-1 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Modifier Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {availableModifierTags.map((tag) => {
                          const isSelected = order.selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(idx, tag)}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer border ${
                                isSelected
                                  ? "bg-orange-500/20 text-orange-400 border-orange-500/40 font-semibold"
                                  : "bg-[#131b2e] text-slate-400 border-[#1F2E4D] hover:bg-white/5"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Total and Send Button */}
            <div className="mt-5 pt-4 border-t border-[#1F2E4D]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400">
                  Total:
                </span>
                <span className="text-xl font-black text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSend}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/30 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>SEND TO KITCHEN</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableMenu;

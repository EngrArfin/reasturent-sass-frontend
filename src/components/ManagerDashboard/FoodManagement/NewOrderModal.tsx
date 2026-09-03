import React, { useState } from "react";
import {
  X,
  Search,
  Plus,
  Minus,
  Trash2,
  Utensils,
  User,
  Phone,
  Users,
  Clock,
  Receipt,
  Flame,
  Tag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MenuItem, LiveOrder } from "./FoodManagement";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onOrderCreated: (order: LiveOrder) => void;
  defaultTableId?: number | string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  notes?: string;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onOrderCreated,
  defaultTableId = 1,
}) => {
  // Order Configuration Inputs (Manager Controls)
  const [orderType, setOrderType] = useState<"Dine In" | "Takeaway" | "Delivery">("Dine In");
  const [tableId, setTableId] = useState<number | string>(defaultTableId);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [serverName, setServerName] = useState("Sarah Jenkins");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Digital" | "Pay Later">("Pay Later");
  const [orderStatus, setOrderStatus] = useState<LiveOrder["status"]>("PENDING");
  const [isRushOrder, setIsRushOrder] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Custom Item Modal/Inputs inside Dialog
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState<number>(10);
  const [customItemQty, setCustomItemQty] = useState<number>(1);

  // Cart Items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Search & Filter in Modal
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  // Add Item from Catalog
  const handleAddItem = (dish: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          category: dish.category,
        },
      ];
    });
  };

  // Add Custom Item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) {
      toast.error("Please enter a custom item name");
      return;
    }
    const customItem: CartItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      price: Number(customItemPrice) || 0,
      quantity: Number(customItemQty) || 1,
      category: "Special",
    };
    setCartItems((prev) => [...prev, customItem]);
    toast.success(`Added custom item "${customItem.name}"`);
    setCustomItemName("");
    setCustomItemPrice(10);
    setCustomItemQty(1);
    setShowCustomItemForm(false);
  };

  // Adjust Quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% VAT / Tax
  const finalDiscount = Math.min(discountAmount, subtotal + tax);
  const totalAmount = Math.max(0, subtotal + tax - finalDiscount);

  // Filter Dishes
  const filteredDishes = menuItems.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || dish.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  // Submit Order
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Please add at least one dish to the order!");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Please enter guest name!");
      return;
    }

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const finalTable = orderType === "Dine In" ? tableId : orderType;

    const newOrder: LiveOrder = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      tableId: finalTable,
      customerName: customerName.trim(),
      items: cartItems.map((c) => ({
        name: c.name,
        quantity: c.quantity,
        price: c.price,
      })),
      totalAmount,
      status: orderStatus,
      orderTime: currentTime,
    };

    onOrderCreated(newOrder);
    toast.success(`Order ${orderNumber} created for Table #${finalTable}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#131b2e] rounded-2xl max-w-5xl w-full h-[94vh] max-h-[820px] shadow-2xl border border-[#1F2E4D] flex flex-col text-white overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="px-5 py-3.5 border-b border-[#1F2E4D] bg-[#1a243d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#052350] border border-[#1F2E4D] flex items-center justify-center text-white shadow-sm">
              <Utensils className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Manager POS: Create Order
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  Live Terminal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Input table details, staff assignment, payment method, and menu items
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#131b2e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= BODY SPLIT ================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT 7 COLS: Menu Items Selector & Custom Items */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1F2E4D] overflow-hidden">
            {/* Search, Categories & Add Custom Item Action */}
            <div className="space-y-2.5 shrink-0 mb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search menu dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowCustomItemForm(!showCustomItemForm)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    showCustomItemForm
                      ? "bg-[#052350] text-white border-blue-500/40"
                      : "bg-[#1a243d] text-slate-300 hover:text-white border-[#1F2E4D]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>+ Custom Dish</span>
                </button>
              </div>

              {/* Custom Item Quick Form Drawer */}
              {showCustomItemForm && (
                <div className="p-3 bg-[#1a243d] rounded-xl border border-blue-500/30 space-y-2 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Input Custom / Special Dish:</span>
                    <button
                      type="button"
                      onClick={() => setShowCustomItemForm(false)}
                      className="text-slate-400 hover:text-white text-[11px]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="Dish name (e.g. Special Grilled Fish)"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="col-span-6 px-3 py-1.5 bg-[#131b2e] border border-[#1F2E4D] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="Price $"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(parseFloat(e.target.value) || 0)}
                      className="col-span-3 px-3 py-1.5 bg-[#131b2e] border border-[#1F2E4D] rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="col-span-3 px-2 py-1.5 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/30 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {["ALL", "Main Course", "Appetizer", "Dessert", "Beverage"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
                        : "bg-[#1a243d] text-slate-400 hover:text-white border border-[#1F2E4D]/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredDishes.map((dish) => {
                    const inCart = cartItems.find((c) => c.id === dish.id);
                    return (
                      <div
                        key={dish.id}
                        onClick={() => dish.isAvailable && handleAddItem(dish)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          !dish.isAvailable
                            ? "bg-[#1a243d]/30 border-[#1F2E4D]/40 opacity-50 cursor-not-allowed"
                            : inCart
                            ? "bg-[#052350]/40 border-blue-500/50 shadow-sm"
                            : "bg-[#1a243d] hover:bg-[#1a243d]/80 border-[#1F2E4D]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <span className="text-xs font-bold text-white line-clamp-1 block">
                              {dish.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{dish.category}</span>
                          </div>
                          <span className="text-xs font-bold text-white font-mono">
                            ${dish.price.toFixed(2)}
                          </span>
                        </div>

                        {dish.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                            {dish.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-[#1F2E4D]/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {dish.preparationTime}
                          </span>

                          {dish.isAvailable ? (
                            inCart ? (
                              <span className="text-blue-400 font-bold bg-blue-500/20 px-2 py-0.5 rounded-full text-[10px]">
                                {inCart.quantity} added
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="px-2.5 py-0.5 rounded-lg bg-[#052350] hover:bg-[#041a3d] text-white text-[11px] font-semibold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add
                              </button>
                            )
                          ) : (
                            <span className="text-red-400 text-[10px]">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-center">
                  <Utensils className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-300">No dishes matched</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLS: Manager Order Form & Cart Basket */}
          <form
            onSubmit={handleSubmitOrder}
            className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between overflow-hidden bg-[#131b2e]"
          >
            {/* Manager Inputs (Order Header, Guests, Table, Staff, Payment) */}
            <div className="space-y-3 shrink-0 overflow-y-auto max-h-[46%] pr-1">
              {/* Type Switcher & Rush Flag */}
              <div className="flex items-center justify-between gap-2">
                <div className="grid grid-cols-3 gap-1 bg-[#1a243d] p-1 rounded-xl border border-[#1F2E4D] flex-1">
                  {(["Dine In", "Takeaway", "Delivery"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                        orderType === type
                          ? "bg-[#052350] text-white shadow-sm border border-[#1F2E4D]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Rush Toggle */}
                <label className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20 shrink-0">
                  <input
                    type="checkbox"
                    checked={isRushOrder}
                    onChange={(e) => setIsRushOrder(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <Flame className="w-3.5 h-3.5" />
                  <span>Rush</span>
                </label>
              </div>

              {/* Table & Guests */}
              {orderType === "Dine In" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Table Number
                    </label>
                    <select
                      value={tableId}
                      onChange={(e) => setTableId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
                        <option key={t} value={t} className="bg-[#131b2e] text-white">
                          Table #{t} (Hall)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" /> Guest Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                    />
                  </div>
                </div>
              )}

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 555-0192"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  />
                </div>
              </div>

              {/* Assigned Waiter & Initial Status */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Assigned Server / Staff
                  </label>
                  <select
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="Sarah Jenkins" className="bg-[#131b2e] text-white">Sarah Jenkins</option>
                    <option value="John Doe" className="bg-[#131b2e] text-white">John Doe</option>
                    <option value="Emily Watson" className="bg-[#131b2e] text-white">Emily Watson</option>
                    <option value="David Khan" className="bg-[#131b2e] text-white">David Khan</option>
                    <option value="Manager Desk" className="bg-[#131b2e] text-white">Manager Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as LiveOrder["status"])}
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="PENDING" className="bg-[#131b2e] text-white">PENDING (New)</option>
                    <option value="PREPARING" className="bg-[#131b2e] text-white">PREPARING (Kitchen)</option>
                    <option value="SERVED" className="bg-[#131b2e] text-white">SERVED (Dining)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method & Discount ($) */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "Cash" | "Card" | "Digital" | "Pay Later")
                    }
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="Pay Later" className="bg-[#131b2e] text-white">Pay Later (Post-dine)</option>
                    <option value="Cash" className="bg-[#131b2e] text-white">Cash Paid</option>
                    <option value="Card" className="bg-[#131b2e] text-white">Card / POS</option>
                    <option value="Digital" className="bg-[#131b2e] text-white">Digital / UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" /> Discount ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0.00"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350] font-mono"
                  />
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <input
                  type="text"
                  placeholder="Special instructions / Kitchen note (e.g. less spicy)..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>
            </div>

            {/* Cart Items Basket */}
            <div className="flex-1 overflow-y-auto my-2 p-2.5 bg-[#1a243d]/60 rounded-xl border border-[#1F2E4D] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-1 border-b border-[#1F2E4D]">
                <span>Order Basket ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCartItems([])}
                    className="text-[11px] text-red-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cartItems.length > 0 ? (
                <div className="space-y-1.5">
                  {cartItems.map((ci) => (
                    <div
                      key={ci.id}
                      className="flex items-center justify-between bg-[#131b2e] p-2 rounded-lg border border-[#1F2E4D]/80 text-xs"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-semibold text-white truncate">{ci.name}</div>
                        <div className="text-[10px] text-slate-400">
                          ${ci.price.toFixed(2)} each
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-[#1a243d] px-1.5 py-0.5 rounded-md border border-[#1F2E4D]">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(ci.id, -1)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-white px-1 text-xs">{ci.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(ci.id, 1)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-white w-12 text-right font-mono text-xs">
                          ${(ci.price * ci.quantity).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(ci.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-5 text-center text-slate-500 text-xs">
                  Select dishes from left or add custom item
                </div>
              )}
            </div>

            {/* Bill Summary & Submit Button */}
            <div className="shrink-0 space-y-2 pt-2 border-t border-[#1F2E4D]">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (5% VAT)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                {finalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-${finalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#1F2E4D]/80">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 font-mono text-base">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-[#1a243d] hover:bg-[#1a243d]/80 text-xs font-semibold text-slate-300 border border-[#1F2E4D] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="flex-2 py-2.5 bg-[#052350] hover:bg-[#041a3d] disabled:opacity-50 disabled:cursor-not-allowed border border-[#1F2E4D] text-white text-xs font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Confirm & Send to Kitchen</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;

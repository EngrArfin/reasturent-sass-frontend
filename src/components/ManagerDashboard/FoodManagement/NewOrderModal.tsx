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
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetMenuItemsQuery,
  useGetTablesQuery,
  useCreateOrderMutation,
} from "@/redux/features/manager/ManageFood/manageFoodApi";
import {
  IMenuItem,
  IOrder,
  OrderStatus,
} from "@/redux/features/manager/ManageFood/manageFoodType";

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: IMenuItem[];
  onOrderCreated?: (order: IOrder) => void;
  defaultTableId?: string;
}

interface CartItem {
  id: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  notes?: string;
}

const fallbackMenuCatalog: IMenuItem[] = [
  {
    id: "M-1",
    name: "Grilled Salmon Steak",
    category: "Main Course",
    price: 24.5,
    isAvailable: true,
    prepTime: "20-25 mins",
    description: "Atlantic salmon with herbs butter and fresh asparagus",
  },
  {
    id: "M-2",
    name: "Classic Beef Burger",
    category: "Main Course",
    price: 18.0,
    isAvailable: true,
    prepTime: "15 mins",
    description: "Angus beef patty with cheddar cheese and crisp fries",
  },
  {
    id: "M-3",
    name: "Margherita Pizza",
    category: "Main Course",
    price: 19.0,
    isAvailable: true,
    prepTime: "15-20 mins",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, basil",
  },
  {
    id: "M-4",
    name: "Caesar Salad",
    category: "Appetizer",
    price: 12.0,
    isAvailable: true,
    prepTime: "10 mins",
    description: "Crispy romaine, parmesan shavings, garlic croutons",
  },
  {
    id: "M-5",
    name: "Truffle Mushroom Pasta",
    category: "Main Course",
    price: 22.5,
    isAvailable: true,
    prepTime: "18 mins",
    description: "Fettuccine in creamy black truffle and wild mushroom sauce",
  },
  {
    id: "M-6",
    name: "Lemon Mint Mocktail",
    category: "Beverage",
    price: 6.75,
    isAvailable: true,
    prepTime: "5 mins",
    description: "Refreshing crushed ice beverage with fresh mint and lime",
  },
];

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  menuItems: propMenuItems,
  onOrderCreated,
  defaultTableId,
}) => {
  // API Queries & Mutations
  const { data: menuApiData, isLoading: isMenuLoading } = useGetMenuItemsQuery(undefined, {
    skip: !isOpen,
  });
  const { data: tablesApiData } = useGetTablesQuery(undefined, {
    skip: !isOpen,
  });
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const availableTables = tablesApiData?.data || [];
  const menuCatalog =
    menuApiData?.data && menuApiData.data.length > 0
      ? menuApiData.data
      : propMenuItems && propMenuItems.length > 0
      ? propMenuItems
      : fallbackMenuCatalog;

  // Order Configuration Inputs (Manager Controls)
  const [orderType, setOrderType] = useState<"Dine In" | "Takeaway" | "Delivery">("Dine In");
  const [selectedTableId, setSelectedTableId] = useState<string>(
    defaultTableId || (availableTables[0]?.id ? availableTables[0].id : "1")
  );
  const [customTableNumber, setCustomTableNumber] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Custom Item Drawer inside Dialog
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
  const handleAddItem = (dish: IMenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => (item.menuItemId || item.id) === dish.id);
      if (existing) {
        return prev.map((item) =>
          (item.menuItemId || item.id) === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          menuItemId: dish.id,
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
    toast.success(`Added "${customItem.name}" to cart`);
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
  const tax = subtotal * 0.05; // 5% Tax
  const finalDiscount = Math.min(discountAmount, subtotal + tax);
  const totalAmount = Math.max(0, subtotal + tax - finalDiscount);

  // Filter Dishes
  const filteredDishes = menuCatalog.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || dish.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  // Categories list
  const categoriesList = [
    "ALL",
    ...Array.from(new Set(menuCatalog.map((d) => d.category))).filter((c) => c !== "ALL"),
  ];

  // Submit Order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Please add at least one dish to the order!");
      return;
    }

    const matchedTable = availableTables.find((t) => t.id === selectedTableId);
    const resolvedTableNumber =
      orderType === "Dine In"
        ? matchedTable
          ? `Table #${matchedTable.tableNumber || matchedTable.id}`
          : customTableNumber.trim()
          ? `Table #${customTableNumber.trim()}`
          : `Table #${selectedTableId}`
        : orderType;

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      orderNumber,
      tableId: orderType === "Dine In" && matchedTable ? matchedTable.id : undefined,
      tableNumber: resolvedTableNumber,
      status: "PENDING" as OrderStatus,
      notes: [
        customerName ? `Guest: ${customerName}` : "",
        customerPhone ? `Phone: ${customerPhone}` : "",
        orderNotes ? `Notes: ${orderNotes}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
      items: cartItems.map((c) => ({
        menuItemId: c.menuItemId,
        name: c.name,
        quantity: c.quantity,
        unitPrice: c.price,
        notes: c.notes,
      })),
    };

    try {
      const response = await createOrder(payload).unwrap();
      toast.success(response.message || `Order ${orderNumber} created successfully!`);
      if (onOrderCreated && response.data) {
        onOrderCreated(response.data);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create order");
    }
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
                Select table, pick dishes, customize options, and dispatch to kitchen
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
                {categoriesList.map((cat) => (
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
              {isMenuLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-400" />
                  <p className="text-xs">Loading menu catalog...</p>
                </div>
              ) : filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredDishes.map((dish) => {
                    const inCart = cartItems.find(
                      (c) => (c.menuItemId || c.id) === dish.id
                    );
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
                            {dish.prepTime || "15 mins"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              dish.isAvailable
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {dish.isAvailable ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Utensils className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-300">No dishes match filter</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLS: Order Configuration, Cart & Checkout */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-[#131b2e] overflow-y-auto">
            <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                {/* Order Type Switch */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1a243d] rounded-xl border border-[#1F2E4D]">
                  {(["Dine In", "Takeaway", "Delivery"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        orderType === type
                          ? "bg-[#052350] text-white shadow-xs border border-blue-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Table Assignment (if Dine In) */}
                {orderType === "Dine In" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Dining Table
                    </label>
                    {availableTables.length > 0 ? (
                      <select
                        value={selectedTableId}
                        onChange={(e) => setSelectedTableId(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                      >
                        {availableTables.map((tbl) => (
                          <option key={tbl.id} value={tbl.id} className="bg-[#131b2e] text-white">
                            Table #{tbl.tableNumber || tbl.id} ({tbl.capacity} - {tbl.section || "Floor"}) [{tbl.status}]
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Table Number (e.g. 1)"
                        value={customTableNumber}
                        onChange={(e) => setCustomTableNumber(e.target.value)}
                        className="w-full px-3.5 py-2 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                      />
                    )}
                  </div>
                )}

                {/* Guest Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Guest Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Phone / Contact"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Order Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                    {cartItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCartItems([])}
                        className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="bg-[#1a243d] rounded-xl p-2.5 max-h-44 overflow-y-auto space-y-2 border border-[#1F2E4D]">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 text-xs bg-[#131b2e] p-2 rounded-lg border border-[#1F2E4D]"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-white block truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-md bg-[#1a243d] hover:bg-[#202c4b] text-slate-300 flex items-center justify-center cursor-pointer border border-[#1F2E4D]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-bold text-white font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-md bg-[#1a243d] hover:bg-[#202c4b] text-slate-300 flex items-center justify-center cursor-pointer border border-[#1F2E4D]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-6 h-6 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center cursor-pointer border border-red-500/20 ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-400">
                        <p className="text-xs">Cart is empty. Click dishes on the left to add.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Special Instructions / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra cutlery, no spicy sauce..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  />
                </div>
              </div>

              {/* Bill Calculations & Action Button */}
              <div className="pt-3 border-t border-[#1F2E4D] space-y-2.5">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (5%):</span>
                    <span className="font-mono text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Discount ($):</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0.00"
                      value={discountAmount === 0 ? "" : discountAmount}
                      onChange={(e) =>
                        setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="w-20 px-2 py-0.5 bg-[#1a243d] border border-[#1F2E4D] rounded text-right text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Applied:</span>
                      <span className="font-mono">-${finalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#1F2E4D]/80">
                    <span>Total Bill:</span>
                    <span className="font-mono text-blue-400 text-base">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingOrder || cartItems.length === 0}
                    className="flex-2 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isCreatingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Dispatch Order (${totalAmount.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;

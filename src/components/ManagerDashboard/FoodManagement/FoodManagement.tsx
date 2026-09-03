import React, { useState } from "react";
import {
  Plus,
  Utensils,
  Search,
  Clock,
  Trash2,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import FootTable from "./FootTable";

// Menu Item Types
export interface MenuItem {
  id: string;
  name: string;
  category: "Appetizer" | "Main Course" | "Dessert" | "Beverage" | "Special";
  price: number;
  isAvailable: boolean;
  preparationTime: string;
  description?: string;
  calories?: number;
}

// Live Order Types
export interface LiveOrder {
  id: string;
  orderNumber: string;
  tableId: number | string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: "PENDING" | "PREPARING" | "SERVED" | "COMPLETED" | "CANCELLED";
  orderTime: string;
}

const initialMenuItems: MenuItem[] = [
  {
    id: "M-1",
    name: "Grilled Salmon Steak",
    category: "Main Course",
    price: 24.5,
    isAvailable: true,
    preparationTime: "20-25 mins",
    description: "Atlantic salmon with herbs butter and fresh asparagus",
    calories: 520,
  },
  {
    id: "M-2",
    name: "Classic Beef Burger",
    category: "Main Course",
    price: 18.0,
    isAvailable: true,
    preparationTime: "15 mins",
    description: "Angus beef patty with cheddar cheese and crisp fries",
    calories: 680,
  },
  {
    id: "M-3",
    name: "Margherita Pizza",
    category: "Main Course",
    price: 19.0,
    isAvailable: true,
    preparationTime: "15-20 mins",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, basil",
    calories: 740,
  },
  {
    id: "M-4",
    name: "Caesar Salad",
    category: "Appetizer",
    price: 12.0,
    isAvailable: true,
    preparationTime: "10 mins",
    description: "Crispy romaine, parmesan shavings, garlic croutons",
    calories: 310,
  },
  {
    id: "M-5",
    name: "Truffle Mushroom Pasta",
    category: "Main Course",
    price: 22.5,
    isAvailable: true,
    preparationTime: "18 mins",
    description: "Fettuccine in creamy black truffle and wild mushroom sauce",
    calories: 610,
  },
  {
    id: "M-6",
    name: "Lemon Mint Mocktail",
    category: "Beverage",
    price: 6.75,
    isAvailable: true,
    preparationTime: "5 mins",
    description: "Refreshing crushed ice beverage with fresh mint and lime",
    calories: 120,
  },
  {
    id: "M-7",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 9.5,
    isAvailable: false,
    preparationTime: "12 mins",
    description: "Warm Belgian chocolate cake with bourbon vanilla gelato",
    calories: 450,
  },
];

const initialLiveOrders: LiveOrder[] = [
  {
    id: "ORD-1",
    orderNumber: "ORD-9021",
    tableId: 1,
    customerName: "Alex Morgan",
    items: [
      { name: "Grilled Salmon Steak", quantity: 2, price: 24.5 },
      { name: "Caesar Salad", quantity: 1, price: 12.0 },
      { name: "Lemon Mint Mocktail", quantity: 2, price: 6.75 },
    ],
    totalAmount: 74.5,
    status: "SERVED",
    orderTime: "18:30 PM",
  },
  {
    id: "ORD-2",
    orderNumber: "ORD-9023",
    tableId: 3,
    customerName: "James Henderson",
    items: [
      { name: "Classic Beef Burger", quantity: 2, price: 18.0 },
      { name: "Iced Tea", quantity: 2, price: 5.5 },
    ],
    totalAmount: 47.0,
    status: "PREPARING",
    orderTime: "18:45 PM",
  },
  {
    id: "ORD-3",
    orderNumber: "ORD-9025",
    tableId: 4,
    customerName: "Sophia Martinez",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 19.0 },
      { name: "Craft Soda", quantity: 2, price: 8.0 },
    ],
    totalAmount: 35.0,
    status: "PENDING",
    orderTime: "19:05 PM",
  },
  {
    id: "ORD-4",
    orderNumber: "ORD-9028",
    tableId: 5,
    customerName: "Liam Johnson",
    items: [
      { name: "Truffle Mushroom Pasta", quantity: 1, price: 22.5 },
      { name: "Cappuccino", quantity: 2, price: 7.0 },
    ],
    totalAmount: 36.5,
    status: "SERVED",
    orderTime: "18:50 PM",
  },
];

const FoodManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Tables" | "Menu" | "Orders">("Tables");
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("ALL");
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    category: "Main Course",
    price: 15.0,
    isAvailable: true,
    preparationTime: "15 mins",
    description: "",
    calories: 400,
  });

  // Orders State
  const [orders, setOrders] = useState<LiveOrder[]>(initialLiveOrders);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [orderTableFilter, setOrderTableFilter] = useState("ALL");

  // Dynamic Primary Action
  const handlePrimaryAction = () => {
    if (activeTab === "Tables") {
      setIsAddTableModalOpen(true);
    } else if (activeTab === "Menu") {
      setShowAddMenuModal(true);
    }
  };

  // Add Dish
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.name.trim()) {
      toast.error("Please enter a dish name!");
      return;
    }
    const item: MenuItem = {
      ...newMenuItem,
      id: `M-${Date.now().toString().slice(-4)}`,
    };
    setMenuItems([item, ...menuItems]);
    toast.success(`Dish "${item.name}" added to menu!`);
    setShowAddMenuModal(false);
    setNewMenuItem({
      name: "",
      category: "Main Course",
      price: 15.0,
      isAvailable: true,
      preparationTime: "15 mins",
      description: "",
      calories: 400,
    });
  };

  // Toggle Availability
  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    toast.success("Dish availability updated!");
  };

  // Delete Dish
  const handleDeleteMenuItem = (id: string, name: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Removed "${name}" from menu!`);
  };

  // Order Status Change
  const handleUpdateOrderStatus = (orderId: string, newStatus: LiveOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat =
      menuCategoryFilter === "ALL" ||
      item.category.toUpperCase() === menuCategoryFilter.toUpperCase();
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.tableId.toString().includes(orderSearch);
    const matchesStatus =
      orderStatusFilter === "ALL" || order.status === orderStatusFilter;
    const matchesTable =
      orderTableFilter === "ALL" ||
      order.tableId.toString() === orderTableFilter;
    return matchesSearch && matchesStatus && matchesTable;
  });

  return (
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* ================= TOP HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">
            Food & Tables Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage restaurant floor tables, active menus, and real-time orders
          </p>
        </div>

        {activeTab !== "Orders" && (
          <div className="flex items-center gap-3">
            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === "Tables" ? "Add Table" : "Add Dish"}</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= TABS SWITCHER ================= */}
      <div className="w-full bg-[#131b2e] rounded-2xl p-1.5 border border-[#1F2E4D] shadow-sm flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("Tables")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${activeTab === "Tables"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
            }`}
        >
          Tables Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("Menu")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${activeTab === "Menu"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
            }`}
        >
          Menu Catalog
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("Orders")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${activeTab === "Orders"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
            }`}
        >
          Active Orders
        </button>
      </div>

      {/* ================= TAB 1: TABLES VIEW ================= */}
      {activeTab === "Tables" && (
        <FootTable
          isAddModalOpen={isAddTableModalOpen}
          onCloseAddModal={() => setIsAddTableModalOpen(false)}
          onOpenAddModal={() => setIsAddTableModalOpen(true)}
        />
      )}

      {/* ================= TAB 2: MENU VIEW ================= */}
      {activeTab === "Menu" && (
        <div className="w-full space-y-6 animate-in fade-in duration-200">
          {/* Search & Categories Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131b2e] p-4 sm:p-5 rounded-2xl border border-[#1F2E4D] shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search menu dishes..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] focus:border-blue-500/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350] transition-all"
              />
            </div>

            {/* Right Side Professional Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter Dropdown */}
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
                <div className="flex items-center gap-2 pointer-events-none">
                  <div className="w-5 h-5 rounded-md bg-[#052350] border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Filter className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category:</span>
                  <span className="text-xs font-bold text-white">
                    {menuCategoryFilter === "ALL" ? "All Categories" : menuCategoryFilter}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
                </div>
                <select
                  value={menuCategoryFilter}
                  onChange={(e) => setMenuCategoryFilter(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-[#131b2e] text-white">All Categories</option>
                  <option value="Main Course" className="bg-[#131b2e] text-white">Main Course</option>
                  <option value="Appetizer" className="bg-[#131b2e] text-white">Appetizer</option>
                  <option value="Dessert" className="bg-[#131b2e] text-white">Dessert</option>
                  <option value="Beverage" className="bg-[#131b2e] text-white">Beverage</option>
                  <option value="Special" className="bg-[#131b2e] text-white">Special</option>
                </select>
              </div>
            </div>
          </div>

          {/* Menu Table Card */}
          <div className="bg-[#131b2e] rounded-2xl border border-[#1F2E4D] shadow-sm overflow-hidden text-slate-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1F2E4D] bg-[#1a243d] text-slate-300 text-sm">
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Item Name</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Category</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Price</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Prep Time</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Availability</th>
                    <th className="py-4.5 px-6 sm:px-8 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2E4D]/60 text-sm">
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#1a243d]/45 transition-colors duration-150"
                      >
                        <td className="py-4.5 px-6 sm:px-8">
                          <div className="font-semibold text-white">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4.5 px-6 sm:px-8">
                          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#1a243d] border border-[#1F2E4D] text-slate-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 sm:px-8 font-bold text-white">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-4.5 px-6 sm:px-8 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.preparationTime}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6 sm:px-8">
                          <button
                            type="button"
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${item.isAvailable
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}
                          >
                            {item.isAvailable ? "In Stock" : "Out of Stock"}
                          </button>
                        </td>
                        <td className="py-4.5 px-6 sm:px-8">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteMenuItem(item.id, item.name)}
                              title="Delete Item"
                              className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Utensils className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-300">No dishes found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDERS VIEW ================= */}
      {activeTab === "Orders" && (
        <div className="w-full space-y-6 animate-in fade-in duration-200">
          {/* Order Search & Professional Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131b2e] p-4 sm:p-5 rounded-2xl border border-[#1F2E4D] shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders by number, table, customer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] focus:border-blue-500/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350] transition-all"
              />
            </div>

            {/* Right Side Professional Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Dropdown Filter */}
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
                <div className="flex items-center gap-2 pointer-events-none">
                  <div className="w-5 h-5 rounded-md bg-[#052350] border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Filter className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
                  <span className="text-xs font-bold text-white capitalize">
                    {orderStatusFilter === "ALL" ? "All Statuses" : orderStatusFilter.toLowerCase()}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-[#131b2e] text-white">All Statuses</option>
                  <option value="PENDING" className="bg-[#131b2e] text-white">Pending</option>
                  <option value="PREPARING" className="bg-[#131b2e] text-white">Preparing</option>
                  <option value="SERVED" className="bg-[#131b2e] text-white">Served</option>
                  <option value="COMPLETED" className="bg-[#131b2e] text-white">Completed</option>
                </select>
              </div>

              {/* Table / Location Dropdown Filter */}
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
                <div className="flex items-center gap-2 pointer-events-none">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Table:</span>
                  <span className="text-xs font-bold text-white">
                    {orderTableFilter === "ALL" ? "All Tables" : orderTableFilter === "Takeaway" ? "Takeaway" : `Table #${orderTableFilter}`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
                </div>
                <select
                  value={orderTableFilter}
                  onChange={(e) => setOrderTableFilter(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-[#131b2e] text-white">All Tables</option>
                  <option value="1" className="bg-[#131b2e] text-white">Table #1</option>
                  <option value="2" className="bg-[#131b2e] text-white">Table #2</option>
                  <option value="3" className="bg-[#131b2e] text-white">Table #3</option>
                  <option value="4" className="bg-[#131b2e] text-white">Table #4</option>
                  <option value="5" className="bg-[#131b2e] text-white">Table #5</option>
                  <option value="Takeaway" className="bg-[#131b2e] text-white">Takeaway</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#131b2e] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#1F2E4D] flex flex-col justify-between gap-4 hover:border-[#3A5CFF]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#1F2E4D]/70 pb-3.5 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-base">{order.orderNumber}</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#1a243d] border border-[#1F2E4D] text-xs font-semibold text-slate-300">
                        Table #{order.tableId}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${order.status === "SERVED"
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : order.status === "PREPARING"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : order.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-slate-300"
                      >
                        <span className="font-medium">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono text-slate-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#1F2E4D]/70 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Total Bill</span>
                    <span className="text-base font-bold text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "PREPARING")}
                        className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Start Prep
                      </button>
                    )}
                    {order.status === "PREPARING" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "SERVED")}
                        className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Mark Served
                      </button>
                    )}
                    {order.status === "SERVED" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "COMPLETED")}
                        className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Complete Bill
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ADD MENU ITEM MODAL ================= */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#1F2E4D] relative text-white">
            <button
              onClick={() => setShowAddMenuModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1a243d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#052350] border border-[#1F2E4D] flex items-center justify-center text-white">
                <Utensils className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add Menu Dish</h3>
                <p className="text-xs text-slate-400">Add a new item to the restaurant catalog</p>
              </div>
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ribeye Steak"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newMenuItem.category}
                    onChange={(e) =>
                      setNewMenuItem({
                        ...newMenuItem,
                        category: e.target.value as MenuItem["category"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  >
                    <option value="Main Course" className="bg-[#131b2e] text-white">Main Course</option>
                    <option value="Appetizer" className="bg-[#131b2e] text-white">Appetizer</option>
                    <option value="Dessert" className="bg-[#131b2e] text-white">Dessert</option>
                    <option value="Beverage" className="bg-[#131b2e] text-white">Beverage</option>
                    <option value="Special" className="bg-[#131b2e] text-white">Special</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMenuItem.price}
                    onChange={(e) =>
                      setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preparation Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15-20 mins"
                  value={newMenuItem.preparationTime}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, preparationTime: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of ingredients or preparation..."
                  value={newMenuItem.description}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white text-sm font-semibold rounded-full shadow-sm transition-all cursor-pointer"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;

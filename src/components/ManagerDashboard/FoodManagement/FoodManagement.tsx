import React, { useState } from "react";
import {
  Plus,
  Utensils,
  Search,
  Clock,
  Trash2,
  Pencil,
  X,
  Filter,
  ChevronDown,
  Loader2,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import FootTable from "./FootTable";
import NewOrderModal from "./NewOrderModal";
import {
  useGetMenuItemsQuery,
  useGetMenuCategoriesQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useGetOrdersQuery,
  useGetOrderSummaryQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "@/redux/features/manager/ManageFood/manageFoodApi";
import {
  IMenuItem,
  IOrder,
  OrderStatus,
} from "@/redux/features/manager/ManageFood/manageFoodType";

// Fallbacks for offline / initial development
const fallbackMenuItems: IMenuItem[] = [
  {
    id: "M-1",
    name: "Grilled Salmon Steak",
    category: "Main Course",
    price: 24.5,
    formattedPrice: "$24.50",
    isAvailable: true,
    prepTime: "20-25 mins",
    description: "Atlantic salmon with herbs butter and fresh asparagus",
  },
  {
    id: "M-2",
    name: "Classic Beef Burger",
    category: "Main Course",
    price: 18.0,
    formattedPrice: "$18.00",
    isAvailable: true,
    prepTime: "15 mins",
    description: "Angus beef patty with cheddar cheese and crisp fries",
  },
  {
    id: "M-3",
    name: "Margherita Pizza",
    category: "Main Course",
    price: 19.0,
    formattedPrice: "$19.00",
    isAvailable: true,
    prepTime: "15-20 mins",
    description: "San Marzano tomatoes, fresh buffalo mozzarella, basil",
  },
  {
    id: "M-4",
    name: "Caesar Salad",
    category: "Appetizer",
    price: 12.0,
    formattedPrice: "$12.00",
    isAvailable: true,
    prepTime: "10 mins",
    description: "Crispy romaine, parmesan shavings, garlic croutons",
  },
  {
    id: "M-5",
    name: "Truffle Mushroom Pasta",
    category: "Main Course",
    price: 22.5,
    formattedPrice: "$22.50",
    isAvailable: true,
    prepTime: "18 mins",
    description: "Fettuccine in creamy black truffle and wild mushroom sauce",
  },
  {
    id: "M-6",
    name: "Lemon Mint Mocktail",
    category: "Beverage",
    price: 6.75,
    formattedPrice: "$6.75",
    isAvailable: true,
    prepTime: "5 mins",
    description: "Refreshing crushed ice beverage with fresh mint and lime",
  },
  {
    id: "M-7",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: 9.5,
    formattedPrice: "$9.50",
    isAvailable: false,
    prepTime: "12 mins",
    description: "Warm Belgian chocolate cake with bourbon vanilla gelato",
  },
];

const fallbackOrders: IOrder[] = [
  {
    id: "ORD-1",
    orderNumber: "ORD-9021",
    tableId: "1",
    tableNumber: "Table #1",
    status: "SERVED",
    totalBill: 74.5,
    actionButton: "Complete Bill",
    nextStatus: "COMPLETED",
    items: [
      { name: "Grilled Salmon Steak", quantity: 2, unitPrice: 24.5, totalPrice: 49.0 },
      { name: "Caesar Salad", quantity: 1, unitPrice: 12.0, totalPrice: 12.0 },
      { name: "Lemon Mint Mocktail", quantity: 2, unitPrice: 6.75, totalPrice: 13.5 },
    ],
    notes: "No onions | Extra cutlery",
  },
  {
    id: "ORD-2",
    orderNumber: "ORD-9023",
    tableId: "3",
    tableNumber: "Table #3",
    status: "PREPARING",
    totalBill: 47.0,
    actionButton: "Mark Served",
    nextStatus: "SERVED",
    items: [
      { name: "Classic Beef Burger", quantity: 2, unitPrice: 18.0, totalPrice: 36.0 },
      { name: "Iced Tea", quantity: 2, unitPrice: 5.5, totalPrice: 11.0 },
    ],
  },
  {
    id: "ORD-3",
    orderNumber: "ORD-9025",
    tableId: "4",
    tableNumber: "Table #4",
    status: "PENDING",
    totalBill: 35.0,
    actionButton: "Start Prep",
    nextStatus: "PREPARING",
    items: [
      { name: "Margherita Pizza", quantity: 1, unitPrice: 19.0, totalPrice: 19.0 },
      { name: "Craft Soda", quantity: 2, unitPrice: 8.0, totalPrice: 16.0 },
    ],
  },
];

const FoodManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Tables" | "Menu" | "Orders">("Tables");
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // -------------------------------------------------------------
  // Menu RTK Query State & Hooks
  // -------------------------------------------------------------
  const [menuSearch, setMenuSearch] = useState("");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("ALL");
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<IMenuItem | null>(null);
  const [deleteMenuId, setDeleteMenuId] = useState<{ id: string; name: string } | null>(null);

  const {
    data: menuApiData,
    isLoading: isMenuLoading,
    isFetching: isMenuFetching,
  } = useGetMenuItemsQuery({
    search: menuSearch || undefined,
    category: menuCategoryFilter !== "ALL" ? menuCategoryFilter : undefined,
  });

  const { data: menuCategoriesData } = useGetMenuCategoriesQuery();

  const [createMenuItem, { isLoading: isCreatingMenu }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdatingMenu }] = useUpdateMenuItemMutation();
  const [deleteMenuItem, { isLoading: isDeletingMenu }] = useDeleteMenuItemMutation();
  const [toggleAvailability] = useToggleMenuItemAvailabilityMutation();

  const [newMenuItem, setNewMenuItem] = useState<{
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
    prepTime: string;
    description: string;
  }>({
    name: "",
    category: "Main Course",
    price: 15.0,
    isAvailable: true,
    prepTime: "15-20 mins",
    description: "",
  });

  // -------------------------------------------------------------
  // Orders RTK Query State & Hooks
  // -------------------------------------------------------------
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");
  const [orderTableFilter, setOrderTableFilter] = useState("ALL");
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const {
    data: ordersApiData,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useGetOrdersQuery({
    search: orderSearch || undefined,
    status: orderStatusFilter !== "ALL" ? orderStatusFilter : undefined,
    tableId: orderTableFilter !== "ALL" ? orderTableFilter : undefined,
  });

  const { data: ordersSummaryData } = useGetOrderSummaryQuery();

  const [updateOrderStatus, { isLoading: isUpdatingOrderStatus }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();

  // Resolved list of Menu Items & Orders
  const menuItems: IMenuItem[] =
    menuApiData?.data && menuApiData.data.length > 0 ? menuApiData.data : fallbackMenuItems;

  const orders: IOrder[] =
    ordersApiData?.data && ordersApiData.data.length > 0 ? ordersApiData.data : fallbackOrders;

  // Filtered Menu Items in memory for fallback
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(menuSearch.toLowerCase())) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat =
      menuCategoryFilter === "ALL" ||
      item.category.toUpperCase() === menuCategoryFilter.toUpperCase();
    return matchesSearch && matchesCat;
  });

  // Filtered Orders in memory for fallback
  const filteredOrders = orders.filter((order) => {
    const searchLower = orderSearch.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchLower) ||
      (order.tableNumber && order.tableNumber.toLowerCase().includes(searchLower)) ||
      (order.notes && order.notes.toLowerCase().includes(searchLower));
    const matchesStatus =
      orderStatusFilter === "ALL" || order.status === orderStatusFilter;
    const matchesTable =
      orderTableFilter === "ALL" ||
      order.tableId === orderTableFilter ||
      order.tableNumber.includes(orderTableFilter);
    return matchesSearch && matchesStatus && matchesTable;
  });

  // Categories list (dynamic from API or fallback)
  const dynamicCategories = menuCategoriesData?.data
    ? Object.keys(menuCategoriesData.data)
    : [];
  const availableCategories =
    menuApiData?.categories ||
    (dynamicCategories.length > 0
      ? ["ALL", ...dynamicCategories]
      : [
          "ALL",
          "Main Course",
          "Appetizer",
          "Dessert",
          "Beverage",
          "Special",
        ]);

  // Dynamic Primary Action
  const handlePrimaryAction = () => {
    if (activeTab === "Tables") {
      setIsAddTableModalOpen(true);
    } else if (activeTab === "Menu") {
      setShowAddMenuModal(true);
    } else if (activeTab === "Orders") {
      setIsNewOrderModalOpen(true);
    }
  };

  // -------------------------------------------------------------
  // Menu Item Actions
  // -------------------------------------------------------------
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.name.trim()) {
      toast.error("Please enter a dish name!");
      return;
    }

    try {
      await createMenuItem({
        name: newMenuItem.name.trim(),
        category: newMenuItem.category,
        price: Number(newMenuItem.price) || 0,
        prepTime: newMenuItem.prepTime,
        isAvailable: newMenuItem.isAvailable,
        description: newMenuItem.description.trim(),
      }).unwrap();

      toast.success(`Dish "${newMenuItem.name}" added to menu!`);
      setShowAddMenuModal(false);
      setNewMenuItem({
        name: "",
        category: "Main Course",
        price: 15.0,
        isAvailable: true,
        prepTime: "15-20 mins",
        description: "",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add menu item");
    }
  };

  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;

    try {
      await updateMenuItem({
        id: editingMenuItem.id,
        name: editingMenuItem.name,
        category: editingMenuItem.category,
        price: editingMenuItem.price,
        prepTime: editingMenuItem.prepTime,
        isAvailable: editingMenuItem.isAvailable,
        description: editingMenuItem.description,
      }).unwrap();

      toast.success(`Dish "${editingMenuItem.name}" updated successfully!`);
      setEditingMenuItem(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update menu item");
    }
  };

  const handleToggleItemAvailability = async (id: string) => {
    try {
      const res = await toggleAvailability(id).unwrap();
      toast.success(res.message || "Dish availability updated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle availability");
    }
  };

  const handleConfirmDeleteMenuItem = async () => {
    if (!deleteMenuId) return;
    try {
      await deleteMenuItem(deleteMenuId.id).unwrap();
      toast.success(`Removed "${deleteMenuId.name}" from menu!`);
      setDeleteMenuId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete menu item");
    }
  };

  // -------------------------------------------------------------
  // Order Actions
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (order: IOrder) => {
    let nextStatus: OrderStatus = "PREPARING";
    if (order.status === "PENDING") nextStatus = "PREPARING";
    else if (order.status === "PREPARING") nextStatus = "SERVED";
    else if (order.status === "SERVED") nextStatus = "COMPLETED";
    else return;

    try {
      const res = await updateOrderStatus({ id: order.id, status: nextStatus }).unwrap();
      toast.success(res.message || `Order status updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to update order status`);
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!deleteOrderId) return;
    try {
      await deleteOrder(deleteOrderId).unwrap();
      toast.success(`Order cancelled & removed successfully!`);
      setDeleteOrderId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete order");
    }
  };

  const ordersSummary = ordersSummaryData?.data || ordersApiData?.summary || {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    preparing: orders.filter((o) => o.status === "PREPARING").length,
    served: orders.filter((o) => o.status === "SERVED").length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* ================= TOP HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">
            Food & Tables Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage restaurant floor tables, active dishes, and real-time orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dynamic Primary Action Button */}
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === "Tables"
                ? "Add Table"
                : activeTab === "Menu"
                ? "Add Dish"
                : "Create Order"}
            </span>
          </button>
        </div>
      </div>

      {/* ================= TABS SWITCHER ================= */}
      <div className="w-full bg-[#131b2e] rounded-2xl p-1.5 border border-[#1F2E4D] shadow-sm flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("Tables")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
            activeTab === "Tables"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
          }`}
        >
          Floor Tables
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("Menu")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
            activeTab === "Menu"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
          }`}
        >
          Menu Dish Catalog
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("Orders")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
            activeTab === "Orders"
              ? "bg-[#052350] text-white border border-[#1F2E4D] shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-[#1a243d]"
          }`}
        >
          Kitchen & Active Orders ({ordersSummary.total})
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
                placeholder="Search menu dishes by name or description..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] focus:border-blue-500/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#052350] transition-all"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
                <div className="flex items-center gap-2 pointer-events-none">
                  <div className="w-5 h-5 rounded-md bg-[#052350] border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Filter className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Category:
                  </span>
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
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#131b2e] text-white">
                      {cat === "ALL" ? "All Categories" : cat}
                    </option>
                  ))}
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
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Dish Item</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Category</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Price</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Prep Time</th>
                    <th className="py-4.5 px-6 sm:px-8 font-semibold">Stock Status</th>
                    <th className="py-4.5 px-6 sm:px-8 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2E4D]/60 text-sm">
                  {isMenuLoading || isMenuFetching ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-400" />
                        <p className="text-sm">Loading menu dishes...</p>
                      </td>
                    </tr>
                  ) : filteredMenuItems.length > 0 ? (
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
                        <td className="py-4.5 px-6 sm:px-8 font-bold text-white font-mono">
                          {item.formattedPrice || `$${Number(item.price).toFixed(2)}`}
                        </td>
                        <td className="py-4.5 px-6 sm:px-8 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.prepTime || "15-20 mins"}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-6 sm:px-8">
                          <button
                            type="button"
                            onClick={() => handleToggleItemAvailability(item.id)}
                            className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                              item.isAvailable
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {item.isAvailable ? "In Stock" : "Out of Stock"}
                          </button>
                        </td>
                        <td className="py-4.5 px-6 sm:px-8">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => setEditingMenuItem(item)}
                              title="Edit Dish"
                              className="w-9 h-9 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteMenuId({ id: item.id, name: item.name })}
                              title="Delete Dish"
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

            {/* Right Side Status & Table Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
                <div className="flex items-center gap-2 pointer-events-none">
                  <div className="w-5 h-5 rounded-md bg-[#052350] border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Filter className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Status:
                  </span>
                  <span className="text-xs font-bold text-white capitalize">
                    {orderStatusFilter === "ALL" ? `All (${ordersSummary.total})` : orderStatusFilter.toLowerCase()}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-[#131b2e] text-white">
                    All Orders ({ordersSummary.total})
                  </option>
                  <option value="PENDING" className="bg-[#131b2e] text-white">
                    Pending ({ordersSummary.pending})
                  </option>
                  <option value="PREPARING" className="bg-[#131b2e] text-white">
                    Preparing ({ordersSummary.preparing})
                  </option>
                  <option value="SERVED" className="bg-[#131b2e] text-white">
                    Served ({ordersSummary.served})
                  </option>
                  <option value="COMPLETED" className="bg-[#131b2e] text-white">
                    Completed ({ordersSummary.completed})
                  </option>
                </select>
              </div>

              {/* Table / Location Filter */}
              <div className="relative flex items-center bg-[#1a243d] hover:bg-[#202c4b] border border-[#1F2E4D] hover:border-blue-500/50 rounded-xl px-3.5 py-2 transition-all shadow-xs cursor-pointer group">
                <div className="flex items-center gap-2 pointer-events-none">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Table:
                  </span>
                  <span className="text-xs font-bold text-white">
                    {orderTableFilter === "ALL" ? "All Tables" : `Table #${orderTableFilter}`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors ml-1" />
                </div>
                <select
                  value={orderTableFilter}
                  onChange={(e) => setOrderTableFilter(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
                >
                  <option value="ALL" className="bg-[#131b2e] text-white">
                    All Tables
                  </option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isOrdersLoading || isOrdersFetching ? (
              <div className="col-span-full py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-400" />
                <p className="text-sm">Loading kitchen & active orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const isPending = order.status === "PENDING";
                const isPreparing = order.status === "PREPARING";
                const isServed = order.status === "SERVED";
                const isCompleted = order.status === "COMPLETED";

                return (
                  <div
                    key={order.id}
                    className="bg-[#131b2e] rounded-2xl p-5 shadow-sm border border-[#1F2E4D] flex flex-col justify-between gap-4 hover:border-[#3A5CFF]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#1F2E4D]/70 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">
                            {order.orderNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#1a243d] border border-[#1F2E4D] text-xs font-semibold text-slate-300">
                            {order.tableNumber || `Table #${order.tableId}`}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
                            isServed
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              : isPreparing
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : isCompleted
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {order.notes && (
                        <p className="text-xs text-slate-400 italic mb-3 bg-[#1a243d]/60 p-2 rounded-lg border border-[#1F2E4D]/40">
                          {order.notes}
                        </p>
                      )}

                      <div className="space-y-2 mb-3">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-slate-300"
                          >
                            <span className="font-medium">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-mono text-slate-400 font-semibold">
                              ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1F2E4D]/70 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">Total Bill</span>
                        <span className="text-base font-bold text-white font-mono">
                          {order.formattedTotal || `$${Number(order.totalBill || 0).toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order)}
                            disabled={isUpdatingOrderStatus}
                            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Start Prep
                          </button>
                        )}
                        {isPreparing && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order)}
                            disabled={isUpdatingOrderStatus}
                            className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Mark Served
                          </button>
                        )}
                        {isServed && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order)}
                            disabled={isUpdatingOrderStatus}
                            className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Complete Bill
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteOrderId(order.id)}
                          title="Cancel Order"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center text-slate-400">
                <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-semibold text-slate-300">No active orders</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Create Order" to start a new order
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ADD MENU DISH MODAL ================= */}
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
                        category: e.target.value,
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
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350] font-mono"
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
                  value={newMenuItem.prepTime}
                  onChange={(e) =>
                    setNewMenuItem({ ...newMenuItem, prepTime: e.target.value })
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
                  placeholder="Short description of ingredients..."
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
                  disabled={isCreatingMenu}
                  className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white text-sm font-semibold rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  {isCreatingMenu && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Add Dish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MENU DISH MODAL ================= */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#1F2E4D] relative text-white">
            <button
              onClick={() => setEditingMenuItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-[#1a243d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit Menu Dish</h3>
                <p className="text-xs text-slate-400">Update dish details, pricing, and category</p>
              </div>
            </div>

            <form onSubmit={handleUpdateMenuItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={editingMenuItem.name}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={editingMenuItem.category}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        category: e.target.value,
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
                    value={editingMenuItem.price}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preparation Time
                </label>
                <input
                  type="text"
                  value={editingMenuItem.prepTime || ""}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, prepTime: e.target.value })
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
                  value={editingMenuItem.description || ""}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#052350]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(null)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingMenu}
                  className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white text-sm font-semibold rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  {isUpdatingMenu && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Update Dish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE MENU ITEM DIALOG ================= */}
      {deleteMenuId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#1F2E4D] text-center text-white">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Delete Dish?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to remove "{deleteMenuId.name}" from the menu catalog?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteMenuId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteMenuItem}
                disabled={isDeletingMenu}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeletingMenu && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE ORDER DIALOG ================= */}
      {deleteOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#1F2E4D] text-center text-white">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Cancel Order?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to cancel and remove this active order?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteOrderId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-[#1a243d] rounded-xl transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmDeleteOrder}
                disabled={isDeletingOrder}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {isDeletingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Cancel Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW ORDER MODAL ================= */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        menuItems={menuItems}
      />
    </div>
  );
};

export default FoodManagement;

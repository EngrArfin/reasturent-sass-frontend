// src/components/ManagerDashboard/Inventory/InventoryTable.tsx
import React, { useState } from "react";
import {
  PlusCircle,
  RefreshCw,
  Printer,
  Trash2,
  Edit,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DollarSign,
  Boxes,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { toast } from "sonner";
import NewInventory from "./NewInventory";
import {
  useGetProductsQuery,
  useGetInventorySummaryQuery,
  useDeleteProductMutation,
  useAdjustProductStockMutation,
  useLazyGetBarcodeLabelQuery,
} from "@/redux/features/manager/InventoryManagement/InventoryManagementApi";
import {
  IProduct,
  StockStatus,
  BarcodeLabelData,
} from "@/redux/features/manager/InventoryManagement/InventoryManagementType";

const InventoryTable: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Filters and Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [stockStatus, setStockStatus] = useState<StockStatus>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [stockAdjustProduct, setStockAdjustProduct] = useState<IProduct | null>(null);
  const [stockAdjustmentType, setStockAdjustmentType] = useState<"SET" | "ADD" | "SUBTRACT">("SET");
  const [stockQuantity, setStockQuantity] = useState<number | string>(0);
  const [stockNotes, setStockNotes] = useState("");

  const [labelData, setLabelData] = useState<BarcodeLabelData | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  // RTK Query hooks
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    refetch: refetchProducts,
  } = useGetProductsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    stockStatus: stockStatus !== "ALL" ? stockStatus : undefined,
  });

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetInventorySummaryQuery();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [adjustStock, { isLoading: isAdjustingStock }] = useAdjustProductStockMutation();
  const [fetchBarcodeLabel] = useLazyGetBarcodeLabelQuery();

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchProducts(), refetchSummary()]);
      toast.success("Inventory data refreshed!");
    } catch {
      toast.error("Failed to refresh data.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      const res = await deleteProduct(productToDelete.id).unwrap();
      toast.success(res?.message || `Deleted "${productToDelete.name}" successfully!`);
      setProductToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  const handleOpenStockModal = (product: IProduct) => {
    setStockAdjustProduct(product);
    setStockAdjustmentType("SET");
    setStockQuantity(product.stock);
    setStockNotes("");
  };

  const handleStockAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustProduct) return;

    const qty = Number(stockQuantity);
    if (isNaN(qty) || qty < 0) {
      toast.error("Please enter a valid stock number");
      return;
    }

    try {
      const res = await adjustStock({
        id: stockAdjustProduct.id,
        body: {
          quantity: qty,
          type: stockAdjustmentType,
          notes: stockNotes.trim() || undefined,
        },
      }).unwrap();

      toast.success(
        `Updated stock for "${res.name}": ${res.stock} items in stock.`
      );
      setStockAdjustProduct(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to adjust stock level");
    }
  };

  const handleOpenLabelModal = async (product: IProduct) => {
    try {
      const data = await fetchBarcodeLabel(product.id).unwrap();
      setLabelData(data);
      setIsLabelModalOpen(true);
    } catch {
      // Fallback label data from product
      setLabelData({
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        sku: product.sku || product.barcode,
        price: product.price,
        formattedPrice: product.formattedPrice || `$${product.price.toFixed(2)}`,
        stock: product.stock,
        businessName: product.business?.businessName || product.businessName || "Restaurant Store",
        printLabelData: {
          text: product.name,
          code: product.barcode,
          priceTag: product.formattedPrice || `$${product.price.toFixed(2)}`,
          generatedAt: new Date().toISOString(),
        },
      });
      setIsLabelModalOpen(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const productsList = productsData?.items || [];
  const total = productsData?.total || 0;
  const totalPages = productsData?.totalPages || Math.ceil(total / limit) || 1;

  return (
    <div className="w-full space-y-6">
      {/* Top Header / Add Product Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Boxes className="w-6 h-6 text-orange-500" />
            <span>Inventory Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time restaurant stock monitoring, barcode catalog & valuation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddForm(!showAddForm);
            }}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-md cursor-pointer flex items-center gap-2 border border-orange-500/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showAddForm ? "Hide Form" : "Add Product"}</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Products */}
        <div
          onClick={() => {
            setStockStatus("ALL");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-[#131b2e] border transition-all cursor-pointer hover:border-slate-500/50 ${
            stockStatus === "ALL" ? "border-orange-500/60 bg-[#162138]" : "border-[#1F2E4D]"
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Items</span>
            <Package className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {isSummaryLoading ? "..." : summaryData?.totalProducts ?? total}
          </div>
          <span className="text-[11px] text-slate-400">All catalog products</span>
        </div>

        {/* In Stock */}
        <div
          onClick={() => {
            setStockStatus("IN_STOCK");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-[#131b2e] border transition-all cursor-pointer hover:border-emerald-500/50 ${
            stockStatus === "IN_STOCK" ? "border-emerald-500/60 bg-emerald-950/10" : "border-[#1F2E4D]"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">In Stock</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">
            {isSummaryLoading ? "..." : summaryData?.inStockCount ?? 0}
          </div>
          <span className="text-[11px] text-emerald-400/80">Optimal stock levels</span>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => {
            setStockStatus("LOW_STOCK");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-[#131b2e] border transition-all cursor-pointer hover:border-amber-500/50 ${
            stockStatus === "LOW_STOCK" ? "border-amber-500/60 bg-amber-950/10" : "border-[#1F2E4D]"
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">
            {isSummaryLoading ? "..." : summaryData?.lowStockCount ?? 0}
          </div>
          <span className="text-[11px] text-amber-400/80">Restock needed</span>
        </div>

        {/* Out Of Stock */}
        <div
          onClick={() => {
            setStockStatus("OUT_OF_STOCK");
            setPage(1);
          }}
          className={`p-4 rounded-2xl bg-[#131b2e] border transition-all cursor-pointer hover:border-rose-500/50 ${
            stockStatus === "OUT_OF_STOCK" ? "border-rose-500/60 bg-rose-950/10" : "border-[#1F2E4D]"
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Out of Stock</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-400">
            {isSummaryLoading ? "..." : summaryData?.outOfStockCount ?? 0}
          </div>
          <span className="text-[11px] text-rose-400/80">Unavailable</span>
        </div>

        {/* Total Valuation */}
        <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-[#131b2e] border border-[#1F2E4D]">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Valuation</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            ${isSummaryLoading ? "..." : Number(summaryData?.totalInventoryValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">Total asset value</span>
        </div>
      </div>

      {/* Add / Edit Form Modal / Card */}
      {showAddForm && (
        <NewInventory
          initialData={editingProduct}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Inventory Table Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300 shadow-sm">
        {/* Search Row & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search input & Refresh */}
          <div className="flex items-center gap-3 flex-1 w-full max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by product name, barcode or SKU..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-orange-500/40 bg-[#1a243d] border border-[#1F2E4D] text-white placeholder-slate-400 text-sm shadow-inner"
              />
              <CiSearch
                onClick={handleSearch}
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Inventory"
              className="w-10 h-10 rounded-full bg-[#1a243d] hover:bg-[#232f4c] border border-[#1F2E4D] text-white flex items-center justify-center cursor-pointer shadow-sm flex-shrink-0 transition-all active:scale-95"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-300 ${
                  isProductsFetching ? "animate-spin text-orange-400" : ""
                }`}
              />
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(
              [
                { label: "All", value: "ALL" },
                { label: "In Stock", value: "IN_STOCK" },
                { label: "Low Stock", value: "LOW_STOCK" },
                { label: "Out of Stock", value: "OUT_OF_STOCK" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStockStatus(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  stockStatus === tab.value
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-[#1a243d] text-slate-300 hover:text-white hover:bg-[#243152] border border-[#1F2E4D]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="grid grid-cols-1 gap-5">
          <div className="w-full">
            <div className="w-full overflow-x-auto bg-[#131b2e] rounded-2xl border border-[#1F2E4D]">
              <table className="min-w-[850px] w-full text-sm text-slate-300">
                <thead className="border-b border-[#1F2E4D] bg-[#1a243d]/80">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-sm font-semibold">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-sm font-semibold">
                      Barcode / SKU
                    </th>
                    <th className="px-6 py-4 text-center whitespace-nowrap text-slate-300 text-sm font-semibold">
                      Stock Level
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-sm font-semibold">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center whitespace-nowrap text-slate-300 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isProductsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                          <span>Loading inventory products...</span>
                        </div>
                      </td>
                    </tr>
                  ) : productsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Package className="w-8 h-8 text-slate-500" />
                          <p className="text-base font-semibold text-slate-300">No products found</p>
                          <p className="text-xs text-slate-500">
                            {searchTerm || stockStatus !== "ALL"
                              ? "Try adjusting your search query or filter"
                              : "Get started by adding your first product to inventory"}
                          </p>
                          {(searchTerm || stockStatus !== "ALL") && (
                            <button
                              onClick={() => {
                                setSearchInput("");
                                setSearchTerm("");
                                setStockStatus("ALL");
                                setPage(1);
                              }}
                              className="mt-2 text-xs font-semibold text-orange-400 underline cursor-pointer hover:text-orange-300"
                            >
                              Reset filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    productsList.map((item) => {
                      const isOutOfStock = item.stock <= 0;
                      const isLowStock = !isOutOfStock && item.stock <= 5;

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/50 transition duration-150"
                        >
                          {/* Product Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-white tracking-wide">
                                  {item.name}
                                </div>
                                {item.createdAt && (
                                  <div className="text-[11px] text-slate-500">
                                    Added {new Date(item.createdAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Barcode & SKU */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-xs px-2.5 py-1 bg-[#1a243d] rounded-lg text-slate-200 border border-[#1F2E4D]">
                                {item.barcode}
                              </span>
                              {item.sku && item.sku !== item.barcode && (
                                <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-800/60 rounded text-slate-400 border border-slate-700/60">
                                  SKU: {item.sku}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Stock Status Badge */}
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold border ${
                                  isOutOfStock
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                    : isLowStock
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                }`}
                              >
                                {item.stock} {isOutOfStock ? "Out of Stock" : "In Stock"}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleOpenStockModal(item)}
                                title="Adjust Stock Quantity"
                                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#232f4c] transition cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <span className="whitespace-nowrap font-semibold text-white">
                              {item.formattedPrice || `$${Number(item.price || 0).toFixed(2)}`}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(item);
                                  setShowAddForm(true);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                title="Edit Product"
                                className="p-2 text-slate-300 bg-[#1a243d] hover:bg-[#232f4c] hover:text-white rounded-lg cursor-pointer transition border border-[#1F2E4D]"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Barcode Label */}
                              <button
                                type="button"
                                onClick={() => handleOpenLabelModal(item)}
                                title="Print Barcode Label"
                                className="p-2 text-slate-300 bg-[#1a243d] hover:bg-[#232f4c] hover:text-white rounded-lg cursor-pointer transition border border-[#1F2E4D]"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Product */}
                              <button
                                type="button"
                                onClick={() => setProductToDelete(item)}
                                title="Delete Product"
                                className="p-2 text-rose-400 bg-[#1a243d] hover:bg-rose-500/20 rounded-lg cursor-pointer transition border border-[#1F2E4D]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Server Pagination Controls */}
        {total > 0 && (
          <div className="mt-6 flex items-center justify-between px-2 sm:px-4 py-3 flex-wrap gap-3 border-t border-[#1F2E4D]/60 pt-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
              <span>
                Showing <span className="font-semibold text-white">{productsList.length}</span> of{" "}
                <span className="font-semibold text-white">{total}</span> products
              </span>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#1a243d] border border-[#1F2E4D] text-xs text-slate-300 rounded-lg px-2 py-1 outline-none cursor-pointer"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isProductsFetching}
                className="cursor-pointer rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-[#232f4c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <div className="min-w-[60px] rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-center text-xs sm:text-sm font-semibold text-white shadow-sm">
                {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isProductsFetching}
                className="cursor-pointer rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-[#232f4c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 1. Quick Stock Adjustment Modal */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#131b2e] rounded-3xl p-6 border border-[#1F2E4D] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2E4D]">
              <div>
                <h3 className="text-base font-bold text-white">Adjust Stock Level</h3>
                <p className="text-xs text-slate-400">{stockAdjustProduct.name} ({stockAdjustProduct.barcode})</p>
              </div>
              <button
                onClick={() => setStockAdjustProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#0b1220] rounded-xl border border-[#1F2E4D]">
                {(
                  [
                    { label: "Set Exact", value: "SET" },
                    { label: "+ Add Stock", value: "ADD" },
                    { label: "- Deduct", value: "SUBTRACT" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setStockAdjustmentType(t.value)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      stockAdjustmentType === t.value
                        ? "bg-orange-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Quantity Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {stockAdjustmentType === "SET"
                    ? "New Total Quantity"
                    : stockAdjustmentType === "ADD"
                    ? "Quantity to Add"
                    : "Quantity to Deduct"}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1220] border border-[#1F2E4D] text-white text-sm focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Adjustment Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Notes / Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shipment received from vendor"
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b1220] border border-[#1F2E4D] text-white text-sm focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2E4D]">
                <button
                  type="button"
                  onClick={() => setStockAdjustProduct(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1a243d] rounded-xl border border-[#1F2E4D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjustingStock}
                  className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAdjustingStock && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Barcode Label Printable Modal */}
      {isLabelModalOpen && labelData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#131b2e] rounded-3xl p-6 border border-[#1F2E4D] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2E4D]">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Barcode Label Preview</h3>
              </div>
              <button
                onClick={() => setIsLabelModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Tag Card */}
            <div
              id="printable-barcode-label"
              className="p-5 bg-white rounded-2xl text-slate-900 border-2 border-slate-300 shadow flex flex-col items-center justify-center text-center space-y-2"
            >
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                {labelData.businessName || "Restaurant Store"}
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {labelData.productName}
              </div>

              {/* Barcode representation */}
              <div className="py-2 px-4 bg-slate-50 rounded border border-dashed border-slate-300 w-full flex flex-col items-center">
                <div className="h-10 w-48 flex items-center justify-center gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-black"
                      style={{ width: i % 3 === 0 ? "3px" : i % 2 === 0 ? "2px" : "1px" }}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-slate-800 tracking-wider mt-1">
                  {labelData.barcode}
                </span>
              </div>

              <div className="text-lg font-black text-slate-900">
                {labelData.formattedPrice || `$${Number(labelData.price || 0).toFixed(2)}`}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1F2E4D]">
              <button
                type="button"
                onClick={() => setIsLabelModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1a243d] rounded-xl border border-[#1F2E4D]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#131b2e] rounded-3xl p-6 border border-[#1F2E4D] shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Product?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete <span className="text-white font-semibold">"{productToDelete.name}"</span> ({productToDelete.barcode})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#1a243d] rounded-xl border border-[#1F2E4D]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;

// src/components/ManagerDashboard/Inventory/NewInventory.tsx
import React, { useState, useEffect } from "react";
import { PlusCircle, Save, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useLazyGenerateSkuQuery,
} from "@/redux/features/manager/InventoryManagement/InventoryManagementApi";
import { IProduct } from "@/redux/features/manager/InventoryManagement/InventoryManagementType";

export interface NewInventoryProps {
  initialData?: IProduct | null;
  onSuccess?: (product: IProduct) => void;
  onCancel: () => void;
  onAddProduct?: (product: any) => void; // backwards compatibility
}

const NewInventory: React.FC<NewInventoryProps> = ({
  initialData,
  onSuccess,
  onCancel,
  onAddProduct,
}) => {
  const isEditing = Boolean(initialData?.id);

  const [name, setName] = useState(initialData?.name || "");
  const [barcode, setBarcode] = useState(initialData?.barcode || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [stock, setStock] = useState<number | string>(
    initialData?.stock !== undefined ? initialData.stock : ""
  );
  const [price, setPrice] = useState<number | string>(
    initialData?.price !== undefined ? initialData.price : ""
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [triggerGenerateSku, { isFetching: isGeneratingSku }] = useLazyGenerateSkuQuery();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setBarcode(initialData.barcode || "");
      setSku(initialData.sku || "");
      setStock(initialData.stock !== undefined ? initialData.stock : "");
      setPrice(initialData.price !== undefined ? initialData.price : "");
    }
  }, [initialData]);

  const handleGenerateBarcode = async () => {
    try {
      const res = await triggerGenerateSku().unwrap();
      if (res?.barcode) {
        setBarcode(res.barcode);
        if (res.sku) setSku(res.sku);
        toast.success(`Generated Code: ${res.barcode}`);
        return;
      }
    } catch {
      // Fallback client generator if offline
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const fallbackCode = `RENE-${randomNum}`;
      setBarcode(fallbackCode);
      setSku(fallbackCode);
      toast.info(`Generated Code: ${fallbackCode}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    const parsedStock = stock === "" ? 0 : Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }

    const parsedPrice = price === "" ? 0 : Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      if (isEditing && initialData?.id) {
        const updated = await updateProduct({
          id: initialData.id,
          body: {
            name: name.trim(),
            barcode: barcode.trim() || undefined,
            sku: sku.trim() || barcode.trim() || undefined,
            stock: parsedStock,
            price: parsedPrice,
          },
        }).unwrap();

        toast.success(`Product "${updated.name}" updated successfully!`);
        if (onSuccess) onSuccess(updated);
        onCancel();
      } else {
        const created = await createProduct({
          name: name.trim(),
          barcode: barcode.trim() || undefined,
          sku: sku.trim() || barcode.trim() || undefined,
          stock: parsedStock,
          initialStock: parsedStock,
          price: parsedPrice,
        }).unwrap();

        toast.success(`Product "${created.name}" created successfully!`);
        if (onSuccess) onSuccess(created);
        if (onAddProduct) onAddProduct(created);
        onCancel();
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.error ||
        "Failed to save product. Please check your inputs.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-5 sm:p-7 md:p-8 border border-[#1F2E4D] shadow-sm transition-all animate-in fade-in duration-300 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {isEditing ? "Edit Product Details" : "New Product Details"}
            </h2>
            <p className="text-xs text-slate-400">
              {isEditing
                ? "Update product pricing, barcode, or inventory stock levels"
                : "Create a new inventory item and assign unique barcodes"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a243d] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Product Name & Barcode/SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Product Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Product Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Farm Chicken"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
            />
          </div>

          {/* Barcode / SKU */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Barcode / SKU
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                placeholder="Leave blank to auto-generate (e.g. RENE-1001)"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  if (!sku) setSku(e.target.value);
                }}
                className="flex-1 w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
              <button
                type="button"
                disabled={isGeneratingSku}
                onClick={handleGenerateBarcode}
                className="px-5 py-3 rounded-full border border-amber-500/30 bg-[#1a243d] hover:bg-[#232f4c] text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all whitespace-nowrap active:scale-[0.98] flex-shrink-0 disabled:opacity-50"
              >
                {isGeneratingSku ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                <span>{isGeneratingSku ? "Generating..." : "Generate Code"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Initial Stock & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Initial Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              {isEditing ? "Stock Quantity" : "Initial Stock"} <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
            />
          </div>

          {/* Price ($) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Price ($) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]/60">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 border border-orange-500/40 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Save Product"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInventory;

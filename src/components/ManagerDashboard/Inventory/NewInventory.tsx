import React, { useState } from "react";
import { PlusCircle, Save, X } from "lucide-react";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  name: string;
  barcode: string;
  stock: number;
  price: number;
}

interface NewInventoryProps {
  onAddProduct: (product: Omit<InventoryItem, "id">) => void;
  onCancel: () => void;
}

const NewInventory: React.FC<NewInventoryProps> = ({ onAddProduct, onCancel }) => {
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [stock, setStock] = useState<number | string>(0);
  const [price, setPrice] = useState<number | string>(0);

  const handleGenerateBarcode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBarcode = `RENE-${randomNum}`;
    setBarcode(newBarcode);
    toast.info(`Generated Barcode: ${newBarcode}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    const finalBarcode = barcode.trim() || `RENE-${Math.floor(1000 + Math.random() * 9000)}`;
    const parsedStock = Number(stock) || 0;
    const parsedPrice = Number(price) || 0;

    onAddProduct({
      name: name.trim(),
      barcode: finalBarcode,
      stock: parsedStock,
      price: parsedPrice,
    });

    toast.success(`Product "${name.trim()}" added successfully!`);
    onCancel();
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-5 sm:p-7 md:p-8 border border-[#1F2E4D] shadow-sm transition-all animate-in fade-in duration-300 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          New Product Details
        </h2>
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
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Farm Chicken"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
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
                placeholder="Scan or enter code"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1 w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={handleGenerateBarcode}
                className="px-5 py-3 rounded-full border border-amber-500/30 bg-[#1a243d] hover:bg-[#232f4c] text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all whitespace-nowrap active:scale-[0.98] flex-shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Initial Stock & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Initial Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Initial Stock
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
            />
          </div>

          {/* Price ($) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]/60">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Product</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInventory;

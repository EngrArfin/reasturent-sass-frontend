import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import NewVoucher, { VoucherItem } from "./NewVoucher";

const initialVouchersData: VoucherItem[] = [
  {
    id: "1",
    name: "Whole Milk",
    requestedBy: "JOHN",
    minPrice: 72,
    originalPrice: 3.5,
    discountPercent: 14.3,
    discountAmount: 0.5,
    finalPrice: 3.0,
  },
  {
    id: "2",
    name: "Farm Chicken",
    requestedBy: "SARAH",
    minPrice: 50,
    originalPrice: 12.5,
    discountPercent: 10,
    discountAmount: 1.25,
    finalPrice: 11.25,
  },
  {
    id: "3",
    name: "Fresh Eggs",
    requestedBy: "EMILY",
    minPrice: 30,
    originalPrice: 4.5,
    discountPercent: 11.1,
    discountAmount: 0.5,
    finalPrice: 4.0,
  },
];

const VoucherList = () => {
  const [vouchers, setVouchers] = useState<VoucherItem[]>(initialVouchersData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);

  const handleAddOrUpdateVoucher = (voucherData: Omit<VoucherItem, "id">) => {
    if (editingVoucher) {
      setVouchers(
        vouchers.map((v) =>
          v.id === editingVoucher.id
            ? { ...voucherData, id: editingVoucher.id }
            : v
        )
      );
      setEditingVoucher(null);
    } else {
      const newVoucher: VoucherItem = {
        ...voucherData,
        id: Date.now().toString(),
      };
      setVouchers([newVoucher, ...vouchers]);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setVouchers(vouchers.filter((v) => v.id !== id));
    toast.success(`Removed voucher for "${name}"`);
  };

  const handleEdit = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header / Add Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Vouchers & Discounts
        </h1>

        <button
          type="button"
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingVoucher(null);
            } else {
              setShowAddForm(true);
            }
          }}
          className="px-6 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2"
        >
          <Plus
            className={`w-4 h-4 transition-transform duration-200 ${
              showAddForm ? "rotate-45" : ""
            }`}
          />
          <span>{showAddForm ? "Close Form" : "Add Voucher"}</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <NewVoucher
          onAddVoucher={handleAddOrUpdateVoucher}
          onCancel={() => {
            setShowAddForm(false);
            setEditingVoucher(null);
          }}
          initialData={editingVoucher}
        />
      )}

      {/* Voucher Cards List */}
      <div className="space-y-4">
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="w-full bg-[#131b2e] rounded-3xl p-5 sm:p-7 border border-[#1F2E4D] shadow-sm hover:shadow-md transition-all duration-200 space-y-6"
            >
              {/* Card Top: Details & Price Breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Product Name & Requester */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {voucher.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mt-1">
                    REQUESTED BY {voucher.requestedBy}
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-sm">
                  <span className="text-slate-400 font-medium">
                    Original: ${voucher.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-rose-400 font-semibold">
                    Discount: -${voucher.discountAmount.toFixed(2)}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Final: ${voucher.finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card Bottom: Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(voucher.id, voucher.name)}
                  className="w-full py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 font-semibold text-sm transition-all duration-200 cursor-pointer text-center"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(voucher)}
                  className="w-full py-2.5 rounded-full bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm text-center active:scale-[0.99]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#131b2e] rounded-3xl p-12 border border-[#1F2E4D] text-center text-slate-400">
            <p>No vouchers created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherList;

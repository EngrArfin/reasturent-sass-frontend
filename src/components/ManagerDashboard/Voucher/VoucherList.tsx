import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import NewVoucher from "./NewVoucher";
import {
  useGetVouchersQuery,
  useDeleteVoucherMutation,
  IVoucher,
} from "@/redux/features/manager/VouchersDiscounts/vouchersDiscountsApi";

const VoucherList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<IVoucher | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: vouchers = [], isLoading } = useGetVouchersQuery();
  const [deleteVoucher] = useDeleteVoucherMutation();

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await deleteVoucher(id).unwrap();
      toast.success(`Removed voucher for "${name}"`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.error || `Failed to delete voucher "${name}"`
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (voucher: IVoucher) => {
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
          onCancel={() => {
            setShowAddForm(false);
            setEditingVoucher(null);
          }}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingVoucher(null);
          }}
          initialData={editingVoucher}
        />
      )}

      {/* Voucher Cards List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-[#131b2e] rounded-3xl p-12 border border-[#1F2E4D] text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <p className="text-sm">Loading vouchers...</p>
          </div>
        ) : vouchers.length > 0 ? (
          vouchers.map((voucher) => {
            const isDeletingThis = deletingId === voucher.id;
            const originalFormatted =
              voucher.originalFormatted ||
              `$${(voucher.minimumPrice ?? voucher.originalPrice ?? 0).toFixed(2)}`;
            const discountFormatted =
              voucher.discountFormatted ||
              `-$${(voucher.amountOff ?? voucher.discountAmount ?? 0).toFixed(2)}`;
            const finalFormatted =
              voucher.finalFormatted ||
              `$${(voucher.finalPrice ?? 0).toFixed(2)}`;
            const requestedBy =
              voucher.requestedByFormatted ||
              `REQUESTED BY ${voucher.requestedBy || "SARAH"}`;

            return (
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
                      {requestedBy}
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-sm">
                    <span className="text-slate-400 font-medium">
                      Original: {originalFormatted}
                    </span>
                    <span className="text-rose-400 font-semibold">
                      Discount: {discountFormatted}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Final: {finalFormatted}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isDeletingThis}
                    onClick={() => handleDelete(voucher.id, voucher.name)}
                    className="w-full py-2.5 rounded-full border border-[#1F2E4D] bg-[#1a243d] hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 font-semibold text-sm transition-all duration-200 cursor-pointer text-center disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeletingThis && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Delete</span>
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
            );
          })
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


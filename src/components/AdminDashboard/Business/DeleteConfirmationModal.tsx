import React from "react";
import { Trash2, X, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="relative bg-[#131b2e] border border-[#1F2E4D] rounded-2xl p-6 max-w-[380px] w-full shadow-2xl text-center text-white animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute right-4 top-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a243d] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Formal Red Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Trash2 className="w-5 h-5" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white tracking-tight mb-2">
          {title}
        </h3>

        {/* Description / Message */}
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-300 hover:text-white bg-[#1a243d] hover:bg-[#232f4c] rounded-xl border border-[#1F2E4D] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.99] rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

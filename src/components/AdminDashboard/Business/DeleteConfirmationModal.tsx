import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[0.5px] transition-all duration-200">
      <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200 scale-100 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F2E4D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
              <FaExclamationTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-white transition-colors rounded-full p-1 hover:bg-[#1a243d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-slate-300 leading-relaxed">{message}</p>
              <p className="text-sm text-slate-400 mt-3">
                This action cannot be undone. The user will be permanently removed from the system.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1F2E4D] bg-[#1a243d]/30 rounded-b-2xl">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-[#1a243d] border border-[#1F2E4D] rounded-lg hover:bg-[#232f4c] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

import React from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  error,
  confirmText = "Konfirmasi",
  confirmColor = "bg-[#D97706] hover:bg-orange-500 text-black",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#120E0B] border border-[#251C18] rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        {error ? (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        ) : (
          ""
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 rounded-lg bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`cursor-pointer px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px] ${confirmColor}`}
          >
            {isLoading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

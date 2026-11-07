"use client";

import { useState } from "react";

export function useDeleteProduct() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteProduct = async (productId) => {
    if (!productId) return { success: false };
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus produk");
      }

      return { success: true, data: result };
    } catch (error) {
      const errMsg = error.message || "Terjadi kesalahan pada jaringan";
      setDeleteError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProduct,
    isDeleting,
    deleteError,
    setDeleteError,
  };
}

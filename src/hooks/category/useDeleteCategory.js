"use client";

import { useState } from "react";

export function useDeleteCategory() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteCategory = async (categoryId) => {
    if (!categoryId) return { success: false };
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus kategori");
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
    deleteCategory,
    isDeleting,
    deleteError,
    setDeleteError,
  };
}

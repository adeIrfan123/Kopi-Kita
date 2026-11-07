"use client";

import { useEffect, useState } from "react";

export function useUpdateCategory(categoryId) {
  const [categoryName, setCategoryName] = useState("");
  const [originalCategory, setOriginalCategory] = useState("");
  const [isLoading, setIsLoading] = useState(!!categoryId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFetchError("");

      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Kategori tidak ditemukan");
        }

        setCategoryName(result.category_name || "");
        setOriginalCategory(result.category_name || "");
      } catch (err) {
        setFetchError(err.message || "Gagal mengambil data kategori");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const updateCategory = async (newName) => {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name: newName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengupdate category");
      }

      return { success: true, data: result };
    } catch (err) {
      const errMsg = err.message || "Terjadi kesalahan pada server";
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    categoryName,
    setCategoryName,
    originalCategory,
    isLoading,
    isSaving,
    error,
    setError,
    fetchError,
    updateCategory,
  };
}

"use client";

import { useState } from "react";

export function useCreateCategory() {
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [errorCreateCategory, setErrorCreateCategory] = useState("");

  const createCategory = async (categoryName) => {
    try {
      setLoadingCreateCategory(true);
      setErrorCreateCategory("");

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name: categoryName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menambahkan category");
      }

      return { success: true, data: result };
    } catch (error) {
      const errMsg = error.message || "Terjadi kesalahan pada server";
      setErrorCreateCategory(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoadingCreateCategory(false);
    }
  };

  return {
    createCategory,
    loadingCreateCategory,
    errorCreateCategory,
    setErrorCreateCategory,
  };
}

"use client";

import { useState } from "react";

export function useFetchCatgories() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState("");

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setErrorCategories("");
      const response = await fetch("/api/categories");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data categories");
      }

      if (!Array.isArray(result.data)) {
        throw new Error("Format data categories tidak valid");
      }

      setCategories(result.data);
    } catch (error) {
      setCategories([]);

      setErrorCategories(
        "Terjadi kesalahan saat mengambil data categories dari server",
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  return {
    categories,
    loadingCategories,
    errorCategories,
    fetchCategories,
  };
}

"use client";

import { useState } from "react";

export function useFetchCatgories() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState("");

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("/api/categories");
      const result = await response.json();

      setCategories(result.data);
    } catch (error) {
      setErrorCategories(
        error.message ||
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

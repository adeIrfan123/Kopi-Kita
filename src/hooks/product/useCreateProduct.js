"use client";

import { useState } from "react";

export function useCreateProduct() {
  const [loadingCreateProduct, setLoadingCreateProduct] = useState(false);
  const [errorCreateProduct, setErrorCreateProduct] = useState("");

  const createProduct = async (productData) => {
    try {
      setLoadingCreateProduct(true);
      setErrorCreateProduct("");

      const formData = new FormData();

      // Add text fields
      formData.append("product_name", productData.productName);
      formData.append("description", productData.description);
      formData.append("category_id", productData.categoryId);
      formData.append("category_name", productData.categoryName);
      formData.append("variants", JSON.stringify(productData.variants));
      formData.append("discount", productData.discount.toString());

      // Add image files
      productData.images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menambahkan produk");
      }

      return { success: true, data: result };
    } catch (error) {
      const errMsg = error.message || "Terjadi kesalahan pada server";
      setErrorCreateProduct(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoadingCreateProduct(false);
    }
  };

  return {
    createProduct,
    loadingCreateProduct,
    errorCreateProduct,
    setErrorCreateProduct,
  };
}

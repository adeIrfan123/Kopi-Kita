"use client";

import { useEffect, useState } from "react";

export function useUpdateProduct(productId) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [variants, setVariants] = useState([]);
  const [discount, setDiscount] = useState("");
  const [existingImages, setExistingImages] = useState([]);

  const [isLoading, setIsLoading] = useState(!!productId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFetchError("");

      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Produk tidak ditemukan");
        }

        setProductName(result.product_name || "");
        setDescription(result.description || "");
        setSelectedCategory(
          result.category_id
            ? {
                category_id: result.category_id,
                category_name: result.category_name || "",
              }
            : null,
        );
        setVariants(
          (result.variants || []).map((variant) => ({
            id: crypto.randomUUID(),
            size: variant.size || "",
            price: String(variant.price ?? ""),
            stock: String(variant.stock ?? ""),
          })),
        );
        setDiscount(result.discount ? String(result.discount) : "");
        setExistingImages(
          (result.image_keys || []).map((key, index) => ({
            id: `${key}-${index}`,
            key,
            url: result.images?.[index] || "",
          })),
        );
      } catch (err) {
        setFetchError(err.message || "Gagal mengambil data produk");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const updateProduct = async (productData) => {
    setIsSaving(true);
    setError("");

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("product_name", productData.productName);
      formData.append("description", productData.description);
      formData.append("category_id", productData.categoryId);
      formData.append("category_name", productData.categoryName);
      formData.append("variants", JSON.stringify(productData.variants));
      formData.append("discount", productData.discount.toString());

      // Keep existing image keys
      (productData.existingImages || []).forEach((key) => {
        formData.append("existing_images", key);
      });

      // Add new image files
      (productData.images || []).forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengupdate produk");
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
    productName,
    setProductName,
    description,
    setDescription,
    selectedCategory,
    setSelectedCategory,
    variants,
    setVariants,
    discount,
    setDiscount,
    existingImages,
    setExistingImages,
    isLoading,
    isSaving,
    error,
    setError,
    fetchError,
    updateProduct,
  };
}

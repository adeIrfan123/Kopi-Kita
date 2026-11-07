"use client";

import AdminLayout from "@/app/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductVariants from "@/components/admin/ProductVariants";
import ConfirmModal from "@/components/ConfirmModal";
import { useFetchCatgories } from "@/hooks/category/useFetchCategories";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const router = useRouter();
  const { id: productId } = useParams();

  const {
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
  } = useUpdateProduct(productId);

  const { categories, fetchCategories } = useFetchCatgories();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newImages, setNewImages] = useState([]);

  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateForm = () => {
    setFormError("");

    if (!productName.trim()) {
      setFormError("Nama produk wajib diisi");
      return false;
    }

    if (!selectedCategory) {
      setFormError("Kategori wajib dipilih");
      return false;
    }

    if (variants.some((v) => !v.size || !v.price || !v.stock)) {
      setFormError("Semua field varian (size, price, stock) wajib diisi");
      return false;
    }

    if (variants.some((v) => Number(v.price) <= 0)) {
      setFormError("Harga varian harus lebih dari 0");
      return false;
    }

    if (variants.some((v) => Number(v.stock) < 0)) {
      setFormError("Stok varian tidak boleh negatif");
      return false;
    }

    if (discount && (Number(discount) < 0 || Number(discount) > 100)) {
      setFormError("Diskon harus antara 0-100%");
      return false;
    }

    if (existingImages.length + newImages.length === 0) {
      setFormError("Minimal harus ada 1 gambar produk");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedCategory) {
      setFormError("Kategori wajib dipilih");
      setIsModalOpen(false);
      return;
    }

    const existingImageKeys = existingImages.map((image) => image.key);

    const result = await updateProduct({
      productName: productName.trim(),
      description: description.trim(),
      categoryId: selectedCategory.category_id,
      categoryName: selectedCategory.category_name,
      variants: variants.map((v) => ({
        size: v.size,
        price: v.price,
        stock: v.stock,
      })),
      discount: discount ? Number(discount) : 0,
      images: newImages,
      existingImages: existingImageKeys,
    });

    if (result.success) {
      setIsModalOpen(false);
      router.push("/admin/products");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-white bg-[#120E0B] w-full max-w-xl h-fit p-6 rounded-xl border border-[#251C18] flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange2 mx-auto mb-4"></div>
            <p className="text-graye2">Memuat data produk...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (fetchError) {
    return (
      <AdminLayout>
        <div className="text-white bg-[#120E0B] w-full max-w-xl h-fit p-6 rounded-xl border border-[#251C18]">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-graye2 mb-6">{fetchError}</p>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="bg-white text-black cursor-pointer px-3 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex gap-12">
        <aside>
          <div className="bg-[#120E0B] rounded-lg w-127.75">
            <div className="px-7.25 pt-4 pb-14.75">
              <h2 className="text-white font-bold">General Information</h2>
              <div className="text-white">
                <div className="flex flex-col my-2 gap-1">
                  <label htmlFor="productName" className="text-white">
                    Name Product
                  </label>
                  <input
                    id="productName"
                    type="text"
                    placeholder="e.x Cappucino"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (formError) setFormError("");
                    }}
                    disabled={isSaving}
                    className="bg-[#1D1D1D] border border-graye2 w-101.25 pl-4 h-8 rounded-sm outline-none focus:border-orange2 placeholder:italic placeholder:text-graye2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col my-2 gap-1">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="e.x Cappucino Description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (formError) setFormError("");
                    }}
                    disabled={isSaving}
                    className="
                      h-34.75 w-102.25
                      bg-[#1D1D1D]
                      border border-graye2
                      rounded-sm
                      px-2 py-2
                      resize-none
                      placeholder:italic
                      placeholder:text-graye2
                      outline-none
                      focus:border-orange2
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  />
                </div>
                <div className="flex flex-col gap-2 relative w-64">
                  <div>
                    <h2 className="font-bold">Category</h2>
                    <p className="text-[#8B8178] text-sm">
                      Select Category for Product
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isSaving}
                    className="
                        w-full h-14 px-4
                        bg-[#E5E5E5] text-black
                        rounded-md
                        flex items-center justify-between
                        transition-all duration-200
                        hover:bg-white
                        disabled:opacity-50
                        disabled:cursor-not-allowed trfa
                      "
                  >
                    <span className="text-xl font-medium">
                      {selectedCategory?.category_name || "Select Category"}
                    </span>

                    <span
                      className="
                        w-6 h-6 rounded-full
                        bg-[#1D1D1D]
                        flex items-center justify-center
                        text-[#D97706]
                        text-sm
                      "
                    >
                      {isDropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="
                        absolute top-full left-0 mt-2
                        w-full
                        bg-[#E5E5E5]
                        rounded-md
                        shadow-xl
                        overflow-hidden
                        z-50
                      "
                    >
                      {categories.map((item) => (
                        <button
                          key={item.category_id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(item);
                            setIsDropdownOpen(false);
                            if (formError) setFormError("");
                          }}
                          className={`
                              w-full px-4 py-3
                              text-left text-black
                              text-sm font-medium
                              transition-colors
                              hover:bg-[#D97706]
                              ${
                                selectedCategory?.category_id ===
                                item.category_id
                                  ? "bg-[#D97706]"
                                  : ""
                              }
                            `}
                        >
                          {item.category_name}
                        </button>
                      ))}

                      {categories.length === 0 && (
                        <p className="p-4 text-sm text-gray-500">
                          No categories available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {formError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ProductVariants
            variants={variants}
            onChange={setVariants}
            availableSizes={["S", "M", "L"]}
            discount={discount}
            onDiscountChange={setDiscount}
          />
        </aside>
        <main>
          <ImageUploader
            initialImages={existingImages}
            onChange={setNewImages}
            onExistingChange={(remainingKeys) => {
              setExistingImages((prev) =>
                prev.filter((img) => remainingKeys.includes(img.key)),
              );
            }}
            maxSize={5}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            submitLabel="Simpan Perubahan"
          />
        </main>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          if (isSaving) return;
          setIsModalOpen(false);
          setError("");
        }}
        onConfirm={handleConfirmSubmit}
        title="Edit Produk"
        message={`Apakah Anda yakin ingin menyimpan perubahan pada produk "${productName.trim()}"?`}
        error={error}
        confirmText="Ya, Simpan"
        confirmColor="bg-[#D97706] hover:bg-orange-500 text-black"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
}

export default Page;

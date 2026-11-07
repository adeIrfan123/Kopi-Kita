"use client";

import AdminLayout from "@/app/AdminLayout";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductVariants from "@/components/admin/ProductVariants";
import { useFetchCatgories } from "@/hooks/category/useFetchCategories";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";

function Page() {
  const router = useRouter();
  const {
    createProduct,
    loadingCreateProduct,
    errorCreateProduct,
    setErrorCreateProduct,
  } = useCreateProduct();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([
    {
      id: crypto.randomUUID(),
      size: "",
      price: "",
      stock: "",
    },
  ]);
  const [discount, setDiscount] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  // Form validation states
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories, fetchCategories } = useFetchCatgories();
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

    if (images.length === 0) {
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

    const result = await createProduct({
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
      images,
    });

    if (result.success) {
      setIsModalOpen(false);
      router.push("/admin/products");
      router.refresh();
    }
  };

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
                    disabled={loadingCreateProduct}
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
                    disabled={loadingCreateProduct}
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
                    disabled={loadingCreateProduct}
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

                  {/* Dropdown Options */}
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
            onChange={setImages}
            maxSize={5}
            onSubmit={handleSubmit}
            isLoading={loadingCreateProduct}
          />
        </main>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          if (loadingCreateProduct) return;
          setIsModalOpen(false);
          setErrorCreateProduct("");
        }}
        onConfirm={handleConfirmSubmit}
        title="Tambah Produk"
        message={`Apakah Anda yakin ingin menambahkan produk "${productName.trim()}"?`}
        error={errorCreateProduct}
        confirmText="Ya, Simpan"
        confirmColor="bg-[#D97706] hover:bg-orange-500 text-black"
        isLoading={loadingCreateProduct}
      />
    </AdminLayout>
  );
}

export default Page;

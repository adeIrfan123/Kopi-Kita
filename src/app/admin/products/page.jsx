"use client";

import AdminLayout from "@/app/AdminLayout";
import ButtonAdd from "@/components/ButtonAdd";
import ConfirmModal from "@/components/ConfirmModal";
import { useFetchCatgories } from "@/hooks/category/useFetchCategories";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import useFetchProducts from "@/hooks/product/useFetchProducts";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function Page() {
  const { fetchCategories, categories } = useFetchCatgories();
  const { fetchProducts, products } = useFetchProducts();
  const { deleteProduct, isDeleting, deleteError, setDeleteError } =
    useDeleteProduct();

  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchProduct, setSearchProduct] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "-";

    return `Rp ${Number(price).toLocaleString("id-ID")}`;
  };

  const getVariant = (variants, size) => {
    return variants?.find((variant) => variant.size?.toUpperCase() === size);
  };

  const filteredProducts = products.filter((item) => {
    const matchCategory =
      selectedCategory === "All" || item.category_name === selectedCategory;

    const matchSearch = item.product_name
      ?.toLowerCase()
      .includes(searchProduct.toLowerCase());

    return matchCategory && matchSearch;
  });

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteError("");
    setIsModalOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedProduct) return;

    const result = await deleteProduct(selectedProduct.product_id);

    if (result.success) {
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search Products..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            className="
              w-full max-w-sm rounded-xl
              bg-[#181310]
              px-4 py-2.5
              text-sm text-white
              placeholder:text-[#766B60]
              outline-none
              ring-1 ring-[#302921]
              transition
              focus:ring-1 focus:ring-amber-500
            "
          />

          <ButtonAdd href="/admin/products/add-product" label="+ Products" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white">Categories</h3>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`
                shrink-0 rounded-full px-5 py-2
                text-sm font-semibold transition-all duration-200
                ${
                  selectedCategory === "All"
                    ? "bg-amber-600 text-black"
                    : "bg-[#181512] text-[#A69A8D] hover:bg-[#292019] hover:text-white"
                }
              `}
            >
              All
            </button>

            {categories.map((item) => (
              <button
                key={item.category_id}
                onClick={() => setSelectedCategory(item.category_name)}
                className={`
                  shrink-0 rounded-full px-5 py-2
                  text-sm font-medium transition-all duration-200
                  ${
                    selectedCategory === item.category_name
                      ? "bg-amber-600 text-black"
                      : "bg-[#181512] text-[#A69A8D] hover:bg-[#292019] hover:text-white"
                  }
                `}
              >
                {item.category_name}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <table
            className="
              w-full min-w-[1100px]
              text-left text-sm text-white
            "
          >
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="rounded-l-lg bg-[#211912] px-4 py-4 text-center font-semibold"
                >
                  No
                </th>

                <th
                  rowSpan={2}
                  className="bg-[#211912] px-4 py-4 font-semibold"
                >
                  Product Name
                </th>

                <th
                  rowSpan={2}
                  className="bg-[#211912] px-4 py-4 font-semibold"
                >
                  Image
                </th>

                <th
                  rowSpan={2}
                  className="bg-[#211912] px-4 py-4 font-semibold"
                >
                  Category
                </th>

                <th
                  colSpan={3}
                  className="bg-[#211912] px-4 py-3 text-center font-semibold"
                >
                  Price
                </th>

                <th
                  colSpan={3}
                  className="bg-[#211912] px-4 py-3 text-center font-semibold"
                >
                  Stock
                </th>

                <th
                  rowSpan={2}
                  className="rounded-r-lg bg-[#211912] px-4 py-4 text-center font-semibold"
                >
                  Action
                </th>
              </tr>

              <tr>
                {["S", "M", "L", "S", "M", "L"].map((size, index) => (
                  <th
                    key={index}
                    className="bg-[#211912] px-4 py-2 text-center text-xs font-semibold text-amber-500"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => {
                  const variantS = getVariant(item.variants, "S");
                  const variantM = getVariant(item.variants, "M");
                  const variantL = getVariant(item.variants, "L");

                  return (
                    <tr key={item.product_id} className="group">
                      <td className="rounded-l-lg border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-[#A69A8D] transition group-hover:bg-[#251C16]">
                        {index + 1}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 font-medium transition group-hover:bg-[#251C16]">
                        {item.product_name}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-3 transition group-hover:bg-[#251C16]">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#302921]">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.product_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#766B60]">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 transition group-hover:bg-[#251C16]">
                        <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500">
                          {item.category_name}
                        </span>
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-xs transition group-hover:bg-[#251C16]">
                        {formatPrice(variantS?.price)}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-xs transition group-hover:bg-[#251C16]">
                        {formatPrice(variantM?.price)}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-xs transition group-hover:bg-[#251C16]">
                        {formatPrice(variantL?.price)}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-[#C5B8AA] transition group-hover:bg-[#251C16]">
                        {variantS?.stock ?? "-"}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-[#C5B8AA] transition group-hover:bg-[#251C16]">
                        {variantM?.stock ?? "-"}
                      </td>

                      <td className="border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 text-center text-[#C5B8AA] transition group-hover:bg-[#251C16]">
                        {variantL?.stock ?? "-"}
                      </td>
                      <td className="rounded-r-lg border-b-[2px] border-transparent bg-[#181310] bg-clip-padding px-4 py-4 transition group-hover:bg-[#251C16] flex gap-4">
                        <Link
                          href={`/admin/products/edit-product/${item.product_id}`}
                          className="p-2 bg-[#1C1613] rounded-xl border border-[#251C18] cursor-pointer"
                        >
                          <Pencil color="orange" />
                        </Link>
                        <div className="p-2 bg-[#1C1613] rounded-xl border border-[#251C18] cursor-pointer ">
                          <Trash
                            color="red"
                            onClick={() => handleDelete(item)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    className="rounded-lg bg-[#181310] px-4 py-10 text-center text-sm text-[#A69A8D]"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${selectedProduct?.product_name || "ini"}"? Tindakan ini tidak dapat dibatalkan dan semua gambar produk akan dihapus dari penyimpanan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={executeDelete}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
          setDeleteError("");
        }}
        isLoading={isDeleting}
        error={deleteError}
      />
    </AdminLayout>
  );
}

export default Page;

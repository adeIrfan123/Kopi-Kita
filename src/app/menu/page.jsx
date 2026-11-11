"use client";

import React, { useEffect, useState } from "react";
import UserLayout from "../UserLayout";
import SearchBar from "@/components/user/SearchBar";
import { useFetchCatgories } from "@/hooks/category/useFetchCategories";
import ProductsCard from "@/components/user/ProductsCard";
import useFetchProducts from "@/hooks/product/useFetchProducts";

export default function Page() {
  const { fetchCategories, categories, errorCategories, loadingCategories } =
    useFetchCatgories();
  const { fetchProducts, products } = useFetchProducts();
  const [searchProduct, setSearchProduct] = useState("");
  const [debounchedSearch, setDebounchedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchCategories();
    fetchProducts();

    const timer = setTimeout(() => {
      setDebounchedSearch(searchProduct);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchProduct]);

  const filteredProducts = products.filter((product) => {
    const matchedCategory =
      selectedCategory === "All" || product.category_id === selectedCategory;

    const matchSearch = product.product_name
      ?.toLowerCase()
      .includes(debounchedSearch.toLowerCase());

    return matchSearch && matchedCategory;
  });

  return (
    <UserLayout>
      <div className="min-h-screen">
        <div className="sticky top-0 z-50 bg-[#171413] px-4 pt-4 pb-2">
          <SearchBar onChange={setSearchProduct} />
        </div>

        <div className="p-4">
          <main className="pb-8">
            <div className="space-y-3">
              {loadingCategories && (
                <div className="flex gap-2 overflow-hidden">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-[#332923]"
                    />
                  ))}
                </div>
              )}

              {!loadingCategories && errorCategories && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{errorCategories}</p>

                  <button
                    onClick={fetchCategories}
                    className="shrink-0 text-sm font-semibold text-[#E98208]"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loadingCategories &&
                !errorCategories &&
                categories.length === 0 && (
                  <p className="text-sm text-[#A39995]">
                    Belum ada kategori tersedia.
                  </p>
                )}

              {!loadingCategories &&
                !errorCategories &&
                categories.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`
                      shrink-0 rounded-full px-5 py-2 text-sm
                      ${
                        selectedCategory === "All"
                          ? "bg-orange2 text-black font-bold"
                          : "bg-transparent border border-graye2 text-white"
                      }
                    `}
                    >
                      All
                    </button>

                    {categories.map((item) => (
                      <button
                        key={item.category_id}
                        onClick={() => setSelectedCategory(item.category_id)}
                        className={`
                        shrink-0 rounded-full px-5 py-2 text-sm
                        ${
                          selectedCategory === item.category_id
                            ? "bg-orange2 text-black font-bold"
                            : "bg-transparent border border-graye2 text-white"
                        }
                      `}
                      >
                        {item.category_name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
                {filteredProducts.map((product) => (
                  <ProductsCard key={product.product_id} product={product} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-[#A39995]">
                Products not found
              </p>
            )}
          </main>
        </div>
      </div>
    </UserLayout>
  );
}

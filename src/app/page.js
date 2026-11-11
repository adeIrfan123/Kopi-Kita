"use client";

import React, { useEffect, useState } from "react";
import HeaderLocation from "@/components/user/HeaderLocation";
import { useFetchCatgories } from "@/hooks/category/useFetchCategories";
import useFetchProducts from "@/hooks/product/useFetchProducts";
import ProductsCard from "@/components/user/ProductsCard";
import UserLayout from "./UserLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function UserHomeScreen() {
  const { fetchCategories, categories, errorCategories, loadingCategories } =
    useFetchCatgories();
  const { fetchProducts, products } = useFetchProducts();
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchedCategory =
      selectedCategory === "All" || product.category_id === selectedCategory;
    const matchSearch = product.product_name
      ?.toLowerCase()
      .includes(searchProduct.toLowerCase());

    return matchSearch && matchedCategory;
  });

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#171413]">
        <section className="min-h-[400px] bg-[url('/images/Coffee1.webp')] bg-cover bg-[center_35%] bg-no-repeat flex flex-col">
          <div className="flex-1 px-5 pt-4 bg-linear-to-b from-black/40 via-black/20 to-[#171413]">
            <HeaderLocation />
            <div className="mt-24 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Crafted with passion
                </h1>

                <p className="text-sm text-white/60">
                  Served with love, sourced with integrity.
                </p>
              </div>

              <button className="rounded-full bg-[#E98208] px-6 py-2.5 font-semibold text-white hover:bg-[#d97505] transition-all">
                Order Now
              </button>
            </div>
          </div>
        </section>

        <main className="px-5 pt-4  pb-8">
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

            <div className="text-end">
              <p className="font-thin text-sm text-amber-500">See all</p>
            </div>
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
        <div className="px-5">
          <Swiper
            spaceBetween={4}
            slidesPerView={3}
            modules={[Scrollbar, Autoplay]}
            autoplay
          >
            <SwiperSlide>
              <Image
                src={"/images/banner1.jpeg"}
                width={500}
                height={500}
                alt="tes"
                className="w-40 h-40 md:w-80 md:h-80 rounded-md"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={"/images/banner2.jpeg"}
                width={500}
                height={500}
                alt="tes"
                className="w-40 h-40 md:w-80 md:h-80 rounded-md"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={"/images/banner3.jpeg"}
                width={500}
                height={500}
                alt="tes"
                className="w-40 h-40 md:w-80 md:h-80 rounded-md"
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src={"/images/banner4.jpeg"}
                width={500}
                height={500}
                alt="tes"
                className="w-40 h-40 md:w-80 md:h-80 rounded-md"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </UserLayout>
  );
}

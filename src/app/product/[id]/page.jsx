"use client";

import useFetchDetailProduct from "@/hooks/product/useFetchDetailProduct";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Coffee,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();

  const { fetchDetailProduct, detailProduct } = useFetchDetailProduct({ id });

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetailProduct();
    }
  }, [id]);

  // Set default variant ketika data produk berhasil dimuat
  useEffect(() => {
    if (detailProduct?.variants?.length > 0) {
      setSelectedVariant(detailProduct.variants[0]);
      setQuantity(1);
    }

    setSelectedImage(0);
  }, [detailProduct]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const images = detailProduct?.images || [];
  const variants = detailProduct?.variants || [];

  const currentStock = selectedVariant?.stock || 0;

  const handleQuantity = (type) => {
    if (type === "increase" && quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }

    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Loading state
  if (!detailProduct?.product_id) {
    return (
      <div className="min-h-screen bg-[#171413] flex flex-col items-center justify-center gap-3">
        <Coffee size={38} className="text-orange2 animate-pulse" />
        <p className="text-sm text-[#A39995]">Loading your coffee...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#171413] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#171413]/90 px-4 py-4 backdrop-blur-xl">
        <Link
          href="/menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#251F1C] text-white transition hover:bg-[#332923]"
        >
          <ArrowLeft size={19} />
        </Link>

        <p className="text-sm font-semibold tracking-wide text-white">
          Product Details
        </p>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#251F1C] transition hover:bg-[#332923]"
        >
          <Heart
            size={19}
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-[#A39995]"
            }
          />
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-5">
        {/* Product Gallery */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#251F1C]">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]}
                width={900}
                height={900}
                alt={detailProduct.product_name}
                unoptimized
                priority
                className="aspect-square w-full object-cover transition-all duration-500"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center">
                <ImageIcon size={48} className="text-[#8A7B73]" />
              </div>
            )}

            <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-none">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === index
                      ? "border-orange2 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    width={120}
                    height={120}
                    alt={`${detailProduct.product_name} ${index + 1}`}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product Information */}
        <section className="mt-7">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-orange2/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange2">
              {detailProduct.category_name}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-[#8A7B73]">
              <Coffee size={14} />
              <span>Freshly Made</span>
            </div>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {detailProduct.product_name}
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#A39995]">
            {detailProduct.description ||
              "Enjoy the perfect taste in every sip."}
          </p>
        </section>

        {/* Variant Selection */}
        {variants.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Choose Your Size</h2>
                <p className="mt-1 text-xs text-[#8A7B73]">
                  Select your preferred size
                </p>
              </div>

              <span className="text-xs text-orange2">
                {variants.length} options
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {variants.map((variant, index) => {
                const isSelected = selectedVariant?.size === variant.size;

                const isAvailable = variant.stock > 0;

                return (
                  <button
                    key={`${variant.size}-${index}`}
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-orange2 bg-orange2/10"
                        : "border-white/5 bg-[#251F1C] hover:border-white/20"
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {isSelected && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange2 text-[#171413]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}

                    <span
                      className={`text-base font-bold ${
                        isSelected ? "text-orange2" : "text-white"
                      }`}
                    >
                      {variant.size}
                    </span>

                    <span className="mt-2 text-sm font-semibold text-white">
                      {formatPrice(variant.price)}
                    </span>

                    <span className="mt-1 text-[10px] text-[#8A7B73]">
                      {isAvailable
                        ? `${variant.stock} available`
                        : "Out of stock"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Price Summary */}
        <section className="mt-8 rounded-2xl border border-white/5 bg-[#251F1C] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8A7B73]">Selected Price</p>

              <p className="mt-1 text-2xl font-bold text-orange2">
                {formatPrice(selectedVariant?.price)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#8A7B73]">Selected Size</p>

              <p className="mt-1 font-semibold text-white">
                {selectedVariant?.size || "-"}
              </p>
            </div>
          </div>

          <div className="my-4 border-t border-white/5" />

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Quantity</p>
              <p className="mt-1 text-xs text-[#8A7B73]">
                Maximum {currentStock} items
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#171413] p-1.5">
              <button
                onClick={() => handleQuantity("decrease")}
                disabled={quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-[#332923] disabled:opacity-30"
              >
                <Minus size={15} />
              </button>

              <span className="min-w-4 text-center text-sm font-bold text-white">
                {quantity}
              </span>

              <button
                onClick={() => handleQuantity("increase")}
                disabled={quantity >= currentStock}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange2 text-[#171413] transition hover:bg-amber-500 disabled:opacity-30"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-white/5 bg-[#171413]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#8A7B73]">Total Price</p>

            <p className="truncate text-lg font-bold text-white">
              {formatPrice((selectedVariant?.price || 0) * quantity)}
            </p>
          </div>

          <button
            disabled={!selectedVariant || currentStock <= 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange2 px-5 py-3.5 text-sm font-bold text-[#171413] transition hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

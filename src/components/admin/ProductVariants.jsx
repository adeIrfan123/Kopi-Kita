"use client";

import React from "react";
import Input from "../Input";

const DefaultSizes = ["S", "M", "L"];

export default function ProductVariants({
  variants,
  onChange,
  availableSizes = DefaultSizes,
  discount = "",
  onDiscountChange,
}) {
  const handleAddVariant = () => {
    onChange([
      ...variants,
      {
        id: crypto.randomUUID(),
        size: "",
        price: "",
        stock: "",
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    onChange(
      variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const handleRemove = (id) => {
    onChange(variants.filter((variant) => variant.id !== id));
  };

  return (
    <div className="bg-[#120E0B] rounded-lg w-127.75 my-6">
      <div className="bg-[#120E0B] rounded-xl w-127.75 my-6 border border-[#2A211C]">
        <div className="px-7 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Product Variants</h2>
              <p className="text-sm text-gray-400 mt-1">
                Manage size, price, and stock for each variant.
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {variants.length} Variants
            </span>
          </div>

          {/* Column Header */}
          <div className="grid grid-cols-[1fr_1.3fr_1fr_32px] gap-3 mb-2">
            <label className="text-xs text-gray-400">Size</label>
            <label className="text-xs text-gray-400">Price (Rp)</label>
            <label className="text-xs text-gray-400">Stock</label>
            <span />
          </div>

          {/* Variant Rows */}
          <div className="flex flex-col gap-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="grid grid-cols-[1fr_1.3fr_1fr_32px] gap-3 items-center"
              >
                {/* Size */}
                <select
                  value={variant.size}
                  onChange={(e) =>
                    handleChange(variant.id, "size", e.target.value)
                  }
                  className="
                    w-full h-11 px-2
                    rounded-lg
                    bg-[#1D1D1D]
                    border border-[#3A2E27]
                    text-white text-sm
                    outline-none
                    focus:border-orange2
                  "
                >
                  <option value="">Select</option>

                  {availableSizes.map((size) => (
                    <option
                      key={size}
                      value={size}
                      disabled={variants.some(
                        (item) => item.size === size && item.id !== variant.id,
                      )}
                    >
                      {size}
                    </option>
                  ))}
                </select>

                {/* Price */}
                <input
                  type="number"
                  min="0"
                  value={variant.price}
                  onChange={(e) =>
                    handleChange(variant.id, "price", e.target.value)
                  }
                  placeholder="15000"
                  className="
                    w-full h-11 px-3
                    rounded-lg
                    bg-[#1D1D1D]
                    border border-[#3A2E27]
                    text-white text-sm
                    placeholder:text-gray-600
                    outline-none
                    focus:border-orange2
                  "
                />

                {/* Stock */}
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) =>
                    handleChange(variant.id, "stock", e.target.value)
                  }
                  placeholder="20"
                  className="
                    w-full h-11 px-3
                    rounded-lg
                    bg-[#1D1D1D]
                    border border-[#3A2E27]
                    text-white text-sm
                    placeholder:text-gray-600
                    outline-none
                    focus:border-orange2
                  "
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemove(variant.id)}
                  disabled={variants.length === 1}
                  className="
                    w-8 h-8
                    flex items-center justify-center
                    rounded-lg
                    text-gray-500
                    hover:text-red-400
                    hover:bg-red-500/10
                    transition-colors
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                  "
                  title="Remove variant"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add Variant */}
          <button
            type="button"
            onClick={handleAddVariant}
            disabled={variants.length >= availableSizes.length}
            className="
              mt-5
              w-full h-11
              flex items-center justify-center gap-2
              rounded-lg
              border border-dashed border-[#594333]
              text-orange2 text-sm font-medium
              hover:bg-[#211914]
              hover:border-orange2
              transition-all
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <span className="text-lg">+</span>
            Add Size
          </button>

          {/* Discount */}
          <div className="mt-7 pt-5 border-t border-[#2A211C]">
            <Input 
              placeholder="e.x 15" 
              label="Discount (%)" 
              type="number"
              value={discount}
              onChange={(e) => onDiscountChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

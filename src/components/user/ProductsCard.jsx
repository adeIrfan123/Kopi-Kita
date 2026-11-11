import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function ProductsCard({ product }) {
  const router = useRouter();
  const clickProduct = (product_id) => {
    router.push(`/product/${product_id}`);
  };
  return (
    <div
      onClick={() => clickProduct(product.product_id)}
      className="group overflow-hidden rounded-2xl border border-white/5 bg-[#251F1C] transition-all duration-300 hover:border-[#E98208]/40 hover:-translate-y-1 drop-shadow-md drop-shadow-mauve-600"
    >
      <div className="overflow-hidden bg-[#332923]">
        <Image
          src={product.images[0]}
          width={600}
          height={600}
          alt={product.product_name}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#E98208]">
            {product.category_name}
          </p>
          <Heart size={16} />
        </div>

        <div className="flex items-center justify-between gap-2 mt-2">
          <div>
            <h3 className="truncate text-sm font-semibold text-white">
              {product.product_name}
            </h3>

            <p className="text-sm font-bold text-[#E98208]">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.variants?.[0]?.price || 0)}
            </p>
          </div>

          <button
            disabled={!product.variants?.[0] || product.variants[0].stock <= 0}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E98208] text-xl font-medium text-[#171413] transition-all hover:bg-[#F59A26] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

export default function useFetchDetailProduct({ id }) {
  const [detailProduct, setDetailProduct] = useState("");

  const fetchDetailProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const result = await response.json();

      setDetailProduct(result);
    } catch {
      console.log("Terjadi kesalahan pada server");
    }
  };
  return { detailProduct, fetchDetailProduct };
}

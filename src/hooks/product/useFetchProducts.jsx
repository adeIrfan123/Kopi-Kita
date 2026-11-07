"use client";

import React, { useEffect, useState } from "react";

export default function useFetchProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();

      setProducts(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  return { products, fetchProducts };
}

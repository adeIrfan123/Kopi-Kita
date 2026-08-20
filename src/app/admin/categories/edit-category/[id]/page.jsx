"use client";

import AdminLayout from "@/app/AdminLayout";
import CategoryForm from "@/components/CategoryForm";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams();
  const categoryId = params.id;

  const [initialData, setInitialData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setInitialData(result.category_name);
        } else {
          setError(result.message || "Data kategori tidak ditemukan.");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data dari server.");
      } finally {
        setIsFetching(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);
  return (
    <AdminLayout>
      {isFetching ? (
        <div className="bg-[#120E0B] w-full max-w-2xl p-8 rounded-lg border border-[#251C18] flex items-center justify-center">
          <p className="text-gray-400 italic animate-pulse">
            Memuat data kategori...
          </p>
        </div>
      ) : error ? (
        <div className="bg-[#120E0B] w-full max-w-2xl p-6 rounded-lg border border-[#251C18]">
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm font-medium">
            {error}
          </div>
        </div>
      ) : (
        <CategoryForm
          isEdit={true}
          initialData={initialData}
          categoryId={categoryId}
        />
      )}
    </AdminLayout>
  );
}

export default Page;

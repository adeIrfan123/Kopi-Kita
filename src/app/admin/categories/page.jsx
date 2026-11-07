"use client";

import AdminLayout from "@/app/AdminLayout";
import ButtonAdd from "@/components/ButtonAdd";
import ConfirmModal from "@/components/ConfirmModal";
import { useFetchCatgories } from "@/hooks/category/useFetchCategories";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Page() {
  const { categories, loadingCategoriesg, errorCategories, fetchCategories } =
    useFetchCatgories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setDeleteError("");
    setIsModalOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/categories/${selectedCategory.category_id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        await fetchCategories();
        setIsModalOpen(false);
        setSelectedCategory(null);
      } else {
        setDeleteError(result.message || "Gagal menghapus kategori");
      }
    } catch (error) {
      setDeleteError("Terjadi kesalahan pada jaringan");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <AdminLayout>
      <div className="flex flex-col gap-10">
        {errorCategories && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm font-medium">
            {errorCategories}
          </div>
        )}

        <div className="flex justify-between">
          <div className="text-white">Total Kategori: {categories.length}</div>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search Categories..."
              className="bg-[#181310] text-graye2 border border-[#251C18] px-4 py-1 rounded-lg"
            />
            <ButtonAdd
              href={"/admin/categories/add-category"}
              label={"+ Category"}
            />
          </div>
        </div>

        <div className="w-full bg-[#120E0B] rounded-md overflow-hidden">
          <table className="text-white w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-center w-12">No</th>
                <th className="px-4 py-2">Category Name</th>
                <th className="px-4 py-2">Date Time</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingCategoriesg ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 bg-[#251C18] rounded w-6 mx-auto"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-[#251C18] rounded w-3/4"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-[#251C18] rounded w-1/2"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-7 bg-[#251C18] rounded w-20"></div>
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-8 text-gray-400 italic"
                  >
                    Belum ada kategori. Silakan tambah kategori baru.
                  </td>
                </tr>
              ) : (
                categories.map((item, index) => {
                  const formattedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-";
                  return (
                    <tr
                      key={item.category_id}
                      className="hover:bg-gray-700 transition-colors border-b border-[#251C18]"
                    >
                      <td className="px-4 py-2 text-center">{index + 1}</td>
                      <td className="px-4 py-2">{item.category_name}</td>
                      <td className="px-4 py-2">{formattedDate}</td>
                      <td className="px-4 py-2 flex gap-2 items-center">
                        <Link
                          href={`/admin/categories/edit-category/${item.category_id}`}
                          className="p-2 bg-[#1C1613] rounded-xl border border-[#251C18] cursor-pointer"
                        >
                          <Pencil color="orange" />
                        </Link>
                        <div className="p-2 bg-[#1C1613] rounded-xl border border-[#251C18] cursor-pointer">
                          <Trash
                            color="red"
                            onClick={() => handleDelete(item)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDeleteError("");
          setSelectedCategory(null);
        }}
        onConfirm={executeDelete}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.category_name}"? Tindakan ini tidak dapat dibatalkan.`}
        error={deleteError}
        confirmText="Ya, Hapus"
        confirmColor="bg-red-600 hover:bg-red-700 text-white"
        isLoading={isDeleting}
      />
      {/* <StatCard label={"Total Kategori"} value={10} /> */}
    </AdminLayout>
  );
}

export default Page;

"use client";

import AdminLayout from "@/app/AdminLayout";
import ConfirmModal from "@/components/ConfirmModal";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const router = useRouter();
  const {
    createCategory,
    loadingCreateCategory,
    errorCreateCategory,
    setErrorCreateCategory,
  } = useCreateCategory();
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      setError("Nama category tidak boleh kosong");
      return;
    }

    if (name.length < 2) {
      setError("Nama category minimal 2 karakter");
      return;
    }

    setError("");
    setErrorCreateCategory("");
    setIsModalOpen(true);
  };

  const handleCreate = async () => {
    const { success } = await createCategory(categoryName.trim());
    if (success) {
      setIsModalOpen(false);
      router.push("/admin/categories");
      router.refresh();
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories");
  };

  return (
    <AdminLayout>
      <div className="text-white bg-[#120E0B] w-full max-w-xl h-fit p-6 rounded-xl border border-[#251C18]">
        <h1 className="text-2xl font-bold">General Information</h1>
        <p className="mt-1 mb-6 text-sm text-graye2">
          Isi nama kategori baru yang akan ditambahkan.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="categoryName">Name Category</label>
            <input
              id="categoryName"
              name="categoryName"
              type="text"
              placeholder="e.g Cappucino"
              autoComplete="off"
              required
              disabled={loadingCreateCategory}
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (error) setError("");
                if (errorCreateCategory) setErrorCreateCategory("");
              }}
              className="bg-[#181310] placeholder:italic text-graye2 border border-[#251C18] px-4 py-2 rounded-lg outline-none focus:border-orange2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {(error || errorCreateCategory) && (
            <p className="text-sm text-red-500">
              {error || errorCreateCategory}
            </p>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loadingCreateCategory}
              className="bg-white text-black cursor-pointer px-3 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loadingCreateCategory}
              className="bg-[#D97706] text-black cursor-pointer px-3 py-2 rounded-lg font-bold hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Membuat
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          if (loadingCreateCategory) return;
          setIsModalOpen(false);
          setErrorCreateCategory("");
        }}
        onConfirm={handleCreate}
        title="Tambah Kategori"
        message={`Apakah Anda yakin ingin membuat kategori "${categoryName.trim()}"?`}
        error={errorCreateCategory}
        confirmText="Ya, Simpan"
        confirmColor="bg-[#D97706] hover:bg-orange-500 text-black"
        isLoading={loadingCreateCategory}
      />
    </AdminLayout>
  );
}

export default Page;

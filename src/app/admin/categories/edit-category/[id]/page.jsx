"use client";

import AdminLayout from "@/app/AdminLayout";
import ConfirmModal from "@/components/ConfirmModal";
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const router = useRouter();
  const params = useParams();
  const { id: categoryId } = useParams();

  const {
    categoryName,
    setCategoryName,
    originalCategory,
    isLoading,
    isSaving,
    error,
    setError,
    fetchError,
    updateCategory,
  } = useUpdateCategory(categoryId);

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

    if (name === originalCategory) {
      setError("Nama category tidak berubah");
      return;
    }

    setError("");
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const { success } = await updateCategory(categoryName.trim());
    if (success) {
      setIsModalOpen(false);
      router.push("/admin/categories");
      router.refresh();
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories");
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-white bg-[#120E0B] w-full max-w-xl h-fit p-6 rounded-xl border border-[#251C18] flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange2 mx-auto mb-4"></div>
            <p className="text-graye2">Memuat data kategori...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (fetchError) {
    return (
      <AdminLayout>
        <div className="text-white bg-[#120E0B] w-full max-w-xl h-fit p-6 rounded-xl border border-[#251C18]">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-graye2 mb-6">{fetchError}</p>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-black cursor-pointer px-3 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="text-white bg-[#120E0B] w-full max-w-xl h-fit p-6 rounded-xl border border-[#251C18]">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="mt-1 mb-6 text-sm text-graye2">
          Edit nama kategori yang ada.
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
              disabled={isSaving}
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                if (error) setError("");
              }}
              className="bg-[#181310] placeholder:italic text-graye2 border border-[#251C18] px-4 py-2 rounded-lg outline-none focus:border-orange2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="text-sm text-graye2">
            <p>
              <span className="font-semibold">Original name:</span>{" "}
              {originalCategory}
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-white text-black cursor-pointer px-3 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || categoryName.trim() === originalCategory}
              className="bg-[#D97706] text-black cursor-pointer px-3 py-2 rounded-lg font-bold hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D97706]"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          if (isSaving) return;
          setIsModalOpen(false);
          setError("");
        }}
        onConfirm={handleUpdate}
        title="Update Kategori"
        message={`Apakah Anda yakin ingin mengubah nama kategori dari "${originalCategory}" menjadi "${categoryName.trim()}"?`}
        error={error}
        confirmText="Ya, Update"
        confirmColor="bg-[#D97706] hover:bg-orange-500 text-black"
        isLoading={isSaving}
      />
    </AdminLayout>
  );
}

export default Page;

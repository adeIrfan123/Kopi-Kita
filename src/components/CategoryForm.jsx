import React, { useState } from "react";
import ConfirmButton from "./ConfirmButton";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

function CategoryForm({ isEdit = false, initialData = "", categoryId = null }) {
  const router = useRouter();

  const [categoryName, setCategoryName] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const executeSave = async (e) => {
    setLoading(true);
    setError("");

    try {
      const apiUrl = isEdit
        ? `/api/categories/${categoryId}`
        : `/api/categories`;

      const apiMethode = isEdit ? "PUT" : "POST";
      const respose = await fetch(apiUrl, {
        method: apiMethode,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_name: categoryName,
        }),
      });

      const result = await respose.json();

      if (respose.ok && result.success) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        setError(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error :", error);
      setError("Terjadi Kesalahan Pada Jaringan");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories");
  };

  return (
    <div>
      <div className="text-white bg-[#120E0B] w-120 h-fit p-4 rounded-lg">
        <h1 className="mb-4 text-2xl font-bold">General Information</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form
          action=""
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="">Name Category</label>
            <input
              type="text"
              placeholder="e.x Cappucino"
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="bg-[#181310] placeholder:italic text-graye2 border border-[#251C18] px-4 py-1 rounded-lg"
            />
          </div>

          <ConfirmButton
            label1={"Batal"}
            label2={isEdit ? "Edit Category" : "+ Add Category"}
            bgColor1={"bg-white"}
            bgColor2={"bg-[#D97706]"}
            labelColor1={"text-black"}
            labelColor2={"text-black"}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </form>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeSave}
        title={isEdit ? "Konfirmasi Edit" : "Konfirmasi Tambah"}
        message={`Apakah Anda yakin ingin ${isEdit ? "menyimpan perubahan" : "menambahkan"} kategori "${categoryName}"?`}
        confirmText="Ya, Simpan"
        confirmColor="bg-[#D97706] hover:bg-orange-500 text-black"
        isLoading={loading}
      />
    </div>
  );
}

export default CategoryForm;

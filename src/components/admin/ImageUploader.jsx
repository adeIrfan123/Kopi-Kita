"use client";
import React, { useEffect, useRef, useState } from "react";
import ConfirmButton from "../ConfirmButton";
import { useRouter } from "next/navigation";

export default function ImageUploader({
  onChange,
  onExistingChange,
  initialImages = [],
  maxSize = 5,
  accept = ["image/png", "image/jpeg", "image/webp"],
  onSubmit,
  isLoading = false,
  submitLabel = "Tambah Produk",
}) {
  const router = useRouter();
  const [images, setImages] = useState(() =>
    initialImages.map((image) => ({
      id: image.id || image.key,
      type: "existing",
      key: image.key,
      url: image.url,
    })),
  );
  const previewUrls = useRef(new Set());

  const notifyChange = (updatedImages) => {
    onChange?.(
      updatedImages
        .filter((image) => image.type === "new")
        .map((image) => image.file),
    );
    onExistingChange?.(
      updatedImages
        .filter((image) => image.type === "existing")
        .map((image) => image.key),
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    const newImages = [];

    files.forEach((file) => {
      if (!accept.includes(file.type)) {
        alert(`${file.name}: Format gambar tidak didukung.`);
        return;
      }

      if (file.size > maxSize * 1024 * 1024) {
        alert(`${file.name}: Ukuran gambar maksimal ${maxSize}MB.`);
        return;
      }

      const preview = URL.createObjectURL(file);

      previewUrls.current.add(preview);

      newImages.push({
        id: crypto.randomUUID(),
        type: "new",
        file,
        preview,
      });
    });

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];

      setImages(updatedImages);
      notifyChange(updatedImages);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (id) => {
    const selected = images.find((image) => image.id === id);

    if (selected?.type === "new") {
      URL.revokeObjectURL(selected.preview);
      previewUrls.current.delete(selected.preview);
    }

    const updatedImages = images.filter((image) => image.id !== id);

    setImages(updatedImages);
    notifyChange(updatedImages);
  };

  useEffect(() => {
    return () => {
      previewUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrls.current.clear();
    };
  }, []);

  const handleCancel = () => {
    router.push("/admin/products");
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <div className="bg-[#120E0B] rounded-xl w-127.75 my-6 border border-[#2A211C]">
      <div className="px-7 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Upload Image</h2>

          <span className="text-xs text-gray-400">{images.length} Images</span>
        </div>

        <p className="text-sm text-gray-400 mt-1 mb-5">
          Add images to your product gallery.
        </p>

        {/* Upload Area */}
        <label
          htmlFor="image-upload"
          className="
            flex flex-col items-center justify-center
            w-full h-44
            border-2 border-dashed border-[#3A2E27]
            rounded-xl
            bg-[#181310]
            cursor-pointer
            transition-all duration-200
            hover:border-[#A78B70]
            hover:bg-[#211914]
          "
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2A211C] mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="text-[#C4A88C]"
            >
              <path d="M12 16V4" />
              <path d="m7 9 5-5 5 5" />
              <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
            </svg>
          </div>

          <p className="text-sm text-white font-medium">
            Click to upload images
          </p>

          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG or WEBP (Max. 5MB each)
          </p>

          <input
            id="image-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {images.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-sm font-medium">Image Preview</h3>

              <span className="text-xs text-gray-500">
                {images.length} selected
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="
                    relative group
                    aspect-square
                    rounded-lg
                    overflow-hidden
                    border border-[#3A2E27]
                    bg-[#181310]
                  "
                >
                  <img
                    src={image.type === "existing" ? image.url : image.preview}
                    alt={
                      image.type === "existing"
                        ? "Existing image"
                        : image.file.name
                    }
                    className="
                      w-full h-full
                      object-cover
                      transition-transform duration-300
                      group-hover:scale-105
                    "
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="
                      absolute top-2 right-2
                      w-7 h-7
                      flex items-center justify-center
                      rounded-full
                      bg-black/70
                      text-white
                      hover:bg-red-500
                      transition-colors
                    "
                    title="Remove image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>

                  {/* Image Name */}
                  <div
                    className="
                    absolute bottom-0 left-0 right-0
                    bg-black/60
                    px-2 py-2
                  "
                  >
                    <p className="text-white text-xs truncate">
                      {image.type === "existing"
                        ? image.key.split("/").pop()
                        : image.file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <ConfirmButton
            label1={"Batal"}
            labelColor1={"text-black"}
            bgColor1={"bg-white"}
            label2={submitLabel}
            labelColor2={"text-black"}
            bgColor2={"bg-orange2"}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { getR2SignedUrl, uploadFilesToR2, deleteFilesFromR2 } from "@/lib/r2";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    const product = docSnap.data();
    const imageKeys = product.images || [];

    const signedImages = await Promise.all(
      imageKeys.map((key) => getR2SignedUrl(key)),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil diambil",
        product_id: docSnap.id,
        ...product,
        images: signedImages,
        image_keys: imageKeys,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error GET Product:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data produk" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // === 1. Ambil field teks ===
    const productName = formData.get("product_name")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || "";
    const categoryId = formData.get("category_id")?.toString().trim();
    const categoryName = formData.get("category_name")?.toString().trim() || "";
    const variantsJson = formData.get("variants")?.toString();
    const discountStr = formData.get("discount")?.toString().trim();

    // === 2. Validasi field wajib ===
    if (!productName) {
      return NextResponse.json(
        { success: false, message: "Nama produk wajib diisi" },
        { status: 400 },
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Kategori wajib dipilih" },
        { status: 400 },
      );
    }

    if (!variantsJson) {
      return NextResponse.json(
        { success: false, message: "Varian produk wajib diisi" },
        { status: 400 },
      );
    }

    // === 3. Parse & validasi varian ===
    let variants;
    try {
      variants = JSON.parse(variantsJson);
    } catch {
      return NextResponse.json(
        { success: false, message: "Format varian tidak valid" },
        { status: 400 },
      );
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { success: false, message: "Minimal harus ada 1 varian produk" },
        { status: 400 },
      );
    }

    const seenSizes = new Set();
    const normalizedVariants = [];

    for (const variant of variants) {
      const size = String(variant?.size ?? "")
        .trim()
        .toUpperCase();
      const price = Number(variant?.price);
      const stock = Number(variant?.stock);

      if (!size || variant?.price === "" || variant?.stock === "") {
        return NextResponse.json(
          {
            success: false,
            message: "Semua field varian (size, price, stock) wajib diisi",
          },
          { status: 400 },
        );
      }

      if (seenSizes.has(size)) {
        return NextResponse.json(
          { success: false, message: `Ukuran ${size} tidak boleh duplikat` },
          { status: 400 },
        );
      }

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Harga varian ${size} harus lebih dari 0`,
          },
          { status: 400 },
        );
      }

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Stok varian ${size} tidak boleh negatif`,
          },
          { status: 400 },
        );
      }

      seenSizes.add(size);
      normalizedVariants.push({ size, price, stock });
    }

    // === 4. Validasi diskon (opsional, 0-100) ===
    const discount = discountStr ? Number(discountStr) : 0;
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      return NextResponse.json(
        { success: false, message: "Diskon harus antara 0-100%" },
        { status: 400 },
      );
    }

    // === 5. Pastikan produk ada ===
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    // === 6. Ambil gambar lama & validasi gambar baru ===
    const existingImages = formData
      .getAll("existing_images")
      .map((key) => key?.toString())
      .filter(Boolean);

    const imageFiles = formData.getAll("images");
    const validImages = imageFiles.filter((file) => file && file.size > 0);

    const ALLOWED_IMAGE_TYPES = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    for (const file of validImages) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Tipe file ${file.name} tidak didukung. Gunakan PNG, JPEG, atau WebP.`,
          },
          { status: 400 },
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `File ${file.name} terlalu besar. Maksimal 5MB per gambar.`,
          },
          { status: 400 },
        );
      }
    }

    // === 7. Upload gambar baru ke Cloudflare R2 ===
    let newImageKeys = [];
    if (validImages.length > 0) {
      try {
        newImageKeys = await uploadFilesToR2(validImages, "products");
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        return NextResponse.json(
          { success: false, message: "Gagal mengupload gambar produk ke R2" },
          { status: 500 },
        );
      }
    }

    const imageUrls = [...existingImages, ...newImageKeys];

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, message: "Minimal harus ada 1 gambar produk" },
        { status: 400 },
      );
    }

    // === 8. Update ke Firestore ===
    await updateDoc(docRef, {
      product_name: productName,
      description,
      category_id: categoryId,
      category_name: categoryName,
      variants: normalizedVariants,
      discount,
      images: imageUrls,
      updatedAt: new Date().toISOString(),
    });

    // === 9. Hapus gambar lama yang tidak lagi dipakai dari R2 ===
    const oldImageKeys = docSnap.data().images || [];
    const removedImageKeys = oldImageKeys.filter(
      (key) => !imageUrls.includes(key),
    );

    if (removedImageKeys.length > 0) {
      try {
        await deleteFilesFromR2(removedImageKeys);
      } catch (deleteImageError) {
        // Update produk sudah berhasil, cukup catat kegagalan hapus gambar
        console.error(
          "Error deleting removed product images from R2:",
          deleteImageError,
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil diperbarui",
        product_id: docRef.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error PUT Product:", error);

    return NextResponse.json(
      { success: false, message: "Gagal memperbarui produk" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    const product = docSnap.data();
    const imageKeys = product.images || [];

    // Hapus gambar dari Cloudflare R2 terlebih dahulu
    if (imageKeys.length > 0) {
      try {
        await deleteFilesFromR2(imageKeys);
      } catch (deleteImageError) {
        console.error(
          "Error deleting product images from R2:",
          deleteImageError,
        );

        return NextResponse.json(
          {
            success: false,
            message: "Gagal menghapus gambar produk dari R2",
          },
          { status: 500 },
        );
      }
    }

    // Hapus dokumen produk dari Firestore
    await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil dihapus",
        product_id: id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error DELETE Product:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menghapus produk" },
      { status: 500 },
    );
  }
}

import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import { getR2SignedUrl, uploadFilesToR2 } from "@/lib/r2";

export async function GET() {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    const products = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const product = doc.data();

        const signedImages = await Promise.all(
          (product.images || []).map((key) => getR2SignedUrl(key)),
        );

        return {
          product_id: doc.id,
          ...product,
          images: signedImages,
        };
      }),
    );

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error GET Products:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data produk",
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
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

    // === 5. Ambil & validasi gambar ===
    const imageFiles = formData.getAll("images");
    const validImages = imageFiles.filter((file) => file && file.size > 0);

    // Validasi tipe dan ukuran gambar
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

    // === 6. Upload gambar ke Cloudflare R2 ===
    let imageUrls = [];
    if (validImages.length > 0) {
      try {
        imageUrls = await uploadFilesToR2(validImages, "products");
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        return NextResponse.json(
          { success: false, message: "Gagal mengupload gambar produk ke R2" },
          { status: 500 },
        );
      }
    }

    // === 6. Simpan ke Firestore ===
    const now = new Date().toISOString();
    const productData = {
      product_name: productName,
      description,
      category_id: categoryId,
      category_name: categoryName,
      variants: normalizedVariants,
      discount,
      images: imageUrls,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, "products"), productData);

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan",
        product_id: docRef.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error POST Product:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan data produk" },
      { status: 500 },
    );
  }
}

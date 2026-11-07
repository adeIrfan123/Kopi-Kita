import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Kategori tidak ditemukkan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Kategori berhasil diambil",
        category_id: docSnap.id,
        ...docSnap.data(),
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data kategori" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.category_name) {
      return NextResponse.json(
        { success: false, message: "Nama kategori tidak boleh kosong" },
        { status: 400 },
      );
    }

    const docRef = doc(db, "categories", id);

    await updateDoc(docRef, {
      category_name: body.category_name,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kategori berhasil diupdate",
        category_id: docRef.id,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui kategori" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const productsRef = collection(db, "products");
    const q = query(productsRef, where("category_id", "==", id));
    const querySnapshot = await getDocs(q);

    const deletePromise = querySnapshot.docs.map((productDoc) =>
      deleteDoc(doc(db, "products", productDoc.id)),
    );
    await Promise.all(deletePromise);

    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);

    return NextResponse.json(
      {
        success: true,
        message: `Kategori beserta ${querySnapshot.size} produk di dalamnya berhasil dihapus`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kategori" },
      { status: 500 },
    );
  }
}

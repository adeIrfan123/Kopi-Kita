import { db } from "@/lib/firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
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
      { status: false, message: "Gagal memperbarui kategori" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);

    return NextResponse.json(
      { success: true, message: "Kategori berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus kategori" },
      { status: 500 },
    );
  }
}

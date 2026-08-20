import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "categories"));

    const categories = snapshot.docs.map((doc) => ({
      category_id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { success: true, message: "Data berhasil diambil", data: categories },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.category_name) {
      return NextResponse.json(
        { success: false, message: "Nama Kategori Wajib Diisi" },
        { status: 400 },
      );
    }

    const docRef = await addDoc(collection(db, "categories"), {
      category_name: body.category_name,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil Menambahkan Kategori Baru",
        category_id: docRef.id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal Menyimpan Data", error: error.message },
      { status: 500 },
    );
  }
}

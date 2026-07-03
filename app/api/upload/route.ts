import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    // Cek ukuran file (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File terlalu besar (maks 2MB)" }, { status: 400 })
    }

    // Convert file ke base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "sidesa-dokumen",
      resource_type: "auto",
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error("UPLOAD ERROR:", err)
    return NextResponse.json({ error: "Gagal upload file" }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nik, nama, noHp, tglLahir, password } = body

    if (!nik || !nama || !noHp || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    if (nik.length !== 16) {
      return NextResponse.json({ error: "NIK harus 16 digit" }, { status: 400 })
    }

    const existing = await prisma.warga.findUnique({ where: { nik } })

    if (existing) {
      return NextResponse.json({ error: "NIK sudah terdaftar" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const warga = await prisma.warga.create({
      data: {
        nik,
        nama,
        noHp,
        tglLahir: tglLahir ? new Date(tglLahir) : null,
        password: hashedPassword,
        role: "USER",
      },
    })

 return NextResponse.json({ success: true, id: warga.id })
  } catch (err) {
    console.error("REGISTER ERROR:", err)
    return NextResponse.json({ error: "Server error", detail: String(err) }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const warga = await prisma.warga.findUnique({
    where: { id: (session.user as any).id },
    select: {
      nama: true,
      nik: true,
      noHp: true,
      tglLahir: true,
    }
  })

  return NextResponse.json(warga)
}
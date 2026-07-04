import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const warga = await prisma.warga.findUnique({
    where: { nik: (session.user as any).nik },
  })

  if (!warga) {
    return NextResponse.json([], { status: 200 })
  }

  const pengajuan = await prisma.pengajuan.findMany({
    where: { wargaId: warga.id },
    orderBy: { updatedAt: "desc" },
    include: {
      riwayat: { orderBy: { createdAt: "desc" } },
    },
  })

  return NextResponse.json(pengajuan)
}
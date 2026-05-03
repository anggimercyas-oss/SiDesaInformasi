import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { noPengajuan: string } }
) {
  const pengajuan = await prisma.pengajuan.findUnique({
    where: { noPengajuan: params.noPengajuan },
    include: { riwayat: { orderBy: { createdAt: "asc" } }, warga: true },
  })
  if (!pengajuan) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  }
  return NextResponse.json(pengajuan)
}
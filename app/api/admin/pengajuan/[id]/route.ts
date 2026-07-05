import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const pengajuan = await prisma.pengajuan.findUnique({
    where: { id },
    include: {
      warga: true,
      riwayat: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!pengajuan) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json(pengajuan)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, catatan, fileUrl } = body

  const STATUS_LABEL: Record<string, string> = {
    DITERIMA: "Pengajuan Diterima",
    VERIFIKASI: "Verifikasi Dokumen",
    TTD_KEPDES: "Tanda Tangan Kepala Desa",
    SELESAI: "Surat Selesai & Siap Diunduh",
  }

  const pengajuan = await prisma.pengajuan.update({
    where: { id },
    data: {
      status,
      ...(fileUrl ? { dokumen: { push: fileUrl } } : {}),
      riwayat: {
        create: {
          status,
          catatan: catatan || STATUS_LABEL[status],
        },
      },
    },
    include: { warga: true },
  })

  return NextResponse.json({ success: true, pengajuan })
}
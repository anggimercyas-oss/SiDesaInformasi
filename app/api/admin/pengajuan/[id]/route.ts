import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { kirimWhatsApp } from "@/lib/whatsapp"

const STATUS_LABEL: Record<string, string> = {
  DITERIMA:   "Pengajuan Diterima",
  VERIFIKASI: "Verifikasi Dokumen",
  TTD_KEPDES: "Tanda Tangan Kepala Desa",
  SELESAI:    "Surat Selesai & Siap Diunduh",
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, catatan, fileUrl } = body

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

  // Kirim notifikasi WhatsApp
  let pesan = ""
  if (status === "SELESAI") {
    pesan = `🎉 *Surat Anda Sudah Selesai!*\n\nHalo ${pengajuan.warga.nama},\nSurat *${pengajuan.jenisSurat}* (No. ${pengajuan.noPengajuan}) sudah selesai diproses.\n\n📍 Silakan unduh di halaman Tracking atau ambil langsung di kantor desa.\n\n_SiDesa — Sistem Informasi Desa_`
  } else {
    pesan = `📋 *Update Status Pengajuan*\n\nHalo ${pengajuan.warga.nama},\nStatus pengajuan *${pengajuan.jenisSurat}* (No. ${pengajuan.noPengajuan}) telah diperbarui menjadi:\n\n*${STATUS_LABEL[status]}*\n\n_SiDesa — Sistem Informasi Desa_`
  }

  await kirimWhatsApp(pengajuan.warga.noHp, pesan)

  return NextResponse.json({ success: true, pengajuan })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
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
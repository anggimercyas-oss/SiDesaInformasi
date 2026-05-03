import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { kirimWhatsApp } from "@/lib/whatsapp"

// Generate nomor pengajuan unik: DSM-2026-XXXX
function generateNomor() {
  const tahun = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DSM-${tahun}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jenisSurat, nama, nik, noHp, alamat, keperluan } = body

    // Validasi data wajib
    if (!jenisSurat || !nama || !nik || !noHp) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Cari atau buat akun warga
    let warga = await prisma.warga.findUnique({ where: { nik } })
    if (!warga) {
      warga = await prisma.warga.create({
        data: { nik, nama, noHp, password: nik }, // password sementara = NIK
      })
    }

    // Simpan pengajuan ke database
    const noPengajuan = generateNomor()
    await prisma.pengajuan.create({
      data: {
        noPengajuan,
        jenisSurat,
        keperluan,
        wargaId: warga.id,
        riwayat: {
          create: { status: "DITERIMA", catatan: "Pengajuan berhasil diterima" }
        }
      }
    })

    // Kirim notifikasi WhatsApp otomatis
    await kirimWhatsApp(noHp,
      `✅ *Pengajuan Surat Berhasil Diterima!*\n\n` +
      `Halo ${nama},\n` +
      `No. Pengajuan: *${noPengajuan}*\n` +
      `Jenis Surat: ${jenisSurat}\n` +
      `Estimasi selesai: 2 hari kerja\n\n` +
      `Pantau status di: ${process.env.NEXT_PUBLIC_APP_URL}/tracking\n\n` +
      `_SiDesa — Sistem Informasi Desa_`
    )

    return NextResponse.json({ success: true, noPengajuan })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

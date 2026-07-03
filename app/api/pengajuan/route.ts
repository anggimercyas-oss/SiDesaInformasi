import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

function generateNoPengajuan(kode: string, urutan: number) {
  const now = new Date()
  const bulanRomawi = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"]
  const bulan = bulanRomawi[now.getMonth()]
  const tahun = now.getFullYear()
  const nomor = String(urutan).padStart(3, "0")
  return `${kode}/${nomor}/KDG/${bulan}/${tahun}`
}

const KODE_SURAT: Record<string, string> = {
  "Surat Keterangan Domisili": "09",
  "Surat Keterangan Tidak Mampu": "09",
  "Surat Keterangan Kelahiran": "09",
  "Surat Keterangan Usaha": "09",
  "Surat Keterangan Kematian": "09",
  "Surat Pengantar KTP": "15",
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { jenisSurat, keperluan, dataLengkap, dokumen } = body

    if (!jenisSurat) {
      return NextResponse.json({ error: "Jenis surat wajib diisi" }, { status: 400 })
    }

    const kode = KODE_SURAT[jenisSurat] || "09"

    // Hitung nomor urut berdasarkan kode surat
    const jumlahSurat = await prisma.pengajuan.count({
      where: {
        noPengajuan: { startsWith: kode }
      }
    })
    const urutan = jumlahSurat + 1
    const noPengajuan = generateNoPengajuan(kode, urutan)

    const pengajuan = await prisma.pengajuan.create({
      data: {
        noPengajuan,
        jenisSurat,
        keperluan: keperluan || "",
        status: "DITERIMA",
        dokumen: dokumen || [],
        wargaId: (session.user as any).id,
        riwayat: {
          create: {
            status: "DITERIMA",
            catatan: "Pengajuan berhasil diterima oleh sistem",
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      noPengajuan: pengajuan.noPengajuan,
      id: pengajuan.id
    })
  } catch (err) {
    console.error("PENGAJUAN ERROR:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
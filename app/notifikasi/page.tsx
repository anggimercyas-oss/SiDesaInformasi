"use client"
import { useState } from "react"

const NOTIF_DATA = [
  {
    id: 1, tipe: "success", icon: "✅",
    judul: "Surat Domisili Selesai!",
    isi: "No. DSM-2026-0039 sudah selesai dan siap diambil di kantor desa.",
    waktu: "Hari ini, 08.30 WIB", dibaca: false,
  },
  {
    id: 2, tipe: "warning", icon: "⏳",
    judul: "Pengajuan Sedang Diproses",
    isi: "Surat Pengantar KTP (DSM-2026-0042) sedang ditinjau oleh petugas.",
    waktu: "Kemarin, 14.15 WIB", dibaca: false,
  },
  {
    id: 3, tipe: "info", icon: "📩",
    judul: "Pengajuan Diterima",
    isi: "Pengajuan Surat Keterangan Usaha Anda berhasil diterima. No: DSM-2026-0043.",
    waktu: "2 Mei 2026, 09.05 WIB", dibaca: false,
  },
  {
    id: 4, tipe: "info", icon: "📢",
    judul: "Info: Jam Pelayanan",
    isi: "Kantor desa tutup pada 1 Mei 2026 (Hari Buruh). Layanan online tetap aktif.",
    waktu: "30 Apr 2026", dibaca: true,
  },
]

const WARNA: Record<string, string> = {
  success: "bg-hijau-muda",
  warning: "bg-kuning-muda",
  info: "bg-blue-50",
}

export default function Notifikasi() {
  const [notifs, setNotifs] = useState(NOTIF_DATA)

  const tandaiSemua = () => {
    setNotifs(notifs.map(n => ({ ...n, dibaca: true })))
  }

  const belumDibaca = notifs.filter(n => !n.dibaca).length

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold">Notifikasi</h1>
          {belumDibaca > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{belumDibaca} belum dibaca</p>
          )}
        </div>
        {belumDibaca > 0 && (
          <button onClick={tandaiSemua} className="btn-secondary text-xs px-3 py-1.5">
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* List Notifikasi */}
      <div className="flex flex-col gap-2.5 mb-6">
        {notifs.map(n => (
          <div key={n.id}
            onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, dibaca: true } : x))}
            className={`card flex gap-3 cursor-pointer transition-all
              ${!n.dibaca ? "border-l-4 border-l-hijau bg-hijau-muda/30" : "opacity-70"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${WARNA[n.tipe]}`}>
              {n.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold">{n.judul}</p>
                {!n.dibaca && <span className="w-2 h-2 bg-hijau rounded-full flex-shrink-0 mt-1.5"></span>}
              </div>
              <p className="text-[12px] text-gray-400 mt-0.5 leading-relaxed">{n.isi}</p>
              <p className="text-[11px] text-gray-300 mt-1">{n.waktu}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hubungkan WA */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center">
        <p className="text-sm font-semibold mb-1">Aktifkan Notifikasi WhatsApp</p>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Dapatkan notifikasi otomatis langsung ke WhatsApp setiap ada update pengajuan.
        </p>
        <button className="btn-primary text-sm" style={{ background: "#25D366" }}>
          Hubungkan WhatsApp
        </button>
      </div>

    </div>
  )
}
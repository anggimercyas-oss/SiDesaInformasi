"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const STATUS_LABEL: Record<string, string> = { DITERIMA: "Pengajuan Diterima", VERIFIKASI: "Verifikasi Dokumen", TTD_KEPDES: "Tanda Tangan Kepala Desa", SELESAI: "Surat Siap Diunduh" }
const STATUS_COLOR: Record<string, string> = { DITERIMA: "bg-blue-50 text-blue-700", VERIFIKASI: "bg-yellow-50 text-yellow-700", TTD_KEPDES: "bg-purple-50 text-purple-700", SELESAI: "bg-hijau-muda text-hijau-tua" }
const STATUS_ICON: Record<string, string> = { DITERIMA: "📋", VERIFIKASI: "🔍", TTD_KEPDES: "✍️", SELESAI: "✅" }

export default function Notifikasi() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notifikasi").then(res => res.json()).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-10"><p className="text-sm text-gray-400 text-center">Memuat...</p></div>

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h1 className="text-lg font-semibold mb-1">Notifikasi</h1>
      <p className="text-xs text-gray-400 mb-5">Riwayat semua pengajuan surat Anda</p>
      {data.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-sm text-gray-400 mb-4">Belum ada pengajuan surat</p>
          <Link href="/ajukan" className="btn-primary text-sm">Ajukan Surat Sekarang</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map(p => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{STATUS_ICON[p.status]}</span>
                  <div>
                    <p className="text-sm font-semibold">{p.jenisSurat}</p>
                    <p className="text-xs text-gray-400">No. {p.noPengajuan}</p>
                  </div>
                </div>
                <span className={"text-[11px] font-medium px-2.5 py-1 rounded-full " + STATUS_COLOR[p.status]}>{STATUS_LABEL[p.status]}</span>
              </div>
              <p className="text-xs text-gray-300 mb-3">Diajukan: {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              <div className="flex gap-2">
                <Link href={"/tracking?no=" + p.noPengajuan} className="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">🔍 Lihat Detail</Link>
                {p.status === "SELESAI" && p.dokumen?.length > 0 && (
                  <Link href={p.dokumen[p.dokumen.length - 1]} className="flex-1 text-center text-xs py-2 rounded-lg bg-hijau text-white hover:opacity-90">⬇️ Unduh Surat</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
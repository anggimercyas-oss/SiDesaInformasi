"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const STATUS_LABEL: Record<string, string> = {
  DITERIMA:   "Pengajuan Diterima",
  VERIFIKASI: "Verifikasi Dokumen",
  TTD_KEPDES: "Tanda Tangan Kepala Desa",
  SELESAI:    "Surat Siap Diunduh",
}

const STATUS_COLOR: Record<string, string> = {
  DITERIMA:   "bg-blue-50 text-blue-700",
  VERIFIKASI: "bg-yellow-50 text-yellow-700",
  TTD_KEPDES: "bg-purple-50 text-purple-700",
  SELESAI:    "bg-hijau-muda text-hijau-tua",
}

const STATUS_ICON: Record<string, string> = {
  DITERIMA:   "📋",
  VERIFIKASI: "🔍",
  TTD_KEPDES: "✍️",
  SELESAI:    "✅",
}

export default function Notifikasi() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notifikasi")
      .then(res => res.json())
      .then(d => {
        setData(Array.isArray(d) ? d : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 animate-fade-in">
      <h1 className="text-lg font-semibold mb-1">Notifikasi</h1>
      <p className="text-xs text-gray-400 mb-5">Riwayat semua pengajuan surat Anda</p>

      {data.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-sm text-gray-400">Belum ada pengajuan surat</p>
          <p className="text-xs text-gray-300 mt-1 mb-5">Ajukan surat pertama Anda sekarang</p>
          <Link href="/ajukan" className="btn-primary text-sm active:scale-95">
            Ajukan Surat Sekarang
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map(p => {
            const fileUrl = p.dokumen?.length > 0 ? p.dokumen[p.dokumen.length - 1] : null
            const latestRiwayat = p.riwayat?.[0]
            return (
              <div key={p.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-hijau-muda rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {STATUS_ICON[p.status]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{p.jenisSurat}</p>
                      <p className="text-xs text-gray-400">No. {p.noPengajuan}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {["DITERIMA","VERIFIKASI","TTD_KEPDES","SELESAI"].map((s, i) => {
                    const steps = ["DITERIMA","VERIFIKASI","TTD_KEPDES","SELESAI"]
                    const currentIdx = steps.indexOf(p.status)
                    const done = i <= currentIdx
                    return (
                      <div key={s} className="flex items-center gap-1 flex-1">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? "bg-hijau" : "bg-gray-200"}`} />
                        {i < 3 && <div className={`h-0.5 flex-1 ${done && i < currentIdx ? "bg-hijau" : "bg-gray-200"}`} />}
                      </div>
                    )
                  })}
                </div>

                {latestRiwayat && (
                  <p className="text-xs text-gray-400 mb-3">
                    🕐 Update terakhir: {new Date(latestRiwayat.createdAt).toLocaleString("id-ID")}
                    {latestRiwayat.catatan && ` — ${latestRiwayat.catatan}`}
                  </p>
                )}

                <p className="text-xs text-gray-300 mb-3">
                  Diajukan: {new Date(p.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>

                <div className="flex gap-2">
                  <Link
                    href={`/tracking?no=${p.noPengajuan}`}
                    className="flex-1 text-center text-xs py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors active:scale-95">
                    🔍 Lihat Detail
                  </Link>
                  {p.status === "SELESAI" && fileUrl && (
                    
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs py-2 rounded-lg bg-hijau text-white hover:opacity-90 transition-opacity active:scale-95">
                      ⬇️ Unduh Surat
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
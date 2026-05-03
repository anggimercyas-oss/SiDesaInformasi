"use client"
import { useState } from "react"

const STATUS_STEPS = ["DITERIMA", "VERIFIKASI", "TTD_KEPDES", "SELESAI"]
const STATUS_LABEL: Record<string, string> = {
  DITERIMA:   "Pengajuan Diterima",
  VERIFIKASI: "Verifikasi Dokumen",
  TTD_KEPDES: "Tanda Tangan Kepdes",
  SELESAI:    "Surat Siap Diambil",
}

export default function Tracking() {
  const [nomor, setNomor] = useState("")
  const [data, setData]   = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const cariPengajuan = async () => {
    if (!nomor.trim()) return
    setLoading(true); setError("")
    try {
      const res = await fetch(`/api/tracking/${nomor.trim()}`)
      if (!res.ok) { setError("Nomor pengajuan tidak ditemukan."); setData(null); return }
      setData(await res.json())
    } catch { setError("Gagal memuat data.") }
    finally { setLoading(false) }
  }

  const currentIdx = data ? STATUS_STEPS.indexOf(data.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h1 className="text-lg font-semibold mb-5">Tracking Status Pengajuan</h1>

      {/* Search */}
      <div className="card mb-5">
        <div className="flex gap-2">
          <input className="form-input flex-1" placeholder="Masukkan No. Pengajuan (cth: DSM-2026-XXXX)"
            value={nomor} onChange={e => setNomor(e.target.value)}
            onKeyDown={e => e.key === "Enter" && cariPengajuan()} />
          <button onClick={cariPengajuan} className="btn-primary px-5" disabled={loading}>
            {loading ? "..." : "Cari"}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {/* Hasil */}
      {data && (
        <div className="card space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{data.jenisSurat}</p>
              <p className="text-xs text-gray-400">No. {data.noPengajuan}</p>
            </div>
            <span className={data.status === "SELESAI" ? "badge-hijau" : "badge-kuning"}>
              {STATUS_LABEL[data.status]}
            </span>
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                    ${i <= currentIdx ? "bg-hijau text-white" : "bg-gray-100 text-gray-400"}`}>
                    {i < currentIdx ? "✓" : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`w-0.5 h-6 ${i < currentIdx ? "bg-hijau" : "bg-gray-100"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-sm font-medium ${i <= currentIdx ? "" : "text-gray-400"}`}>
                    {STATUS_LABEL[s]}
                  </p>
                  {data.riwayat.find((r: any) => r.status === s) && (
                    <p className="text-xs text-gray-400">
                      {new Date(data.riwayat.find((r: any) => r.status === s).createdAt)
                        .toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

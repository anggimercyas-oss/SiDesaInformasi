"use client"
import { useState } from "react"

const STATUS_STEPS = ["DITERIMA", "VERIFIKASI", "TTD_KEPDES", "SELESAI"]
const STATUS_LABEL: Record<string, string> = {
  DITERIMA:   "Pengajuan Diterima",
  VERIFIKASI: "Verifikasi Dokumen",
  TTD_KEPDES: "Tanda Tangan Kepala Desa",
  SELESAI:    "Surat Siap Diunduh",
}

export default function Tracking() {
  const [nomor, setNomor] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const cariPengajuan = async () => {
    if (!nomor.trim()) return
    setLoading(true)
    setError("")
    setData(null)
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(nomor.trim())}`)
      if (!res.ok) {
        setError("Nomor pengajuan tidak ditemukan. Pastikan nomor sudah benar.")
        setLoading(false)
        return
      }
      setData(await res.json())
    } catch {
      setError("Gagal memuat data. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const currentIdx = data ? STATUS_STEPS.indexOf(data.status) : -1
  const fileUrl = data?.dokumen?.length > 0 ? data.dokumen[data.dokumen.length - 1] : null

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h1 className="text-lg font-semibold mb-5">Tracking Status Pengajuan</h1>

      <div className="card mb-5">
        <p className="text-xs text-gray-400 mb-3">
          Masukkan nomor pengajuan yang Anda terima via WhatsApp setelah mengajukan surat.
        </p>
        <div className="flex gap-2">
          <input
            className="form-input flex-1"
            placeholder="Cth: DSM-2026-XXXX"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && cariPengajuan()}
          />
          <button onClick={cariPengajuan} disabled={loading} className="btn-primary px-5 active:scale-95">
            {loading ? "..." : "Cari"}
          </button>
        </div>
        {error && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-xs text-red-500">⚠️ {error}</p>
          </div>
        )}
      </div>

      {data && (
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-gray-800">{data.jenisSurat}</p>
                <p className="text-xs text-gray-400 mt-0.5">No. {data.noPengajuan}</p>
                <p className="text-xs text-gray-400">
                  Diajukan: {new Date(data.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  data.status === "SELESAI"
                    ? "bg-hijau-muda text-hijau-tua"
                    : data.status === "TTD_KEPDES"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-kuning-muda text-yellow-700"
                }`}
              >
                {STATUS_LABEL[data.status]}
              </span>
            </div>

            {data.warga && (
              <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-gray-500">
                  👤 <strong>{data.warga.nama}</strong> • {data.warga.noHp}
                </p>
              </div>
            )}

            <div className="space-y-0">
              {STATUS_STEPS.map((s, i) => {
                const riwayat = data.riwayat?.find((r: any) => r.status === s)
                const done = i <= currentIdx
                return (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all ${
                          done ? "bg-hijau text-white" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {i < currentIdx ? "✓" : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 transition-all ${i < currentIdx ? "bg-hijau" : "bg-gray-100"}`} />
                      )}
                    </div>
                    <div className="pb-2 flex-1">
                      <p className={`text-sm font-medium ${done ? "text-gray-800" : "text-gray-400"}`}>
                        {STATUS_LABEL[s]}
                      </p>
                      {riwayat && (
                        <>
                          <p className="text-xs text-gray-400 mt-0.5">{riwayat.catatan}</p>
                          <p className="text-[11px] text-gray-300 mt-0.5">
                            {new Date(riwayat.createdAt).toLocaleString("id-ID")}
                          </p>
                        </>
                      )}
                      {!riwayat && !done && (
                        <p className="text-xs text-gray-300 mt-0.5">Menunggu proses...</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {data.status === "SELESAI" && fileUrl && (
            <div className="card border-hijau bg-hijau-muda">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-hijau rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  📄
                </div>
                <div>
                  <p className="text-sm font-semibold text-hijau-tua">Surat Sudah Selesai!</p>
                  <p className="text-xs text-hijau-tua/70">Surat Anda sudah ditandatangani dan siap diunduh</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-hijau-border text-hijau-tua text-sm font-medium rounded-xl hover:bg-white/80 transition-colors active:scale-95"
                >
                  👁 Lihat Surat
                </a>
                <a
                  href={fileUrl}
                  download={`Surat-${data.noPengajuan}.pdf`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-hijau text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity active:scale-95"
                >
                  ⬇️ Unduh Surat
                </a>
              </div>

              <p className="text-[11px] text-hijau-tua/60 text-center mt-2">
                Surat juga dapat diambil langsung di kantor desa • Senin-Jumat 08.00-15.00
              </p>
            </div>
          )}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-gray-400">Masukkan nomor pengajuan untuk melihat status surat Anda</p>
          <p className="text-xs text-gray-300 mt-1">Nomor pengajuan dikirim via WhatsApp setelah mengajukan surat</p>
        </div>
      )}
    </div>
  )
}
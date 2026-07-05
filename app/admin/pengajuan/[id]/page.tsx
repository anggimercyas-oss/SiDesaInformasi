"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

const STATUS_STEPS = ["DITERIMA", "VERIFIKASI", "TTD_KEPDES", "SELESAI"]
const STATUS_LABEL: Record<string, string> = {
  DITERIMA:   "Diterima",
  VERIFIKASI: "Verifikasi Dokumen",
  TTD_KEPDES: "TTD Kepala Desa",
  SELESAI:    "Selesai",
}

export default function DetailPengajuan() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fileUrl, setFileUrl] = useState("")

  useEffect(() => {
    fetch(`/api/admin/pengajuan/${params.id}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(d => {
      setData(d)
      setLoading(false)
    })
    .catch(err => {
      console.error("Error:", err)
      setLoading(false)
    })
}, [params.id])

  const currentIdx = data ? STATUS_STEPS.indexOf(data.status) : -1
  const nextStatus = currentIdx < STATUS_STEPS.length - 1 ? STATUS_STEPS[currentIdx + 1] : null

  const handleUpdateStatus = async () => {
    if (!nextStatus) return

    if (nextStatus === "SELESAI" && !fileUrl) {
      alert("Harap masukkan link PDF surat sebelum menandai SELESAI")
      return
    }

    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/pengajuan/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          fileUrl: nextStatus === "SELESAI" ? fileUrl : undefined,
        }),
      })
      const result = await res.json()
      setData(result.pengajuan)
      setFileUrl("")
    } catch {
      alert("Gagal update status")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto px-6 py-10 text-center"><p className="text-sm text-gray-400">Memuat...</p></div>
  }

  if (!data) {
    return <div className="max-w-2xl mx-auto px-6 py-10 text-center"><p className="text-sm text-gray-400">Data tidak ditemukan</p></div>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <Link href="/admin" className="text-xs text-gray-400 hover:text-hijau mb-4 inline-block active:scale-95 transition-transform">
        ← Kembali ke Dashboard
      </Link>

      <div className="card mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold text-gray-800">{data.jenisSurat}</p>
            <p className="text-xs text-gray-400 mt-0.5">No. {data.noPengajuan}</p>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-hijau-muda text-hijau-tua">
            {STATUS_LABEL[data.status]}
          </span>
        </div>

        {/* Data Pemohon */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1">
          <p className="text-xs text-gray-500"><strong>Nama:</strong> {data.warga.nama}</p>
          <p className="text-xs text-gray-500"><strong>NIK:</strong> {data.warga.nik}</p>
          <p className="text-xs text-gray-500"><strong>No. HP:</strong> {data.warga.noHp}</p>
          {data.keperluan && <p className="text-xs text-gray-500"><strong>Keperluan:</strong> {data.keperluan}</p>}
        </div>

        {/* Dokumen */}
        {data.dokumen?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Dokumen Terlampir:</p>
            <div className="flex flex-col gap-1.5">
              {data.dokumen.map((d: string, i: number) => (
                <a key={i} href={d} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline truncate hover:text-blue-700">
                  📎 Dokumen {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-0 mb-4">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  i <= currentIdx ? "bg-hijau text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {i < currentIdx ? "✓" : i + 1}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`w-0.5 h-8 ${i < currentIdx ? "bg-hijau" : "bg-gray-100"}`} />
                )}
              </div>
              <div className="pb-2">
                <p className={`text-sm font-medium ${i <= currentIdx ? "text-gray-800" : "text-gray-400"}`}>
                  {STATUS_LABEL[s]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Update Status */}
        {nextStatus && (
          <div className="border-t border-gray-100 pt-4">
            {nextStatus === "SELESAI" && (
              <div className="mb-3">
                <label className="form-label">Link PDF Surat *</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  className="form-input"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Upload PDF surat ke Google Drive/Cloudinary, lalu paste link-nya di sini
                </p>
              </div>
            )}

            <button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="btn-primary w-full active:scale-95">
              {updating ? "Memproses..." : `Update ke: ${STATUS_LABEL[nextStatus]} →`}
            </button>
          </div>
        )}

        {data.status === "SELESAI" && (
          <div className="bg-hijau-muda border border-hijau-border rounded-xl p-3 text-center">
            <p className="text-sm text-hijau-tua font-medium">✅ Pengajuan ini sudah selesai</p>
          </div>
        )}
      </div>
    </div>
  )
}
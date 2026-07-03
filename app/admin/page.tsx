"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const STATUS_LABEL: Record<string, string> = {
  DITERIMA:   "Diterima",
  VERIFIKASI: "Verifikasi",
  TTD_KEPDES: "TTD Kepdes",
  SELESAI:    "Selesai",
}

const STATUS_COLOR: Record<string, string> = {
  DITERIMA:   "bg-blue-50 text-blue-700",
  VERIFIKASI: "bg-kuning-muda text-yellow-700",
  TTD_KEPDES: "bg-purple-50 text-purple-700",
  SELESAI:    "bg-hijau-muda text-hijau-tua",
}

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")

  useEffect(() => {
    fetch("/api/admin/pengajuan")
      .then(res => res.json())
      .then(data => {
        setData(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === "ALL" ? data : data.filter(d => d.status === filter)

  const stats = {
    total: data.length,
    diterima: data.filter(d => d.status === "DITERIMA").length,
    proses: data.filter(d => ["VERIFIKASI", "TTD_KEPDES"].includes(d.status)).length,
    selesai: data.filter(d => d.status === "SELESAI").length,
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="text-sm text-gray-400">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <h1 className="text-lg font-semibold mb-1">Dashboard Admin</h1>
      <p className="text-xs text-gray-400 mb-5">Kelola semua pengajuan surat warga</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Total Pengajuan</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.diterima}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Baru Diterima</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.proses}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Sedang Diproses</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-hijau">{stats.selesai}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Selesai</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL", "DITERIMA", "VERIFIKASI", "TTD_KEPDES", "SELESAI"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
              filter === s
                ? "bg-hijau text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}>
            {s === "ALL" ? "Semua" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm text-gray-400">Belum ada pengajuan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(p => (
            <div key={p.id} className="card flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold">{p.jenisSurat}</p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  No. {p.noPengajuan} • {p.warga?.nama} ({p.warga?.nik})
                </p>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Diajukan: {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <Link href={`/admin/pengajuan/${p.id}`} className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0 active:scale-95 inline-block text-center">
                Detail →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
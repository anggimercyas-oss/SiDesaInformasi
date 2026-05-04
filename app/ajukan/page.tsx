"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const JENIS_SURAT = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Tidak Mampu",
  "Surat Pengantar KTP",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Usaha",
  "Surat Keterangan Kematian",
]

export default function AjukanSurat() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sukses, setSukses] = useState<string | false>(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    jenisSurat: "", nama: "", nik: "",
    noHp: "", tglLahir: "", alamat: "", keperluan: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipe: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "desa_dokumen")
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData }
      )
      const data = await res.json()
      setUploadedFiles(prev => ({ ...prev, [tipe]: data.secure_url }))
    } catch {
      alert("Gagal upload file. Coba lagi.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.jenisSurat || !form.nama || !form.nik || !form.noHp) {
      alert("Harap lengkapi data yang wajib diisi!")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/pengajuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dokumen: Object.values(uploadedFiles) }),
      })
      const data = await res.json()
      if (data.success) setSukses(data.noPengajuan)
      else alert("Gagal mengirim. Coba lagi.")
    } catch {
      alert("Gagal mengirim pengajuan. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">

      {/* Popup Sukses */}
      {sukses && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-hijau-muda rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Pengajuan Berhasil!</h2>
            <p className="text-sm text-gray-500 mb-1">Nomor Pengajuan Anda:</p>
            <div className="bg-hijau-muda text-hijau-tua font-bold text-lg px-4 py-2 rounded-lg mb-4">
              {sukses}
            </div>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Simpan nomor ini untuk memantau status. Notifikasi WhatsApp akan dikirim otomatis.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setSukses(false)} className="btn-secondary flex-1 text-sm">Tutup</button>
              <button onClick={() => router.push("/tracking")} className="btn-primary flex-1 text-sm">Cek Status →</button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-lg font-semibold mb-5">Formulir Pengajuan Surat</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card space-y-4">

          {/* Jenis Surat */}
          <div>
            <label className="form-label">Jenis Surat *</label>
            <select name="jenisSurat" className="form-input" onChange={handleChange} value={form.jenisSurat}>
              <option value="">-- Pilih jenis surat --</option>
              {JENIS_SURAT.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          {/* Nama & NIK */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Nama Lengkap *</label>
              <input name="nama" className="form-input" placeholder="Nama sesuai KTP"
                onChange={handleChange} value={form.nama} />
            </div>
            <div>
              <label className="form-label">NIK *</label>
              <input name="nik" className="form-input" placeholder="16 digit NIK"
                maxLength={16} onChange={handleChange} value={form.nik} />
            </div>
          </div>

          {/* No HP & Tanggal Lahir */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Nomor WhatsApp *</label>
              <input name="noHp" className="form-input" placeholder="08xx-xxxx-xxxx"
                onChange={handleChange} value={form.noHp} />
            </div>
            <div>
              <label className="form-label">Tanggal Lahir *</label>
              <input name="tglLahir" type="date" className="form-input"
                onChange={handleChange} value={form.tglLahir} />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="form-label">Alamat Lengkap *</label>
            <input name="alamat" className="form-input" placeholder="RT/RW, nama jalan, no. rumah"
              onChange={handleChange} value={form.alamat} />
          </div>

          {/* Keperluan */}
          <div>
            <label className="form-label">Keperluan / Keterangan</label>
            <textarea name="keperluan" className="form-input resize-none" rows={3}
              placeholder="Jelaskan keperluan pengajuan..."
              onChange={handleChange} value={form.keperluan} />
          </div>
        </div>

        {/* Upload Dokumen */}
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Upload Dokumen Persyaratan</h3>

          <div className="bg-biru-muda border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">ℹ️ Siapkan: fotokopi KTP, KK, dan surat pengantar RT/RW. Format: JPG, PNG, PDF. Maks. 2MB per file.</p>
          </div>

          {[
            { key: "ktp", label: "Fotokopi KTP *" },
            { key: "kk", label: "Fotokopi Kartu Keluarga *" },
            { key: "rt", label: "Surat Pengantar RT/RW *" },
          ].map(dok => (
            <div key={dok.key}>
              <label className="form-label">{dok.label}</label>
              {uploadedFiles[dok.key] ? (
                <div className="flex items-center gap-2 bg-hijau-muda border border-hijau-border rounded-lg px-3 py-2">
                  <span className="text-hijau text-sm">✓</span>
                  <span className="text-xs text-hijau-tua flex-1">File berhasil diupload</span>
                  <button type="button" onClick={() => setUploadedFiles(prev => { const n = {...prev}; delete n[dok.key]; return n })}
                    className="text-xs text-red-400 hover:text-red-600">Hapus</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-hijau hover:bg-hijau-muda transition-all">
                  <span className="text-2xl mb-1">📎</span>
                  <span className="text-xs text-gray-400">Klik untuk upload</span>
                  <span className="text-[11px] text-gray-300 mt-0.5">JPG, PNG, PDF • Maks. 2MB</span>
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => handleUpload(e, dok.key)} />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Info WA */}
        <div className="bg-hijau-muda border border-hijau-border rounded-xl p-4">
          <p className="text-xs text-hijau-tua">📱 <strong>Notifikasi WhatsApp aktif</strong> — Anda akan menerima pesan otomatis saat pengajuan diterima, diproses, dan surat selesai.</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? "Mengirim..." : "Kirim Pengajuan →"}
        </button>
      </form>
    </div>
  )
}
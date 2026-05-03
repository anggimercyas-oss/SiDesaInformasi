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
  const [form, setForm] = useState({
    jenisSurat: "", nama: "", nik: "",
    noHp: "", alamat: "", keperluan: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        alert(`Pengajuan berhasil! No: ${data.noPengajuan}`)
        router.push("/tracking")
      }
    } catch (err) {
      alert("Gagal mengirim pengajuan. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
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

          {/* No HP */}
          <div>
            <label className="form-label">Nomor WhatsApp *</label>
            <input name="noHp" className="form-input" placeholder="08xx-xxxx-xxxx"
              onChange={handleChange} value={form.noHp} />
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

        {/* Info WA */}
        <div className="bg-hijau-muda border border-hijau-border rounded-xl p-4">
          <p className="text-xs text-hijau-tua">📱 <strong>Notifikasi WhatsApp aktif</strong> — Anda akan
          menerima pesan otomatis ke nomor WhatsApp yang diisi di atas saat pengajuan diterima,
          diproses, dan saat surat selesai.</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? "Mengirim..." : "Kirim Pengajuan →"}
        </button>
      </form>
    </div>
  )
}

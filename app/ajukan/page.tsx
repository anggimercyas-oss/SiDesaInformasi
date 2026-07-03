"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const JENIS_SURAT = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Tidak Mampu",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Usaha",
  "Surat Keterangan Kematian",
  "Surat Pengantar KTP",
]

export default function AjukanSurat() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState("")

const [files, setFiles] = useState<{
  kk: File | null
  rtRw: File | null
  dtks: File | null
  ktpAyah: File | null
  ktpIbu: File | null
}>({
  kk: null,
  rtRw: null,
  dtks: null,
  ktpAyah: null,
  ktpIbu: null,
})

  const [form, setForm] = useState<Record<string, string>>({
    jenisSurat: "",
    nama: "",
    nik: "",
    noHp: "",
    tanggalLahir: "",
    alamat: "",
    keperluan: "",
    kewarganegaraan: "WNI",
    // Domisili
    nomorRT: "",
    namaKetuaRT: "",
    // SKTM
    pekerjaan: "",
    penghasilan: "",
    desil: "",
    dtks: "Ya",
    // Kelahiran
    namaAnak: "",
    jenisKelaminAnak: "Laki-laki",
    tanggalLahirAnak: "",
    hariLahir: "",
    pukulLahir: "",
    tempatLahir: "",
    anakKe: "",
    dariSaudara: "",
    beratBadan: "",
    panjangBadan: "",
    penolongLahir: "",
    tempatPersalinan: "",
    namaTempatPersalinan: "",
    namaIbu: "",
    ttlIbu: "",
    nikIbu: "",
    agamaIbu: "",
    pekerjaanIbu: "",
    alamatIbu: "",
    namaAyah: "",
    ttlAyah: "",
    nikAyah: "",
    agamaAyah: "",
    pekerjaanAyah: "",
    alamatAyah: "",
    // Usaha
    namaUsaha: "",
    jenisUsaha: "",
    bidangUsaha: "",
    lokasiUsaha: "",
    modalUsaha: "",
    luasTempatUsaha: "",
    jumlahKaryawan: "",
    // Kematian
    namaAlmarhum: "",
    tanggalMeninggal: "",
    tempatMeninggal: "",
    penyebabMeninggal: "",
    // Pengantar KTP
    statusPerkawinan: "Belum Kawin",
  })

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

 const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data.url
}
  
const handleSubmit = async () => {
  if (!form.jenisSurat || !form.nama || !form.nik || !form.noHp || !form.alamat) {
    setError("Harap lengkapi semua field yang wajib diisi")
    return
  }
  if (!files.kk || !files.rtRw) {
    setError("Harap upload Fotokopi KK dan Surat Pengantar RT/RW")
    return
  }

  setLoading(true)
  setError("")

  try {
    // Upload semua file
    const uploadedDocs: string[] = []

    const kkUrl = await uploadFile(files.kk)
    uploadedDocs.push(`KK:${kkUrl}`)

    const rtRwUrl = await uploadFile(files.rtRw)
    uploadedDocs.push(`RTRW:${rtRwUrl}`)

    if (files.dtks) {
      const dtksUrl = await uploadFile(files.dtks)
      uploadedDocs.push(`DTKS:${dtksUrl}`)
    }

    if (files.ktpAyah) {
      const ktpAyahUrl = await uploadFile(files.ktpAyah)
      uploadedDocs.push(`KTP_AYAH:${ktpAyahUrl}`)
    }

    if (files.ktpIbu) {
      const ktpIbuUrl = await uploadFile(files.ktpIbu)
      uploadedDocs.push(`KTP_IBU:${ktpIbuUrl}`)
    }

    const res = await fetch("/api/pengajuan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jenisSurat: form.jenisSurat,
        keperluan: form.keperluan,
        dataLengkap: form,
        dokumen: uploadedDocs,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || "Gagal mengajukan surat")
      return
    }
    setSuccess(data.noPengajuan)
  } catch (err: any) {
    setError(err.message || "Terjadi kesalahan. Coba lagi.")
  } finally {
    setLoading(false)
  }
}

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/10 transition-all"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"
  const selectClass = inputClass + " bg-white"

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-hijau-muda rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          ✅
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Pengajuan Berhasil!</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pengajuan surat kamu telah diterima. Simpan nomor pengajuan berikut untuk tracking status.
        </p>
        <div className="bg-hijau-muda border border-hijau-border rounded-2xl px-6 py-4 mb-6">
          <p className="text-xs text-hijau-tua mb-1">Nomor Pengajuan</p>
          <p className="text-2xl font-bold text-hijau-tua tracking-wide">{success}</p>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Gunakan nomor ini untuk tracking di halaman <strong>Tracking</strong>.
          Notifikasi akan dikirim ke WhatsApp saat status berubah.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/tracking")}
            className="flex-1 btn-primary active:scale-95">
            Cek Tracking
          </button>
          <button
            onClick={() => { setSuccess(null); setStep(1); setForm(f => ({ ...f, jenisSurat: "" })) }}
            className="flex-1 btn-secondary active:scale-95">
            Ajukan Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 animate-fade-in">
      <h1 className="text-lg font-semibold mb-1">Formulir Pengajuan Surat</h1>
      <p className="text-xs text-gray-400 mb-5">Lengkapi data dengan benar sesuai KTP</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              s <= step ? "bg-hijau text-white" : "bg-gray-100 text-gray-400"
            }`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-12 transition-all ${s < step ? "bg-hijau" : "bg-gray-100"}`} />}
          </div>
        ))}
        <p className="text-xs text-gray-400 ml-2">
          {step === 1 ? "Pilih Jenis Surat" : step === 2 ? "Data Pemohon" : "Data Tambahan"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-red-500">⚠️ {error}</p>
        </div>
      )}

      <div className="card">

        {/* STEP 1 — Pilih Jenis Surat */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className={labelClass}>Jenis Surat *</label>
              <select
                value={form.jenisSurat}
                onChange={e => set("jenisSurat", e.target.value)}
                className={selectClass}>
                <option value="">-- Pilih jenis surat --</option>
                {JENIS_SURAT.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>

            {form.jenisSurat && (
              <div className="bg-hijau-muda rounded-xl p-3 animate-fade-in">
                <p className="text-xs text-hijau-tua font-medium mb-1">📋 Persyaratan {form.jenisSurat}:</p>
                <ul className="text-xs text-hijau-tua/80 space-y-0.5">
                  <li>• Fotokopi KTP</li>
                  <li>• Fotokopi Kartu Keluarga</li>
                  <li>• Surat Pengantar RT/RW</li>
                  {form.jenisSurat === "Surat Keterangan Tidak Mampu" && <li>• Screenshot bukti terdaftar DTKS</li>}
                  {form.jenisSurat === "Surat Keterangan Kelahiran" && <li>• Fotokopi KTP Ayah & Ibu</li>}
                  {form.jenisSurat === "Surat Keterangan Usaha" && <li>• Foto tempat usaha</li>}
                </ul>
              </div>
            )}

            <button
              onClick={() => {
                if (!form.jenisSurat) { setError("Pilih jenis surat dulu"); return }
                setError("")
                setStep(2)
              }}
              className="btn-primary w-full active:scale-95">
              Lanjut →
            </button>
          </div>
        )}

        {/* STEP 2 — Data Pemohon */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm font-semibold text-gray-700 mb-2">📋 {form.jenisSurat}</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nama Lengkap *</label>
                <input className={inputClass} placeholder="Sesuai KTP" value={form.nama} onChange={e => set("nama", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>NIK *</label>
                <input className={inputClass} placeholder="16 digit" maxLength={16} value={form.nik} onChange={e => set("nik", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>No. WhatsApp *</label>
                <input className={inputClass} placeholder="08xx-xxxx-xxxx" value={form.noHp} onChange={e => set("noHp", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Tanggal Lahir *</label>
                <input type="date" className={inputClass} value={form.tanggalLahir} onChange={e => set("tanggalLahir", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Alamat Lengkap *</label>
              <input className={inputClass} placeholder="RT/RW, nama jalan, no. rumah" value={form.alamat} onChange={e => set("alamat", e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Keperluan / Keterangan</label>
              <textarea className={inputClass} rows={2} placeholder="Jelaskan keperluan pengajuan..." value={form.keperluan} onChange={e => set("keperluan", e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 active:scale-95">← Kembali</button>
              <button
                onClick={() => {
                  if (!form.nama || !form.nik || !form.noHp || !form.alamat) {
                    setError("Lengkapi semua field wajib")
                    return
                  }
                  setError("")
                  setStep(3)
                }}
                className="btn-primary flex-1 active:scale-95">
                Lanjut →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Data Tambahan per Jenis Surat */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm font-semibold text-gray-700 mb-2">📝 Data Tambahan</p>

            {/* DOMISILI */}
            {form.jenisSurat === "Surat Keterangan Domisili" && (
              <>
                <div>
                  <label className={labelClass}>Kewarganegaraan</label>
                  <select className={selectClass} value={form.kewarganegaraan} onChange={e => set("kewarganegaraan", e.target.value)}>
                    <option>WNI</option>
                    <option>WNA</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nomor RT</label>
                    <input className={inputClass} placeholder="001" value={form.nomorRT} onChange={e => set("nomorRT", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Nama Ketua RT</label>
                    <input className={inputClass} placeholder="Nama ketua RT" value={form.namaKetuaRT} onChange={e => set("namaKetuaRT", e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* SKTM */}
            {form.jenisSurat === "Surat Keterangan Tidak Mampu" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Pekerjaan</label>
                    <input className={inputClass} placeholder="Pekerjaan" value={form.pekerjaan} onChange={e => set("pekerjaan", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Penghasilan/Bulan</label>
                    <input className={inputClass} placeholder="Rp 0" value={form.penghasilan} onChange={e => set("penghasilan", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Desil (1-10)</label>
                    <select className={selectClass} value={form.desil} onChange={e => set("desil", e.target.value)}>
                      <option value="">Pilih desil</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(d => <option key={d} value={d}>Desil {d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Terdaftar DTKS</label>
                    <select className={selectClass} value={form.dtks} onChange={e => set("dtks", e.target.value)}>
                      <option>Ya</option>
                      <option>Tidak</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* KELAHIRAN */}
            {form.jenisSurat === "Surat Keterangan Kelahiran" && (
              <>
                <p className="text-xs font-semibold text-hijau-tua uppercase tracking-wide">Data Anak</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nama Anak</label>
                    <input className={inputClass} placeholder="Nama lengkap anak" value={form.namaAnak} onChange={e => set("namaAnak", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Jenis Kelamin</label>
                    <select className={selectClass} value={form.jenisKelaminAnak} onChange={e => set("jenisKelaminAnak", e.target.value)}>
                      <option>Laki-laki</option>
                      <option>Perempuan</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Tanggal Lahir Anak</label>
                    <input type="date" className={inputClass} value={form.tanggalLahirAnak} onChange={e => set("tanggalLahirAnak", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Hari Lahir</label>
                    <select className={selectClass} value={form.hariLahir} onChange={e => set("hariLahir", e.target.value)}>
                      <option value="">Pilih hari</option>
                      {["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"].map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Pukul Lahir</label>
                    <input type="time" className={inputClass} value={form.pukulLahir} onChange={e => set("pukulLahir", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Tempat Lahir</label>
                    <input className={inputClass} placeholder="Kota tempat lahir" value={form.tempatLahir} onChange={e => set("tempatLahir", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Anak ke-</label>
                    <input type="number" className={inputClass} placeholder="1" value={form.anakKe} onChange={e => set("anakKe", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Dari saudara</label>
                    <input type="number" className={inputClass} placeholder="1" value={form.dariSaudara} onChange={e => set("dariSaudara", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Berat (gram)</label>
                    <input type="number" className={inputClass} placeholder="3000" value={form.beratBadan} onChange={e => set("beratBadan", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Panjang (cm)</label>
                    <input type="number" className={inputClass} placeholder="50" value={form.panjangBadan} onChange={e => set("panjangBadan", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Penolong Lahir</label>
                    <input className={inputClass} placeholder="Bidan/Dokter" value={form.penolongLahir} onChange={e => set("penolongLahir", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Tempat Persalinan</label>
                    <input className={inputClass} placeholder="RS/Puskesmas/Rumah" value={form.tempatPersalinan} onChange={e => set("tempatPersalinan", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Nama RS/Klinik/Tempat</label>
                  <input className={inputClass} placeholder="Nama tempat persalinan" value={form.namaTempatPersalinan} onChange={e => set("namaTempatPersalinan", e.target.value)} />
                </div>

                <p className="text-xs font-semibold text-hijau-tua uppercase tracking-wide pt-2 border-t border-gray-100">Data Ibu</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nama Ibu</label>
                    <input className={inputClass} value={form.namaIbu} onChange={e => set("namaIbu", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>TTL Ibu</label>
                    <input className={inputClass} placeholder="Kota, DD/MM/YYYY" value={form.ttlIbu} onChange={e => set("ttlIbu", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>NIK Ibu</label>
                    <input className={inputClass} maxLength={16} value={form.nikIbu} onChange={e => set("nikIbu", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Agama Ibu</label>
                    <select className={selectClass} value={form.agamaIbu} onChange={e => set("agamaIbu", e.target.value)}>
                      <option value="">Pilih</option>
                      {["Islam","Kristen","Katolik","Hindu","Buddha","Konghucu"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Pekerjaan Ibu</label>
                    <input className={inputClass} value={form.pekerjaanIbu} onChange={e => set("pekerjaanIbu", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Alamat Ibu</label>
                  <input className={inputClass} value={form.alamatIbu} onChange={e => set("alamatIbu", e.target.value)} />
                </div>

                <p className="text-xs font-semibold text-hijau-tua uppercase tracking-wide pt-2 border-t border-gray-100">Data Ayah</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nama Ayah</label>
                    <input className={inputClass} value={form.namaAyah} onChange={e => set("namaAyah", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>TTL Ayah</label>
                    <input className={inputClass} placeholder="Kota, DD/MM/YYYY" value={form.ttlAyah} onChange={e => set("ttlAyah", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>NIK Ayah</label>
                    <input className={inputClass} maxLength={16} value={form.nikAyah} onChange={e => set("nikAyah", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Agama Ayah</label>
                    <select className={selectClass} value={form.agamaAyah} onChange={e => set("agamaAyah", e.target.value)}>
                      <option value="">Pilih</option>
                      {["Islam","Kristen","Katolik","Hindu","Buddha","Konghucu"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Pekerjaan Ayah</label>
                    <input className={inputClass} value={form.pekerjaanAyah} onChange={e => set("pekerjaanAyah", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Alamat Ayah</label>
                  <input className={inputClass} value={form.alamatAyah} onChange={e => set("alamatAyah", e.target.value)} />
                </div>
              </>
            )}

            {/* USAHA */}
            {form.jenisSurat === "Surat Keterangan Usaha" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nama Usaha</label>
                    <input className={inputClass} value={form.namaUsaha} onChange={e => set("namaUsaha", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Jenis Usaha</label>
                    <input className={inputClass} placeholder="Warung, Bengkel, dll" value={form.jenisUsaha} onChange={e => set("jenisUsaha", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Bidang Usaha</label>
                    <input className={inputClass} placeholder="Perdagangan, Jasa, dll" value={form.bidangUsaha} onChange={e => set("bidangUsaha", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Lokasi Usaha</label>
                    <input className={inputClass} value={form.lokasiUsaha} onChange={e => set("lokasiUsaha", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Modal Usaha</label>
                    <input className={inputClass} placeholder="Rp" value={form.modalUsaha} onChange={e => set("modalUsaha", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Luas Tempat (m²)</label>
                    <input type="number" className={inputClass} value={form.luasTempatUsaha} onChange={e => set("luasTempatUsaha", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Jumlah Karyawan</label>
                    <input type="number" className={inputClass} value={form.jumlahKaryawan} onChange={e => set("jumlahKaryawan", e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* KEMATIAN */}
            {form.jenisSurat === "Surat Keterangan Kematian" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nama Almarhum/ah</label>
                    <input className={inputClass} value={form.namaAlmarhum} onChange={e => set("namaAlmarhum", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Tanggal Meninggal</label>
                    <input type="date" className={inputClass} value={form.tanggalMeninggal} onChange={e => set("tanggalMeninggal", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Tempat Meninggal</label>
                    <input className={inputClass} value={form.tempatMeninggal} onChange={e => set("tempatMeninggal", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Penyebab Meninggal</label>
                    <input className={inputClass} value={form.penyebabMeninggal} onChange={e => set("penyebabMeninggal", e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {/* PENGANTAR KTP */}
            {form.jenisSurat === "Surat Pengantar KTP" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Kewarganegaraan</label>
                    <select className={selectClass} value={form.kewarganegaraan} onChange={e => set("kewarganegaraan", e.target.value)}>
                      <option>WNI</option>
                      <option>WNA</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status Perkawinan</label>
                    <select className={selectClass} value={form.statusPerkawinan} onChange={e => set("statusPerkawinan", e.target.value)}>
                      <option>Belum Kawin</option>
                      <option>Kawin</option>
                      <option>Cerai Hidup</option>
                      <option>Cerai Mati</option>
                    </select>
                  </div>
                </div>
              </>
            )}

{/* Upload Dokumen */}
<div className="border-t border-gray-100 pt-4">
  <p className="text-sm font-semibold text-gray-700 mb-3">📎 Upload Dokumen</p>

  {/* KK — wajib semua surat */}
  <div className="mb-3">
    <label className={labelClass}>Fotokopi Kartu Keluarga *</label>
    <div
      onClick={() => document.getElementById("upload-kk")?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-hijau hover:bg-hijau-muda/30 ${
        files.kk ? "border-hijau bg-hijau-muda/20" : "border-gray-200"
      }`}>
      <input
        id="upload-kk"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={e => setFiles(f => ({ ...f, kk: e.target.files?.[0] || null }))}
      />
      {files.kk ? (
        <p className="text-xs text-hijau-tua font-medium">✅ {files.kk.name}</p>
      ) : (
        <>
          <p className="text-2xl mb-1">📁</p>
          <p className="text-xs text-gray-400">Klik untuk upload • JPG, PNG, PDF • Maks 2MB</p>
        </>
      )}
    </div>
  </div>

  {/* Surat RT/RW — wajib semua surat */}
  <div className="mb-3">
    <label className={labelClass}>Surat Pengantar RT/RW *</label>
    <div
      onClick={() => document.getElementById("upload-rtrw")?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-hijau hover:bg-hijau-muda/30 ${
        files.rtRw ? "border-hijau bg-hijau-muda/20" : "border-gray-200"
      }`}>
      <input
        id="upload-rtrw"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={e => setFiles(f => ({ ...f, rtRw: e.target.files?.[0] || null }))}
      />
      {files.rtRw ? (
        <p className="text-xs text-hijau-tua font-medium">✅ {files.rtRw.name}</p>
      ) : (
        <>
          <p className="text-2xl mb-1">📁</p>
          <p className="text-xs text-gray-400">Klik untuk upload • JPG, PNG, PDF • Maks 2MB</p>
        </>
      )}
    </div>
  </div>

  {/* Screenshot DTKS — khusus SKTM */}
  {form.jenisSurat === "Surat Keterangan Tidak Mampu" && (
    <div className="mb-3">
      <label className={labelClass}>Screenshot Bukti DTKS *</label>
      <div
        onClick={() => document.getElementById("upload-dtks")?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-hijau hover:bg-hijau-muda/30 ${
          files.dtks ? "border-hijau bg-hijau-muda/20" : "border-gray-200"
        }`}>
        <input
          id="upload-dtks"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={e => setFiles(f => ({ ...f, dtks: e.target.files?.[0] || null }))}
        />
        {files.dtks ? (
          <p className="text-xs text-hijau-tua font-medium">✅ {files.dtks.name}</p>
        ) : (
          <>
            <p className="text-2xl mb-1">📁</p>
            <p className="text-xs text-gray-400">Klik untuk upload • JPG, PNG • Maks 2MB</p>
          </>
        )}
      </div>
    </div>
  )}

  {/* KTP Ayah & Ibu — khusus Kelahiran */}
  {form.jenisSurat === "Surat Keterangan Kelahiran" && (
    <>
      <div className="mb-3">
        <label className={labelClass}>Fotokopi KTP Ayah *</label>
        <div
          onClick={() => document.getElementById("upload-ktpayah")?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-hijau hover:bg-hijau-muda/30 ${
            files.ktpAyah ? "border-hijau bg-hijau-muda/20" : "border-gray-200"
          }`}>
          <input
            id="upload-ktpayah"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={e => setFiles(f => ({ ...f, ktpAyah: e.target.files?.[0] || null }))}
          />
          {files.ktpAyah ? (
            <p className="text-xs text-hijau-tua font-medium">✅ {files.ktpAyah.name}</p>
          ) : (
            <>
              <p className="text-2xl mb-1">📁</p>
              <p className="text-xs text-gray-400">Klik untuk upload • JPG, PNG, PDF • Maks 2MB</p>
            </>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className={labelClass}>Fotokopi KTP Ibu *</label>
        <div
          onClick={() => document.getElementById("upload-ktpibu")?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-hijau hover:bg-hijau-muda/30 ${
            files.ktpIbu ? "border-hijau bg-hijau-muda/20" : "border-gray-200"
          }`}>
          <input
            id="upload-ktpibu"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={e => setFiles(f => ({ ...f, ktpIbu: e.target.files?.[0] || null }))}
          />
          {files.ktpIbu ? (
            <p className="text-xs text-hijau-tua font-medium">✅ {files.ktpIbu.name}</p>
          ) : (
            <>
              <p className="text-2xl mb-1">📁</p>
              <p className="text-xs text-gray-400">Klik untuk upload • JPG, PNG, PDF • Maks 2MB</p>
            </>
          )}
        </div>
      </div>
    </>
  )}
</div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 active:scale-95">← Kembali</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 active:scale-95">
                {loading ? "Memproses..." : "Kirim Pengajuan ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
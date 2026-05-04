import Link from "next/link"

const LAYANAN = [
  { icon: "🏠", nama: "Ket. Domisili", desc: "Surat keterangan tempat tinggal" },
  { icon: "📋", nama: "Ket. Tidak Mampu", desc: "Untuk keringanan biaya" },
  { icon: "🪪", nama: "Pengantar KTP", desc: "Pembuatan/perpanjangan KTP" },
  { icon: "👶", nama: "Ket. Kelahiran", desc: "Keterangan data kelahiran" },
  { icon: "💼", nama: "Ket. Usaha", desc: "Keterangan memiliki usaha" },
  { icon: "📜", nama: "Ket. Kematian", desc: "Keterangan peristiwa kematian" },
]

const STATS = [
  { num: "1.240", label: "Surat Selesai" },
  { num: "24", label: "Sedang Diproses" },
  { num: "48 jam", label: "Rata-rata Selesai" },
  { num: "4.8★", label: "Rating Layanan" },
]

const PENGUMUMAN = [
  {
    tgl: "04", bln: "MEI",
    judul: "Jam Operasional Kantor Desa",
    isi: "Kantor desa beroperasi Senin–Jumat pukul 08.00–15.00 WIB. Layanan online tersedia 24 jam.",
  },
  {
    tgl: "01", bln: "MEI",
    judul: "Pembaruan Sistem Portal Desa",
    isi: "Fitur tracking real-time dan notifikasi WhatsApp kini tersedia untuk semua warga terdaftar.",
  },
  {
    tgl: "28", bln: "APR",
    judul: "Libur Hari Buruh",
    isi: "Kantor desa tutup pada 1 Mei 2026 (Hari Buruh Nasional). Layanan online tetap aktif.",
  },
]

export default function Beranda() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-hijau-muda to-white px-6 py-12 text-center border-b border-gray-100">
        <span className="inline-flex items-center gap-1.5 bg-hijau-muda text-hijau-tua text-xs font-medium px-3.5 py-1.5 rounded-full border border-hijau-border mb-4">
          ✅ Pelayanan 24 Jam Online
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 max-w-md mx-auto leading-snug">
          Urus Surat Desa Tanpa Harus Antre
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Ajukan surat administrasi desa secara online, pantau status, dan terima notifikasi otomatis kapan pun surat Anda selesai.
        </p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <Link href="/ajukan" className="btn-primary">Ajukan Surat Sekarang</Link>
          <Link href="/tracking" className="btn-secondary">Cek Status Pengajuan</Link>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 bg-white">
        {STATS.map(s => (
          <div key={s.label} className="py-4 px-5 text-center">
            <p className="text-2xl font-bold text-hijau">{s.num}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6">

        {/* Layanan */}
        <h2 className="text-base font-semibold mb-4">Layanan Surat Tersedia</h2>
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {LAYANAN.map(l => (
            <Link key={l.nama} href="/ajukan"
              className="card flex items-start gap-2.5 hover:border-hijau hover:bg-hijau-muda transition-all">
              <div className="w-9 h-9 rounded-lg bg-hijau-muda flex items-center justify-center text-lg flex-shrink-0">
                {l.icon}
              </div>
              <div>
                <p className="text-[13px] font-semibold">{l.nama}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{l.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pengumuman */}
        <h2 className="text-base font-semibold mb-4">Pengumuman Desa</h2>
        <div className="flex flex-col gap-3">
          {PENGUMUMAN.map(p => (
            <div key={p.judul} className="card flex gap-3 items-start">
              <div className="bg-hijau-muda rounded-lg px-2.5 py-1.5 text-center min-w-[44px] flex-shrink-0">
                <p className="text-lg font-bold text-hijau leading-none">{p.tgl}</p>
                <p className="text-[10px] text-hijau-tua font-medium">{p.bln}</p>
              </div>
              <div>
                <p className="text-[13px] font-semibold mb-1">{p.judul}</p>
                <p className="text-[12px] text-gray-400 leading-relaxed">{p.isi}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
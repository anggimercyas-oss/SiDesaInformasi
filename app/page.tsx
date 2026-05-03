import Link from "next/link"

const LAYANAN = [
  { icon: "🏠", nama: "Ket. Domisili",  desc: "Surat keterangan tempat tinggal" },
  { icon: "📋", nama: "Ket. Tidak Mampu", desc: "Untuk keringanan biaya" },
  { icon: "🪪", nama: "Pengantar KTP",   desc: "Pembuatan/perpanjangan KTP" },
  { icon: "👶", nama: "Ket. Kelahiran",  desc: "Keterangan data kelahiran" },
  { icon: "💼", nama: "Ket. Usaha",      desc: "Keterangan memiliki usaha" },
  { icon: "📜", nama: "Ket. Kematian",   desc: "Keterangan peristiwa kematian" },
]

const STATS = [
  { num: "1.240", label: "Surat Selesai" },
  { num: "24",    label: "Sedang Diproses" },
  { num: "48 jam", label: "Rata-rata Selesai" },
  { num: "4.8★",  label: "Rating Layanan" },
]

export default function Beranda() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-hijau-muda to-white px-6 py-12 text-center border-b border-gray-100">
        <span className="inline-flex items-center gap-1.5 bg-hijau-muda text-hijau-tua text-xs font-medium px-3.5 py-1.5 rounded-full border border-hijau-border mb-4">
          ✅ Pelayanan 24 Jam Online
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 max-w-md mx-auto leading-snug">
          Urus Surat Desa Tanpa Harus Antre
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Ajukan surat administrasi desa secara online, pantau status,
          dan terima notifikasi otomatis kapan pun surat Anda selesai.
        </p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <Link href="/ajukan" className="btn-primary">Ajukan Surat Sekarang</Link>
          <Link href="/tracking" className="btn-secondary">Cek Status Pengajuan</Link>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 bg-white">
        {STATS.map(s => (
          <div key={s.label} className="py-4 px-5 text-center">
            <p className="text-2xl font-bold text-hijau">{s.num}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Layanan Grid */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        <h2 className="text-base font-semibold mb-4">Layanan Surat Tersedia</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {LAYANAN.map(l => (
            <Link key={l.nama} href="/ajukan"
              className="card flex items-start gap-2.5 hover:border-hijau hover:bg-hijau-muda transition-all group">
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
      </div>
    </div>
  )
}

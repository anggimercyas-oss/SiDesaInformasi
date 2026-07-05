"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

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
    tgl: "06", bln: "JULI",
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

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = []

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.22 - 0.08,
        alpha: Math.random() * 0.25 + 0.08,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(29,158,117,${p.alpha})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return visible
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function JiggleLink({ href, children, className, style }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {  // ⬅️ tambah style di sini
  const [jiggle, setJiggle] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setJiggle(true)
    setTimeout(() => { setJiggle(false); router.push(href) }, 320)
  }

  return (
    <a href={href} onClick={handleClick} className={`${className ?? ""} inline-block`}
      style={{ ...style, animation: jiggle ? "jiggle 0.3s ease" : "none" }}>  {/* ⬅️ gabungin style di sini */}
      {children}
    </a>
  )
}

export default function Beranda() {
  return (
    <>
      {/* Background gradient hijau + kuning muda */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 85% 5%, rgba(239,159,39,0.18) 0%, transparent 45%), " +
            "radial-gradient(ellipse at 15% 15%, rgba(239,159,39,0.10) 0%, transparent 40%), " +
            "radial-gradient(ellipse at 10% 65%, rgba(159,225,203,0.45) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 75% 85%, rgba(29,158,117,0.20) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 50%, rgba(225,245,238,0.80) 0%, transparent 70%), " +
            "linear-gradient(155deg, #edfaf3 0%, #f5fdf8 35%, #fffef5 65%, #fdfff8 100%)",
        }}
      />

      <ParticleCanvas />

      <style>{`
        @keyframes jiggle {
          0%   { transform: rotate(0deg) scale(1); }
          20%  { transform: rotate(-4deg) scale(1.07); }
          40%  { transform: rotate(4deg) scale(1.07); }
          60%  { transform: rotate(-3deg) scale(1.04); }
          80%  { transform: rotate(2deg) scale(1.02); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .badge-float { animation: floatBadge 3s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10">

        {/* Hero */}
        <section className="px-6 py-14 text-center border-b border-white/60">
          <FadeIn delay={0}>
            <span className="badge-float inline-flex items-center gap-1.5 bg-white/70 text-hijau-tua text-xs font-medium px-3.5 py-1.5 rounded-full border border-hijau-border mb-5 backdrop-blur-sm shadow-sm">
              ✅ Pelayanan 24 Jam Online
            </span>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 max-w-md mx-auto leading-snug">
              Urus Surat Desa{" "}
              <span style={{
                background: "linear-gradient(135deg, #1D9E75, #085041)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Tanpa Harus Antre
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-7 leading-relaxed">
              Ajukan surat administrasi desa secara online, pantau status, dan terima notifikasi otomatis kapan pun surat Anda selesai.
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="flex gap-2.5 justify-center flex-wrap">
              <JiggleLink
                href="/ajukan"
                className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #1D9E75, #085041)" } as React.CSSProperties}
              >
                Ajukan Surat Sekarang
              </JiggleLink>
              <JiggleLink
                href="/tracking"
                className="px-5 py-2.5 bg-white/70 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 backdrop-blur-sm hover:bg-white active:scale-95 transition-all shadow-sm"
              >
                Cek Status Pengajuan
              </JiggleLink>
            </div>
          </FadeIn>
        </section>

        {/* Stats */}
        <FadeIn delay={100}>
          <div className="grid grid-cols-4 divide-x divide-white/60 border-b border-white/60 backdrop-blur-sm"
            style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(225,245,238,0.6), rgba(250,238,218,0.4), rgba(255,255,255,0.5))" }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="py-4 px-5 text-center">
                <p className="text-2xl font-bold"
                  style={{ color: i === 1 ? "#EF9F27" : "#1D9E75" }}>
                  {s.num}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto px-6 py-6">

          {/* Layanan */}
          <FadeIn delay={0}>
            <h2 className="text-base font-semibold mb-4">Layanan Surat Tersedia</h2>
          </FadeIn>
          <div className="grid grid-cols-2 gap-2.5 mb-8">
            {LAYANAN.map((l, i) => (
              <FadeIn key={l.nama} delay={i * 80}>
                <JiggleLink href="/ajukan"
                  className="card flex items-start gap-2.5 hover:border-hijau hover:bg-white/90 transition-all bg-white/60 backdrop-blur-sm w-full h-full">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #E1F5EE, #9FE1CB)" }}>
                    {l.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{l.nama}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{l.desc}</p>
                  </div>
                </JiggleLink>
              </FadeIn>
            ))}
          </div>

          {/* Pengumuman */}
          <FadeIn delay={0}>
            <h2 className="text-base font-semibold mb-4">Pengumuman Desa</h2>
          </FadeIn>
          <div className="flex flex-col gap-3 pb-8">
            {PENGUMUMAN.map((p, i) => (
              <FadeIn key={p.judul} delay={i * 100}>
                <div className="card flex gap-3 items-start bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow">
                  <div className="rounded-lg px-2.5 py-1.5 text-center min-w-[44px] flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #E1F5EE, #9FE1CB)" }}>
                    <p className="text-lg font-bold text-hijau leading-none">{p.tgl}</p>
                    <p className="text-[10px] text-hijau-tua font-medium">{p.bln}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold mb-1">{p.judul}</p>
                    <p className="text-[12px] text-gray-400 leading-relaxed">{p.isi}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Footer mini */}
          <FadeIn delay={200}>
            <div className="text-center py-4 border-t border-gray-100">
              <p className="text-[11px] text-gray-300">
                © 2026 SiDesa — Sistem Informasi Desa Gegempalan, Kec. Cikoneng, Kab. Ciamis
              </p>
            </div>
          </FadeIn>

        </div>
      </div>
    </>
  )
}
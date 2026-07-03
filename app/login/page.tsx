"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ nik: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      nik: form.nik,
      password: form.password,
      redirect: false,
    })

    if (res?.error) {
      setError("NIK atau password salah")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #085041 0%, #1D9E75 50%, #9FE1CB 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-hijau-muda/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-sm">
        <div
          className="rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-lg active:scale-90 transition-transform">
              🏡
            </div>
            <h1 className="text-2xl font-bold text-white">SiDesa</h1>
            <p className="text-xs text-white/70 mt-1 text-center">
              Desa Gegempalan, Kec. Cikoneng, Kab. Ciamis
            </p>
          </div>

          <h2 className="text-lg font-semibold text-white text-center mb-5">Masuk ke Akun Anda</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-300/30 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-xs text-white text-center">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/80 mb-1.5 block">NIK</label>
              <input
                type="text"
                maxLength={16}
                placeholder="16 digit NIK"
                value={form.nik}
                onChange={e => setForm({ ...form, nik: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/80 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-hijau-tua font-semibold py-3 rounded-xl text-sm transition-all hover:bg-white/90 active:scale-95 disabled:opacity-60 shadow-lg"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-xs text-white/70 mt-5">
            Belum punya akun?{" "}
            <Link href="/register" className="text-white font-semibold underline hover:no-underline">
              Daftar di sini
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-white/50 mt-6">
          © 2026 SiDesa — Sistem Informasi Desa Gegempalan
        </p>
      </div>
    </div>
  )
}
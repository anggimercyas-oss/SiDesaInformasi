"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    nik: "", nama: "", noHp: "", tglLahir: "", password: "", confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.nik.length !== 16) {
      setError("NIK harus 16 digit")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok")
      return
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal mendaftar")
        setLoading(false)
        return
      }

      // Auto login setelah register
      const loginRes = await signIn("credentials", {
        nik: form.nik,
        password: form.password,
        redirect: false,
      })

      if (loginRes?.error) {
        router.push("/login")
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("Terjadi kesalahan. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #085041 0%, #1D9E75 50%, #9FE1CB 100%)",
      }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-hijau-muda/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-sm">
        <div
          className="rounded-3xl p-8 shadow-2xl border border-white/20 backdrop-blur-xl"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div className="flex flex-col items-center mb-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 shadow-lg active:scale-90 transition-transform">
              <img src="/logo-web.jpeg" alt="SiDesa" className="w-full h-full object-cover" />
          </div>
            <h1 className="text-xl font-bold text-white">Daftar Akun SiDesa</h1>
            <p className="text-xs text-white/70 mt-1 text-center">
              Pelayanan administrasi untuk warga Desa Gegempalan
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-300/30 rounded-xl px-4 py-2.5 mb-4">
              <p className="text-xs text-white text-center">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-white/80 mb-1 block">NIK *</label>
              <input
                type="text" maxLength={16} placeholder="16 digit NIK"
                value={form.nik}
                onChange={e => setForm({ ...form, nik: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/80 mb-1 block">Nama Lengkap *</label>
              <input
                type="text" placeholder="Sesuai KTP"
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-white/80 mb-1 block">No. WhatsApp *</label>
                <input
                  type="tel" placeholder="08xxx"
                  value={form.noHp}
                  onChange={e => setForm({ ...form, noHp: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-white/80 mb-1 block">Tanggal Lahir</label>
                <input
                  type="date"
                  value={form.tglLahir}
                  onChange={e => setForm({ ...form, tglLahir: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/80 mb-1 block">Password *</label>
              <input
                type="password" placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-white/80 mb-1 block">Konfirmasi Password *</label>
              <input
                type="password" placeholder="Ulangi password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 outline-none focus:bg-white/30 focus:border-white/50 transition-all text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-hijau-tua font-semibold py-3 rounded-xl text-sm transition-all hover:bg-white/90 active:scale-95 disabled:opacity-60 shadow-lg mt-2"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-xs text-white/70 mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-white font-semibold underline hover:no-underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
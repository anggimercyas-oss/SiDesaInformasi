"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showDownload, setShowDownload] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const links = [
    { href: "/",           label: "Beranda" },
    { href: "/ajukan",     label: "Ajukan Surat" },
    { href: "/tracking",   label: "Tracking" },
    { href: "/notifikasi", label: "Notifikasi" },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo-web.jpeg"
            alt="SiDesa Logo"
            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold leading-tight">SiDesa</p>
            <p className="text-[10px] text-gray-400 leading-tight">
              Desa Gegempalan, Kec. Cikoneng, Kab. Ciamis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {links.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-hijau-muda text-hijau-tua"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}>
              {link.label}
            </Link>
          ))}

          {session?.user?.role === "ADMIN" && (
            <Link href="/admin"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-hijau-muda text-hijau-tua"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}>
              Admin
            </Link>
          )}

          <button
            onClick={() => setShowDownload(true)}
            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 bg-hijau-muda text-hijau-tua text-sm font-medium rounded-lg border border-hijau-border hover:bg-hijau hover:text-white transition-all active:scale-95">
            📲 Download
          </button>

          {/* Login state */}
          {status === "loading" ? (
            <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse ml-1" />
          ) : session ? (
            <div className="relative ml-1">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-hijau-muda rounded-lg hover:bg-hijau-border transition-all active:scale-95">
                <div className="w-6 h-6 bg-hijau rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-hijau-tua max-w-[100px] truncate">
                  {session.user?.name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs text-gray-400">NIK</p>
                    <p className="text-sm font-medium">{session.user?.nik}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm ml-1 active:scale-95 transition-transform">Masuk</Link>
          )}
        </div>
      </nav>

      {showDownload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-hijau-muda rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              📱
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Download Aplikasi SiDesa</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Akses layanan administrasi desa lebih mudah langsung dari smartphone Anda.
            </p>
            <div className="flex flex-col gap-3 mb-5">
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors active:scale-95">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-[10px] text-gray-300">Download di</p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-hijau text-white rounded-xl hover:opacity-90 transition-opacity active:scale-95">
                <span className="text-2xl">🤖</span>
                <div className="text-left">
                  <p className="text-[10px] text-green-100">Download di</p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </a>
            </div>
            <div className="bg-hijau-muda rounded-lg px-4 py-2.5 mb-5">
              <p className="text-xs text-hijau-tua">
                Gratis • Notifikasi real-time • Ajukan surat kapan saja
              </p>
            </div>
            <button onClick={() => setShowDownload(false)} className="btn-secondary w-full text-sm active:scale-95 transition-transform">
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  )
}
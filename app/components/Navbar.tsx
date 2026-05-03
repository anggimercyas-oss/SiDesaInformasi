"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/",           label: "Beranda" },
    { href: "/ajukan",     label: "Ajukan Surat" },
    { href: "/tracking",   label: "Tracking" },
    { href: "/notifikasi", label: "Notifikasi" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 h-[60px] flex items-center justify-between">

      {/* Logo & Nama */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-hijau rounded-lg flex items-center justify-center text-white text-lg">
          🏡
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">SiDesa</p>
          <p className="text-[11px] text-gray-400">Sistem Informasi Desa</p>
        </div>
      </div>

      {/* Menu Links */}
      <div className="flex items-center gap-1">
        {links.map(link => (
          <Link key={link.href} href={link.href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${pathname === link.href
                ? "bg-hijau-muda text-hijau-tua"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
          >
            {link.label}
          </Link>
        ))}
        <button className="btn-primary text-sm ml-2">Masuk</button>
      </div>

    </nav>
  )
}
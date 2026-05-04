import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import ChatbotWidget from "@/components/ChatbotWidget"

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "SiDesa — Sistem Informasi Desa",
  description: "Portal layanan administrasi desa online",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${jakartaSans.className} bg-gray-50`}>
        <Navbar />
        <main>{children}</main>
        <ChatbotWidget />
      </body>
    </html>
  )
}
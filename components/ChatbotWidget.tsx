"use client"
import { useState } from "react"

const BOT_RESPONSES: Record<string, string> = {
  domisili: "Untuk surat domisili, klik menu Ajukan Surat → pilih Surat Keterangan Domisili → isi formulir → upload KTP, KK, dan surat RT/RW. Proses selesai 1-2 hari kerja. ✅",
  syarat: "Persyaratan umum: 1) Fotokopi KTP 2) Fotokopi KK 3) Surat pengantar RT/RW. Dokumen khusus berbeda per jenis surat. 📎",
  lama: "Rata-rata waktu penyelesaian 1-2 hari kerja (48 jam). Anda akan mendapat notifikasi WhatsApp otomatis saat surat selesai. ⏱",
  biaya: "Semua layanan surat GRATIS. Tidak ada biaya administrasi. 🎉",
  jam: "Kantor desa buka Senin–Jumat pukul 08.00–15.00 WIB. Layanan online tersedia 24 jam. 🕐",
  default: "Terima kasih atas pertanyaannya! Untuk info lebih lanjut hubungi kantor desa di jam operasional. 🏡",
}

function getResponse(msg: string) {
  const m = msg.toLowerCase()
  if (m.includes("domisili") || m.includes("ajukan") || m.includes("cara")) return BOT_RESPONSES.domisili
  if (m.includes("syarat") || m.includes("dokumen") || m.includes("persyaratan")) return BOT_RESPONSES.syarat
  if (m.includes("lama") || m.includes("selesai") || m.includes("berapa")) return BOT_RESPONSES.lama
  if (m.includes("biaya") || m.includes("bayar") || m.includes("gratis")) return BOT_RESPONSES.biaya
  if (m.includes("jam") || m.includes("buka") || m.includes("tutup")) return BOT_RESPONSES.jam
  return BOT_RESPONSES.default
}

type Message = { teks: string; dari: "bot" | "user" }

const QUICK = [
  "Cara mengajukan surat domisili?",
  "Berapa lama surat selesai?",
  "Dokumen apa yang dibutuhkan?",
]

export default function ChatbotWidget() {
  const [buka, setBuka] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { teks: "Halo! 👋 Selamat datang di Bot Admin Desa. Ada yang bisa saya bantu?", dari: "bot" },
  ])
  const [input, setInput] = useState("")

  const kirim = (teks: string) => {
    if (!teks.trim()) return
    const newMsgs: Message[] = [...messages, { teks, dari: "user" }]
    setMessages(newMsgs)
    setInput("")
    setTimeout(() => {
      setMessages(prev => [...prev, { teks: getResponse(teks), dari: "bot" }])
    }, 600)
  }

  return (
    <>
      {/* Tombol floating */}
      <button onClick={() => setBuka(!buka)}
        className="fixed bottom-5 right-5 w-13 h-13 rounded-full flex items-center justify-center text-2xl shadow-lg z-50 transition-transform hover:scale-110"
        style={{ background: "#25D366", width: 52, height: 52 }}>
        {buka ? "✕" : "💬"}
      </button>

      {/* Panel chat */}
      {buka && (
        <div className="fixed bottom-20 right-5 w-[300px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-[400px]">

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: "#25D366" }}>
            <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-sm font-semibold text-white">Admin Bot Desa</p>
              <p className="text-[11px] text-white/80">Online • Balas cepat</p>
            </div>
          </div>

          {/* Pesan */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2" style={{ background: "#ECE5DD", minHeight: 180 }}>
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed
                ${m.dari === "bot"
                  ? "bg-white text-gray-700 self-start rounded-tl-none"
                  : "self-end rounded-tr-none text-gray-700"
                }`}
                style={m.dari === "user" ? { background: "#DCF8C6" } : {}}>
                {m.teks}
              </div>
            ))}
          </div>

          {/* Quick reply */}
          <div className="px-3 py-2 border-t border-gray-100 flex flex-col gap-1.5 bg-white">
            {QUICK.map(q => (
              <button key={q} onClick={() => kirim(q)}
                className="text-left text-[11px] bg-hijau-muda text-hijau-tua border border-hijau-border rounded-full px-3 py-1 hover:bg-hijau-border transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white">
            <input
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 outline-none"
              placeholder="Ketik pesan..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && kirim(input)}
            />
            <button onClick={() => kirim(input)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
              style={{ background: "#25D366" }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
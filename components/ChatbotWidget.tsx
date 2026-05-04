"use client"
import { useState } from "react"

const BOT_RESPONSES: Record<string, string> = {
  domisili: "Untuk surat domisili, klik menu Ajukan Surat → pilih Surat Keterangan Domisili → isi formulir → upload KTP, KK, dan surat RT/RW. Proses selesai 1-2 hari kerja. ✅",
  syarat: "Persyaratan umum: 1) Fotokopi KTP 2) Fotokopi KK 3) Surat pengantar RT/RW. Dokumen khusus berbeda per jenis surat. 📎",
  lama: "Rata-rata waktu penyelesaian 1-2 hari kerja (48 jam). Anda akan mendapat notifikasi WhatsApp otomatis saat surat selesai. ⏱",
  biaya: "Semua layanan surat GRATIS. Tidak ada biaya administrasi apapun. 🎉",
  jam: "Kantor desa buka Senin–Jumat pukul 08.00–15.00 WIB. Layanan online tersedia 24 jam. 🕐",
  cs: "Untuk informasi lebih lanjut, hubungi Customer Service kami:\n\n📞 Telp: (0265) 123-4567\n💬 WhatsApp: 0812-3456-7890\n📧 Email: sidesa@gegempalan.desa.id\n\nJam layanan CS: Senin–Jumat 08.00–15.00 WIB",
  default: "Maaf, saya belum bisa menjawab pertanyaan itu. Untuk informasi lebih lanjut, silakan hubungi Customer Service kami dengan klik tombol di bawah. 🙏",
}

function getResponse(msg: string) {
  const m = msg.toLowerCase()
  if (m.includes("domisili") || m.includes("ajukan") || m.includes("cara")) return BOT_RESPONSES.domisili
  if (m.includes("syarat") || m.includes("dokumen") || m.includes("persyaratan")) return BOT_RESPONSES.syarat
  if (m.includes("lama") || m.includes("selesai") || m.includes("berapa")) return BOT_RESPONSES.lama
  if (m.includes("biaya") || m.includes("bayar") || m.includes("gratis")) return BOT_RESPONSES.biaya
  if (m.includes("jam") || m.includes("buka") || m.includes("tutup")) return BOT_RESPONSES.jam
  if (m.includes("cs") || m.includes("customer") || m.includes("hubungi") || m.includes("kontak")) return BOT_RESPONSES.cs
  return BOT_RESPONSES.default
}

type Message = { teks: string; dari: "bot" | "user" }

const QUICK = [
  { label: "📄 Cara ajukan surat domisili?", teks: "Cara mengajukan surat domisili?" },
  { label: "⏱ Berapa lama surat selesai?", teks: "Berapa lama surat selesai?" },
  { label: "📎 Dokumen yang dibutuhkan?", teks: "Dokumen apa yang dibutuhkan?" },
  { label: "📞 Hubungi Customer Service", teks: "Hubungi customer service" },
]

export default function ChatbotWidget() {
  const [buka, setBuka] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { teks: "Halo! 👋 Selamat datang di Bot Admin Desa Gegempalan. Ada yang bisa saya bantu?", dari: "bot" },
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

  const bukaWA = () => {
    window.open("https://wa.me/6281234567890?text=Halo%20Admin%20Desa%20Gegempalan%2C%20saya%20ingin%20bertanya%20mengenai%20layanan%20administrasi%20desa.", "_blank")
  }

  return (
    <>
      {/* Tombol floating */}
      <button
        onClick={() => setBuka(!buka)}
        className="fixed bottom-5 right-5 rounded-full flex items-center justify-center text-white text-2xl shadow-lg z-50 transition-transform hover:scale-110"
        style={{ background: "#25D366", width: 52, height: 52 }}>
        {buka ? "✕" : "💬"}
      </button>

      {/* Panel chat */}
      {buka && (
        <div className="fixed bottom-20 right-5 w-[300px] bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col"
          style={{ maxHeight: 480 }}>

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0" style={{ background: "#25D366" }}>
            <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-lg">🤖</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin Bot SiDesa</p>
              <p className="text-[11px] text-white/80">Online • Balas cepat</p>
            </div>
            <button onClick={() => setBuka(false)} className="text-white/80 hover:text-white text-lg">✕</button>
          </div>

          {/* Pesan */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
            style={{ background: "#ECE5DD", minHeight: 160 }}>
            {messages.map((m, i) => (
              <div key={i}
                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line
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
          <div className="px-3 py-2 border-t border-gray-100 flex flex-col gap-1.5 bg-white flex-shrink-0">
            {QUICK.map(q => (
              <button key={q.teks} onClick={() => kirim(q.teks)}
                className={`text-left text-[11px] rounded-full px-3 py-1.5 transition-colors border
                  ${q.label.includes("Customer Service")
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-medium"
                    : "bg-hijau-muda text-hijau-tua border-hijau-border hover:bg-hijau/10"
                  }`}>
                {q.label}
              </button>
            ))}
          </div>

          {/* Tombol chat langsung ke WA */}
          <div className="px-3 pb-2 bg-white flex-shrink-0">
            <button
              onClick={bukaWA}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white text-xs font-medium transition-opacity hover:opacity-90"
              style={{ background: "#25D366" }}>
              <span>💬</span>
              Chat Langsung dengan CS via WhatsApp
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-100 bg-white flex-shrink-0">
            <input
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 outline-none focus:border-green-300"
              placeholder="Ketik pesan..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && kirim(input)}
            />
            <button
              onClick={() => kirim(input)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
              style={{ background: "#25D366" }}>
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
export async function kirimWhatsApp(noHp: string, pesan: string) {
  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: noHp,
        message: pesan,
      }),
    })
    return await res.json()
  } catch (err) {
    console.error("Gagal kirim WhatsApp:", err)
  }
}
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pengajuan = await prisma.pengajuan.findMany({
    where: { wargaId: (session.user as any).id },
    include: {
      riwayat: { orderBy: { createdAt: "desc" } }
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(pengajuan)
}
div >
  

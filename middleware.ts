import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const protectedPaths = ["/ajukan", "/tracking", "/notifikasi"]
  const adminPaths = ["/admin"]

  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAdminPath = adminPaths.some(p => pathname.startsWith(p))

  if (!isLoggedIn && (isProtected || isAdminPath)) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminPath && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/ajukan/:path*", "/tracking/:path*", "/notifikasi/:path*", "/admin/:path*"],
}
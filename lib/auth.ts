import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        nik: {},
        password: {},
      },
      authorize: async (credentials) => {
        const warga = await prisma.warga.findUnique({
          where: { nik: credentials.nik as string },
        })

        if (!warga) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          warga.password
        )

        if (!valid) return null

        return {
          id: warga.id,
          name: warga.nama,
          nik: warga.nik,
          role: warga.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as any
        token.id = u.id
        token.nik = u.nik
        token.role = u.role
      }
      return token
    },
    session: async ({ session, token }) => {
      const t = token as any
      if (session.user) {
        const su = session.user as any
        su.id = t.id
        su.nik = t.nik
        su.role = t.role
      }
      return session
    },
  },
})
import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    nik: string
    role: Role
  }

  interface Session {
    user: {
      id: string
      nik: string
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    nik: string
    role: Role
  }
}
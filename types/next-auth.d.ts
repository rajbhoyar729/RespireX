import NextAuth from "next-auth"
import { ObjectId } from "mongodb";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    username: string
  }
}


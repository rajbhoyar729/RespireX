import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
<<<<<<< HEAD
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
=======
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise, { connectToDatabase } from "@/lib/mongodb"
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
import { compare } from "bcryptjs"
import type { AuthOptions } from "next-auth"

<<<<<<< HEAD
export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
=======
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db()
          const user = await db.collection("users").findOne({ username: credentials.username })

          if (!user) {
            return null
          }

          const isPasswordCorrect = await compare(credentials.password, user.password as string)

          if (!isPasswordCorrect) {
            return null
          }

          return {
            id: user._id.toString(),
            username: user.username,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
<<<<<<< HEAD
=======

        const isPasswordCorrect = await compare(credentials.password, user.password as string)

        if (!isPasswordCorrect) {
          return null
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email || null,
        }
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
<<<<<<< HEAD
  debug: process.env.NODE_ENV === 'development',
=======
  secret: process.env.NEXTAUTH_SECRET,
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

export const auth = () => NextAuth(authOptions)


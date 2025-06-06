import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "next-auth/adapters";
import clientPromise from "./lib/mongodb";

// Define a type for the adapter that includes null handling for the name field
interface CustomAdapter extends Omit<Adapter, 'getUser'> {
  getUser: (id: string) => Promise<{
    id: string;
    email: string;
    name: string | undefined;
    emailVerified: Date | null;
  } | null>;
}

const adapter = MongoDBAdapter(clientPromise) as unknown as CustomAdapter;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
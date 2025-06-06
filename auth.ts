import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "next-auth/adapters";
import clientPromise from "./lib/mongodb";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

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
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const client = await clientPromise;
        const db = client.db('RespireX');
        const user = await db.collection('User').findOne({ 'loginInfo.email': credentials.email });

        if (!user) {
          throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.loginInfo.password);

        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user.profile.userId,
          name: user.profile.username,
          email: user.profile.email,
        };
      },
    }),
  ],
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
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
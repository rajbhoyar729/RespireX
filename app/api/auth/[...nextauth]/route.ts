import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import NextAuth from 'next-auth'; // Import NextAuth

// Extend Session type
interface ExtendedSession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authOptions: NextAuthOptions = {
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
  callbacks: {
    async session({ session, token }): Promise<ExtendedSession> {
      const extendedSession = session as ExtendedSession;
      if (token.id) {
        extendedSession.user.id = token.id as string;
      }
      return extendedSession;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions); // Use NextAuth
export { handler as GET, handler as POST };
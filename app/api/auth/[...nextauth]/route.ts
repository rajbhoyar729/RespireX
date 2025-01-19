<<<<<<< HEAD
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Awaitable } from 'next-auth';

export const authOptions = {
=======
export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import type { NextAuthConfig, User, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
>>>>>>> b76671f26bbb15937a9192bd28c7b8ea3a1a9241
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
<<<<<<< HEAD
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const client = await clientPromise;
        const db = client.db('your_database_name');
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error('Invalid password');
=======
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({ username: credentials.username });

        if (!user || typeof user.password !== 'string') {
          console.error('User not found or password is not a string:', user);
          return null;
        }

        const isPasswordCorrect = await compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordCorrect) {
          return null;
>>>>>>> b76671f26bbb15937a9192bd28c7b8ea3a1a9241
        }

        return {
          id: user._id.toString(),
<<<<<<< HEAD
          name: user.name,
          email: user.email,
=======
          username: user.username,
          email: user.email || null,
>>>>>>> b76671f26bbb15937a9192bd28c7b8ea3a1a9241
        };
      },
    }),
  ],
<<<<<<< HEAD
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ 
      session, 
      token 
    }: { 
      session: Session; 
      token: JWT & { id?: string } 
    }): Promise<Session> {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ 
      url, 
      baseUrl 
    }: { 
      url: string; 
      baseUrl: string 
    }): Promise<string> {
      return '/dashboard';
    },
=======
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
>>>>>>> b76671f26bbb15937a9192bd28c7b8ea3a1a9241
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
  },
<<<<<<< HEAD
=======
  secret: process.env.NEXTAUTH_SECRET,
>>>>>>> b76671f26bbb15937a9192bd28c7b8ea3a1a9241
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
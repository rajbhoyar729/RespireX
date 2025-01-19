import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    id: string;
    email: string;
    name?: string | null;
    emailVerified: Date | null;
  }
}
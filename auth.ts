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
});
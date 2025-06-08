import NextAuth from 'next-auth';
import authOptions from '@/lib/authOptions';

// Route configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Prevent static optimization
export const generateStaticParams = async () => {
  return [];
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
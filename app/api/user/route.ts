import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';
import { getUserCollection } from '@/lib/model';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usersCollection = await getUserCollection();
    const user = await usersCollection.findOne({ 'loginInfo.email': session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found', exists: false }, { status: 404 });
    }

    return NextResponse.json({ ...user, exists: true });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
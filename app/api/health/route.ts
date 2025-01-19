import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const userId = new ObjectId(session.user.id);

    const healthData = await db.collection('user_health').findOne({ userId });

    if (!healthData) {
      return NextResponse.json({ error: 'Health data not found' }, { status: 404 });
    }

    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Error fetching health data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

interface HealthData {
  userId: ObjectId;
  predictions: any[]; // Replace `any` with a more specific type if possible
  latestPrediction: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: Request) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(); // Replace with your database name if needed
    const userId = new ObjectId(session.user.id);

    // Fetch health data
    const healthData = await db.collection<HealthData>('user_health').findOne({ userId });

    if (!healthData) {
      return NextResponse.json({ error: 'Health data not found' }, { status: 404 });
    }

    // Return health data
    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Error fetching health data:', error);

    // Return a generic error response
    return NextResponse.json(
      { error: 'An internal server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
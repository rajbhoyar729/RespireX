import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// Define the Prediction interface
interface Prediction {
  features: any;
  prediction: any;
  timestamp: Date;
}

// Define the UserHealth interface
interface UserHealth {
  _id?: ObjectId;
  userId: string;
  predictions: Prediction[];
  latestPrediction: any;
  updatedAt: Date;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { features, prediction } = await req.json();
    const { db } = await connectToDatabase();

    const userId = session.user.id;

    // Explicitly type the collection
    const userHealthCollection = db.collection<UserHealth>('user_health');

    // Update operation
    const result = await userHealthCollection.updateOne(
      { userId },
      {
        $push: {
          predictions: {
            features,
            prediction,
            timestamp: new Date(),
          },
        },
        $set: {
          latestPrediction: prediction,
          updatedAt: new Date(),
        },
      } as Partial<UserHealth> // Cast to Partial<UserHealth> for type compatibility
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User health record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Health data updated successfully' });
  } catch (error) {
    console.error('Health data update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

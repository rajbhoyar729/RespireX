import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { auth } from "@/auth";
import { ObjectId } from 'mongodb';
import { predictionSchema } from '@/lib/types';
import type { Session } from 'next-auth'; // Import Session type

interface AuthSession {
  user?: {
    id: string;
    [key: string]: any;
  };
}

export async function POST(req: Request) {
  try {
    const session = await auth() as AuthSession | null;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = predictionSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Extract validated data
    const { features, prediction } = validatedData.data;

    // Connect to the database
    const { db } = await connectToDatabase();
    const userId = new ObjectId(session.user.id);

    // Define the update document
    const updateDoc = {
      $push: {
        predictions: {
          features,
          prediction,
          timestamp: new Date(),
        },
      } as any,
      $set: {
        latestPrediction: prediction,
        updatedAt: new Date(),
      },
    };

    // Update the user's health record
    const result = await db.collection('user_health').updateOne(
      { userId },
      updateDoc,
      { upsert: true }
    );

    // Check if the update was successful
    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      console.error('Failed to update health record:', {
        userId: session.user.id,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
      });
      return NextResponse.json(
        { error: 'Failed to update health record' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: 'Health data updated successfully',
      updated: result.modifiedCount > 0,
      created: result.upsertedCount > 0,
    });
  } catch (error) {
    console.error('Health data update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { ObjectId } from 'mongodb'
import { predictionSchema } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
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

    // Connect to database
    const client = await clientPromise;
    const db = client.db()
    const userId = new ObjectId(session.user.id)

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
    )
  }
}
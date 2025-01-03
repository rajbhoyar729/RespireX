import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { connectToDatabase } from '../../../lib/mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { ObjectId } from 'mongodb'
import { predictionSchema } from '@/lib/types'

export async function POST(req: Request) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body = await req.json()
    const validatedData = predictionSchema.safeParse(body)

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error)
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { features, prediction } = validatedData.data

    // Connect to database
    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Update health record
    const result = await db.collection('user_health').updateOne(
      { userId },
      {
        $push: {
          predictions: {
            $each: [
              {
                features: features,
                prediction: prediction,
                timestamp: new Date(),
              },
            ],
          } as any, // Add 'as any' to bypass type checking
        },
        $set: {
          latestPrediction: prediction,
          updatedAt: new Date()
        }
      },
      { upsert: true } // Create document if it doesn't exist
    )

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      console.error('Failed to update health record:', {
        userId: session.user.id,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount
      })
      return NextResponse.json(
        { error: 'Failed to update health record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Health data updated successfully',
      updated: result.modifiedCount > 0,
      created: result.upsertedCount > 0
    })
  } catch (error) {
    console.error('Health data update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
=======
import { connectToDatabase } from '@/lib/mongodb'
import { auth } from "@/auth"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userId = session.user.id

    const healthData = await db.collection('user_health').findOne({ userId })

    if (!healthData) {
      return NextResponse.json({ error: 'Health data not found' }, { status: 404 })
    }

    return NextResponse.json(healthData)
  } catch (error) {
    console.error('Error fetching health data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
>>>>>>> ecca23994d572172023c991bd71e3d3eada81f0c
  }
}


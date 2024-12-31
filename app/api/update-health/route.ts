import { NextResponse } from 'next/server'
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
  }
}


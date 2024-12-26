import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    const { db } = await connectToDatabase()

    const existingUser = await db.collection('users').findOne({ username })
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)
    const result = await db.collection('users').insertOne({ username, password: hashedPassword })
    const userId = result.insertedId

    await db.collection('user_health').insertOne({
      userId,
      predictions: [],
      latestPrediction: null,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ message: 'User registered successfully', userId: userId }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


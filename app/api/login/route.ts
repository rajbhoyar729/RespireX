import { NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { getUserCollection } from '@/lib/model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const usersCollection = await getUserCollection();
    const user = await usersCollection.findOne({ 'loginInfo.email': email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.loginInfo.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update session info (e.g., login count and last login)
    await usersCollection.updateOne(
      { 'loginInfo.email': email },
      {
        $set: { 'sessionInfo.lastLogin': new Date() },
        $inc: { 'sessionInfo.loginCount': 1 },
      }
    );

    // Create a session using NextAuth.js
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json(
        {
          message: 'Login successful',
          user: {
            id: user.profile.userId,
            name: user.profile.username,
            email: user.profile.email,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to create session' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
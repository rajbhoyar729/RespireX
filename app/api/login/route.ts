import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('your_database_name'); // Replace with your database name
    const usersCollection = db.collection('users');

    // Find the user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 400 }
      );
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Authentication successful, redirect to dashboard
    // Note: For session management, consider using NextAuth's login method
    // Here, we're just redirecting; session handling should be managed by NextAuth
    return redirect('/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
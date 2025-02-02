import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserCollection, createUser } from '@/lib/model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const usersCollection = await getUserCollection();
    const existingUser = await usersCollection.findOne({ 'loginInfo.email': email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique user ID
    const userId = `user_${Date.now()}`;

    // Create the user
    await createUser({
      profile: {
        username: name,
        userId,
        email,
      },
      loginInfo: {
        userId,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
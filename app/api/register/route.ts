import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserCollection, createUser } from '@/lib/model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Input validation
    if (!name || !email || !password) {
      console.error('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6) {
      console.error('Password too short');
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const usersCollection = await getUserCollection();
    const existingUser = await usersCollection.findOne({ 'loginInfo.email': email });

    if (existingUser) {
      console.error('User already exists:', email);
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

    console.log('User registered successfully:', email);
    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    // Log specific error details in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Registration error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return NextResponse.json(
      { message: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
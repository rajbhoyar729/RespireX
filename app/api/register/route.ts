import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser } from '@/lib/model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Generate a unique user ID
    const userId = `user_${Date.now()}`;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with required data structure
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
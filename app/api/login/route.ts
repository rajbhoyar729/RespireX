import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, updateSessionInfo } from '@/lib/model';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 400 }
      );
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.loginInfo.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update session info
    await updateSessionInfo(email);

    return NextResponse.json(
      { message: 'Login successful', user: user.profile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
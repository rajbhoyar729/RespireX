import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    console.log('Request received');

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);

    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db('your_database_name'); // Replace with your database name
    console.log('Connected to MongoDB');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      console.log('User already exists:', existingUser);
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save the user to the database
    console.log('Saving user to database...');
    await db.collection('users').insertOne(newUser);
    console.log('User saved successfully');

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
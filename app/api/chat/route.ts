import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { chatMessageSchema } from '@/lib/types';
import { headers } from 'next/headers';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent');
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Parse and validate input
    const body = await req.json();
    const validatedData = chatMessageSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation error:', validatedData.error);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { message } = validatedData.data;

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a medical AI assistant specializing in respiratory health. 
    Provide helpful, accurate information about respiratory conditions, treatments, and preventive measures. 
    Keep responses concise and focused.
    The user's message is: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log the interaction (implement your own logging logic)
    console.log({
      timestamp: new Date().toISOString(),
      userAgent,
      ip,
      message,
      responseLength: text.length,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    
    // Don't expose internal error details to the client
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}


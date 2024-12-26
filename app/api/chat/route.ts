import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Access your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini" });

    const prompt = `You are a medical AI assistant specializing in respiratory health. 
    Provide helpful, accurate information about respiratory conditions, treatments, and preventive measures. 
    The user's message is: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' }, 
      { status: 500 }
    );
  }
}


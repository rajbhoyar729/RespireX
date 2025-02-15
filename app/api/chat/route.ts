import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { chatMessageSchema } from '@/lib/types';
import { headers } from 'next/headers';
import { getDiseaseDetectionsByUserId } from '@/lib/model';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the disease class array
const diseaseClass = [
  'Asthma',
  'Bronchiectasis',
  'Bronchiolitis',
  'COPD',
  'Healthy',
  'LRTI',
  'Pneumonia',
  'URTI'
];

async function fetchUserDisease(userId: string): Promise<string> {
  try {
    const detections = await getDiseaseDetectionsByUserId(userId);
    if (!detections || detections.length === 0) {
      throw new Error('No detected diseases found for this user.');
    }
    // Only return the last detected disease
    return detections[detections.length - 1].diseaseDetected;
  } catch (error) {
    console.error('Error fetching user disease:', error);
    throw new Error('Failed to fetch user disease');
  }
}

export async function POST(req: Request) {
  try {
    // Extract headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Parse and validate input
    const body = await req.json();
    const validatedData = chatMessageSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { message, userId } = validatedData.data;

    // If user says "hi", reply with the full diseaseClass array
    if (message.trim().toLowerCase() === 'hi') {
      const reply = `I specialize exclusively in ${diseaseClass.join(', ')}. Please ask questions specific to these conditions.`;
      return NextResponse.json({ response: reply });
    }

    // For other messages, fetch the last detected disease from the DB
    const lastDisease = await fetchUserDisease(userId);

    // Configure model with safety settings
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });

    const prompt = `You are a medical AI assistant specializing ONLY in respiratory diseases. 
STRICT PROTOCOLS:
1. ONLY discuss these specific conditions: ${lastDisease}
2. IMMEDIATELY REFUSE any questions not directly related to these conditions
3. Never provide medical advice beyond general information
4. Responses must be under 120 words
5. Cite only peer-reviewed sources when mentioning treatments

FORMAT:
- If question relates to ${lastDisease}:
  • Briefly explain relevant symptoms
  • List evidence-based treatments
  • Suggest preventive measures
  • Include latest research (2020-2023)
  
- For any other topics:
  • "I specialize exclusively in ${lastDisease}. Please ask questions specific to these conditions."
  • Do not acknowledge other topics

User's question: ${message}`;

    // Generate content with corrected configuration
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Log interaction
    console.log({
      timestamp: new Date().toISOString(),
      userAgent,
      ip,
      userId,
      message,
      response: text.substring(0, 50) + "...",
      length: text.length
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate medical response' },
      { status: 500 }
    );
  }
}

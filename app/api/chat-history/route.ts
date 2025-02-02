import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getChatHistoryCollection, addChatHistory } from '@/lib/model';

// Get all chat history for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatHistoryCollection = await getChatHistoryCollection();
    const chatHistory = await chatHistoryCollection.find({ userId: session.user.id }).toArray();

    return NextResponse.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add new chat history for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { disease, messages } = body;

    await addChatHistory(session.user.id, {
      disease,
      messages,
    });

    return NextResponse.json({ message: 'Chat history added successfully' });
  } catch (error) {
    console.error('Error adding chat history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { getAudioDataCollection, addAudioData } from '@/lib/model';

// Get all audio data for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const audioDataCollection = await getAudioDataCollection();
    const audioData = await audioDataCollection.find({ userId: session.user.id }).toArray();

    return NextResponse.json(audioData);
  } catch (error) {
    console.error('Error fetching audio data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add new audio data for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { audioFile, timestamp } = body;

    await addAudioData(session.user.id, { audioFile, timestamp });

    return NextResponse.json({ message: 'Audio data added successfully' });
  } catch (error) {
    console.error('Error adding audio data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
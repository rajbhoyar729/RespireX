import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { addAudioData } from '@/lib/model';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    // Add audio data to the user's record
    await addAudioData(session.user.email, {
      audioFile: audioFile.name,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Audio data added successfully' });
  } catch (error) {
    console.error('Error adding audio data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
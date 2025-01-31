import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { addDiseaseDetection } from '@/lib/model';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, diseaseDetected, category, timeOfDetection, date } = body;

    await addDiseaseDetection(email, {
      diseaseDetected,
      category,
      timeOfDetection,
      date,
    });

    return NextResponse.json({ message: 'Health data updated successfully' });
  } catch (error) {
    console.error('Error updating health data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
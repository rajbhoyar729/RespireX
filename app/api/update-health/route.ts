// File: app/api/update-health/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/authOptions';
import {
  addDiseaseDetection,
  getDiseaseDetectionsByUserId,
} from '@/lib/model';

// Helper function to update disease detection data in the database.
async function updateDiseaseDetection(
  email: string,
  diseaseDetected: string,
  category: string,
  timeOfDetection: Date,
  date: Date
) {
  try {
    await addDiseaseDetection(email, {
      diseaseDetected,
      category,
      timeOfDetection,
      date,
    });
    return { success: true, message: 'Health data updated successfully' };
  } catch (error) {
    console.error('Error updating disease detection data:', error);
    throw new Error('Failed to update disease detection data');
  }
}

// Helper function to fetch the last detected disease for a user.
async function getDetectedDisease(email: string) {
  try {
    const detections = await getDiseaseDetectionsByUserId(email);
    if (!detections || detections.length === 0) {
      return { success: true, data: null };
    }
    // Only the last detected disease is needed.
    const lastDetection = detections[detections.length - 1];
    const formattedDetection = {
      diseaseDetected: lastDetection.diseaseDetected,
      category: lastDetection.category,
      timeOfDetection: lastDetection.timeOfDetection.toISOString(),
      date: lastDetection.date.toISOString(),
    };
    return { success: true, data: formattedDetection };
  } catch (error) {
    console.error('Error fetching detected diseases:', error);
    throw new Error('Failed to fetch detected diseases');
  }
}

// POST endpoint to handle health data operations.
export async function POST(req: Request) {
  try {
    // Authenticate the user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { action, email } = body;

    console.log('Received request:', { action, email });

    // Validate required fields
    if (!action || !email) {
      console.error('Missing required fields:', { action, email });
      return NextResponse.json(
        { error: 'Missing required fields: action or email' },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'update': {
        const { diseaseDetected, category, timeOfDetection, date } = body;
        if (!diseaseDetected || !category || !timeOfDetection || !date) {
          console.error('Missing fields for update:', body);
          return NextResponse.json(
            { error: 'Missing required fields for update' },
            { status: 400 }
          );
        }
        const updateResult = await updateDiseaseDetection(
          email,
          diseaseDetected,
          category,
          new Date(timeOfDetection),
          new Date(date)
        );
        return NextResponse.json({ message: updateResult.message });
      }
      case 'fetch': {
        const fetchResult = await getDetectedDisease(email);
        console.log('Fetched disease:', fetchResult);
        return NextResponse.json(fetchResult);
      }
      default:
        console.error('Invalid action specified:', action);
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in POST endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// File: app/api/predict/route.ts

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { createReadStream } from 'fs';

// Force the Node.js runtime so that we can use Node streams and libraries.
export const config = {
  runtime: 'nodejs',
};

/**
 * Parse the multipart form data using formidable.
 */
const parseForm = (req: Request): Promise<{ fields: any; files: any }> =>
  new Promise((resolve, reject) => {
    // @ts-ignore: Next.js Request is extended to be a Node IncomingMessage
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const { files } = await parseForm(req);

    // Retrieve the audio file (field name should match what the client sends)
    const audioFile = files.audio;
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is missing.' },
        { status: 400 }
      );
    }

    // Create a new FormData instance to send to the FastAPI backend.
    // Node 18+ includes a global FormData, or you can import one from a polyfill if needed.
    const formData = new FormData();

    // Create a readable stream from the temporary file stored by formidable.
    const fileStream = createReadStream(audioFile.filepath);
    formData.append('audio', fileStream, audioFile.originalFilename || 'audio.wav');

    // Forward the file to your FastAPI backend.
    const fastApiResponse = await fetch(
      'http://your-fastapi-backend-url/api/predict',
      {
        method: 'POST',
        body: formData,
        // Do not manually set the "Content-Type" header here.
        // The fetch implementation will set the proper multipart/form-data header.
      }
    );

    // Read the JSON response from FastAPI.
    const data = await fastApiResponse.json();

    // Return the backend's response as our API response.
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in predict endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

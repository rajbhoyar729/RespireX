'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [hasMedicalHistory, setHasMedicalHistory] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      if (!session?.user?.email) {
        throw new Error('User email not found in session');
      }

      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      setUserData(user);
      setHealthData(user.diseaseDetections || []);
      setHasMedicalHistory(user.diseaseDetections?.length > 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch user data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  // Update session info on component mount
  useEffect(() => {
    if (status === 'authenticated' && session.user?.email) {
      fetch('/api/update-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      }).catch((error) => {
        console.error('Error updating session info:', error);
      });
    }
  }, [status, session]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router, fetchUserData]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }, []);

  // Handle form submission for audio analysis
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!file || !session?.user?.email) return;

      setIsAnalyzing(true);
      setError(null);

      try {
        // Step 1: Extract features from the audio file
        const formData = new FormData();
        formData.append('audio', file);

        const featuresResponse = await fetch('/api/extract-features', {
          method: 'POST',
          body: formData,
        });

        if (!featuresResponse.ok) {
          throw new Error('Failed to extract features');
        }

        const featuresData = await featuresResponse.json();

        // Step 2: Predict disease using the extracted features
        const predictionResponse = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(featuresData),
        });

        if (!predictionResponse.ok) {
          throw new Error('Failed to predict disease');
        }

        const predictionData = await predictionResponse.json();
        setPrediction(predictionData.prediction);

        // Step 3: Update user health data in MongoDB
        const updateResponse = await fetch('/api/update-health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            diseaseDetected: predictionData.prediction,
            category: 'Respiratory', // Example category
            timeOfDetection: new Date(),
            date: new Date(),
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update health data');
        }

        // Refresh health data
        fetchUserData();

        // Show success toast
        toast({
          title: 'Success',
          description: 'Analysis completed successfully.',
        });
      } catch (error) {
        console.error('Error during analysis:', error);
        setError('An error occurred during analysis. Please try again.');
        toast({
          title: 'Error',
          description: 'An error occurred during analysis. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsAnalyzing(false);
      }
    },
    [file, session, fetchUserData, toast]
  );

  // Loading state
  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {hasMedicalHistory ? (
        // Display medical history if available
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Latest Prediction: {healthData[healthData.length - 1]?.diseaseDetected || 'No prediction yet'}</p>
            <p>Total Predictions: {healthData.length}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Previous Predictions:</h3>
              <ul className="list-disc pl-6">
                {healthData.map((detection: any, index: number) => (
                  <li key={index} className="mt-2">
                    <p><strong>Prediction:</strong> {detection.diseaseDetected}</p>
                    <p><strong>Date:</strong> {new Date(detection.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Display analysis and chat buttons if no medical history is available
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="file"
                  accept=".wav"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <Button type="submit" disabled={!file || isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
                </Button>
              </form>
              {isAnalyzing && (
                <div className="flex items-center justify-center mt-4">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chat with AI</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/chat" passHref>
                <Button className="w-full">Start Chat</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
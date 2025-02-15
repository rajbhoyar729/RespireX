// File: app/dashboard/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [detectedDisease, setDetectedDisease] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const fetchUserDataAndDisease = useCallback(async () => {
    try {
      if (!session?.user?.email) {
        throw new Error('User email not found in session');
      }

      // Fetch user data
      const userResponse = await fetch('/api/user');
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();
      setUserData(userData);

      // Fetch detected disease from /api/update-health
      console.log('Fetching detected disease for email:', session.user.email);
      const healthResponse = await fetch('/api/update-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch', email: session.user.email }),
      });
      if (!healthResponse.ok) {
        const errorData = await healthResponse.json();
        throw new Error(errorData.error || 'Failed to fetch detected disease');
      }
      const healthData = await healthResponse.json();
      // healthData.data is either a single object or null
      setDetectedDisease(healthData.data);
    } catch (error) {
      console.error('Error fetching user data or disease:', error);
      setError('Failed to fetch user data or detected disease.');
      toast({
        title: 'Error',
        description: 'Failed to fetch user data or detected disease.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserDataAndDisease();
    }
  }, [status, router, fetchUserDataAndDisease]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <Button onClick={() => window.location.reload()} className="w-48">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
        Dashboard
      </h1>
      <Card className="mb-8 shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {userData?.profile?.username || 'User'}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {detectedDisease ? 'Latest Prediction' : 'Not Checked Yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Email: {userData?.profile?.email || 'N/A'}
          </p>
          {detectedDisease && (
            <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              Last Detected Disease:{' '}
              <span className="font-bold">
                {detectedDisease.diseaseDetected}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
      {detectedDisease && (
        <Card className="mb-8 shadow-md border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Detected Disease History
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              The latest detected disease for this user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Disease: {detectedDisease.diseaseDetected} <br />
              Category: {detectedDisease.category} <br />
              Date: {new Date(detectedDisease.date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}
      <div className="flex flex-col space-y-4">
        <Link href="/analysis">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 rounded-lg shadow-md transition-all duration-300">
            Analyze Audio
          </Button>
        </Link>
        {detectedDisease &&
          detectedDisease.diseaseDetected !== 'Healthy' && (
            <Link href="/chat">
              <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-6 rounded-lg shadow-md transition-all duration-300">
                Chat with AI
              </Button>
            </Link>
          )}
      </div>
    </div>
  );
}

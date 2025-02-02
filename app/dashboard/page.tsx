'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const [userExists, setUserExists] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // Fetch user data and check if the user exists
  const fetchUserData = useCallback(async () => {
    try {
      if (!session?.user?.email) {
        throw new Error('User email not found in session');
      }

      const response = await fetch('/api/user');
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setUserExists(false);
          setIsLoading(false);
          return;
        }
        throw new Error(data.error || 'Failed to fetch user data');
      }

      setUserData(data);
      setHealthData(data.diseaseDetections || []);
      setUserExists(true);
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

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router, fetchUserData]);

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // Error state
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
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Dashboard</h1>

      {/* User Information Card */}
      <Card className="mb-8 shadow-md border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {userData?.profile?.username || 'User'}
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {userExists && healthData?.length > 0 ? 'Latest Prediction' : 'Not Checked Yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Email: {userData?.profile?.email || 'N/A'}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-4">
        {/* Analyze Button */}
        <Link href="/analysis" passHref>
          <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 rounded-lg shadow-md transition-all duration-300">
            Analyze Audio
          </Button>
        </Link>

        {/* Chat with AI Button (only shown if user exists and disease is predicted) */}
        {userExists && healthData?.length > 0 && (
          <Link href="/chat" passHref>
            <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-6 rounded-lg shadow-md transition-all duration-300">
              Chat with AI
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
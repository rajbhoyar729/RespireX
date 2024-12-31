'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [healthData, setHealthData] = useState<any>(null)
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchHealthData = useCallback(async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        const data = await response.json()
        setHealthData(data)
      } else {
        throw new Error('Failed to fetch health data')
      }
    } catch (error) {
      console.error('Error fetching health data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch health data. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUserData()
      fetchHealthData()
    }
  }, [status, router, fetchUserData, fetchHealthData])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('audio', file)

    try {
      // Extract features
      const featuresResponse = await fetch('/api/extract-features', {
        method: 'POST',
        body: formData,
      })
      if (!featuresResponse.ok) {
        throw new Error('Failed to extract features')
      }
      const featuresData = await featuresResponse.json()

      // Predict disease
      const predictionResponse = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featuresData),
      })
      if (!predictionResponse.ok) {
        throw new Error('Failed to predict disease')
      }
      const predictionData = await predictionResponse.json()
      setPrediction(predictionData.prediction)

      // Update user health data in MongoDB
      const updateResponse = await fetch('/api/update-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featuresData, prediction: predictionData.prediction }),
      })
      if (!updateResponse.ok) {
        throw new Error('Failed to update health data')
      }

      fetchHealthData() // Refresh health data after update
      toast({
        title: "Success",
        description: "Analysis completed successfully.",
      })
    } catch (error) {
      console.error('Error during analysis:', error)
      toast({
        title: "Error",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [file, fetchHealthData, toast])

  if (status === 'loading' || !userData || !healthData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Health Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Latest Prediction: {healthData.latestPrediction || 'No prediction yet'}</p>
          <p>Total Predictions: {healthData.predictions.length}</p>
        </CardContent>
      </Card>
      {!prediction ? (
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
              <Button
                type="submit"
                disabled={!file || isAnalyzing}
              >
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Predicted Disease: {prediction}</p>
            <Link href="/chat" passHref>
              <Button>Chat with AI for Precautions</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [features, setFeatures] = useState<any>(null)
  const [prediction, setPrediction] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [healthData, setHealthData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchHealthData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        console.error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchHealthData = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        const data = await response.json()
        setHealthData(data)
      } else {
        console.error('Failed to fetch health data')
      }
    } catch (error) {
      console.error('Error fetching health data:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      const featuresData = await featuresResponse.json()
      setFeatures(featuresData)

      // Predict disease
      const predictionResponse = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featuresData),
      })
      const predictionData = await predictionResponse.json()
      setPrediction(predictionData.prediction)

      // Update user health data in MongoDB
      await fetch('/api/update-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featuresData, prediction: predictionData.prediction }),
      })

      setIsAnalyzing(false)
      fetchHealthData() // Refresh health data after update
    } catch (error) {
      console.error('Error during analysis:', error)
      setIsAnalyzing(false)
    }
  }

  if (!userData || !healthData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Health Data</h2>
        <p>Latest Prediction: {healthData.latestPrediction || 'No prediction yet'}</p>
        <p>Total Predictions: {healthData.predictions.length}</p>
      </div>
      {!prediction ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Analyze Audio</h2>
          <form onSubmit={handleSubmit} className="mb-8">
            <input
              type="file"
              accept=".wav"
              onChange={handleFileChange}
              className="mb-4"
            />
            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
            </button>
          </form>
          {isAnalyzing && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
          <p className="mb-4">Predicted Disease: {prediction}</p>
          <Link href="/chat" className="bg-green-500 text-white px-4 py-2 rounded">
            Chat with AI for Precautions
          </Link>
        </div>
      )}
    </div>
  )
}


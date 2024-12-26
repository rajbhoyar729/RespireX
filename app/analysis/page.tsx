'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    // Here you would typically send the file to your backend for processing
    console.log('Processing file:', file.name)

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulated result
    setResult('Potential respiratory issue detected. Please consult with a medical professional.')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Respiratory Sound Analysis</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Audio File (.wav)
            </label>
            <input
              type="file"
              id="audio-file"
              accept=".wav"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={!file}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Analyze Audio
          </button>
        </form>
        {result && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
            <p className="font-bold">Analysis Result</p>
            <p>{result}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}


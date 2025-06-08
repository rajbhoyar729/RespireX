'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '../../components/Footer';

// Configuration constants
const MAX_FILE_SIZE_MB = 10;
const SUPPORTED_MIME_TYPES = ['audio/wav', 'audio/x-wav'];

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setError('No file selected');
      return;
    }
    // Validate file type
    if (!SUPPORTED_MIME_TYPES.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a WAV file.');
      resetFileInput();
      return;
    }
    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      resetFileInput();
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an audio file.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('audio', file);
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      const data = await response.json();
      if (!data.predictedClass || typeof data.confidence !== 'number') {
        throw new Error('Invalid response from server');
      }
      setResult(
        `Prediction: ${data.predictedClass} (${data.confidence.toFixed(2)}% confidence)`
      );
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset file input
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
  };

  return (
    <div className="flex flex-col min-h ">
      {/* Navbar */}
      <Navbar activeSection="analysis" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 space-y-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Respiratory Sound Analysis
          </h1>

          {/* File Upload Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="audio-file"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload WAV Audio File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                id="audio-file"
                accept=".wav"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  dark:file:bg-blue-800 dark:file:text-blue-100
                  dark:hover:file:bg-blue-700"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Maximum file size: {MAX_FILE_SIZE_MB}MB
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg
                hover:bg-blue-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414z"
                  ></path>
                </svg>
              )}
              {isLoading ? 'Analyzing...' : 'Analyze Audio'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div
              className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md"
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Result</h3>
                  <p className="mt-1 text-sm text-green-700">{result}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
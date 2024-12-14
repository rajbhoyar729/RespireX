'use client'; // Marking this component as a client component

import React, { useState } from 'react';

const HeroSection = () => {
  const [showECG, setShowECG] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name); // Update state with the selected file's name
    }
  };

  const handlePredictClick = () => {
    setShowECG(true);
    // Hide the animation after some time (optional)
    setTimeout(() => {
      setShowECG(false);
    }, 2000); // Duration matches the animation duration
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">
          Detect Respiratory Diseases
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Using advanced AI and sound analysis to detect respiratory diseases early, ensuring the best care for your health.
        </p>

        {/* Flex container for buttons */}
        <div className="flex flex-col items-center">
          {/* Hidden file input to handle file upload */}
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="file-input"
            onChange={handleFileChange} // Handle file input change
          />

          {/* Label for file input */}
          <label
            htmlFor="file-input"
            className="inline-block bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition duration-300 cursor-pointer mb-2"
          >
            Upload Sound File
          </label>

          {/* File name display */}
          {fileName && (
            <p className="text-lg text-gray-200 mb-4">Selected File: {fileName}</p>
          )}

          {/* Predict button */}
          <button
            onClick={handlePredictClick}
            className="inline-block bg-gray-400 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Predict
          </button>
        </div>

        {/* ECG Animation */}
        {showECG && (
          <div className="mt-8 w-full flex justify-center">
            <svg
              viewBox="0 0 200 40"
              className="ecg-animation"
              width="600"
              height="100"
            >
              <polyline
                points="0,20 5,10 10,20 15,5 20,20 25,15 30,20 35,5 40,20 45,15 50,20 55,5 60,20 65,10 70,20 75,5 80,20 85,15 90,20 95,10 100,20 105,15 110,20 115,5 120,20 125,10 130,20 135,5 140,20 145,15 150,20 155,5 160,20 165,15 170,20 175,5 180,20 185,10 190,20 195,15 200,20"
                fill="none"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-line"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Styles for ECG animation */}
      <style jsx>{`
        .animate-line {
          animation: draw 1s forwards;
        }

        @keyframes draw {
          from {
            stroke-dasharray: 0, 100; /* Start with no line */
          }
          to {
            stroke-dasharray: 100, 0; /* Complete the line */
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;

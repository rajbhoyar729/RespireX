"use client";
import React from 'react';
import { Activity, Brain, Thermometer, AlertCircle } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-indigo-500">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Features = () => (
  <section id="features" className="min-h-screen flex items-center justify-center bg-black bg-opacity-90 py-12">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          title="Audio Analysis"
          description="Advanced AI-powered analysis of respiratory sounds for accurate disease detection."
          icon={Activity}
        />
        <FeatureCard
          title="Severity Estimator"
          description="Intelligent assessment of condition severity based on multiple factors."
          icon={Thermometer}
        />
        <FeatureCard
          title="Personalized Insights"
          description="Tailored health recommendations and explanations using natural language processing."
          icon={Brain}
        />
        <FeatureCard
          title="Early Warning System"
          description="Proactive alerts for potential respiratory issues before they become severe."
          icon={AlertCircle}
        />
      </div>
    </div>
  </section>
);

export default Features;
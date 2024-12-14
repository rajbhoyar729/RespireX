'use client'; // This line ensures that the component is treated as a client-side component.

import React from 'react';
import { Activity, Thermometer, Brain, AlertCircle } from 'lucide-react'; // Importing icons

const features = [
  {
    title: 'Audio Analysis',
    description: 'Advanced AI-powered analysis of respiratory sounds for accurate disease detection.',
    icon: Activity,
  },
  {
    title: 'Severity Estimator',
    description: 'Intelligent assessment of condition severity based on multiple factors.',
    icon: Thermometer,
  },
  {
    title: 'Personalized Insights',
    description: 'Tailored health recommendations and explanations using natural language processing.',
    icon: Brain,
  },
  {
    title: 'Early Warning System',
    description: 'Proactive alerts for potential respiratory issues before they become severe.',
    icon: AlertCircle,
  },
];

const FeatureCard: React.FC<{ title: string; description: string; icon: React.FC }> = ({ title, description, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center transition duration-500 hover:scale-105 hover:shadow-xl">
    <div className="flex justify-center items-center w-20 h-20 mb-4 rounded-full bg-blue-500 mx-auto">
      <Icon />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features: React.FC = () => (
  <section id="features" className="py-16 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
    <div className="container mx-auto px-6 md:px-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default Features;

// src/components/About.tsx

import React from 'react';

const About: React.FC = () => (
  <section id="about" className="py-16 bg-gray-50 text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">About Respiratory Care</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Our platform helps in early detection of respiratory diseases such as asthma, bronchitis, pneumonia, and COPD by analyzing respiratory sounds.
        Upload your lung sound and receive insights and recommendations powered by AI.
      </p>
    </div>
  </section>
);

export default About;

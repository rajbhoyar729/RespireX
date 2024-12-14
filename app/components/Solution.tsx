'use client'; // This line ensures that the component is treated as a client-side component.

import React from 'react';
import { ShieldCheck, ClipboardList, Info, ShieldAlert } from 'lucide-react'; // Importing icons

const items = [
  {
    title: 'Comprehensive Care Plans',
    description: 'Personalized care plans tailored to individual patient needs for effective treatment.',
    icon: ShieldCheck,
  },
  {
    title: 'Telemedicine Services',
    description: 'Remote consultations and check-ups, making healthcare accessible from home.',
    icon: ClipboardList,
  },
  {
    title: 'Advanced Monitoring Tools',
    description: 'Real-time monitoring of patient health metrics for timely interventions.',
    icon: Info,
  },
  {
    title: 'Emergency Response System',
    description: 'Rapid response protocols for immediate assistance in critical situations.',
    icon: ShieldAlert,
  },
  {
    title: 'Regular Health Checkups',
    description: 'Encouraging routine screenings and health assessments for early detection.',
    icon: ShieldCheck,
  },
  {
    title: 'Vaccination Awareness',
    description: 'Promoting vaccination to prevent respiratory diseases and other illnesses.',
    icon: ClipboardList,
  },
  {
    title: 'Health Education Programs',
    description: 'Providing resources and workshops to educate the community on health topics.',
    icon: Info,
  },
  {
    title: 'Emergency Preparedness',
    description: 'Training and resources to prepare for health emergencies effectively.',
    icon: ShieldAlert,
  },
];

const Card: React.FC<{ title: string; description: string; icon: React.FC }> = ({ title, description, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg text-center transition duration-500 hover:scale-105 hover:shadow-xl">
    <div className="flex justify-center items-center w-20 h-20 mb-4 rounded-full bg-blue-500 mx-auto">
      <Icon />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Solution: React.FC = () => (
  <section className="py-16 bg-gradient-to-r from-green-100 via-green-200 to-green-300">
    <div className="container mx-auto px-6 md:px-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Solutions and Precautions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {items.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </div>
    </div>
  </section>
);

export default Solution;

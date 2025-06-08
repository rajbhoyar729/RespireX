"use client";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Thermometer, Brain, AlertCircle, TrendingUp, FlaskConical } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLanding } from '@/contexts/LandingContext';

gsap.registerPlugin(ScrollTrigger);

const features = [
	{
		title: 'Intelligent AI Analysis',
		description: 'Our advanced AI algorithms meticulously analyze respiratory sounds, providing highly accurate insights for early disease detection and proactive health management.',
		icon: Brain,
	},
	{
		title: 'Continuous Real-time Monitoring',
		description: 'Experience peace of mind with continuous monitoring of your respiratory health, offering instant data and alerts to keep you informed and safe.',
		icon: Thermometer,
	},
	{
		title: 'Personalized Health Insights',
		description: 'Receive tailored recommendations and detailed health reports, empowering you with actionable insights based on your unique respiratory patterns and data.',
		icon: Activity,
	},
	{
		title: 'Proactive Early Warning System',
		description: 'Our system intelligently identifies subtle changes in your respiratory health, alerting you to potential issues before they become critical, ensuring timely intervention.',
		icon: AlertCircle,
	},
];

interface FeatureCardProps {
	title: string;
	description: string;
	icon: React.ElementType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => {
	return (
		<div 
			className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center transition duration-300 hover:shadow-xl transform hover:scale-105"
		>
			<div className="flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-blue-100 mx-auto">
				<Icon className="w-8 h-8 text-blue-500" />
			</div>
			<h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
			<p className="text-gray-200">{description}</p>
		</div>
	);
};

const Features = () => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const cardsContainerRef = useRef<HTMLDivElement>(null);
	const { activeSection, registerSection } = useLanding();

	useEffect(() => {
		if (sectionRef.current) {
			registerSection('features', sectionRef);
		}
	}, [registerSection]);

	useEffect(() => {
		const section = sectionRef.current;
		const title = titleRef.current;
		const subtitle = subtitleRef.current;
		const cards = gsap.utils.toArray(cardsContainerRef.current?.children || []);

		if (!section || !title || !subtitle || cards.length === 0) return;

		// Initial state for all elements to be hidden
		gsap.set([title, subtitle], { opacity: 0, y: 50 });
		gsap.set(cards, { opacity: 0, y: 100 });

		// Animation for title and subtitle
		ScrollTrigger.create({
			trigger: section,
			start: 'top bottom',
			end: 'bottom top',
			scrub: 1,
			markers: true,
			animation: gsap.fromTo([title, subtitle], 
				{ opacity: 0, y: 50 }, 
				{ opacity: 1, y: 0, ease: 'power3.out' }
			),
		});

		// Animation for feature cards
		ScrollTrigger.create({
			trigger: section,
			start: 'top bottom-=100',
			end: 'bottom top+=100',
			scrub: 1,
			markers: true,
			animation: gsap.fromTo(cards, 
				{ opacity: 0, y: 100 }, 
				{ opacity: 1, y: 0, ease: 'power3.out', stagger: 0.2, delay: 0.3 }
			),
		});

		return () => {
			ScrollTrigger.getAll().forEach(trigger => {
				if (trigger.vars.trigger === section) {
					trigger.kill();
				}
			});
			// Reset elements to their original state to prevent flashes on re-render
			gsap.set([title, subtitle, ...cards], { clearProps: 'all' });
		};
	}, []);

	return (
		<section 
			ref={sectionRef} 
			id="features" 
			className={`py-32 relative overflow-hidden ${activeSection === 'features' ? 'active' : ''}`}
		>
			<div className="container mx-auto px-4">
				<h2 
					ref={titleRef} 
					className="text-4xl font-bold text-center mb-4 text-white relative z-20"
					style={{
						textShadow: '0 2px 4px rgba(0,0,0,0.3)',
						WebkitTextStroke: '1px rgba(255,255,255,0.1)'
					}}
				>
					Powerful Features Designed For You
				</h2>
				<p 
					ref={subtitleRef} 
					className="text-lg text-gray-300 text-center mb-20 max-w-3xl mx-auto relative z-20"
				>
					Discover how RespireX leverages cutting-edge technology to provide unparalleled respiratory health insights and proactive care.
				</p>
				<div 
					ref={cardsContainerRef} 
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
				>
					{features.map((feature, index) => (
						<FeatureCard key={index} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;


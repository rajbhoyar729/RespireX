"use client";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Thermometer, Brain, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const features = [
	{
		title: 'AI-Powered Analysis',
		description: 'Advanced algorithms analyze respiratory sounds for accurate disease detection.',
		icon: Activity,
	},
	{
		title: 'Real-time Monitoring',
		description: 'Continuous assessment of respiratory health with instant feedback.',
		icon: Thermometer,
	},
	{
		title: 'Personalized Insights',
		description: 'Tailored health recommendations based on individual data.',
		icon: Brain,
	},
	{
		title: 'Early Warning System',
		description: 'Proactive alerts for potential respiratory issues.',
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
		<div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center transition duration-300 hover:shadow-xl transform hover:scale-105">
			<div className="flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-blue-100 mx-auto">
				<Icon className="w-8 h-8 text-blue-500" />
			</div>
			<h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
			<p className="text-gray-200">{description}</p>
		</div>
	);
};

interface FeaturesProps {
	isActive: boolean;
}

const Features: React.FC<FeaturesProps> = ({ isActive }) => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const cardsContainerRef = useRef<HTMLDivElement>(null);

	useScrollAnimation({
		sectionRef,
		animatedRefs: [titleRef],
		start: 'top 75%',
		end: 'bottom 25%',
		stagger: 0.3,
	});

	useEffect(() => {
		const section = sectionRef.current;
		const cardsContainer = cardsContainerRef.current;
		const title = titleRef.current;

		if (!section || !cardsContainer || !title) return;

		// Set initial state for title
		gsap.set(title, {
			autoAlpha: 0,
			y: 50
		});

		// Animate title
		gsap.to(title, {
			autoAlpha: 1,
			y: 0,
			duration: 1.2,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				end: 'top 50%',
				scrub: 0.5,
				markers: false,
			}
		});

		const cards = gsap.utils.toArray(cardsContainer.children);

		// Initial state with better positioning
		gsap.set(cards, { 
			autoAlpha: 0, 
			y: 100,
			scale: 0.9,
			rotation: 5
		});

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top 75%',
				end: 'bottom 25%',
				scrub: 0.5,
				markers: false,
				anticipatePin: 1,
				fastScrollEnd: true,
				preventOverlaps: true,
				onEnter: () => {
					gsap.to(cards, {
						autoAlpha: 1,
						y: 0,
						scale: 1,
						rotation: 0,
						ease: 'power3.out',
						duration: 1.5,
						stagger: {
							amount: 1.2,
							from: 'start',
							ease: 'power2.inOut'
						},
					});
				},
				onLeaveBack: () => {
					gsap.to(cards, {
						autoAlpha: 0,
						y: -50,
						scale: 0.9,
						rotation: -5,
						ease: 'power3.in',
						duration: 1.2,
						stagger: {
							amount: 0.8,
							from: 'end',
							ease: 'power2.inOut'
						},
					});
				},
				onUpdate: (self) => {
					// Smoother parallax effect
					cards.forEach((card: any, index) => {
						const speed = 1 + (index * 0.15);
						gsap.to(card, {
							y: self.progress * 40 * speed,
							rotation: self.progress * 2 * speed,
							duration: 0.1,
							ease: 'power1.out'
						});
					});
				}
			},
		});

		return () => {
			tl.kill();
			ScrollTrigger.getAll().forEach(trigger => {
				if (trigger.vars.trigger === section) {
					trigger.kill();
				}
			});
			// Reset all cards to initial state
			gsap.set(cards, { 
				autoAlpha: 1, 
				y: 0,
				scale: 1,
				rotation: 0
			});
			// Reset title state
			gsap.set(title, {
				autoAlpha: 1,
				y: 0
			});
		};
	}, []);

	return (
		<section 
			ref={sectionRef} 
			id="features" 
			className={`py-32 relative overflow-hidden ${isActive ? 'active' : ''}`}
			data-scroll
			data-scroll-speed="0.5"
			data-scroll-delay="0.1"
		>
			<div className="container mx-auto px-4">
				<h2 
					ref={titleRef} 
					className="text-4xl font-bold text-center mb-20 text-white relative z-20"
					style={{
						textShadow: '0 2px 4px rgba(0,0,0,0.3)',
						WebkitTextStroke: '1px rgba(255,255,255,0.1)'
					}}
				>
					Our Features
				</h2>
				<div 
					ref={cardsContainerRef} 
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
				>
					{features.map((feature) => (
						<FeatureCard key={feature.title} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;


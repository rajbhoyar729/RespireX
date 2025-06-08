"use client";

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, ClipboardList, Info, ShieldAlert } from 'lucide-react';
import { useLanding } from '@/contexts/LandingContext';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
	{
		title: 'Comprehensive Care Plans',
		description: 'Personalized treatment strategies for optimal respiratory health.',
		icon: ShieldCheck,
	},
	{
		title: 'Telemedicine Integration',
		description: 'Connect with healthcare providers remotely for continuous care.',
		icon: ClipboardList,
	},
	{
		title: 'Health Education Resources',
		description: 'Access to a wealth of information on respiratory health management.',
		icon: Info,
	},
	{
		title: 'Emergency Response Protocol',
		description: 'Quick action plans for sudden respiratory distress situations.',
		icon: ShieldAlert,
	},
];

interface SolutionCardProps {
	title: string;
	description: string;
	icon: React.ElementType;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ title, description, icon: Icon }) => {
	return (
		<div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center transition duration-300 hover:shadow-xl transform hover:scale-105">
			<div className="flex justify-center items-center w-16 h-16 mb-4 rounded-full bg-green-100 mx-auto">
				<Icon className="w-8 h-8 text-green-500" />
			</div>
			<h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
			<p className="text-gray-200">{description}</p>
		</div>
	);
};

const Solution = () => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const cardsContainerRef = useRef<HTMLDivElement>(null);
	const { activeSection, registerSection } = useLanding();
	const memoizedSolutions = useMemo(() => solutions, []);

	useEffect(() => {
		if (sectionRef.current) {
			registerSection('solution', sectionRef);
		}
	}, [registerSection]);

	useEffect(() => {
		const section = sectionRef.current;
		const cardsContainer = cardsContainerRef.current;
		const title = titleRef.current;

		if (!section || !cardsContainer || !title) return;

		// Set initial state for title with higher z-index
		gsap.set(title, {
			autoAlpha: 0,
			y: 50,
			zIndex: 50
		});

		// Animate title with higher z-index
		gsap.to(title, {
			autoAlpha: 1,
			y: 0,
			duration: 1,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				end: 'top 60%',
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
				start: 'top 80%',
				end: 'bottom 20%',
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
						duration: 1.2,
						stagger: {
							amount: 0.8,
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
						duration: 1,
						stagger: {
							amount: 0.5,
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
							y: self.progress * 30 * speed,
							rotation: self.progress * 1.5 * speed,
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
				y: 0,
				zIndex: 50
			});
		};
	}, []);

	return (
		<section 
			ref={sectionRef} 
			id="solution" 
			className={`pt-32 pb-12 relative overflow-hidden ${activeSection === 'solution' ? 'active' : ''}`}
			data-scroll
			data-scroll-speed="0.5"
			data-scroll-delay="0.1"
		>
			<div className="container mx-auto px-4">
				<h2 
					ref={titleRef} 
					className="text-4xl font-bold text-center mb-16 text-white relative z-50"
					style={{
						textShadow: '0 2px 4px rgba(0,0,0,0.5)',
						WebkitTextStroke: '1px rgba(255,255,255,0.2)',
						position: 'relative',
						isolation: 'isolate'
					}}
				>
					Our Solutions
				</h2>
				<div 
					ref={cardsContainerRef} 
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
				>
					{memoizedSolutions.map((solution) => (
						<SolutionCard key={solution.title} {...solution} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Solution;


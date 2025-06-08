"use client";

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, ClipboardList, Info, ShieldAlert, HeartPulse, Stethoscope } from 'lucide-react';
import { useLanding } from '@/contexts/LandingContext';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
	{
		title: 'Holistic Care Plans',
		description: 'Beyond monitoring, we offer comprehensive care plans tailored to your unique needs, guiding you towards sustained respiratory health and well-being.',
		icon: ShieldCheck,
	},
	{
		title: 'Seamless Telemedicine Integration',
		description: 'Easily connect with qualified healthcare professionals through our integrated telemedicine platform, ensuring convenient and continuous medical guidance from anywhere.',
		icon: Stethoscope,
	},
	{
		title: 'Empowering Health Education',
		description: 'Gain access to a rich library of educational resources and expert articles, empowering you with the knowledge to actively manage and improve your respiratory health.',
		icon: Info,
	},
	{
		title: 'Rapid Emergency Response',
		description: 'In critical moments, our system provides a clear, actionable emergency response protocol, ensuring you and your loved ones are prepared for sudden respiratory distress situations.',
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
	const subtitleRef = useRef<HTMLParagraphElement>(null);
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
		const subtitle = subtitleRef.current;

		if (!section || !cardsContainer || !title || !subtitle) return;

		// Set initial state for title and subtitle with higher z-index
		gsap.set([title, subtitle], {
			autoAlpha: 0,
			y: 50,
			zIndex: 50
		});

		// Animate title and subtitle with higher z-index
		gsap.to([title, subtitle], {
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
			// Reset title and subtitle state
			gsap.set([title, subtitle], {
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
					className="text-4xl font-bold text-center mb-4 text-white relative z-50"
					style={{
						textShadow: '0 2px 4px rgba(0,0,0,0.5)',
						WebkitTextStroke: '1px rgba(255,255,255,0.2)',
						position: 'relative',
						isolation: 'isolate'
					}}
				>
					Our Comprehensive Solutions
				</h2>
				<p 
					ref={subtitleRef} 
					className="text-lg text-gray-300 text-center mb-16 max-w-3xl mx-auto relative z-20"
				>
					RespireX offers a suite of integrated solutions designed to support your respiratory health journey from assessment to ongoing care and emergency preparedness.
				</p>
				<div 
					ref={cardsContainerRef} 
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
				>
					{memoizedSolutions.map((solution, index) => (
						<SolutionCard key={index} {...solution} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Solution;


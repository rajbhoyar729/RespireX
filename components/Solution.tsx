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
			start: 'top 80%',
			end: 'top 20%',
			scrub: false,
			markers: false,
			animation: gsap.fromTo([title, subtitle], 
				{ opacity: 0, y: 50 }, 
				{ opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
			),
		});

		// Animation for solution cards
		ScrollTrigger.create({
			trigger: section,
			start: 'top 70%',
			end: 'top 30%',
			scrub: false,
			markers: false,
			animation: gsap.fromTo(cards, 
				{ opacity: 0, y: 100 }, 
				{ opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }
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
			id="solution" 
			className={`pt-32 pb-12 relative overflow-hidden ${activeSection === 'solution' ? 'active' : ''}`}
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


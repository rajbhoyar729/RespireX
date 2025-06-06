import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  sectionRef: RefObject<HTMLElement>;
  animatedRefs: RefObject<HTMLElement>[];
  start?: string;
  end?: string;
  stagger?: number;
}

const useScrollAnimation = ({
  sectionRef,
  animatedRefs,
  start = 'top center',
  end = '+=300',
  stagger = 0,
}: UseScrollAnimationOptions) => {
  useEffect(() => {
    const section = sectionRef.current;
    const elementsToAnimate = animatedRefs.map(ref => ref.current).filter(Boolean) as HTMLElement[];

    if (!section || elementsToAnimate.length === 0) return;

    gsap.set(elementsToAnimate, { autoAlpha: 0, y: 50 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: start,
        end: end,
        scrub: 1,
        markers: false,
      },
    });

    tl.to(elementsToAnimate, {
      autoAlpha: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.8,
      stagger: stagger,
    });
    
    return () => {
      tl.kill();
    };
  }, [sectionRef, animatedRefs, start, end, stagger]);
};

export default useScrollAnimation; 
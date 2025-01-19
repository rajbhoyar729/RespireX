declare module 'react-locomotive-scroll' {
  import { ReactNode, RefObject } from 'react';

  interface LocomotiveScrollProviderProps {
    options: Record<string, any>;
    containerRef: RefObject<HTMLElement>;
    watch?: any[];
    children: ReactNode;
  }

  export const LocomotiveScrollProvider: React.FC<LocomotiveScrollProviderProps>;
}

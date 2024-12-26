import { Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'
declare module '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>
      bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>
    }
  }
}


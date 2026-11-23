import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { createIridescentCoreMaterial } from '../shaders/iridescentCoreNode';

interface ReactiveCoreMeshProps {
  frequency: number;
  amplitude: number;
  glowColor: string;
}

export function ReactiveCoreMesh({ frequency, amplitude, glowColor }: ReactiveCoreMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPointer = useRef(new THREE.Vector3(0, 0, 0));

  const { material, uniforms } = useMemo(
    () => createIridescentCoreMaterial(glowColor),
    []
  );

  useEffect(() => {
    uniforms.uFrequency.value = frequency;
    uniforms.uAmplitude.value = amplitude;
    uniforms.uGlowColor.value.set(glowColor);
  }, [frequency, amplitude, glowColor, uniforms]);

  // Explicit GPU resource cleanup on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.28;
    meshRef.current.rotation.x += delta * 0.12;
    uniforms.uPointer.value.lerp(targetPointer.current, Math.min(1, delta * 8));
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!meshRef.current) return;
    const localPoint = meshRef.current.worldToLocal(e.point.clone());
    targetPointer.current.copy(localPoint);
  };

  const handlePointerLeave = () => {
    targetPointer.current.set(0, 0, 0);
  };

  return (
    <mesh
      ref={meshRef}
      material={material}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <icosahedronGeometry args={[1.35, 64]} />
    </mesh>
  );
}

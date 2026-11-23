import * as THREE from 'three';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import {
  color,
  dot,
  mix,
  normalLocal,
  normalView,
  positionLocal,
  positionViewDirection,
  pow,
  sin,
  time,
  uniform,
  vec3,
} from 'three/tsl';

export interface CoreShaderUniforms {
  uFrequency: ReturnType<typeof uniform<number>>;
  uAmplitude: ReturnType<typeof uniform<number>>;
  uPointer: ReturnType<typeof uniform<THREE.Vector3>>;
  uGlowColor: ReturnType<typeof uniform<THREE.Color>>;
}

/**
 * Builds a node-based MeshStandardNodeMaterial using Three.js Shading Language (TSL).
 * Compiles automatically to WGSL (WebGPU) or GLSL (WebGL 2) with zero raw shader strings.
 */
export function createIridescentCoreMaterial(initialGlowHex = '#38bdf8'): {
  material: MeshStandardNodeMaterial;
  uniforms: CoreShaderUniforms;
} {
  const uFrequency = uniform(2.4);
  const uAmplitude = uniform(0.18);
  const uPointer = uniform(new THREE.Vector3(0, 0, 0));
  const uGlowColor = uniform(new THREE.Color(initialGlowHex));

  // Procedural harmonic displacement along local surface normals
  const waveX = sin(positionLocal.x.mul(uFrequency).add(time.mul(1.8)));
  const waveY = sin(positionLocal.y.mul(uFrequency).add(time.mul(1.4)));
  const waveZ = sin(positionLocal.z.mul(uFrequency).add(time.mul(2.1)));
  const harmonic = waveX.add(waveY).add(waveZ).div(3);

  // Pointer proximity ripple in object space
  const distToPointer = positionLocal.distance(uPointer);
  const pointerRipple = sin(distToPointer.mul(5.0).sub(time.mul(4.0)))
    .mul(0.08)
    .div(distToPointer.add(0.4));

  const displacedPosition = positionLocal.add(
    normalLocal.mul(harmonic.mul(uAmplitude).add(pointerRipple))
  );

  // View-space Fresnel rim glow
  const fresnel = pow(
    dot(normalView, positionViewDirection).clamp(0, 1).oneMinus(),
    2.6
  );

  const baseDark = color('#0b1224');
  const iridescentShift = vec3(
    sin(time.add(positionLocal.x.mul(2.0))).mul(0.25).add(0.75),
    sin(time.mul(0.8).add(positionLocal.y.mul(2.0))).mul(0.25).add(0.75),
    1.0
  );

  const material = new MeshStandardNodeMaterial({
    roughness: 0.22,
    metalness: 0.78,
  });

  material.positionNode = displacedPosition;
  material.colorNode = mix(baseDark, uGlowColor.mul(iridescentShift), fresnel.mul(0.65));
  material.emissiveNode = uGlowColor.mul(fresnel.mul(1.85));

  return {
    material,
    uniforms: { uFrequency, uAmplitude, uPointer, uGlowColor },
  };
}

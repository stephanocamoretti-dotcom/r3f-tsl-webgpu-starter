import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { WebGPURenderer } from 'three/webgpu';
import { ReactiveCoreMesh } from './ReactiveCoreMesh';

export type RenderBackend = 'initializing' | 'webgpu' | 'webgl2';

interface SceneCanvasProps {
  frequency: number;
  amplitude: number;
  glowColor: string;
  onBackendDetected: (backend: RenderBackend) => void;
}

export function SceneCanvas({
  frequency,
  amplitude,
  glowColor,
  onBackendDetected,
}: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={async (props) => {
        const renderer = new WebGPURenderer({
          canvas: props.canvas as HTMLCanvasElement,
          antialias: true,
          powerPreference: 'high-performance',
        });
        await renderer.init();
        const isWebGPU = (renderer.backend as { isWebGPUBackend?: boolean })?.isWebGPUBackend;
        onBackendDetected(isWebGPU ? 'webgpu' : 'webgl2');
        return renderer;
      }}
    >
      <color attach="background" args={['#050811']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} color="#e0f2fe" />
      <pointLight position={[-4, -3, -2]} intensity={1.6} color={glowColor} />

      <ReactiveCoreMesh
        frequency={frequency}
        amplitude={amplitude}
        glowColor={glowColor}
      />

      <OrbitControls enableDamping dampingFactor={0.06} minDistance={2.4} maxDistance={7} />
    </Canvas>
  );
}

import { useState } from 'react';
import { Cpu, Sliders, Sparkles } from 'lucide-react';
import { SceneCanvas, type RenderBackend } from './components/SceneCanvas';

const PRESET_COLORS = [
  { label: 'Cyan', hex: '#38bdf8' },
  { label: 'Indigo', hex: '#818cf8' },
  { label: 'Emerald', hex: '#34d399' },
  { label: 'Rose', hex: '#fb7185' },
];

export function App() {
  const [frequency, setFrequency] = useState(2.4);
  const [amplitude, setAmplitude] = useState(0.18);
  const [glowColor, setGlowColor] = useState('#38bdf8');
  const [backend, setBackend] = useState<RenderBackend>('initializing');

  return (
    <div style={{ position: 'relative', height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <SceneCanvas
        frequency={frequency}
        amplitude={amplitude}
        glowColor={glowColor}
        onBackendDetected={setBackend}
      />

      <header
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <Sparkles size={16} color={glowColor} />
          <strong style={{ fontSize: 14 }}>R3F v9 · TSL Node Shader</strong>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <Cpu size={14} color={backend === 'webgpu' ? '#34d399' : '#38bdf8'} />
          <span>Backend: {backend.toUpperCase()}</span>
        </div>
      </header>

      <aside
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 280,
          padding: 16,
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
          <Sliders size={14} color={glowColor} />
          <span>TSL Uniform Controls</span>
        </div>

        <label style={{ fontSize: 12, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Harmonic Frequency ({frequency.toFixed(1)})</span>
          <input
            type="range"
            min={0.5}
            max={6.0}
            step={0.1}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
        </label>

        <label style={{ fontSize: 12, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>Displacement Amplitude ({amplitude.toFixed(2)})</span>
          <input
            type="range"
            min={0}
            max={0.45}
            step={0.01}
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
          />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => setGlowColor(preset.hex)}
              title={preset.label}
              style={{
                flex: 1,
                height: 26,
                borderRadius: 8,
                border: glowColor === preset.hex ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                background: preset.hex,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}

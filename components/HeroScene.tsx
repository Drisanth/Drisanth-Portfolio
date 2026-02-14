import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particlesCount = 8000; // Double the count at 120fps!

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const randoms = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const r = (Math.random() - 0.5) * 25; // Wider spread
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      randoms[i * 3] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();
    }
    return { positions, randoms };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uColor: { value: new THREE.Color("#00f3ff") }
  }), []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;

      // Optimized mouse tracking
      const { pointer, viewport } = state;
      const x = (pointer.x * viewport.width) / 2;
      const y = (pointer.y * viewport.height) / 2;

      // Smooth lerp for mouse uniform to reduce jitter
      materialRef.current.uniforms.uMouse.value.x += (x - materialRef.current.uniforms.uMouse.value.x) * 0.1;
      materialRef.current.uniforms.uMouse.value.y += (y - materialRef.current.uniforms.uMouse.value.y) * 0.1;
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform vec3 uMouse;
    attribute vec3 aRandom;
    
    varying float vDistance;
    varying vec3 vRandom;

    void main() {
      vRandom = aRandom;
      vec3 pos = position;
      
      // Natural orbit rotation
      float angle = uTime * 0.05 * (0.5 + aRandom.x);
      float s = sin(angle);
      float c = cos(angle);
      
      // Rotate around Y axis
      float x = pos.x * c - pos.z * s;
      float z = pos.x * s + pos.z * c;
      pos.x = x;
      pos.z = z;

      // Mouse interaction (Gravity/Repulsion)
      float dx = pos.x - uMouse.x;
      float dy = pos.y - uMouse.y;
      float dist = sqrt(dx*dx + dy*dy);
      
      float radius = 5.0; // Larger interaction radius
      float force = max(0.0, radius - dist);
      
      if (force > 0.0) {
          vec2 dir = normalize(vec2(dx, dy));
          pos.x += dir.x * force * 1.5;
          pos.y += dir.y * force * 1.5;
          pos.z -= force * 0.8;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      // Increased size: Base 60.0, min 20.0
      gl_PointSize = (60.0 * aRandom.x + 20.0) * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      
      vDistance = force; 
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    varying float vDistance;
    varying vec3 vRandom;

    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;

      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 1.5);

      vec3 finalColor = uColor;
      
      // Color Variation: Mix with white/purple based on random factor
      // This creates a "sparkle" effect
      finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), vRandom.y * 0.3); // 30% white mix
      finalColor = mix(finalColor, vec3(0.5, 0.0, 1.0), vRandom.z * 0.2); // 20% purple mix

      // Interaction Color (Red shift on gravity)
      finalColor += vec3(1.0, 0.2, 0.5) * vDistance * 0.6;

      gl_FragColor = vec4(finalColor, glow);
    }
  `;

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length / 3}
          array={randoms}
          itemSize={3}
        />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
        />
      </Points>
    </group>
  );
};

const HeroScene: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate system boot sequence
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 1000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50 pointer-events-none transition-opacity duration-1000" style={{ opacity: progress === 100 ? 0 : 1 }}>
          <div className="font-mono text-cyan-500 flex flex-col items-center gap-4">
            <div className="text-sm tracking-widest">SYSTEM_INITIALIZATION_SEQUENCE</div>
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between w-64 text-[10px] text-cyan-500/50">
              <span>CORE_KERNEL</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <ParticleField />
        </Float>
      </Canvas>
    </div>
  );
};

export default HeroScene;
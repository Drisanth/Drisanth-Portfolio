import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  
  const particlesCount = 2000;
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const r = (Math.random() - 0.5) * 15;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

interface HeroSceneProps {
    mouseX: number;
    mouseY: number;
}

const HeroScene: React.FC<HeroSceneProps> = ({ mouseX, mouseY }) => {
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
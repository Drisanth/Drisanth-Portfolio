import React, { useRef, useState, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

const StarField = (props: any) => {
    const ref = useRef<any>();

    // Generate 5000 stars
    const [sphere] = useState(() => {
        const coords = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            // Random point in sphere volume
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = Math.pow(Math.random(), 1 / 3) * 10; // Radius up to 10

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            coords[i * 3] = x;
            coords[i * 3 + 1] = y;
            coords[i * 3 + 2] = z;
        }
        return coords;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};

const StarFieldCanvas = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <StarField />
            </Canvas>
        </div>
    );
};

export default StarFieldCanvas;

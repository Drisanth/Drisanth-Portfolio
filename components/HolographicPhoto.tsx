import React from 'react';
import { motion } from 'framer-motion';

interface HolographicPhotoProps {
    src: string;
    alt: string;
    size?: number;
}

export default function HolographicPhoto({ src, alt, size = 300 }: HolographicPhotoProps) {
    return (
        <div className="relative group cursor-crosshair" style={{ width: size, height: size }}>
            {/* Rotating Ring Back */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-20%] rounded-full border border-dashed border-cyan-500/20 pointer-events-none"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-10%] rounded-full border border-dotted border-purple-500/20 pointer-events-none"
            />

            {/* Main Image Container */}
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-cyan-500/30 bg-black/50 backdrop-blur-sm group-hover:border-cyan-400 transition-colors">
                {/* Placeholder/Image */}
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cyan-900/10 text-cyan-500/50 font-mono text-xs">
                        NO_IMAGE_DATA
                    </div>
                )}

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-50"></div>

                {/* Scanning Light */}
                <motion.div
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_20px_#00f3ff] z-20 pointer-events-none"
                />

                {/* Glitch Overlay on Hover */}
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity z-30"></div>

                {/* Corner Decorators */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-30"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-30"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-30"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-30"></div>
            </div>

            {/* Label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-cyan-500 font-mono text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                IDENTITY_VERIFIED
            </div>
        </div>
    );
}

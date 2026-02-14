import React from 'react';
import { motion } from 'framer-motion';

const HologramOverlay = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {/* Holographic Gradient Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-purple-500/10 mix-blend-overlay" />



            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-color-dodge"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Corner Brackets - Animated */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500 transition-all duration-300 group-hover:w-8 group-hover:h-8" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500 transition-all duration-300 group-hover:w-8 group-hover:h-8" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500 transition-all duration-300 group-hover:w-8 group-hover:h-8" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500 transition-all duration-300 group-hover:w-8 group-hover:h-8" />

            {/* Glitch Overlay (Static Noise) - Removed pulse */}
            <div className="absolute inset-0 opacity-10 bg-repeat bg-[length:200px_200px] mix-blend-screen pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
        </div>
    );
};

export default HologramOverlay;

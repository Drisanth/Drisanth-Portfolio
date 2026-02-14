import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function SystemBoot({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);

    const BOOT_SEQUENCE = [
        "INITIALIZING KERNEL...",
        "LOADING MEMORY MODULES... [OK]",
        "MOUNTING FILE SYSTEMS... [OK]",
        "CONNECTING TO NEURAL NET... [SECURE]",
        "DECRYPTING USER PROFILE...",
        "LOADING GRAPHICS ENGINE (VULKAN)...",
        "OPTIMIZING SHADERS...",
        "SYSTEM CHECK: 100% INTEGRITY",
        "ACCESS GRANTED."
    ];

    useEffect(() => {
        let delay = 0;
        BOOT_SEQUENCE.forEach((line, index) => {
            delay += Math.random() * 300 + 100;
            setTimeout(() => {
                setLines(prev => [...prev, line]);
                if (index === BOOT_SEQUENCE.length - 1) {
                    setTimeout(onComplete, 800);
                }
            }, delay);
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-black text-green-500 font-mono p-10 flex flex-col justify-end pb-20 overflow-hidden">
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

            <div className="flex items-center gap-2 mb-4 text-white opacity-50">
                <Terminal size={16} /> BIOS V.2.0.4.5
            </div>

            <div className="space-y-1">
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm md:text-base"
                    >
                        <span className="text-gray-500 mr-2">{`[${new Date().toLocaleTimeString().split(' ')[0]}]`}</span>
                        {line}
                    </motion.div>
                ))}
            </div>

            <motion.div
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-3 h-5 bg-green-500 mt-2"
            />
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Activity, Database, Wifi } from 'lucide-react';

interface HudStats {
    cpu: number;
    mem: number;
    net: number;
    fps: number;
}
const HUD = () => {
    const { scrollY, scrollYProgress } = useScroll();
    const [stats, setStats] = useState<HudStats>({ cpu: 10, mem: 2.4, net: 12, fps: 60 });
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const posRef = useRef<HTMLDivElement>(null);

    // Independent Stats Update
    useEffect(() => {
        const interval = setInterval(() => {
            setStats({
                cpu: Math.floor(Math.random() * 30) + 10,
                mem: parseFloat((Math.random() * 2 + 2).toFixed(1)),
                net: Math.floor(Math.random() * 20) + 10,
                fps: Math.floor(Math.random() * 10) + 55
            });
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    // System Diagnostics Data
    const [packets, setPackets] = useState<number[]>(new Array(15).fill(10));

    useEffect(() => {
        const interval = setInterval(() => {
            // Optimized update: Use functional state update with slice/concat in one go
            // This is efficient enough for 15 items, but 'prev' access is key
            setPackets(prev => {
                const nextVal = Math.floor(Math.random() * 50) + 10;
                return [...prev.slice(1), nextVal];
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    // Update POS text directly to avoid re-renders
    useMotionValueEvent(scrollY, "change", (latest) => {
        if (posRef.current) {
            posRef.current.innerText = `POS: ${latest.toFixed(0)}`;
        }
    });

    const scrollBarHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 font-mono text-[10px] md:text-xs text-cyan-500/60 uppercase select-none mix-blend-screen">
            {/* Top Left Stats */}
            <div className="absolute top-4 left-6 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Activity size={12} /> CPU: {stats.cpu}%
                </div>
                <div className="flex items-center gap-2">
                    <Database size={12} /> MEM: {stats.mem.toFixed(1)}GB
                </div>
                <div className="flex items-center gap-2">
                    <Wifi size={12} /> LAT: {stats.net}ms
                </div>
            </div>

            {/* Top Right: System Diagnostics & Time */}
            <div className="absolute top-4 right-20 flex flex-col items-end gap-2">
                <div>{time}</div>

                {/* System Analytics Widget */}
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-2">
                    <div className="flex items-end gap-0.5 h-6">
                        {packets.map((h, i) => (
                            <motion.div
                                key={i}
                                className="w-1 bg-cyan-500/50"
                                animate={{ height: `${h}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col text-[8px] text-cyan-400">
                        <span>SYS.ANALYTICS</span>
                        <span className="opacity-50">ACTIVE_MONITORING</span>
                    </div>
                </div>
            </div>

            {/* Bottom Left: Coordinates */}
            <div className="absolute bottom-4 left-6 border-l-2 border-cyan-500/30 pl-2">
                <div ref={posRef}>POS: 0</div>
                <div>SEC: MAIN_THREAD</div>
                <div className="mt-1 text-[8px] opacity-50">V.2.0.4.5</div>
            </div>

            {/* Right: Scroll Bar */}
            <div className="absolute top-1/2 right-6 -translate-y-1/2 h-48 w-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="w-full bg-cyan-500 box-shadow-[0_0_10px_#00f3ff]"
                    style={{ height: scrollBarHeight }}
                />
            </div>

            {/* Decorative Overlay Lines */}
            <div className="absolute top-20 left-6 w-32 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
            <div className="absolute bottom-20 right-6 w-32 h-[1px] bg-gradient-to-l from-cyan-500/50 to-transparent" />

            {/* Corner Brackets */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-cyan-500/30" />
            <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-cyan-500/30" />
            <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-cyan-500/30" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-cyan-500/30" />
        </div>
    );
};

export default HUD;

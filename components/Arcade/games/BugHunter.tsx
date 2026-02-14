import React, { useState, useEffect } from 'react';
import { Bug, Play, Trophy, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BugHunter() {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [bugs, setBugs] = useState<{ id: number, x: number, y: number }[]>([]);

    // Grid config
    const GRID_ROWS = 4;
    const GRID_COLS = 4;

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameState('playing');
        setBugs([]);
    };

    // Timer
    useEffect(() => {
        if (gameState !== 'playing') return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameState('gameover');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState]);

    // Spawner
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawnInterval = setInterval(() => {
            if (bugs.length < 5) { // Max 5 bugs at once
                const newBug = {
                    id: Math.random(),
                    x: Math.floor(Math.random() * GRID_COLS),
                    y: Math.floor(Math.random() * GRID_ROWS)
                };
                // Avoid overlap simple check
                setBugs(prev => [...prev.filter(b => b.x !== newBug.x || b.y !== newBug.y), newBug]);
            }
        }, 600); // Spawn every 600ms

        return () => clearInterval(spawnInterval);
    }, [gameState, bugs]);

    const handleSmash = (id: number) => {
        setScore(s => s + 10);
        setBugs(prev => prev.filter(b => b.id !== id));
        // Play sound?
    };

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center font-mono cursor-crosshair relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '25% 25%', opacity: 0.1 }}></div>

            {/* Header */}
            <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <div className="text-2xl font-bold text-red-400 flex items-center gap-2">
                    <Bug /> BUG HUNTER
                </div>
                <div className="flex gap-8">
                    <div className="text-xl text-yellow-400">SCORE: {score}</div>
                    <div className={`text-xl ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>TIME: {timeLeft}s</div>
                </div>
            </div>

            {gameState === 'start' && (
                <div className="z-30 text-center bg-black/80 p-10 rounded-xl border border-red-500/50 backdrop-blur-md">
                    <h1 className="text-5xl font-bold text-red-500 mb-4">BUG HUNTER</h1>
                    <p className="text-gray-300 mb-8">Smash the bugs before the system crashes.</p>
                    <button onClick={startGame} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                        <Play /> START DEBUGGING
                    </button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="z-30 text-center bg-black/90 p-12 rounded-xl border border-white/20 backdrop-blur-xl">
                    <h2 className="text-4xl font-bold text-white mb-2">DEBUGGING COMPLETE</h2>
                    <div className="text-gray-400 mb-6">Bugs squashed: {score / 10}</div>
                    <div className="text-3xl text-yellow-400 mb-8 font-bold">SCORE: {score}</div>
                    <button onClick={startGame} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-all">
                        PLAY AGAIN
                    </button>
                </div>
            )}

            {/* Game Board */}
            <div className="relative w-full max-w-2xl aspect-square grid grid-cols-4 grid-rows-4 gap-4 p-4 z-10">
                <AnimatePresence>
                    {bugs.map(bug => (
                        <motion.div
                            key={bug.id}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="relative flex items-center justify-center"
                            style={{
                                gridColumn: bug.x + 1,
                                gridRow: bug.y + 1
                            }}
                        >
                            <button
                                onClick={() => handleSmash(bug.id)}
                                className="w-20 h-20 bg-red-500/20 hover:bg-red-500/40 rounded-full border-2 border-red-500 flex items-center justify-center transition-all group active:scale-95"
                            >
                                <Bug className="w-10 h-10 text-red-500 group-hover:text-red-300 transition-colors" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

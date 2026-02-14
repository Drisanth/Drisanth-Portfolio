import React, { useState } from 'react';
import { X, Gamepad2, Play, Trophy, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberDefense from './games/CyberDefense';
import NeonSnake from './games/NeonSnake';
import BinaryPong from './games/BinaryPong';
import MemoryLeak from './games/MemoryLeak';
import BugHunter from './games/BugHunter';

interface ArcadeOverlayProps {
    onClose: () => void;
}

type GameType = 'cyber-defense' | 'neon-snake' | 'binary-pong' | 'memory-leak' | 'bug-hunter' | null;

const GAMES = [
    { id: 'cyber-defense', title: 'Cyber Defense', description: 'Defend the kernel from corrupted packets.', color: 'text-cyan-400', border: 'border-cyan-500' },
    { id: 'neon-snake', title: 'Neon Snake', description: 'Consume data blocks to grow your algorithm.', color: 'text-green-400', border: 'border-green-500' },
    { id: 'binary-pong', title: 'Binary Pong', description: 'Defeat the AI in a high-speed ping pong duel.', color: 'text-purple-400', border: 'border-purple-500' },
    { id: 'memory-leak', title: 'Memory Leak', description: 'Test your RAM. Repeat the sequence.', color: 'text-yellow-400', border: 'border-yellow-500' },
    { id: 'bug-hunter', title: 'Bug Hunter', description: 'Smash the glitches before they crash the system.', color: 'text-red-400', border: 'border-red-500' },
];

export default function ArcadeOverlay({ onClose }: ArcadeOverlayProps) {
    const [selectedGame, setSelectedGame] = useState<GameType>(null);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-mono overflow-hidden">
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] mix-blend-screen opacity-40"></div>

            {/* Header */}
            <div className="relative z-40 p-6 flex justify-between items-center bg-black/80 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Gamepad2 className="text-cyan-500 animate-pulse" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                        NEURAL_NEXUS // ARCADE
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-30 flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!selectedGame ? (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="h-full flex flex-col items-center justify-center p-8 overflow-y-auto"
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-white neon-text">
                                SELECT CARTRIDGE
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                                {GAMES.map((game) => (
                                    <button
                                        key={game.id}
                                        onClick={() => setSelectedGame(game.id as GameType)}
                                        className={`group relative p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] text-left overflow-hidden flex flex-col h-64 ${game.border} hover:border-opacity-100 border-opacity-30`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-black/80 z-0`}></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <h3 className={`text-2xl font-bold mb-2 ${game.color} group-hover:animate-pulse`}>{game.title}</h3>
                                            <p className="text-gray-400 text-sm mb-auto">{game.description}</p>
                                            <div className="mt-4 flex items-center gap-2 text-white/50 group-hover:text-white transition-colors uppercase text-xs tracking-widest">
                                                <Play size={14} /> Insert Coin
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="game"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full relative"
                        >
                            {/* Back Button */}
                            <button
                                onClick={() => setSelectedGame(null)}
                                className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-white/10 text-white rounded border border-white/20 backdrop-blur-md transition-colors font-mono text-sm"
                            >
                                <ArrowLeft size={16} /> EXIT GAME
                            </button>

                            {/* Game Components */}
                            {selectedGame === 'cyber-defense' && <CyberDefense />}
                            {selectedGame === 'neon-snake' && <NeonSnake />}
                            {selectedGame === 'binary-pong' && <BinaryPong />}
                            {selectedGame === 'memory-leak' && <MemoryLeak />}
                            {selectedGame === 'bug-hunter' && <BugHunter />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

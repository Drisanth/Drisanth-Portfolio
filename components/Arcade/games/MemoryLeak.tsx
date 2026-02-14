import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const COLORS = [
    { id: 0, color: 'bg-green-500', active: 'bg-green-300 shadow-[0_0_50px_#00ff00]', sound: 261.63 }, // C4
    { id: 1, color: 'bg-red-500', active: 'bg-red-300 shadow-[0_0_50px_#ff0000]', sound: 329.63 },    // E4
    { id: 2, color: 'bg-yellow-500', active: 'bg-yellow-300 shadow-[0_0_50px_#ffff00]', sound: 392.00 }, // G4
    { id: 3, color: 'bg-blue-500', active: 'bg-blue-300 shadow-[0_0_50px_#0000ff]', sound: 523.25 }     // C5
];

export default function MemoryLeak() {
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'input' | 'gameover'>('start');
    const [activeColor, setActiveColor] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const playTone = (freq: number) => {
        // Placeholder for Audio API if we wanted real sound, but visual is fine for now
    };

    const startGame = () => {
        setSequence([]);
        setUserSequence([]);
        setScore(0);
        setGameState('playing');
        addToSequence([]);
    };

    const addToSequence = (currentSeq: number[]) => {
        const nextColor = Math.floor(Math.random() * 4);
        const newSeq = [...currentSeq, nextColor];
        setSequence(newSeq);
        setGameState('playing');
        playSequence(newSeq);
    };

    const playSequence = async (seq: number[]) => {
        await new Promise(r => setTimeout(r, 800)); // Delay before start
        for (let i = 0; i < seq.length; i++) {
            setActiveColor(seq[i]);
            // playTone(COLORS[seq[i]].sound);
            await new Promise(r => setTimeout(r, 500));
            setActiveColor(null);
            await new Promise(r => setTimeout(r, 200));
        }
        setGameState('input');
        setUserSequence([]);
    };

    const handleColorClick = (id: number) => {
        if (gameState !== 'input') return;

        setActiveColor(id);
        setTimeout(() => setActiveColor(null), 200);

        const newUserSeq = [...userSequence, id];
        setUserSequence(newUserSeq);

        // Check Input
        const currentIndex = newUserSeq.length - 1;
        if (newUserSeq[currentIndex] !== sequence[currentIndex]) {
            setGameState('gameover');
            return;
        }

        if (newUserSeq.length === sequence.length) {
            setScore(s => s + 1);
            setGameState('playing');
            setTimeout(() => addToSequence(sequence), 1000);
        }
    };

    return (
        <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center font-mono relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#333_1px,_transparent_1px)] bg-[length:20px_20px]"></div>

            <h1 className="text-4xl text-yellow-400 font-bold mb-8 z-10 neon-text">MEMORY LEAK</h1>

            {gameState === 'start' && (
                <button onClick={startGame} className="z-10 px-12 py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xl rounded transition-all hover:scale-110 flex items-center gap-2">
                    <Play fill="currentColor" /> START TEST
                </button>
            )}

            {gameState === 'gameover' && (
                <div className="z-10 text-center bg-black/80 p-8 rounded-xl border border-red-500 mb-8">
                    <h2 className="text-red-500 text-3xl font-bold mb-2">SEGMENTATION FAULT</h2>
                    <p className="text-white text-xl mb-6">Score: {score}</p>
                    <button onClick={startGame} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-all">TRY AGAIN</button>
                </div>
            )}

            <div className={`grid grid-cols-2 gap-4 p-4 mt-8 ${gameState === 'start' ? 'opacity-50 pointer-events-none blur-sm' : ''}`}>
                {COLORS.map((btn) => (
                    <div
                        key={btn.id}
                        className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl cursor-pointer transition-all duration-100 border-4 border-black/20 ${activeColor === btn.id ? btn.active : btn.color} hover:brightness-110 active:scale-95`}
                        onClick={() => handleColorClick(btn.id)}
                    />
                ))}
            </div>

            {(gameState === 'playing' || gameState === 'input') && (
                <div className="mt-8 text-xl text-gray-500">
                    {gameState === 'playing' ? 'OBSERVE...' : 'REPEAT SEQUENCE'}
                </div>
            )}

            <div className="absolute top-6 right-6 text-2xl font-bold text-yellow-500">
                LEVEL: {score + 1}
            </div>
        </div>
    );
}

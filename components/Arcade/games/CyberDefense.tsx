import React, { useEffect, useRef, useState } from 'react';
import { Play, Skull, Trophy } from 'lucide-react';

export default function CyberDefense() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // Game Constants
    const ENEMY_SIZE = 20;

    useEffect(() => {
        if (!gameStarted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Game State
        let playerX = canvas.width / 2;
        let bullets: { x: number; y: number }[] = [];
        let enemies: { x: number; y: number; speed: number }[] = [];
        let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
        let animationId: number;
        let spawnRate = 60;
        let frames = 0;
        let isRunning = true;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            playerX = e.clientX - rect.left;
        };

        const handleClick = () => {
            bullets.push({ x: playerX, y: canvas.height - 60 });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleClick);

        const gameLoop = () => {
            if (!isRunning) return;
            frames++;

            // Clear Canvas
            ctx.fillStyle = 'rgba(0, 5, 10, 0.4)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid effect
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i += 50) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
            }
            for (let i = 0; i < canvas.height; i += 50) {
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
            }
            ctx.stroke();

            // Spawn Enemies
            if (frames % spawnRate === 0) {
                enemies.push({
                    x: Math.random() * (canvas.width - ENEMY_SIZE),
                    y: -ENEMY_SIZE,
                    speed: 2 + Math.random() * 2 + (frames / 2000) // Progressive difficulty
                });
                if (spawnRate > 20 && frames % 500 === 0) spawnRate -= 5;
            }

            // Update Player
            ctx.fillStyle = '#00f3ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f3ff';
            ctx.beginPath();
            ctx.moveTo(playerX, canvas.height - 40);
            ctx.lineTo(playerX - 15, canvas.height - 10);
            ctx.lineTo(playerX + 15, canvas.height - 10);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Update Bullets
            ctx.fillStyle = '#fff';
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].y -= 12;
                ctx.fillRect(bullets[i].x - 2, bullets[i].y, 4, 12);
                if (bullets[i].y < 0) bullets.splice(i, 1);
            }

            // Update Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.04;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillRect(p.x, p.y, 3, 3);
                ctx.globalAlpha = 1;
                if (p.life <= 0) particles.splice(i, 1);
            }

            // Update Enemies & Collisions
            ctx.fillStyle = '#ff0055';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff0055';

            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                enemy.y += enemy.speed;

                // Draw Glitchy Enemy
                const jitter = Math.random() * 2 - 1;
                ctx.fillRect(enemy.x + jitter, enemy.y, ENEMY_SIZE, ENEMY_SIZE);

                // Game Over Condition
                if (enemy.y > canvas.height) {
                    isRunning = false;
                    setGameOver(true);
                }

                // Bullet Collision
                for (let j = bullets.length - 1; j >= 0; j--) {
                    const b = bullets[j];
                    if (
                        b.x > enemy.x &&
                        b.x < enemy.x + ENEMY_SIZE &&
                        b.y > enemy.y &&
                        b.y < enemy.y + ENEMY_SIZE
                    ) {
                        // Explosion Particles
                        for (let k = 0; k < 6; k++) {
                            particles.push({
                                x: enemy.x + ENEMY_SIZE / 2,
                                y: enemy.y + ENEMY_SIZE / 2,
                                vx: (Math.random() - 0.5) * 8,
                                vy: (Math.random() - 0.5) * 8,
                                life: 1,
                                color: Math.random() > 0.5 ? '#ff0055' : '#fff'
                            });
                        }

                        enemies.splice(i, 1);
                        bullets.splice(j, 1);
                        setScore(s => s + 100);
                        break;
                    }
                }
            }
            ctx.shadowBlur = 0;

            if (isRunning) {
                animationId = requestAnimationFrame(gameLoop);
            }
        };

        animationId = requestAnimationFrame(gameLoop);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleClick);
            cancelAnimationFrame(animationId);
        };
    }, [gameStarted]);

    return (
        <div className="relative w-full h-full bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden">
            {/* UI Layer */}
            <div className="absolute top-4 right-6 text-2xl font-bold text-cyan-400 flex items-center gap-3 z-20 pointer-events-none">
                <Trophy className="w-6 h-6 text-yellow-400" />
                {score.toString().padStart(6, '0')}
            </div>

            {!gameStarted && !gameOver && (
                <div className="text-center space-y-8 z-30 animate-in fade-in zoom-in duration-300 bg-black/80 p-12 rounded-2xl border border-cyan-500/30 backdrop-blur-xl">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
                        CYBER DEFENSE
                    </h1>
                    <p className="text-gray-300 max-w-sm mx-auto leading-relaxed">
                        Move mouse to aim. Click to fire.<br />
                        Protect the system core from corruption.
                    </p>
                    <button
                        onClick={() => setGameStarted(true)}
                        className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded flex items-center gap-2 mx-auto transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                    >
                        <Play fill="currentColor" /> START MISSION
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="text-center space-y-6 z-30 bg-black/90 p-12 border border-red-500/50 rounded-xl backdrop-blur-xl">
                    <Skull className="w-20 h-20 text-red-500 mx-auto animate-bounce" />
                    <h2 className="text-5xl font-bold text-red-500 tracking-tighter">SYSTEM FAILURE</h2>
                    <div className="text-xl text-white">SCORE: <span className="text-cyan-400 font-mono text-2xl">{score}</span></div>
                    <button
                        onClick={() => {
                            setGameOver(false);
                            setScore(0);
                            setGameStarted(true);
                        }}
                        className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded uppercase tracking-widest font-bold transition-all"
                    >
                        Reboot System
                    </button>
                </div>
            )}

            <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair z-10" />
        </div>
    );
}

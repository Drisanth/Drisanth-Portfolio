import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function BinaryPong() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

    // Game Constants
    const PADDLE_HEIGHT = 80;
    const PADDLE_WIDTH = 12;
    const BALL_SIZE = 10;
    const WIN_SCORE = 5;

    // Refs for loop
    const ballRef = useRef({ x: 0, y: 0, vx: 5, vy: 5, speed: 6 });
    const paddleLRef = useRef(0); // Player (Left)
    const paddleRRef = useRef(0); // AI (Right)
    const playerYTargetRef = useRef(0);

    const startGame = () => {
        setPlayerScore(0);
        setAiScore(0);
        setGameState('playing');
        setWinner(null);
        resetBall();
    };

    const resetBall = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        ballRef.current = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() > 0.5 ? 1 : -1) * 6,
            vy: (Math.random() * 2 - 1) * 6,
            speed: 6
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            playerYTargetRef.current = e.clientY - rect.top - PADDLE_HEIGHT / 2;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (gameState !== 'playing') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 600;
            paddleLRef.current = canvas.height / 2 - PADDLE_HEIGHT / 2;
            paddleRRef.current = canvas.height / 2 - PADDLE_HEIGHT / 2;
            if (ballRef.current.x === 0) resetBall();
        };
        resize();
        window.addEventListener('resize', resize);

        let animationId: number;

        const loop = () => {
            // Clear
            ctx.fillStyle = '#1a0b2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Center Line
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.stroke();
            ctx.setLineDash([]);

            // Update Paddles
            // Player easing
            paddleLRef.current += (playerYTargetRef.current - paddleLRef.current) * 0.1;

            // AI Logic
            const aiTarget = ballRef.current.y - PADDLE_HEIGHT / 2;
            paddleRRef.current += (aiTarget - paddleRRef.current) * 0.08; // AI Speed

            // Clamp Paddles
            paddleLRef.current = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleLRef.current));
            paddleRRef.current = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleRRef.current));

            // Draw Paddles
            ctx.fillStyle = '#a855f7'; // Purple for P1
            ctx.fillRect(20, paddleLRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);

            ctx.fillStyle = '#ff0055'; // Red for AI
            ctx.fillRect(canvas.width - 20 - PADDLE_WIDTH, paddleRRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);

            // Update Ball
            const ball = ballRef.current;
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Wall Bounce (Top/Bottom)
            if (ball.y <= 0 || ball.y >= canvas.height - BALL_SIZE) {
                ball.vy *= -1;
            }

            // Paddle Collision
            // Left Paddle
            if (
                ball.x <= 20 + PADDLE_WIDTH &&
                ball.x >= 20 &&
                ball.y >= paddleLRef.current &&
                ball.y <= paddleLRef.current + PADDLE_HEIGHT
            ) {
                ball.vx = Math.abs(ball.vx) * 1.05; // Speed up
                ball.x = 20 + PADDLE_WIDTH + 1; // Unstick
                ball.speed *= 1.05;
            }

            // Right Paddle
            if (
                ball.x >= canvas.width - 20 - PADDLE_WIDTH - BALL_SIZE &&
                ball.x <= canvas.width - 20 &&
                ball.y >= paddleRRef.current &&
                ball.y <= paddleRRef.current + PADDLE_HEIGHT
            ) {
                ball.vx = -Math.abs(ball.vx) * 1.05;
                ball.x = canvas.width - 20 - PADDLE_WIDTH - BALL_SIZE - 1;
                ball.speed *= 1.05;
            }

            // Scoring
            if (ball.x < 0) {
                setAiScore(s => {
                    const newScore = s + 1;
                    if (newScore >= WIN_SCORE) {
                        setWinner('ai');
                        setGameState('gameover');
                    }
                    return newScore;
                });
                resetBall();
            } else if (ball.x > canvas.width) {
                setPlayerScore(s => {
                    const newScore = s + 1;
                    if (newScore >= WIN_SCORE) {
                        setWinner('player');
                        setGameState('gameover');
                    }
                    return newScore;
                });
                resetBall();
            }

            // Draw Ball
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [gameState]);

    return (
        <div className="relative w-full h-full bg-[#1a0b2e] flex flex-col items-center justify-center font-mono">
            {/* Scoreboard */}
            <div className="absolute top-10 w-full flex justify-center gap-24 text-6xl font-bold opacity-30 pointer-events-none">
                <div className="text-purple-400">{playerScore}</div>
                <div className="text-red-500">{aiScore}</div>
            </div>

            {gameState === 'start' && (
                <div className="z-20 text-center bg-black/60 p-10 rounded-xl border border-purple-500/50 backdrop-blur-md">
                    <h1 className="text-5xl font-bold text-purple-400 mb-4 neon-text">BINARY PONG</h1>
                    <p className="text-purple-200 mb-8">First to {WIN_SCORE} points wins.</p>
                    <button onClick={startGame} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-all">
                        START MATCH
                    </button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="z-20 text-center bg-black/80 p-12 rounded-xl border border-white/20 backdrop-blur-xl">
                    <h2 className={`text-5xl font-bold mb-4 ${winner === 'player' ? 'text-green-400' : 'text-red-500'}`}>
                        {winner === 'player' ? 'VICTORY' : 'DEFEAT'}
                    </h2>
                    <button onClick={startGame} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-all flex items-center gap-2 mx-auto">
                        <RotateCcw size={18} /> PLAY AGAIN
                    </button>
                </div>
            )}

            <canvas ref={canvasRef} className="absolute inset-0 cursor-none" />
        </div>
    );
}

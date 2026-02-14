import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Trophy, RotateCcw } from 'lucide-react';

export default function NeonSnake() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');

    // Game Configuration
    const GRID_SIZE = 20;
    const SPEED = 100;

    // Game State Refs (for game loop access without dependency cycles)
    const snakeRef = useRef<{ x: number, y: number }[]>([{ x: 10, y: 10 }]);
    const foodRef = useRef<{ x: number, y: number }>({ x: 15, y: 15 });
    const directionRef = useRef<{ x: number, y: number }>({ x: 1, y: 0 });
    const nextDirectionRef = useRef<{ x: number, y: number }>({ x: 1, y: 0 });
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

    const spawnFood = (width: number, height: number) => {
        const cols = Math.floor(width / GRID_SIZE);
        const rows = Math.floor(height / GRID_SIZE);
        return {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    };

    const startGame = () => {
        snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        directionRef.current = { x: 1, y: 0 };
        nextDirectionRef.current = { x: 1, y: 0 };
        setScore(0);
        setGameState('playing');
    };

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;

            const { x, y } = directionRef.current;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                    if (y === 0) nextDirectionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                case 's':
                    if (y === 0) nextDirectionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (x === 0) nextDirectionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                case 'd':
                    if (x === 0) nextDirectionRef.current = { x: 1, y: 0 };
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    // Main Game Loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Responsive Canvas
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                // Respawn food if outside bounds
                if (foodRef.current.x * GRID_SIZE >= canvas.width || foodRef.current.y * GRID_SIZE >= canvas.height) {
                    foodRef.current = spawnFood(canvas.width, canvas.height);
                }
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const moveSnake = () => {
            const head = { ...snakeRef.current[0] };
            directionRef.current = nextDirectionRef.current;
            head.x += directionRef.current.x;
            head.y += directionRef.current.y;

            // Wall Wrapping (or Collision)
            const cols = Math.floor(canvas.width / GRID_SIZE);
            const rows = Math.floor(canvas.height / GRID_SIZE);

            // Wall Collision (Game Over)
            if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
                setGameState('gameover');
                return;
            }

            // Self Collision
            for (const segment of snakeRef.current) {
                if (head.x === segment.x && head.y === segment.y) {
                    setGameState('gameover');
                    return;
                }
            }

            snakeRef.current.unshift(head);

            // Eat Food
            if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                setScore(s => s + 10);
                foodRef.current = spawnFood(canvas.width, canvas.height);
            } else {
                snakeRef.current.pop();
            }
        };

        const draw = () => {
            // Clear
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }
            ctx.stroke();

            // Draw Food
            ctx.fillStyle = '#ff0055';
            ctx.shadowColor = '#ff0055';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            const foodX = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
            const foodY = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
            ctx.arc(foodX, foodY, GRID_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Snake
            ctx.fillStyle = '#00f3ff';
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = 10;
            snakeRef.current.forEach((segment, i) => {
                // Head is brighter/different
                if (i === 0) {
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 20;
                } else {
                    ctx.fillStyle = '#00f3ff';
                    ctx.shadowBlur = 10;
                }
                ctx.fillRect(
                    segment.x * GRID_SIZE + 1,
                    segment.y * GRID_SIZE + 1,
                    GRID_SIZE - 2,
                    GRID_SIZE - 2
                );
            });
            ctx.shadowBlur = 0;
        };

        const loop = () => {
            moveSnake();
            draw();
        };

        const intervalId = setInterval(loop, SPEED);
        gameLoopRef.current = intervalId;

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [gameState]);

    // High Score updater
    useEffect(() => {
        if (score > highScore) setHighScore(score);
    }, [score, highScore]);

    return (
        <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
            {/* UI Layer */}
            <div className="absolute top-4 right-6 text-xl font-bold font-mono text-green-400 flex items-center gap-6 z-20 pointer-events-none">
                <div className="text-gray-500">HI: {highScore}</div>
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    {score}
                </div>
            </div>

            {gameState === 'start' && (
                <div className="text-center space-y-6 z-30 bg-black/80 p-10 rounded-xl border border-green-500/30 backdrop-blur-md">
                    <h1 className="text-5xl font-bold text-green-400 neon-text mb-4">NEON SNAKE</h1>
                    <p className="text-gray-400">Use Arrow Keys to navigate.<br />Consume data blocks to grow.</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold text-xl rounded flex items-center gap-2 mx-auto transition-all"
                    >
                        <Play size={20} /> START
                    </button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="text-center space-y-6 z-30 bg-black/90 p-12 border border-red-500/50 rounded-xl backdrop-blur-xl">
                    <div className="text-5xl font-bold text-red-500 mb-2">CRASHED</div>
                    <div className="text-xl text-white">SCORE: <span className="text-green-400 font-mono text-2xl">{score}</span></div>
                    <button
                        onClick={startGame}
                        className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded uppercase font-bold transition-all flex items-center gap-2 mx-auto"
                    >
                        <RotateCcw size={18} /> TRY AGAIN
                    </button>
                </div>
            )}

            <canvas ref={canvasRef} className="absolute inset-0 z-10" />
        </div>
    );
}

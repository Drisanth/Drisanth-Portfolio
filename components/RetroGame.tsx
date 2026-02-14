import React, { useEffect, useRef, useState } from 'react';
import { X, Trophy, Play, Skull } from 'lucide-react';

interface RetroGameProps {
  onClose: () => void;
}

const RetroGame: React.FC<RetroGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game Constants
  const PLAYER_SIZE = 40;
  const BULLET_SIZE = 6;
  const ENEMY_SIZE = 20;

  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
      playerX = e.clientX;
    };

    const handleClick = () => {
      bullets.push({ x: playerX, y: canvas.height - 60 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);

    const gameLoop = () => {
      if (!isRunning) return;
      frames++;

      // Background
      ctx.fillStyle = 'rgba(0, 10, 20, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid effect
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.beginPath();
      for(let i=0; i<canvas.width; i+=50) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
      }
      ctx.stroke();

      // Spawn Enemies
      if (frames % spawnRate === 0) {
        enemies.push({
          x: Math.random() * (canvas.width - ENEMY_SIZE),
          y: -ENEMY_SIZE,
          speed: 2 + Math.random() * 3 + (frames / 1000) // Progressive difficulty
        });
        if (spawnRate > 20) spawnRate--;
      }

      // Update Player
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f3ff';
      ctx.beginPath();
      ctx.moveTo(playerX, canvas.height - 50);
      ctx.lineTo(playerX - 20, canvas.height - 20);
      ctx.lineTo(playerX + 20, canvas.height - 20);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Update Bullets
      ctx.fillStyle = '#fff';
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 10;
        ctx.fillRect(bullets[i].x - 2, bullets[i].y, 4, 10);
        if (bullets[i].y < 0) bullets.splice(i, 1);
      }

      // Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 4, 4);
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
        const jitter = Math.random() * 4 - 2;
        ctx.fillRect(enemy.x + jitter, enemy.y, ENEMY_SIZE, ENEMY_SIZE);

        // Game Over
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
            // Explosion
            for(let k=0; k<8; k++) {
              particles.push({
                x: enemy.x + ENEMY_SIZE/2,
                y: enemy.y + ENEMY_SIZE/2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: '#ff0055'
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center font-mono">
      {/* Game Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="text-2xl text-red-500 font-bold animate-pulse">
           ⚠️ SECURITY PROTOCOL ENGAGED
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="text-white w-8 h-8" />
        </button>
      </div>

      {!gameStarted && !gameOver && (
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
            CYBER DEFENSE
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            System breach detected. Eliminate the corrupted data packets before they reach the core kernel.
          </p>
          <button 
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xl rounded-none border-2 border-cyan-400 flex items-center gap-3 mx-auto transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
          >
            <Play fill="currentColor" /> INITIALIZE
          </button>
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-6 z-10 bg-black/80 p-12 border border-red-500/50">
          <Skull className="w-24 h-24 text-red-500 mx-auto animate-bounce" />
          <h2 className="text-5xl font-bold text-red-500">SYSTEM FAILURE</h2>
          <div className="text-2xl text-white">FINAL SCORE: <span className="text-cyan-400">{score}</span></div>
          <button 
            onClick={() => {
              setGameOver(false);
              setScore(0);
              setGameStarted(true);
            }}
            className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded"
          >
            REBOOT SYSTEM
          </button>
        </div>
      )}

      <div className="absolute top-6 right-6 text-2xl font-bold text-cyan-400 flex items-center gap-3">
         <Trophy className="w-6 h-6 text-yellow-400" />
         {score.toString().padStart(6, '0')}
      </div>
      
      <canvas ref={canvasRef} className="absolute inset-0 cursor-none" />
    </div>
  );
};

export default RetroGame;
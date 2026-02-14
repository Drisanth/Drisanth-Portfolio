import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Terminal, Code, Cpu, Globe, Volume2, VolumeX, Briefcase, GraduationCap, Send, ExternalLink, Github, ChevronDown, Gamepad2, Database, Wifi, Activity, Lock, Unlock, Layers, Server, Zap, Shield, Star, GitFork, Binary, Hash, LayoutGrid, Box } from 'lucide-react';
import HeroScene from './components/HeroScene';
import MatrixRain from './components/MatrixRain';
import ArcadeOverlay from './components/Arcade/ArcadeOverlay';
import HexGrid from './components/HexGrid';
import SystemBoot from './components/SystemBoot';
import GlitchText from './components/GlitchText';
import HolographicPhoto from './components/HolographicPhoto';
import TiltCard from './components/TiltCard';
import SmoothScroll from './components/SmoothScroll';
import StarFieldCanvas from './components/StarField';
import TerminalModal from './components/TerminalModal';
import { PROFILE, PROJECTS, EXPERIENCE, EDUCATION, SKILLS } from './constants';
import { SkillNode } from './types';
import profilePic from './components/PIC.jpeg';

// --- Constants & Helpers ---
const categoryColors: Record<string, string> = {
  'Blockchain': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  'Machine Learning': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  'Productivity': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'Security': 'bg-red-500/10 text-red-300 border-red-500/20',
  'Hardware': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  'Web': 'bg-cyan-500/10 text-cyan-300 border-white/10',
  'AI': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
};

// --- Types & Interfaces ---
interface HudStats {
  cpu: number;
  mem: number;
  net: number;
  fps: number;
}

interface RepoStats {
  stars: number;
  forks: number;
  language: string;
}

// --- Hooks ---
const useKonami = (action: () => void) => {
  const [input, setInput] = useState<string[]>([]);
  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.key];
      if (newInput.length > code.length) newInput.shift();
      setInput(newInput);
      if (JSON.stringify(newInput) === JSON.stringify(code)) {
        action();
        setInput([]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, action, code]);
};

// --- Sub-Components ---

// 1. Custom Cursor with Spring Physics
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-500/50 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-500 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{
          x: cursorX, // Instant follow for dot
          y: cursorY,
          translateX: 12,
          translateY: 12
        }}
      />
    </>
  );
};

// 2. Parallax Floating Particles for Scroll Depth
const FloatingParticle: React.FC<{ Icon: any, x: number, y: number, speed: number }> = React.memo(({ Icon, x, y, speed }) => {
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, speed]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, speed / 2]);
  const size = useMemo(() => Math.random() * 40 + 20, []);

  return (
    <motion.div
      className="absolute text-cyan-900/20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        y: yPos,
        rotate: rotate
      }}
    >
      <Icon size={size} />
    </motion.div>
  );
});

const FloatingParticles = () => {
  const particles = useMemo(() => {
    const icons = [Code, Binary, Cpu, Hash, Database, Wifi];
    return [...Array(15)].map((_, i) => ({
      key: i,
      Icon: icons[i % icons.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: (Math.random() - 0.5) * 500
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <FloatingParticle key={p.key} Icon={p.Icon} x={p.x} y={p.y} speed={p.speed} />
      ))}
    </div>
  );
};

const SecretTrigger = ({ id, onFound, children, className }: { id: string, onFound: (id: string) => void, children?: React.ReactNode, className?: string }) => {
  const [found, setFound] = useState(false);
  return (
    <div
      className={`cursor-pointer transition-all ${className} ${found ? 'text-green-400 animate-pulse' : ''}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent other clicks
        if (!found) {
          setFound(true);
          onFound(id);
        }
      }}
    >
      {children}
    </div>
  );
};

// 3. Enhanced Luxurious Section Transition
const SectionWrapper = ({ children, className, delay = 0 }: { children?: React.ReactNode, className?: string, delay?: number }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50, filter: "blur(10px)", scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1], // "Luxurious" Bezier curve
        delay
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
};

const HUD = ({ stats, scrollY }: { stats: HudStats, scrollY: number }) => (
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

    {/* Top Right: Music Vis & Time */}
    <div className="absolute top-4 right-20 flex flex-col items-end gap-1">
      <div>{new Date().toLocaleTimeString()}</div>
      <div className="flex gap-0.5 h-4 items-end">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-cyan-500/50"
            animate={{ height: [4, Math.random() * 16, 4] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>

    {/* Bottom Left: Coordinates */}
    <div className="absolute bottom-4 left-6 border-l-2 border-cyan-500/30 pl-2">
      <div>POS: {scrollY.toFixed(0)}</div>
      <div>SEC: MAIN_THREAD</div>
      <div className="mt-1 text-[8px] opacity-50">V.2.0.4.5</div>
    </div>

    {/* Right: Scroll Bar */}
    <div className="absolute top-1/2 right-6 -translate-y-1/2 h-48 w-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="w-full bg-cyan-500 box-shadow-[0_0_10px_#00f3ff]"
        style={{ height: `${Math.min((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
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

const NavBar = ({ toggleMatrix, isMatrixActive, toggleSound, isSoundActive }: any) => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 pointer-events-auto">
    <div className="font-mono text-xl font-bold text-cyan-400 backdrop-blur-md px-4 py-1 rounded border border-cyan-500/20 bg-black/40 hover:bg-black/60 transition-colors">
      &lt;Drisanth /&gt;
    </div>
    <div className="flex gap-4">
      <button
        onClick={toggleSound}
        className={`p-2 rounded-full transition-colors glass-card ${isSoundActive ? 'text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'text-gray-500'}`}
      >
        {isSoundActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <button
        onClick={toggleMatrix}
        className={`p-2 rounded-full transition-colors glass-card ${isMatrixActive ? 'text-green-500 border-green-500/50 shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'text-gray-400 hover:text-white'}`}
        title="Toggle Matrix (Press M)"
      >
        <Terminal size={18} />
      </button>
      <a href={`mailto:${PROFILE.email}`} className="hidden md:block px-6 py-2 rounded bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:scale-105 transition-all font-mono text-xs tracking-widest uppercase shadow-[0_0_10px_rgba(0,243,255,0.1)]">
        Initialize Handshake
      </a>
    </div>
  </nav>
);



const CapabilityCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, filter: 'blur(5px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "backOut" }}
    className="glass-card p-6 rounded-xl border-t border-white/10 hover:border-cyan-500/50 transition-colors group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
      <Icon size={120} />
    </div>
    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// --- Main Application ---

export default function App() {
  const [matrixActive, setMatrixActive] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [konamiTriggered, setKonamiTriggered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [foundSecrets, setFoundSecrets] = useState<string[]>([]);
  const [hudStats, setHudStats] = useState<HudStats>({ cpu: 10, mem: 2.4, net: 12, fps: 60 });
  const [repoStats, setRepoStats] = useState<Record<string, RepoStats>>({});
  const [loadingStats, setLoadingStats] = useState(true);
  const [booted, setBooted] = useState(false);

  // Parallax & Physics
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Update Stats & Scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setHudStats({
        cpu: Math.floor(Math.random() * 30) + 10,
        mem: parseFloat((Math.random() * 2 + 2).toFixed(1)),
        net: Math.floor(Math.random() * 20) + 10,
        fps: Math.floor(Math.random() * 10) + 55
      });
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Fetch GitHub Stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      setLoadingStats(true);
      const stats: Record<string, RepoStats> = {};

      await Promise.all(PROJECTS.map(async (project) => {
        if (project.repoUrl) {
          const match = project.repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
          if (match) {
            const [_, owner, repo] = match;
            try {
              const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
              if (res.ok) {
                const data = await res.json();
                stats[project.id] = {
                  stars: data.stargazers_count,
                  forks: data.forks_count,
                  language: data.language
                };
              }
            } catch (e) {
              console.warn(`Failed to fetch stats for ${project.title}`);
            }
          }
        }
      }));

      // Simulate a small network delay for effect if response is too fast
      setTimeout(() => {
        setRepoStats(stats);
        setLoadingStats(false);
      }, 800);
    };

    fetchGitHubStats();
  }, []);

  useKonami(() => {
    setKonamiTriggered(true);
    setMatrixActive(true);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        setTerminalActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSecretFound = (id: string) => {
    if (!foundSecrets.includes(id)) {
      const newSecrets = [...foundSecrets, id];
      setFoundSecrets(newSecrets);

      if (newSecrets.length === 3) {
        setTimeout(() => setGameActive(true), 1000);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    });
  };

  return (
    <SmoothScroll>
      <AnimatePresence>
        {!booted && (
          <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[9999]">
            <SystemBoot onComplete={() => setBooted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative min-h-screen text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden cursor-none" // Added cursor-none for custom cursor
        onMouseMove={handleMouseMove}
        ref={containerRef}
      >
        <CustomCursor />
        <MatrixRain active={matrixActive} />
        <FloatingParticles />

        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-[#050505] to-[#000]"></div>
        <StarFieldCanvas />
        <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-0 pointer-events-none mix-blend-overlay"></div>

        {/* HUD & Nav */}
        <HUD stats={hudStats} scrollY={scrollY} />
        <NavBar
          toggleMatrix={() => setMatrixActive(!matrixActive)}
          isMatrixActive={matrixActive}
          toggleSound={() => setSoundActive(!soundActive)}
          isSoundActive={soundActive}
        />

        {/* Arcade Mode Overlay */}
        {gameActive && <ArcadeOverlay onClose={() => setGameActive(false)} />}

        {/* Terminal Overlay */}
        {terminalActive && <TerminalModal onClose={() => setTerminalActive(false)} />}

        {/* Unlock Progress Notification */}
        <div className="fixed bottom-6 left-6 z-50 flex gap-2">
          {['HERO', 'AI', 'FOOTER'].map((s, i) => (
            <div key={s} className={`w-3 h-3 rounded-full border border-cyan-500 transition-all duration-500 ${foundSecrets.includes(s) ? 'bg-cyan-500 shadow-[0_0_10px_#00f3ff] scale-125' : 'bg-black/50'}`} />
          ))}
          {foundSecrets.length > 0 && foundSecrets.length < 3 && (
            <span className="text-[10px] font-mono text-cyan-500 animate-pulse ml-2 flex items-center">
              <Lock size={10} className="mr-1" /> SECURITY KEYS: {foundSecrets.length}/3
            </span>
          )}
          {foundSecrets.length === 3 && (
            <span className="text-[10px] font-mono text-green-500 animate-bounce ml-2 flex items-center">
              <Unlock size={10} className="mr-1" /> ACCESS GRANTED
            </span>
          )}
        </div>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden z-10">
          <HeroScene mouseX={mousePos.x} mouseY={mousePos.y} />

          <motion.div
            style={{ y: yHero, opacity: opacityHero }}
            className="relative z-10 text-center px-4 max-w-6xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="mb-8 inline-block"
            >
              <SecretTrigger id="HERO" onFound={handleSecretFound}>
                <div className="text-cyan-500 font-mono text-xs tracking-[0.5em] border border-cyan-500/30 px-6 py-2 bg-cyan-900/10 backdrop-blur-md hover:bg-cyan-500/20 hover:tracking-[0.8em] transition-all duration-500 cursor-pointer">
                  SYSTEM ONLINE
                </div>
              </SecretTrigger>
            </motion.div>

            <motion.h1
              className="text-7xl md:text-[9rem] leading-none font-bold mb-8 neon-text tracking-tighter mix-blend-screen text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
              initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {PROFILE.name.toUpperCase()}
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto flex items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <span className="hidden md:block w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50" />
              {PROFILE.tagline}
              <span className="hidden md:block w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50" />
            </motion.p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-cyan-500 cursor-pointer hover:text-white transition-colors"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Initialize</span>
              <ChevronDown size={24} />
            </div>
          </motion.div>
        </section>

        {/* About Section - Separated */}
        <SectionWrapper className="py-32 px-6 max-w-7xl mx-auto z-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 items-center">
            {/* Left: Holographic Photo */}
            <div className="md:col-span-2 flex justify-center md:justify-start relative">
              <TiltCard intensity={10}>
                <div className="relative">
                  <HolographicPhoto
                    src={profilePic}
                    alt={PROFILE.name}
                    size={320}
                  />
                  {/* Decorative Elements around photo */}
                  <div className="absolute -bottom-12 -right-12 text-right">
                    <div className="text-4xl font-bold text-white/10 font-mono">01</div>
                    <div className="text-xs text-cyan-500/50 tracking-widest">AUTHORIZED PERSONNEL</div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* Right: Content */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-cyan-500 font-mono text-xl">01.</span>
                <h2 className="text-4xl md:text-6xl font-bold">
                  <GlitchText text="DATA_PROFILE" />
                </h2>
              </div>
              <div className="glass-card p-10 rounded-2xl border-l-4 border-l-cyan-500 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-all duration-700 rotate-12 group-hover:rotate-45">
                  <Cpu size={400} />
                </div>
                <p className="text-gray-300 leading-loose text-lg font-light relative z-10">
                  {PROFILE.about}
                </p>
                <div className="mt-10 flex flex-wrap gap-8 font-mono text-sm relative z-10">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Globe size={16} /> Based in India
                  </div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Zap size={16} /> Open for Work
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* System Capabilities - New Section */}
        <SectionWrapper className="py-20 px-6 max-w-7xl mx-auto z-20" delay={0.2}>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="w-8 h-1 bg-cyan-500"></span>
              SYSTEM CAPABILITIES
            </h2>
            <div className="hidden md:block font-mono text-xs text-gray-500">
              MODULES_LOADED: 3/3
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CapabilityCard
              icon={Layers}
              title="Full Stack Architecture"
              desc="Building scalable web applications with modern frameworks like React, Node.js, and robust database solutions."
              delay={0}
            />
            <CapabilityCard
              icon={Cpu}
              title="AI & Machine Learning"
              desc="Integrating intelligent agents and predictive models using TensorFlow, PyTorch, and Gemini API for smart automation."
              delay={0.2}
            />
            <CapabilityCard
              icon={Server}
              title="Hardware Optimization"
              desc="Bridging software and hardware with low-level optimization, memory frameworks, and IoT device telemetry."
              delay={0.4}
            />
          </div>
        </SectionWrapper>

        {/* Skills Section - Separated */}
        <SectionWrapper className="py-32 px-6 max-w-7xl mx-auto z-20">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2 block">Technological Arsenal</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">NEURAL_NET.CONNECTIONS</h2>
            <p className="text-gray-400">A comprehensive suite of tools and languages mastered for building next-generation digital solutions.</p>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-50"></div>
            <HexGrid skills={SKILLS} />
          </div>

          {konamiTriggered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center gap-3 text-green-400 font-mono text-sm max-w-md mx-auto"
            >
              <Gamepad2 size={20} />
              <span>CHEAT CODE ACTIVE: ALL SKILLS MAXIMIZED TO 100%</span>
            </motion.div>
          )}
        </SectionWrapper>

        {/* Experience - Vertical Timeline Enhanced */}
        <SectionWrapper className="py-32 px-6 max-w-6xl mx-auto z-20">
          <div className="flex items-center justify-end mb-20 gap-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
            <h2 className="text-4xl font-bold text-right">
              <span className="text-cyan-500">02.</span> EXECUTION_LOGS
            </h2>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent opacity-30 md:-translate-x-1/2"></div>

            <div className="space-y-24">
              {EXPERIENCE.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_15px_#00f3ff] md:-translate-x-1/2 z-10 transform translate-y-2 md:translate-y-6"></div>

                  {/* Content Side */}
                  <div className="md:w-1/2 md:px-12">
                    <div className="glass-card p-8 rounded-xl hover:bg-white/5 transition-all hover:border-cyan-500/50 relative group">
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>

                      <div className="flex flex-col mb-4">
                        <span className="font-mono text-xs text-cyan-400 mb-2">{exp.period}</span>
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{exp.role}</h3>
                        <h4 className="text-lg text-gray-400 font-mono flex items-center gap-2 mt-1">
                          <Briefcase size={14} /> {exp.company}
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                            <span className="text-cyan-500 mt-1.5 min-w-[6px] h-[6px] rounded-full bg-cyan-500"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-gray-500 font-mono">
                        <Globe size={12} className="mr-2" /> {exp.location}
                      </div>
                    </div>
                  </div>

                  {/* Empty Side for alignment */}
                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Projects - Interactive Gallery */}
        <SectionWrapper className="py-32 px-6 max-w-7xl mx-auto z-20">
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
            <div className="flex flex-col">
              <span className="text-cyan-500 font-mono mb-2">Portfolio Showcase</span>
              <h2 className="text-4xl md:text-5xl font-bold">03. PROJECT_INDEX</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-gray-500 text-right">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              LIVE_REPOSITORY_CONNECTION
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, filter: 'blur(5px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full border border-white/5 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="h-48 bg-gradient-to-br from-gray-900 to-black relative p-6 flex flex-col justify-end overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                  {/* 3D-like hover effect background */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 group-hover:scale-125 transition-all duration-700"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      {project.category === 'AI' ? (
                        <SecretTrigger id="AI" onFound={handleSecretFound}>
                          <span className="text-[10px] font-mono px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-crosshair hover:bg-red-500 hover:text-white transition-colors">
                            AI // CLASSIFIED
                          </span>
                        </SecretTrigger>
                      ) : (
                        <span className={`text-[10px] font-mono px-2 py-1 rounded border backdrop-blur-sm ${categoryColors[project.category] || categoryColors['Web']}`}>
                          {project.category}
                        </span>
                      )}

                      {project.metrics && (
                        <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                          <Activity size={10} /> {project.metrics}
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold leading-tight group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col border-t border-white/5 bg-white/[0.02]">
                  <p className="text-gray-400 text-sm mb-6 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map(t => (
                      <span key={t} className="text-[10px] uppercase tracking-wider text-gray-400 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors border border-white/5">{t}</span>
                    ))}
                  </div>

                  {/* GitHub Stats with Loading State */}
                  <div className="min-h-[3rem] mb-4 pb-4 border-b border-white/5">
                    {loadingStats ? (
                      <div className="flex flex-col gap-2 animate-pulse">
                        <div className="h-2 bg-white/5 rounded w-3/4"></div>
                        <div className="flex gap-4">
                          <div className="h-2 bg-white/5 rounded w-12"></div>
                          <div className="h-2 bg-white/5 rounded w-12"></div>
                        </div>
                      </div>
                    ) : repoStats[project.id] ? (
                      <div className="flex items-center gap-4 text-[10px] font-mono animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {repoStats[project.id].language && (
                          <span className="flex items-center gap-1 text-cyan-300">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            {repoStats[project.id].language}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star size={12} fill="currentColor" className="text-yellow-500" /> {repoStats[project.id].stars}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <GitFork size={12} /> {repoStats[project.id].forks}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[10px] font-mono text-gray-600 italic">No public stats available</div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    {project.repoUrl && (
                      <a href={project.repoUrl} className="flex-1 py-3 text-xs font-bold bg-white/5 hover:bg-cyan-500 hover:text-black transition-all rounded flex items-center justify-center gap-2 group/btn uppercase tracking-wider">
                        <Code size={14} /> Source
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} className="flex-1 py-3 text-xs font-bold bg-white/5 hover:bg-white/20 transition-all rounded flex items-center justify-center gap-2 text-white uppercase tracking-wider">
                        Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Education */}
        <SectionWrapper className="py-20 px-6 max-w-4xl mx-auto z-20">
          <div className="relative p-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 animate-gradient-xy">
            <div className="bg-black rounded-[22px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <GraduationCap size={200} />
              </div>

              <h2 className="text-3xl font-bold mb-10 flex items-center gap-4 relative z-10">
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                  <GraduationCap size={32} />
                </div>
                <span>ACADEMIC_RECORDS</span>
              </h2>
              <div className="space-y-6 relative z-10">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-purple-500/30 group">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{edu.institution}</h3>
                      <p className="text-gray-400 mt-1">{edu.degree}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="font-mono text-sm text-cyan-500 mb-1">{edu.period}</p>
                      <div className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded text-sm font-bold border border-green-500/20">
                        {edu.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Contact Section */}
        <section className="relative z-10 py-32 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1 }}
              className="glass-card p-10 md:p-16 rounded-[3rem] relative overflow-hidden text-center border-t border-cyan-500/30"
            >
              {/* Holographic BG */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-purple-900/20"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_20px_#00f3ff]"></div>

              <h2 className="text-5xl md:text-6xl font-bold mb-8 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">INITIATE UPLINK</h2>
              <p className="text-gray-400 mb-12 relative z-10 text-lg max-w-xl mx-auto">
                Transmission channels are open for collaboration on AI Agents, Hardware-Software co-design, and Full Stack Engineering.
              </p>

              <form className="space-y-4 text-left relative z-10 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                <div className="group relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-500 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                  </div>
                  <input type="email" className="w-full bg-black/60 border border-white/10 rounded-xl px-10 py-4 focus:border-cyan-500 focus:outline-none transition-all text-white placeholder:text-gray-600 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(0,243,255,0.1)]" placeholder="ENTER_EMAIL_ADDRESS" />
                </div>
                <div className="group relative">
                  <textarea rows={4} className="w-full bg-black/60 border border-white/10 rounded-xl px-6 py-4 focus:border-cyan-500 focus:outline-none transition-all text-white placeholder:text-gray-600 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] resize-none" placeholder="COMPOSE_MESSAGE_PAYLOAD..."></textarea>
                </div>
                <button className="w-full py-5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_40px_rgba(0,243,255,0.5)] transform hover:-translate-y-1">
                  <Send size={18} /> Transmit Data
                </button>
              </form>

              <div className="mt-16 flex justify-center gap-8 relative z-10">
                <a href={`https://${PROFILE.github}`} className="group p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all text-gray-400 hover:text-white">
                  <Github size={24} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href={`https://${PROFILE.linkedin}`} className="group p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all text-gray-400 hover:text-white">
                  <Briefcase size={24} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 relative z-10 bg-black">
          <div className="flex flex-col items-center justify-center gap-4 text-xs font-mono text-gray-600">
            <SecretTrigger id="FOOTER" onFound={handleSecretFound}>
              <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors px-4 py-2 rounded hover:bg-white/5">
                <Shield size={12} />
                <div className={`w-2 h-2 rounded-full ${gameActive ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                SYSTEM STATUS: {gameActive ? 'BREACH DETECTED' : 'STABLE'}
              </div>
            </SecretTrigger>
            <p className="flex items-center gap-2">
              <Code size={12} />
              BUILT WITH REACT_THREE_FIBER + FRAMER_MOTION
            </p>
            <p>© {new Date().getFullYear()} {PROFILE.name.toUpperCase()} // ALL RIGHTS RESERVED</p>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
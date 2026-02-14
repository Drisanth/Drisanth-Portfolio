import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2, ChevronRight } from 'lucide-react';
import { PROFILE, SKILLS, PROJECTS } from '../constants';

interface NeuralTerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COMMANDS = {
    help: "List available commands",
    about: "Display profile information",
    skills: "List technical skills",
    projects: "List projects",
    contact: "Display contact info",
    clear: "Clear terminal output",
    sudo: "Try it and see...",
    exit: "Close terminal"
};

const NeuralTerminal: React.FC<NeuralTerminalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([
        "NEURAL_LINK v3.0.1 established...",
        "Type 'help' for available commands."
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let output: string | string[] = "";

        switch (cleanCmd) {
            case 'help':
                output = Object.entries(COMMANDS).map(([k, v]) => `${k.padEnd(10)} - ${v}`).join('\n');
                break;
            case 'about':
                output = PROFILE.about;
                break;
            case 'skills':
                output = SKILLS.map(s => `[${s.category}] ${s.name}: ${s.level}%`).join('\n');
                break;
            case 'projects':
                output = PROJECTS.map(p => `* ${p.title} (${p.category})`).join('\n');
                break;
            case 'contact':
                output = `Email: ${PROFILE.email}\nGitHub: ${PROFILE.github}\nLinkedIn: ${PROFILE.linkedin}`;
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'sudo':
                output = "ACCESS DENIED. BIOMETRIC SIGNATURE REQUIRED.";
                break;
            case 'exit':
                onClose();
                return;
            case '':
                return;
            default:
                output = `Command not found: ${cleanCmd}. Type 'help' for assistance.`;
        }

        setHistory(prev => [...prev, `> ${cmd}`, ...(Array.isArray(output) ? output : [output])]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 w-full h-1/2 bg-black/90 backdrop-blur-md border-b-2 border-green-500 z-50 shadow-[0_0_50px_rgba(0,255,0,0.2)] font-mono text-sm md:text-base"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-green-900/20 border-b border-green-500/30">
                        <div className="flex items-center gap-2 text-green-500">
                            <Terminal size={16} />
                            <span>NEURAL_LINK_TERMINAL</span>
                        </div>
                        <div className="flex items-center gap-4 text-green-500/50">
                            <Minimize2 size={16} className="cursor-pointer hover:text-green-500" />
                            <Maximize2 size={16} className="cursor-pointer hover:text-green-500" />
                            <X size={16} className="cursor-pointer hover:text-red-500" onClick={onClose} />
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-4 h-[calc(100%-3rem)] overflow-y-auto font-mono text-green-500 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
                        <div className="space-y-1 whitespace-pre-wrap">
                            {history.map((line, i) => (
                                <div key={i} className={line.startsWith('>') ? 'text-white' : 'text-green-400 opacity-90'}>
                                    {line}
                                </div>
                            ))}
                        </div>

                        {/* Input Line */}
                        <div className="flex items-center gap-2 mt-2 text-white">
                            <ChevronRight size={16} className="text-green-500" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-green-900"
                                autoFocus
                                spellCheck={false}
                            />
                        </div>
                        <div ref={bottomRef} />
                    </div>

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-500/5 to-transparent bg-[length:100%_4px] animate-scanline"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NeuralTerminal;

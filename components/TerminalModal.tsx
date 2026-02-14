import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import { PROFILE, PROJECTS } from '../constants';

export default function TerminalModal({ onClose }: { onClose: () => void }) {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([
        "Welcome to Drisanth's Terminal v2.0.4",
        "Type 'help' to see available commands."
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        let response = "";

        switch (trimmed) {
            case 'help':
                response = "Available commands: help, clear, about, projects, contact, exit, sudo";
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'about':
                response = PROFILE.about;
                break;
            case 'projects':
                response = PROJECTS.map(p => `> ${p.title} [${p.category}]`).join('\n');
                break;
            case 'contact':
                response = `Email: ${PROFILE.email}\nGitHub: ${PROFILE.github}\nLinkedIn: ${PROFILE.linkedin}`;
                break;
            case 'exit':
                onClose();
                return;
            case 'sudo':
                response = "User not in the sudoers file. This incident will be reported.";
                break;
            default:
                response = `Command not found: ${trimmed}`;
        }

        setHistory(prev => [...prev, `user@drisanth:~ $ ${cmd}`, response]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-black/90 border border-green-500/50 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.2)] overflow-hidden flex flex-col h-[500px]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-green-900/20 border-b border-green-500/30">
                    <div className="flex items-center gap-2 text-green-400 font-mono text-xs">
                        <Terminal size={14} />
                        <span>TERMINAL_ACCESS</span>
                    </div>
                    <button onClick={onClose} className="text-green-500 hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div ref={scrollRef} className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">
                    {history.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap leading-relaxed opacity-90">{line}</div>
                    ))}
                    <div className="flex gap-2 items-center">
                        <span className="text-green-600">user@drisanth:~ $</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none outline-none text-green-400 focus:ring-0 placeholder-green-800"
                            autoFocus
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

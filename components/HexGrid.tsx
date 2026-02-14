import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SkillNode } from '../types';
import { Cpu, Globe, Server, Cloud, Code } from 'lucide-react';

interface HexGridProps {
    skills: SkillNode[];
}

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Frontend': return 'cyan';
        case 'Backend': return 'green';
        case 'AI': return 'purple';
        case 'Cloud': return 'orange';
        default: return 'cyan';
    }
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Frontend': return Globe;
        case 'Backend': return Server;
        case 'AI': return Cpu;
        case 'Cloud': return Cloud;
        default: return Code;
    }
};

const Hexagon: React.FC<{ skill: SkillNode; index: number }> = ({ skill, index }) => {
    const color = getCategoryColor(skill.category);
    const Icon = getCategoryIcon(skill.category);
    const [isHovered, setIsHovered] = useState(false);

    // Tailwind color classes mapping for dynamic use
    const colorClasses = {
        cyan: {
            border: 'border-cyan-500/30',
            hoverBorder: 'group-hover:border-cyan-400',
            text: 'text-cyan-400',
            bg: 'bg-cyan-900/10',
            hoverBg: 'group-hover:bg-cyan-500/20',
            glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]'
        },
        green: {
            border: 'border-green-500/30',
            hoverBorder: 'group-hover:border-green-400',
            text: 'text-green-400',
            bg: 'bg-green-900/10',
            hoverBg: 'group-hover:bg-green-500/20',
            glow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]'
        },
        purple: {
            border: 'border-purple-500/30',
            hoverBorder: 'group-hover:border-purple-400',
            text: 'text-purple-400',
            bg: 'bg-purple-900/10',
            hoverBg: 'group-hover:bg-purple-500/20',
            glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]'
        },
        orange: {
            border: 'border-orange-500/30',
            hoverBorder: 'group-hover:border-orange-400',
            text: 'text-orange-400',
            bg: 'bg-orange-900/10',
            hoverBg: 'group-hover:bg-orange-500/20',
            glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]'
        }
    };

    const colors = colorClasses[color as keyof typeof colorClasses];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="relative w-[140px] h-[160px] md:w-[160px] md:h-[185px] flex items-center justify-center group cursor-pointer m-2 md:-ml-8 md:first:ml-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                // Staggering is tricky with flexbox, simple margin approach here
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: '#050505'
            }}
        >
            {/* Hex Basic Shape using CSS for better responsiveness than raw SVG */}
            <div
                className={`absolute inset-0 transition-all duration-300 ${colors.bg} ${colors.hoverBg} backdrop-blur-md`}
            >
                {/* Inner Border (simulated with nested div or pseudo-element) */}
                <div
                    className={`absolute inset-[1px] bg-[#050505] transition-all duration-300`}
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                >
                    {/* Actual Inner Content Background */}
                    <div className={`absolute inset-0 opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-20'} ${colors.bg}`}></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-3 text-center px-2">
                <motion.div
                    animate={isHovered ? { y: -5, scale: 1.1, rotate: [0, -10, 10, 0] } : { y: 0, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-xl bg-white/5 ${colors.text} ${isHovered ? 'bg-white/10 shadow-[0_0_15px_currentColor]' : ''} transition-all duration-300 ring-1 ring-white/10`}
                >
                    <Icon size={28} strokeWidth={1.5} />
                </motion.div>

                <div className="flex flex-col items-center">
                    <span className={`font-bold font-mono text-xs md:text-sm tracking-widest uppercase ${isHovered ? 'text-white' : 'text-gray-300'} transition-colors mb-1`}>
                        {skill.name}
                    </span>

                    {/* Techy Level Bar */}
                    <div className="w-12 h-[2px] bg-gray-800 mt-1 relative overflow-hidden">
                        <motion.div
                            className={`h-full absolute left-0 top-0`}
                            style={{ backgroundColor: color === 'cyan' ? '#22d3ee' : color === 'green' ? '#4ade80' : color === 'purple' ? '#a855f7' : '#fb923c', width: `${skill.level}%` }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const HexGrid: React.FC<HexGridProps> = ({ skills }) => {
    return (
        <div className="relative w-full py-10 px-4 perspective-1000">
            <div className="flex flex-wrap justify-center items-center gap-y-4 max-w-7xl mx-auto">
                {skills.map((skill, i) => (
                    <Hexagon key={i} skill={skill} index={i} />
                ))}
            </div>
        </div>
    );
};

export default HexGrid;

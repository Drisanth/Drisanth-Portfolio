import React, { useEffect, useState, useRef } from 'react';

interface GlitchTextProps {
    text: string;
    className?: string;
    speed?: number; // ms per char
    onTypingComplete?: () => void;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function GlitchText({ text, className = '', speed = 50, onTypingComplete }: GlitchTextProps) {
    const [displayText, setDisplayText] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const animate = () => {
        let iteration = 0;
        clearInterval(intervalRef.current!);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current!);
                if (onTypingComplete) onTypingComplete();
            }

            iteration += 1 / 3; // Slow down the reveal
        }, speed);
    };

    useEffect(() => {
        animate();
        return () => clearInterval(intervalRef.current!);
    }, [text]); // Re-animate if text changes

    const handleHover = () => {
        if (!isHovered) {
            setIsHovered(true);
            animate();
            setTimeout(() => setIsHovered(false), 1000);
        }
    }

    return (
        <span
            className={`font-mono ${className} cursor-default`}
            onMouseEnter={handleHover}
        >
            {displayText}
        </span>
    );
}

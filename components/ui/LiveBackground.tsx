"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LiveBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#1a1b26]">
            {/* Grid Horizon */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(79,214,190,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,214,190,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_scale(2)] opacity-30 animate-[grid-move_20s_linear_infinite]" />

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary/5 blur-[100px] rounded-full opacity-50" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-30" />

            {/* Floating Particles */}
            <Particles count={15} />
        </div>
    );
}

function Particles({ count }: { count: number }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                        opacity: 0,
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0, 0.5, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </>
    );
}

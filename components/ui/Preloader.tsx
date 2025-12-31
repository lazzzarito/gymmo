"use client";

import { motion } from "framer-motion";

export function Preloader() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center min-h-screen"
        >
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.1 }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1
                    }}
                    className="w-16 h-16 bg-primary mx-auto rotate-45 border-4 border-white"
                />
                <h1 className="font-press-start text-2xl text-white tracking-widest uppercase">
                    Cargando...
                </h1>
            </div>
        </motion.div>
    );
}

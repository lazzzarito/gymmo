"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";
import { AnimatePresence, motion } from "framer-motion";

interface PixelModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function PixelModal({ isOpen, onClose, title, children }: PixelModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-md mx-auto relative"
                    >
                        <PixelCard className="bg-background border-t-4 border-l-4 border-r-4 border-white shadow-[0_-4px_20px_rgba(0,0,0,0.5)] max-h-[85vh] overflow-y-auto rounded-t-xl rounded-b-none pb-8 scrollbar-hide">
                            <div className="flex justify-between items-center mb-6 pb-2 border-b-4 border-black/10 sticky top-0 bg-background z-10 pt-2">
                                <h2 className="font-press-start text-sm text-primary uppercase">{title}</h2>
                                <button onClick={onClose} className="hover:text-red-500 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="font-vt323 text-lg">
                                {children}
                            </div>
                        </PixelCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

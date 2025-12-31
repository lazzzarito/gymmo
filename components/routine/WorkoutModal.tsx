"use client";

import { useState, useEffect } from "react";
import { PixelModal } from "@/components/ui/PixelModal";
import { useGameStore } from "@/lib/store";
import { PixelButton } from "@/components/ui/PixelButton";
import { Check, Timer, ArrowRight, Share2, Swords } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareModal } from "@/components/ui/ShareModal";

interface WorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WorkoutModal({ isOpen, onClose }: WorkoutModalProps) {
    const { activeRoutine, addXp, logActivity } = useGameStore();

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [restSecondsLeft, setRestSecondsLeft] = useState(0);
    const [countdown, setCountdown] = useState<number | null>(null);

    // Initial Countdown Logic
    useEffect(() => {
        if (isOpen && !isFinished) {
            setCountdown(3);
        }
    }, [isOpen, isFinished]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (countdown !== null && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (countdown === 0) {
            setCountdown(null); // Start!
        }
        return () => clearInterval(interval);
    }, [countdown]);

    // Main Workout Timer (Only runs after countdown)
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && !isFinished && !isResting && countdown === null) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, isFinished, isResting, countdown]);

    // Rest Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isResting && restSecondsLeft > 0) {
            interval = setInterval(() => {
                setRestSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (isResting && restSecondsLeft <= 0) {
            setIsResting(false);
        }
        return () => clearInterval(interval);
    }, [isResting, restSecondsLeft]);

    // Reset timer when exercise changes
    useEffect(() => {
        if (!isOpen) {
            setSeconds(0);
            setIsFinished(false);
            setCurrentIndex(0);
            setCompletedSets({});
            setCountdown(null);
            setIsResting(false);
        }
    }, [isOpen]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (activeRoutine.length === 0) return null;

    const currentExercise = activeRoutine[currentIndex];

    // Safety check
    if (!currentExercise && !isFinished) return null;

    // Initialize set count for this exercise if not exists
    const currentSetsDone = completedSets[currentExercise?.instanceId || ''] || 0;

    const handleCompleteSet = () => {
        if (!currentExercise) return;

        const newCount = currentSetsDone + 1;
        setCompletedSets({ ...completedSets, [currentExercise.instanceId]: newCount });

        // Trigger Rest if not the last set
        if (newCount < currentExercise.config.sets) {
            setRestSecondsLeft(currentExercise.config.restTime || 120);
            setIsResting(true);
        }
    };

    const skipRest = () => {
        setIsResting(false);
        setRestSecondsLeft(0);
    };

    const handleNextExercise = () => {
        if (currentIndex < activeRoutine.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishWorkout();
        }
    };

    const finishWorkout = () => {
        setIsFinished(true);
        const totalXp = activeRoutine.reduce((acc, ex) => acc + ex.xpReward, 0);
        addXp(totalXp);
        logActivity({
            type: 'workout',
            title: `Dungeon Run: ${activeRoutine[0]?.muscle || 'Entrenamiento'}`,
            xpEarned: totalXp
        });
    };

    return (
        <>
            <PixelModal isOpen={isOpen} onClose={onClose} title={isFinished ? "¡VICTORIA!" : (countdown !== null ? "PREPARANDO..." : "INCURSIÓN")}>
                <div className="relative min-h-[400px] flex flex-col justify-center overflow-hidden">
                    {countdown !== null ? (
                        <motion.div
                            key="countdown"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="flex items-center justify-center h-full"
                        >
                            <span className="font-vt323 text-9xl text-primary animate-pulse font-bold">{countdown === 0 ? "¡YA!" : countdown}</span>
                        </motion.div>
                    ) : isFinished ? (
                        <div className="text-center py-8 space-y-4">
                            <h3 className="font-press-start text-xl text-yellow-400">ENTRENAMIENTO COMPLETADO</h3>
                            <p className="font-vt323 text-lg text-gray-400">Has sobrevivido a la mazmorra.</p>
                            <PixelButton onClick={() => setIsShareOpen(true)} className="w-full mt-4" variant="secondary">
                                <Share2 className="w-4 h-4 mr-2" /> COMPARTIR VICTORIA
                            </PixelButton>
                            <PixelButton onClick={onClose} className="w-full mt-2">VOLVER AL HUB</PixelButton>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Header: Progress */}
                            <div className="flex justify-between text-xs font-press-start text-gray-500">
                                <span>EJERCICIO {currentIndex + 1}/{activeRoutine.length}</span>
                                <span className="text-secondary flex items-center gap-1 font-mono">
                                    <Timer className="w-3 h-3" /> {formatTime(seconds)}
                                </span>
                            </div>

                            {/* Current Exercise Card */}
                            <div className="text-center space-y-2">
                                <div className="text-4xl mb-2">{currentExercise.icon}</div>
                                <h2 className="font-press-start text-lg text-white">{currentExercise.name}</h2>
                                <div className="font-vt323 text-xl text-gray-400">
                                    {currentExercise.config?.sets || 0} SERIES x {currentExercise.config?.reps || 0} REPS @ {currentExercise.config?.weight || 0}KG
                                </div>
                            </div>

                            {/* Sets Management */}
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: currentExercise.config?.sets || 0 }).map((_, i) => (
                                    <button
                                        key={i}
                                        disabled={i > currentSetsDone}
                                        onClick={handleCompleteSet}
                                        className={`
                                        h-12 border-2 flex items-center justify-center transition-all
                                        ${i < currentSetsDone ? 'bg-primary border-primary text-black' : 'bg-transparent border-gray-600 text-gray-600'}
                                        ${i === currentSetsDone ? 'border-white animate-pulse cursor-pointer' : ''}
                                    `}
                                    >
                                        {i < currentSetsDone ? <Check className="w-6 h-6" /> : i + 1}
                                    </button>
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="pt-4 border-t-2 border-dashed border-gray-700">
                                {currentSetsDone >= (currentExercise.config?.sets || 0) ? (
                                    <PixelButton onClick={handleNextExercise} className="w-full animate-bounce">
                                        {currentIndex === activeRoutine.length - 1 ? "FINALIZAR" : "SIGUIENTE EJERCICIO"} <ArrowRight className="ml-2 w-4 h-4" />
                                    </PixelButton>
                                ) : (
                                    <p className="text-center font-vt323 text-gray-500">Completa los sets para avanzar.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Rest Timer Overlay (Inside Modal) */}
                    <AnimatePresence>
                        {isResting && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-yellow-500/30"
                            >
                                <div className="text-center space-y-6">
                                    <h2 className="font-press-start text-xl text-secondary animate-pulse">DESCANSANDO</h2>

                                    <div className="relative w-40 h-40 flex items-center justify-center mx-auto">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" r="70" stroke="#333" strokeWidth="8" fill="none" />
                                            <circle
                                                cx="80" cy="80" r="70"
                                                stroke="#fbbf24" strokeWidth="8" fill="none"
                                                strokeDasharray={440}
                                                strokeDashoffset={440 - (440 * restSecondsLeft) / (currentExercise?.config.restTime || 120)}
                                                className="transition-all duration-1000 ease-linear"
                                            />
                                        </svg>
                                        <div className="font-vt323 text-5xl text-white">{formatTime(restSecondsLeft)}</div>
                                    </div>

                                    <div className="space-y-2 w-full">
                                        <p className="font-vt323 text-gray-400 text-lg">Respira profundo...</p>
                                        <PixelButton onClick={skipRest} variant="outline" className="w-full">
                                            SALTAR DESCANSO
                                        </PixelButton>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PixelModal>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title="MAZMORRA PURIFICADA"
                subtitle={`${activeRoutine.length} ejercicios conquistados.`}
                type="WORKOUT"
                color="border-primary"
                stats={[
                    { label: "Tiempo", value: formatTime(seconds), color: "text-white" },
                    { label: "XP Ganada", value: `+${activeRoutine.reduce((acc, ex) => acc + ex.xpReward, 0)}`, color: "text-yellow-400" }
                ]}
                icon={<Swords className="w-8 h-8 text-primary" />}
            />
        </>
    );
}

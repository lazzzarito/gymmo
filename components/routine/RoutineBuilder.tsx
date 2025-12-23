"use client";

import { useGameStore } from "@/lib/store";
import { EXERCISE_DB, Exercise } from "@/lib/exercises";
import { ExerciseCard } from "./ExerciseCard";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { Swords } from "lucide-react";

import { CreateRoutineModal } from "./CreateRoutineModal";
import { WorkoutModal } from "./WorkoutModal";
import { useState } from "react";

export function RoutineBuilder() {
    const { activeRoutine, addToRoutine, removeFromRoutine } = useGameStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);

    // Group exercises by Muscle for easier navigation (simplified for now)
    const allExercises = EXERCISE_DB;

    return (
        <div className="space-y-6">
            {/* Active Routine (The Inventory) */}
            <section className="bg-black/20 p-4 border-2 border-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-press-start text-xs text-secondary">RUTINA ACTIVA ({activeRoutine.length})</h2>
                    <span className="font-vt323 text-gray-400 text-sm">Experiencia: {activeRoutine.reduce((acc, ex) => acc + ex.xpReward, 0)} XP</span>
                </div>

                {activeRoutine.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 font-vt323 border-2 border-dashed border-gray-700">
                        Tu grimorio está vacío.<br />Selecciona ejercicios abajo.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {activeRoutine.map((ex, idx) => (
                            <PixelCard key={ex.instanceId || `${ex.id}-${idx}`} className="flex items-center justify-between py-2 px-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{ex.icon}</span>
                                    <div>
                                        <div className="font-vt323 text-lg leading-none">{ex.name}</div>
                                        <div className="font-press-start text-[8px] text-gray-400 mt-1">
                                            {ex.config?.sets || 0}x{ex.config?.reps || 0} • {ex.config?.technique || 'Legacy'}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeFromRoutine(ex.instanceId)} className="text-red-400 hover:text-red-300">
                                    [x]
                                </button>
                            </PixelCard>
                        ))}
                        <PixelButton className="w-full mt-4" variant="primary" onClick={() => setIsWorkoutOpen(true)}>
                            <Swords className="w-4 h-4 mr-2" /> COMENZAR BATALLA
                        </PixelButton>
                    </div>
                )}
            </section>

            {/* Modal Trigger & Component */}
            <div className="mt-4">
                <PixelButton className="w-full" variant="outline" onClick={() => setIsModalOpen(true)}>
                    <div className="flex items-center justify-center gap-2">
                        <span>📖</span>
                        <span>ABRIR GRIMORIO (AÑADIR)</span>
                    </div>
                </PixelButton>
            </div>

            <CreateRoutineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <WorkoutModal isOpen={isWorkoutOpen} onClose={() => setIsWorkoutOpen(false)} />
        </div>
    );
}

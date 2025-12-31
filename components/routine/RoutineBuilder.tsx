"use client";

import { useGameStore } from "@/lib/store";
import { EXERCISE_DB, Exercise } from "@/lib/exercises";
import { ExerciseCard } from "./ExerciseCard";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { Swords, ArrowUp, ArrowDown, Edit3 } from "lucide-react";

import { CreateRoutineModal } from "./CreateRoutineModal";
import { WorkoutModal } from "./WorkoutModal";
import { ExerciseDetailsModal } from "./ExerciseDetailsModal";
import { useState } from "react";

export function RoutineBuilder() {
    const { activeRoutine, addToRoutine, removeFromRoutine, reorderRoutine } = useGameStore();
    const [isBrowserOpen, setIsBrowserOpen] = useState(false);
    const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<{ ex: any, id: string } | null>(null);

    return (
        <div className="space-y-6">
            {/* Active Routine (The Inventory) */}
            <section className="bg-black/20 p-4 border-2 border-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-press-start text-xs text-secondary">RUTINA ACTIVA ({activeRoutine.length})</h2>
                    <span className="font-vt323 text-gray-400 text-sm">Experiencia: {activeRoutine.reduce((acc, ex) => acc + (ex.xpReward || 0), 0)} XP</span>
                </div>

                {activeRoutine.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 font-vt323 border-2 border-dashed border-gray-700">
                        Tu grimorio está vacío.<br />Selecciona ejercicios abajo.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {activeRoutine.map((ex, idx) => (
                            <PixelCard key={ex.instanceId || `${ex.id}-${idx}`} className="flex items-center justify-between py-2 px-3 group">
                                <div className="flex items-center gap-3">
                                    {/* Reorder Controls */}
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => idx > 0 && reorderRoutine(idx, idx - 1)}
                                            className="p-1 hover:bg-gray-800 rounded disabled:opacity-30"
                                            disabled={idx === 0}
                                        >
                                            <ArrowUp className="w-3 h-3 text-secondary" />
                                        </button>
                                        <button
                                            onClick={() => idx < activeRoutine.length - 1 && reorderRoutine(idx, idx + 1)}
                                            className="p-1 hover:bg-gray-800 rounded disabled:opacity-30"
                                            disabled={idx === activeRoutine.length - 1}
                                        >
                                            <ArrowDown className="w-3 h-3 text-secondary" />
                                        </button>
                                    </div>

                                    <span className="text-xl">{ex.icon}</span>
                                    <div>
                                        <div className="font-vt323 text-lg leading-none">{ex.name}</div>
                                        <div className="font-press-start text-[8px] text-gray-400 mt-1">
                                            {ex.config?.sets || 0}x{ex.config?.reps || 0} • {ex.config?.weight || 0}kg
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingExercise({ ex, id: ex.instanceId })}
                                        className="p-2 text-gray-400 hover:text-white"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => removeFromRoutine(ex.instanceId)} className="p-2 text-red-400 hover:text-red-300 font-vt323 text-xl">
                                        x
                                    </button>
                                </div>
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
                <PixelButton className="w-full" variant="outline" onClick={() => setIsBrowserOpen(true)}>
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <span>📖</span>
                        <span>ABRIR GRIMORIO (AÑADIR)</span>
                    </div>
                </PixelButton>
            </div>

            <CreateRoutineModal isOpen={isBrowserOpen} onClose={() => setIsBrowserOpen(false)} />
            <WorkoutModal isOpen={isWorkoutOpen} onClose={() => setIsWorkoutOpen(false)} />

            <ExerciseDetailsModal
                isOpen={!!editingExercise}
                onClose={() => setEditingExercise(null)}
                mode="EDIT"
                exercise={editingExercise?.ex}
                instanceId={editingExercise?.id}
                initialConfig={editingExercise?.ex?.config}
            />
        </div>
    );
}

"use client";

import { useState } from "react";
import { PixelModal } from "@/components/ui/PixelModal";
import { EXERCISE_DB, MuscleGroup, Exercise } from "@/lib/exercises";
import { useGameStore } from "@/lib/store";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput } from "@/components/ui/PixelInput";
import { Search, Plus } from "lucide-react";
import { ExerciseDetailsModal } from "./ExerciseDetailsModal";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

interface CreateRoutineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateRoutineModal({ isOpen, onClose }: CreateRoutineModalProps) {
    const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
    const [search, setSearch] = useState("");
    const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

    const { ref: scrollRef, events: scrollEvents } = useDraggableScroll();

    const muscleGroups: (MuscleGroup | 'All')[] = ['All', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Abdominales', 'Cardio'];

    const filteredExercises = EXERCISE_DB.filter(ex => {
        const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
        const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        return matchMuscle && matchSearch;
    }).slice(0, 50);

    return (
        <>
            <PixelModal isOpen={isOpen} onClose={onClose} title="EXPLORADOR DE GRIMORIO">
                <div className="space-y-4">
                    {/* Filters */}
                    <div
                        {...scrollEvents}
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide select-none cursor-grab active:cursor-grabbing"
                        style={scrollEvents.style}
                    >
                        {muscleGroups.map(m => (
                            <button
                                key={m}
                                onClick={() => setSelectedMuscle(m)}
                                className={`px-3 py-1.5 text-[10px] whitespace-nowrap border-2 font-press-start transition-all ${selectedMuscle === m
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                {m === 'All' ? 'TODO' : m.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <PixelInput
                            placeholder="Buscar técnica..."
                            className="pl-9 h-10 border-gray-800 focus:border-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="h-[40vh] overflow-y-auto space-y-2 border-t-2 border-dashed border-gray-800 pt-4 scrollbar-hide">
                        {filteredExercises.map(ex => (
                            <div
                                key={ex.id}
                                className="flex justify-between items-center p-3 border-2 border-gray-800 bg-black/40 hover:border-gray-600 transition-all cursor-pointer group"
                                onClick={() => setDetailExercise(ex)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl w-8 text-center">{ex.icon}</span>
                                    <div>
                                        <div className="font-press-start text-[9px] mb-1 text-gray-300 group-hover:text-white transition-colors">{ex.name}</div>
                                        <div className="font-vt323 text-gray-500 text-sm">{ex.difficulty} • {ex.muscle}</div>
                                    </div>
                                </div>
                                <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                            </div>
                        ))}
                    </div>

                    <PixelButton onClick={onClose} className="w-full" variant="secondary">
                        CERRAR GRIMORIO
                    </PixelButton>
                </div>
            </PixelModal>

            <ExerciseDetailsModal
                isOpen={!!detailExercise}
                onClose={() => setDetailExercise(null)}
                exercise={detailExercise}
                mode="ADD"
            />
        </>
    );
}

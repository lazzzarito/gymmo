"use client";

import { useState } from "react";
import { EXERCISE_DB, MuscleGroup, Exercise } from "@/lib/exercises";
import { useGameStore } from "@/lib/store";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput } from "@/components/ui/PixelInput";
import { Search, Plus } from "lucide-react";
import { PixelCard } from "@/components/ui/PixelCard";
import { ExerciseDetailsModal } from "./ExerciseDetailsModal";

import { useDraggableScroll } from "@/hooks/useDraggableScroll";

// Converted from Modal to an inline component
export function ExerciseBrowser() {
    const { addToRoutine } = useGameStore();
    const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
    const [search, setSearch] = useState("");

    // Draggable Scroll Hook
    const { ref: scrollRef, events: scrollEvents } = useDraggableScroll();

    // Configuration State
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [config, setConfig] = useState({ sets: 4, reps: 10, weight: 20 });
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);

    const muscleGroups: (MuscleGroup | 'All')[] = ['All', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Abdominales', 'Cardio'];

    const filteredExercises = EXERCISE_DB.filter(ex => {
        const matchMuscle = selectedMuscle === 'All' || ex.muscle === selectedMuscle;
        const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        return matchMuscle && matchSearch;
    }).slice(0, 50);

    const handleAdd = () => {
        if (selectedExercise) {
            addToRoutine(selectedExercise, {
                sets: Number(config.sets),
                reps: Number(config.reps),
                weight: Number(config.weight),
                technique: 'Normal'
            });

            // Visual feedback
            const id = selectedExercise.id;
            setLastAddedId(id);
            setTimeout(() => setLastAddedId(null), 2000);

            setSelectedExercise(null);
        }
    };

    return (
        <section className="space-y-4 pt-6 border-t border-gray-800">
            <h2 className="font-press-start text-[10px] text-gray-500 uppercase px-1">Grimorio de Ejercicios</h2>

            {/* Configuration View (Inline) */}
            {/* Modal for Details & Add */}
            <ExerciseDetailsModal
                isOpen={!!selectedExercise}
                onClose={() => setSelectedExercise(null)}
                exercise={selectedExercise}
                mode="ADD"
            />

            {/* Browser View */}
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

                <div className="h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                    {filteredExercises.map(ex => (
                        <div
                            key={ex.id}
                            onClick={() => setSelectedExercise(ex)}
                            className={`
                                flex justify-between items-center p-3 border-2 cursor-pointer transition-all group
                                ${selectedExercise?.id === ex.id ? 'border-secondary bg-secondary/10' : 'border-gray-800 bg-black/40 hover:border-gray-600'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl w-8 text-center">{ex.icon}</span>
                                <div>
                                    <div className={`font-press-start text-[9px] mb-1 ${selectedExercise?.id === ex.id ? 'text-secondary' : 'text-gray-300'}`}>
                                        {ex.name}
                                    </div>
                                    <div className="font-vt323 text-gray-500 text-sm">
                                        {ex.difficulty} • {ex.muscle}
                                    </div>
                                </div>
                            </div>
                            <div className={`p-1.5 rounded-sm transition-colors ${lastAddedId === ex.id ? 'bg-green-500 text-black' : 'text-gray-600 group-hover:text-white'}`}>
                                {lastAddedId === ex.id ? <span className="font-press-start text-[8px]">AÑADIDO</span> : <Plus className="w-4 h-4" />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

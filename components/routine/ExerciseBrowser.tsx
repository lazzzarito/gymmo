"use client";

import { useState } from "react";
import { EXERCISE_DB, MuscleGroup, Exercise } from "@/lib/exercises";
import { useGameStore } from "@/lib/store";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelInput } from "@/components/ui/PixelInput";
import { Search, Plus, ArrowLeft } from "lucide-react";

interface ExerciseBrowserProps {
    inline?: boolean;
}

export function ExerciseBrowser({ inline = false }: ExerciseBrowserProps) {
    const { addToRoutine } = useGameStore();
    const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
    const [search, setSearch] = useState("");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [config, setConfig] = useState({ sets: 4, reps: 10, weight: 20 });

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
            setSelectedExercise(null);
        }
    };

    return (
        <div className={`space-y-4 ${inline ? 'bg-black/20 p-6 border-2 border-gray-800 rounded-lg h-full overflow-hidden flex flex-col' : ''}`}>
            {selectedExercise ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b-2 border-gray-700 pb-4">
                        <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-white/10 rounded">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <div>
                            <h3 className="font-press-start text-xs text-secondary">{selectedExercise.name}</h3>
                            <p className="text-gray-400 text-sm mt-1">{selectedExercise.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-press-start text-gray-500 block">SERIES</label>
                            <PixelInput type="number" value={config.sets} onChange={(e) => setConfig({ ...config, sets: +e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-press-start text-gray-500 block">REPS</label>
                            <PixelInput type="number" value={config.reps} onChange={(e) => setConfig({ ...config, reps: +e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-press-start text-gray-500 block">KG</label>
                            <PixelInput type="number" value={config.weight} onChange={(e) => setConfig({ ...config, weight: +e.target.value })} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <PixelButton variant="outline" onClick={() => setSelectedExercise(null)} className="flex-1">
                            ATRÁS
                        </PixelButton>
                        <PixelButton variant="primary" onClick={handleAdd} className="flex-1">
                            AÑADIR AL GRIMORIO
                        </PixelButton>
                    </div>
                </div>
            ) : (
                <>
                    {inline && <h2 className="font-press-start text-xs text-primary mb-2">CATÁLOGO DE TÉCNICAS</h2>}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
                        {muscleGroups.map(m => (
                            <button
                                key={m}
                                onClick={() => setSelectedMuscle(m)}
                                className={`px-3 py-1.5 text-[10px] font-press-start whitespace-nowrap border-2 transition-colors ${selectedMuscle === m ? 'border-primary bg-primary/20 text-primary' : 'border-gray-800 bg-transparent text-gray-500 hover:border-gray-600'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="relative shrink-0">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <PixelInput
                            placeholder="Buscar en el grimorio..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={`overflow-y-auto space-y-2 border-t-2 border-dashed border-gray-800 pt-4 pr-1 ${inline ? 'flex-1' : 'h-[40vh]'}`}>
                        {filteredExercises.map(ex => (
                            <div
                                key={ex.id}
                                className="flex justify-between items-center p-3 hover:bg-white/5 border-2 border-transparent hover:border-gray-700 transition-all cursor-pointer group"
                                onClick={() => setSelectedExercise(ex)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{ex.icon}</span>
                                    <div>
                                        <div className="text-sm font-vt323 text-lg leading-none">{ex.name}</div>
                                        <div className="text-[10px] font-press-start text-gray-500 mt-1 uppercase">{ex.difficulty} • {ex.muscle}</div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded border-2 border-gray-800 flex items-center justify-center group-hover:border-primary transition-colors">
                                    <Plus className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

"use client";

import { PixelModal } from "../ui/PixelModal";
import { Exercise } from "@/lib/exercises";
import { useGameStore } from "@/lib/store";
import { PixelButton } from "../ui/PixelButton";
import { PixelInput } from "../ui/PixelInput";
import { useState, useEffect } from "react";
import { Dumbbell, Plus, Save } from "lucide-react";
import { PixelCard } from "../ui/PixelCard";

interface ExerciseDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercise: Exercise | null;
    mode: 'ADD' | 'EDIT';
    instanceId?: string; // Only for EDIT mode
    initialConfig?: { sets: number; reps: number; weight: number; technique?: string };
}

export function ExerciseDetailsModal({ isOpen, onClose, exercise, mode, instanceId, initialConfig }: ExerciseDetailsModalProps) {
    const { addToRoutine, updateRoutineItem } = useGameStore();

    const [config, setConfig] = useState<{
        sets: number;
        reps: number;
        weight: number;
        restTime: number;
    }>({ sets: 4, reps: 10, weight: 20, restTime: 120 });

    useEffect(() => {
        if (initialConfig) {
            setConfig({
                sets: initialConfig.sets,
                reps: initialConfig.reps,
                weight: initialConfig.weight,
                restTime: initialConfig.restTime || 120
            });
        } else {
            // Default values reset when opening in ADD mode
            setConfig({ sets: 4, reps: 10, weight: 20, restTime: 120 });
        }
    }, [initialConfig, isOpen]);

    if (!exercise) return null;

    const handleAction = () => {
        if (mode === 'ADD') {
            addToRoutine(exercise, {
                sets: Number(config.sets),
                reps: Number(config.reps),
                weight: Number(config.weight),
                technique: 'Normal',
                restTime: Number(config.restTime)
            });
        } else if (mode === 'EDIT' && instanceId) {
            updateRoutineItem(instanceId, {
                sets: Number(config.sets),
                reps: Number(config.reps),
                weight: Number(config.weight),
                restTime: Number(config.restTime)
            });
        }
        onClose();
    };

    return (
        <PixelModal isOpen={isOpen} onClose={onClose} title={mode === 'ADD' ? 'AÑADIR A BATALLA' : 'EDITAR TÁCTICA'}>
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex gap-4 items-start">
                    <div className="p-4 border-2 border-secondary bg-secondary/10 text-4xl flex items-center justify-center rounded">
                        {exercise.icon}
                    </div>
                    <div>
                        <h3 className="font-press-start text-sm text-white mb-1 uppercase leading-snug">{exercise.name}</h3>
                        <div className="flex gap-2 mb-2">
                            <span className="font-vt323 px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-sm">{exercise.type}</span>
                            <span className="font-vt323 px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-sm">{exercise.muscle}</span>
                            <span className="font-vt323 px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-sm">{exercise.difficulty}</span>
                        </div>
                        <p className="font-vt323 text-lg text-gray-400 leading-tight">{exercise.description}</p>
                    </div>
                </div>

                {/* Instructions */}
                {exercise.instructions && (
                    <PixelCard className="bg-black/40 border-gray-800 p-4">
                        <h4 className="font-press-start text-[10px] text-secondary mb-3 uppercase">Instrucciones de Combate</h4>
                        <ol className="list-decimal pl-4 space-y-2 font-vt323 text-lg text-gray-300">
                            {exercise.instructions.map((step, idx) => (
                                <li key={idx} className="leading-snug">{step}</li>
                            ))}
                        </ol>
                    </PixelCard>
                )}

                {/* Configuration Inputs */}
                <div className="grid grid-cols-4 gap-3 bg-gray-900/50 p-4 border border-gray-700 rounded-lg">
                    <div className="col-span-4 font-press-start text-[10px] text-gray-500 mb-1 text-center uppercase">Configuración de Táctica</div>
                    <div>
                        <label className="text-[10px] font-vt323 uppercase text-gray-400 block mb-1 text-center">SETS</label>
                        <PixelInput type="number" value={config.sets} onChange={(e) => setConfig({ ...config, sets: +e.target.value })} className="h-10 text-center text-lg" />
                    </div>
                    <div>
                        <label className="text-[10px] font-vt323 uppercase text-gray-400 block mb-1 text-center">REPS</label>
                        <PixelInput type="number" value={config.reps} onChange={(e) => setConfig({ ...config, reps: +e.target.value })} className="h-10 text-center text-lg" />
                    </div>
                    <div>
                        <label className="text-[10px] font-vt323 uppercase text-gray-400 block mb-1 text-center">KG</label>
                        <PixelInput type="number" value={config.weight} onChange={(e) => setConfig({ ...config, weight: +e.target.value })} className="h-10 text-center text-lg" />
                    </div>
                    <div>
                        <label className="text-[10px] font-vt323 uppercase text-gray-400 block mb-1 text-center">DESC (s)</label>
                        <PixelInput type="number" value={config.restTime} onChange={(e) => setConfig({ ...config, restTime: +e.target.value })} className="h-10 text-center text-lg" />
                    </div>
                </div>

                <PixelButton onClick={handleAction} className="w-full">
                    {mode === 'ADD' ? (
                        <>AÑADIR <Plus className="w-4 h-4 ml-2" /></>
                    ) : (
                        <>GUARDAR CAMBIOS <Save className="w-4 h-4 ml-2" /></>
                    )}
                </PixelButton>
            </div>
        </PixelModal>
    );
}

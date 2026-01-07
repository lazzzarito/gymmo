"use client";

import { PixelModal } from "@/components/ui/PixelModal";
import { PixelButton } from "@/components/ui/PixelButton";
import { useGameStore, WeeklyPlan, DaySchedule, DailyQuest } from "@/lib/store";
import { useState } from "react";
import { MuscleGroup } from "@/lib/exercises";
import { cn } from "@/lib/utils";
import { generateDailyRoutine, generateDailyQuest } from "@/lib/generator";

interface WeeklyPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MUSCLE_OPTIONS: MuscleGroup[] = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Bíceps', 'Tríceps', 'Abdominales', 'Cardio'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS: Record<string, string> = { 'Mon': 'Lunes', 'Tue': 'Martes', 'Wed': 'Miércoles', 'Thu': 'Jueves', 'Fri': 'Viernes', 'Sat': 'Sábado', 'Sun': 'Domingo' };
const DAY_SHORT: Record<string, string> = { 'Mon': 'L', 'Tue': 'M', 'Wed': 'M', 'Thu': 'J', 'Fri': 'V', 'Sat': 'S', 'Sun': 'D' };

export function WeeklyPlannerModal({ isOpen, onClose }: WeeklyPlannerModalProps) {
    const { weeklyPlan, updateWeeklyPlan } = useGameStore();

    // Defensive merge: Ensure all days exist even if store data is old
    const defaultPlan: WeeklyPlan = {};
    DAYS.forEach(day => {
        defaultPlan[day] = { muscles: [], time: '18:00', mode: 'solo', isActive: false };
    });

    // Merge defaults with existing plan
    const initialPlan = { ...defaultPlan, ...weeklyPlan };

    const [tempPlan, setTempPlan] = useState<WeeklyPlan>(initialPlan);
    const [selectedDay, setSelectedDay] = useState<string>('Mon');

    const handleToggleMuscle = (muscle: MuscleGroup) => {
        const currentDay = tempPlan[selectedDay];
        const isSelected = currentDay.muscles.includes(muscle);

        let newMuscles = isSelected
            ? currentDay.muscles.filter(m => m !== muscle)
            : [...currentDay.muscles, muscle];

        setTempPlan({
            ...tempPlan,
            [selectedDay]: {
                ...currentDay,
                muscles: newMuscles,
                isActive: newMuscles.length > 0
            }
        });
    };

    const handleSave = () => {
        updateWeeklyPlan(tempPlan);

        // Auto-generate if today is active and has muscles
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayKey = days[new Date().getDay()];
        const todayPlan = tempPlan[todayKey];

        if (todayPlan?.isActive && todayPlan.muscles.length > 0) {
            const { level, setRoutine, updateProfile } = useGameStore.getState();

            // Always create a fresh routine and quest when plan is saved if it's training day
            // This ensures the current quest/routine matches the NEWLY saved plan
            const newRoutine = generateDailyRoutine(todayPlan.muscles, level || 1);
            setRoutine(newRoutine);

            const smartQuest = generateDailyQuest(todayPlan.muscles);
            updateProfile({ dailyQuest: smartQuest as DailyQuest });
        } else {
            // If today is now a rest day, clear them
            const { setRoutine, updateProfile } = useGameStore.getState();
            setRoutine([]);
            updateProfile({ dailyQuest: null });
        }

        onClose();
    };

    const handleResetDay = () => {
        setTempPlan({
            ...tempPlan,
            [selectedDay]: {
                muscles: [],
                time: '18:00',
                mode: 'solo',
                isActive: false
            }
        });
    };

    const currentSchedule = tempPlan[selectedDay] || { muscles: [], time: '18:00', mode: 'solo', isActive: false };

    return (
        <PixelModal isOpen={isOpen} onClose={onClose} title="PLANIFICADOR SEMANAL">
            <div className="space-y-6">

                {/* Day Selector */}
                <div className="flex justify-between gap-1 overflow-x-auto bg-black/30 p-2 rounded">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                                "flex flex-col items-center p-3 border-2 transition-all min-w-[50px] h-20 justify-center rounded-md",
                                selectedDay === day ? "border-white bg-primary text-black translate-y-[-4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]" : "border-transparent text-gray-400 hover:text-white bg-black/40",
                                tempPlan[day]?.isActive && selectedDay !== day ? "border-primary/50 text-white" : ""
                            )}
                        >
                            <span className="font-press-start text-[10px] sm:text-xs">{DAY_SHORT[day]}</span>
                            {tempPlan[day]?.isActive && <div className="w-2 h-2 bg-green-400 mt-2 rounded-full" />}
                        </button>
                    ))}
                </div>

                {/* Editor for Selected Day */}
                <div className="bg-gray-900 border-2 border-gray-700 p-4 rounded space-y-4">
                    <div className="flex justify-between items-center text-primary font-press-start text-sm border-b border-gray-700 pb-2">
                        <span>{DAY_LABELS[selectedDay]}</span>
                        <span>{currentSchedule.isActive ? "ENTRENAMIENTO" : "DESCANSO"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {MUSCLE_OPTIONS.map(muscle => (
                            <button
                                key={muscle}
                                onClick={() => handleToggleMuscle(muscle)}
                                className={cn(
                                    "text-left p-4 text-sm font-vt323 border-2 transition-all rounded hover:brightness-110 active:scale-95",
                                    currentSchedule.muscles.includes(muscle)
                                        ? "border-secondary text-secondary bg-secondary/10 shadow-[2px_2px_0px_0px_rgba(255,200,0,0.3)]"
                                        : "border-gray-700 text-gray-500 bg-black/20"
                                )}
                            >
                                {currentSchedule.muscles.includes(muscle) ? "[X] " : "[ ] "}
                                {muscle}
                            </button>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-gray-700 font-vt323 text-gray-400 text-sm flex justify-between items-center">
                        <label>Hora: <input type="time" className="bg-transparent border-b border-gray-500 text-white" defaultValue={currentSchedule.time} /></label>
                        <PixelButton size="sm" variant="secondary" onClick={handleResetDay}>
                            REINICIAR DÍA
                        </PixelButton>
                    </div>
                </div>

                <div className="flex gap-2">
                    <PixelButton onClick={handleSave} className="w-full">
                        GUARDAR PLAN
                    </PixelButton>
                </div>
            </div>
        </PixelModal>
    );
}

"use client";

import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { Flame, Calendar, ArrowRight, Swords, Skull, Check } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { QuestModal } from "@/components/hub/QuestModal";

import { WeeklyPlannerModal } from "@/components/hub/WeeklyPlannerModal";
import { generateDailyRoutine, generateDailyQuest } from "@/lib/generator";
import { useRouter } from "next/navigation";
import { OracleSuggestion } from "@/components/hub/OracleSuggestion";
import { RoutineManagerModal } from "@/components/routine/RoutineManagerModal";
import { StreakFlame } from "@/components/hub/StreakFlame";
import { HydrationTracker } from "@/components/hub/HydrationTracker";
import { WeightTracker } from "@/components/hub/WeightTracker";

export default function Hub() {
    const { dailyQuest, weeklyPlan, level, setRoutine, updateProfile } = useGameStore();
    const router = useRouter();
    const [isQuestOpen, setIsQuestOpen] = useState(false);
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [isBossOpen, setIsBossOpen] = useState(false);
    const [isRoutineOpen, setIsRoutineOpen] = useState(false);

    // 1. Detect Today's Plan
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayKey = days[todayIndex];
    const todayPlan = weeklyPlan?.[todayKey];

    // Determine if Boss Level
    const isBossLevel = level % 10 === 0;

    // 2. [EFFECT] Generate Smart Daily Quest on Load
    useEffect(() => {
        if (todayPlan?.isActive && todayPlan.muscles.length > 0 && !dailyQuest && !isBossLevel) {
            const smartQuest = generateDailyQuest(todayPlan.muscles);
            updateProfile({ dailyQuest: smartQuest });
        }
    }, [todayKey, todayPlan?.isActive, JSON.stringify(todayPlan?.muscles), isBossLevel, dailyQuest, updateProfile]);

    const handleDungeonRun = () => {
        if (!todayPlan || !todayPlan.isActive) {
            setIsPlannerOpen(true);
            return;
        }

        // If for some reason the routine wasn't generated on save, generate it now
        const { activeRoutine } = useGameStore.getState();
        if (activeRoutine.length === 0) {
            const newRoutine = generateDailyRoutine(todayPlan.muscles, level || 1);
            setRoutine(newRoutine);
        }

        setIsRoutineOpen(true);
    };

    const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const DAY_NAMES: Record<string, string> = { 'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mié', 'Thu': 'Jue', 'Fri': 'Vie', 'Sat': 'Sáb', 'Sun': 'Dom' };

    return (
        <div className="max-w-md mx-auto space-y-4 pb-5 pt-0.1 px-0.2">

            {/* 1. STREAK FLAME (New Feature 1) */}
            <section>
                <StreakFlame />
            </section>

            {/* 2. Misión Diaria (Daily Quest) */}
            <section>
                <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-primary animate-pulse" />
                    <h2 className="font-press-start text-[10px] text-primary">MISIÓN DIARIA</h2>
                </div>

                {dailyQuest ? (
                    <PixelCard className="bg-gradient-to-br from-surface to-black/50 border-primary/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Swords className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-vt323 text-2xl mb-1 text-white">{dailyQuest.title}</h3>
                            <div className="text-sm text-gray-400 font-vt323 px-2 border-l-2 border-secondary space-y-1 mb-3">
                                {dailyQuest.description.map((line, i) => (
                                    <span key={i} className="block">• {line}</span>
                                ))}
                            </div>
                            <PixelButton className="w-full" variant="primary" size="sm" onClick={() => setIsQuestOpen(true)}>
                                ACEPTAR RETO
                            </PixelButton>
                        </div>
                    </PixelCard>
                ) : todayPlan?.isActive ? (
                    <div className="text-center text-gray-500 font-vt323 py-4 border-2 border-dashed border-gray-800 rounded animate-pulse">
                        Generando misión para hoy...
                    </div>
                ) : (
                    <div className="text-center text-gray-400 font-vt323 py-4 border-2 border-dashed border-gray-800 rounded bg-black/20">
                        Hoy es día de descanso. Planifica tu semana para entrenar.
                    </div>
                )}
                <QuestModal isOpen={isQuestOpen} onClose={() => setIsQuestOpen(false)} />
            </section>


            {/* 3. Start Routine (Action Card) - Restored Visuals */}
            <section>
                <PixelCard
                    className="group cursor-pointer hover:border-secondary transition-colors relative overflow-hidden bg-gray-900"
                    onClick={handleDungeonRun}
                >
                    {/* Background Art */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />

                    <div className="relative z-10 flex items-center justify-between p-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 border-2 border-secondary bg-black flex items-center justify-center rounded">
                                <Swords className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h3 className="font-press-start text-[10px] text-white group-hover:text-secondary uppercase">Entrenamiento</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-vt323 text-gray-400 text-sm">Nivel Recomendado: {level}</span>
                                </div>
                            </div>
                        </div>
                        <ArrowRight className="text-gray-500 group-hover:text-white" />
                    </div>
                    {/* Action Bar */}
                    <div className="mt-2 bg-black/50 border-t border-gray-800 p-2 text-center font-press-start text-[8px] text-secondary tracking-widest uppercase">
                        INICIAR COMBATE
                    </div>
                </PixelCard>
            </section>

            {/* 4. Planificación Semanal (Weekly Planner) */}
            <section>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white" />
                        <h2 className="font-press-start text-[10px] text-secondary uppercase">Tu Semana</h2>
                    </div>
                </div>

                <PixelCard className="p-3" onClick={() => setIsPlannerOpen(true)}>
                    <div className="grid grid-cols-7 gap-0.5 h-16">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayKey, idx) => {
                            const currentDayIndex = (new Date().getDay() + 6) % 7; // Mon=0
                            const isToday = idx === currentDayIndex;
                            const isPast = idx < currentDayIndex;
                            const plan = weeklyPlan[dayKey] || { muscles: [], isActive: false };
                            const hasTraining = plan.muscles.length > 0;

                            return (
                                <div
                                    key={dayKey}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 rounded border transition-all cursor-pointer relative overflow-hidden",
                                        isToday ? "border-secondary bg-secondary/10 z-10" : "border-gray-800 bg-black/40",
                                        hasTraining && !isToday ? "border-primary/50" : ""
                                    )}
                                >
                                    <span className={cn(
                                        "font-press-start text-[6px]",
                                        isToday ? "text-secondary" : "text-gray-500"
                                    )}>{DAY_NAMES[dayKey]}</span>

                                    {hasTraining ? (
                                        <div className="flex justify-center items-center">
                                            {isPast ? (
                                                <Check className="w-3 h-3 text-gray-400" />
                                            ) : isToday ? (
                                                <Swords className="w-3 h-3 text-secondary animate-pulse" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full border border-gray-600" />
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-800 text-[8px]">-</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </PixelCard>
            </section>

            {/* 5. New Features Grid */}
            <section className="space-y-4">
                <HydrationTracker />
                <WeightTracker />
            </section>

            <OracleSuggestion />

            <WeeklyPlannerModal isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} />
            <RoutineManagerModal isOpen={isRoutineOpen} onClose={() => setIsRoutineOpen(false)} />
        </div>
    );
}

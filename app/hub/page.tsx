"use client";

import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { Flame, Swords, Calendar, ArrowRight, Lock, Sword, ChevronRight } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { QuestModal } from "@/components/hub/QuestModal";

import { WeeklyPlannerModal } from "@/components/hub/WeeklyPlannerModal";
import { BossChallengeModal } from "@/components/hub/BossChallengeModal";
import { generateDailyRoutine, generateDailyQuest } from "@/lib/generator";
import { useRouter } from "next/navigation";
import { OracleSuggestion } from "@/components/hub/OracleSuggestion";
import { Skull } from "lucide-react";

export default function Hub() {
    const { dailyQuest, stats, weeklyPlan, level, setRoutine, updateProfile } = useGameStore();
    const router = useRouter();
    const [isQuestOpen, setIsQuestOpen] = useState(false);
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [isBossOpen, setIsBossOpen] = useState(false);

    // 1. Detect Today's Plan
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayKey = days[todayIndex];
    const todayPlan = weeklyPlan?.[todayKey];

    // 2. [EFFECT] Generate Smart Daily Quest on Load
    useEffect(() => {
        if (todayPlan?.isActive && todayPlan.muscles.length > 0) {
            const smartQuest = generateDailyQuest(todayPlan.muscles);
            updateProfile({ dailyQuest: smartQuest });
        }
    }, [todayKey, todayPlan?.isActive]);

    const handleDungeonRun = () => {
        if (!todayPlan || !todayPlan.isActive) {
            setIsPlannerOpen(true);
            return;
        }

        const newRoutine = generateDailyRoutine(todayPlan.muscles, level || 1);
        setRoutine(newRoutine);
        router.push('/routine');
    };

    const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const DAY_NAMES: Record<string, string> = { 'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mié', 'Thu': 'Jue', 'Fri': 'Vie', 'Sat': 'Sáb', 'Sun': 'Dom' };

    return (
        <div className="max-w-md mx-auto space-y-6 pb-8">

            {/* Daily Quest */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-5 h-5 text-primary animate-pulse" />
                    <h2 className="font-press-start text-xs text-primary">MISIÓN DIARIA</h2>
                </div>

                {dailyQuest ? (
                    <PixelCard className="bg-gradient-to-br from-surface to-black/50 border-primary/30">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-vt323 text-2xl mb-1 text-white">{dailyQuest.title}</h3>
                                <div className="text-sm text-gray-400 font-vt323 px-2 border-l-2 border-secondary space-y-1">
                                    {dailyQuest.description.map((line, i) => (
                                        <span key={i} className="block">• {line}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <PixelButton className="w-full" variant="primary" size="sm" onClick={() => setIsQuestOpen(true)}>
                            ACEPTAR RETO
                        </PixelButton>
                    </PixelCard>
                ) : (
                    <div className="text-center text-gray-500 font-vt323">Generando misión del día...</div>
                )}
                <QuestModal isOpen={isQuestOpen} onClose={() => setIsQuestOpen(false)} />
            </section>

            <OracleSuggestion />

            {/* Planify Hero (Landscape) */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-white" />
                    <h2 className="font-press-start text-xs text-white uppercase">Planificación</h2>
                </div>
                <PixelCard
                    onClick={() => setIsPlannerOpen(true)}
                    className="cursor-pointer hover:bg-surface/80 active:translate-y-1 transition-all border-white/20 bg-black/40"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center border-2 border-white/20">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-press-start text-[10px] text-white">REVISAR PLANIFICADOR</h3>
                                <p className="font-vt323 text-gray-400 text-lg">Configura tu semana de entrenamiento</p>
                            </div>
                        </div>
                        <div className="text-white">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </PixelCard>
            </section>

            {/* Weekly Routine Preview */}
            <section>
                <h3 className="font-press-start text-[8px] text-gray-500 mb-2 uppercase px-1">Tu Semana de Combate</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {daysShort.map((day) => {
                        const plan = weeklyPlan?.[day];
                        const isToday = day === todayKey;
                        return (
                            <div
                                key={day}
                                className={cn(
                                    "flex-shrink-0 w-24 p-2 border-2 text-center transition-all",
                                    isToday ? "border-secondary bg-secondary/10" : "border-gray-800 bg-black/20",
                                    plan?.isActive ? "opacity-100" : "opacity-30"
                                )}
                            >
                                <div className={cn("font-press-start text-[8px] mb-1", isToday ? "text-secondary" : "text-gray-500")}>
                                    {DAY_NAMES[day]}
                                </div>
                                <div className="font-vt323 text-xs truncate text-white">
                                    {plan?.isActive && plan.muscles.length > 0
                                        ? plan.muscles[0]
                                        : "Descanso"}
                                </div>
                                {plan?.isActive && plan.muscles.length > 1 && (
                                    <div className="font-vt323 text-[8px] text-gray-500 truncate">
                                        + {plan.muscles.length - 1} más
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Dungeon Run (Primary CTA) */}
            <section>
                <PixelCard
                    onClick={handleDungeonRun}
                    className="group flex flex-col items-center justify-center gap-4 py-8 text-center active:translate-y-1 transition-transform cursor-pointer border-secondary bg-gradient-to-t from-secondary/10 to-transparent overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Swords className="w-24 h-24" />
                    </div>

                    <div className="w-16 h-16 rounded-full border-4 border-secondary bg-secondary/20 flex items-center justify-center relative z-10">
                        <Swords className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-press-start text-sm mb-2 text-white">ENTRAR A LA MAZMORRA</h3>
                        <p className="text-lg text-secondary font-vt323 font-bold uppercase tracking-widest">
                            {todayPlan?.isActive
                                ? `HOY: ${todayPlan.muscles.join(' & ')}`
                                : "Día de Descanso / Prepárate"}
                        </p>
                    </div>
                    {todayPlan?.isActive && (
                        <div className="mt-2 flex items-center gap-2 text-[10px] font-press-start text-white/50 animate-bounce">
                            TOCA PARA INICIAR <ArrowRight className="w-3 h-3" />
                        </div>
                    )}
                </PixelCard>
            </section>

            {/* Epic Boss Encounter (PR Boss) */}
            <section>
                <PixelCard
                    onClick={() => setIsBossOpen(true)}
                    className="border-red-600 bg-red-600/10 hover:bg-red-600/20 transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-900 border-2 border-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Skull className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-press-start text-[10px] text-red-500 uppercase">JEFE FINAL: EL PASADO</h3>
                                <span className="animate-pulse bg-red-600 text-white text-[6px] font-press-start px-1 py-0.5 rounded-sm">ACTIVO</span>
                            </div>
                            <p className="font-vt323 text-gray-400 text-sm">Supera tu PR para derrotar al jefe y ganar gloria.</p>
                        </div>
                    </div>
                </PixelCard>
            </section>

            {/* Elite Dungeons (Stat-Locked) */}
            <section>
                <h3 className="font-press-start text-[8px] text-gray-500 mb-2 uppercase px-1">Mazmorras de Élite</h3>
                <div className="grid grid-cols-1 gap-3">
                    <PixelCard className="relative overflow-hidden border-red-900/50 bg-red-900/5 p-4 opacity-80">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-red-900 text-white font-press-start text-[6px] px-1 py-0.5 rounded-sm">ELITE</span>
                                    <h4 className="font-press-start text-[10px] text-white">LA FORJA DEL COLOSO</h4>
                                </div>
                                <p className="font-vt323 text-gray-400 text-sm">Entrenamiento de fuerza pura.</p>
                                <div className="mt-3 flex gap-4">
                                    <div className={cn("flex items-center gap-1", stats.str >= 30 ? "text-secondary" : "text-red-900")}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", stats.str >= 30 ? "bg-secondary" : "bg-red-900")} />
                                        <span className="font-press-start text-[8px]">STR 30</span>
                                    </div>
                                    <div className={cn("flex items-center gap-1", stats.sta >= 20 ? "text-primary" : "text-gray-700")}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", stats.sta >= 20 ? "bg-primary" : "bg-gray-700")} />
                                        <span className="font-press-start text-[8px]">STA 20</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-red-900/20 border border-red-900/40 rounded-sm">
                                <Lock className="w-5 h-5 text-red-900" />
                            </div>
                        </div>
                    </PixelCard>
                    <PixelCard className="relative overflow-hidden border-blue-900/50 bg-blue-900/5 p-4 opacity-80">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-blue-900 text-white font-press-start text-[6px] px-1 py-0.5 rounded-sm">ELITE</span>
                                    <h4 className="font-press-start text-[10px] text-white">EL ASCENSO DEL TITÁN</h4>
                                </div>
                                <p className="font-vt323 text-gray-400 text-sm">Entrenamiento de estamina y volumen.</p>
                                <div className="mt-3 flex gap-4">
                                    <div className={cn("flex items-center gap-1", stats.sta >= 40 ? "text-primary" : "text-blue-900")}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", stats.sta >= 40 ? "bg-primary" : "bg-blue-900")} />
                                        <span className="font-press-start text-[8px]">STA 40</span>
                                    </div>
                                    <div className={cn("flex items-center gap-1", stats.will >= 30 ? "text-blue-400" : "text-gray-700")}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", stats.will >= 30 ? "bg-blue-400" : "bg-gray-700")} />
                                        <span className="font-press-start text-[8px]">WILL 30</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-900/20 border border-blue-900/40 rounded-sm">
                                <Lock className="w-5 h-5 text-blue-900" />
                            </div>
                        </div>
                    </PixelCard>
                </div>
            </section>

            <WeeklyPlannerModal isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} />
            <BossChallengeModal isOpen={isBossOpen} onClose={() => setIsBossOpen(false)} />

            {/* Stats Summary */}
            <section className="pt-4">
                <h2 className="font-press-start text-[8px] mb-3 text-gray-500 uppercase px-1">Atributos del Héroe</h2>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/40 p-3 border-2 border-gray-800 text-center rounded">
                        <div className="text-[8px] text-secondary font-press-start mb-2">STR</div>
                        <div className="text-2xl font-vt323 text-white leading-none">{stats.str}</div>
                    </div>
                    <div className="bg-black/40 p-3 border-2 border-gray-800 text-center rounded">
                        <div className="text-[8px] text-primary font-press-start mb-2">STA</div>
                        <div className="text-2xl font-vt323 text-white leading-none">{stats.sta}</div>
                    </div>
                    <div className="bg-black/40 p-3 border-2 border-gray-800 text-center rounded">
                        <div className="text-[8px] text-blue-400 font-press-start mb-2">WILL</div>
                        <div className="text-2xl font-vt323 text-white leading-none">{stats.will}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

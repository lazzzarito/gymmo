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
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import { useRouter } from "next/navigation";
import { OracleSuggestion } from "@/components/hub/OracleSuggestion";
import { Skull } from "lucide-react";
import { PixelHeader } from "@/components/layout/PixelHeader";

export default function Hub() {
    const { dailyQuest, stats, weeklyPlan, level, setRoutine, updateProfile, dungeonUnlocks } = useGameStore();
    const router = useRouter();
    const [isQuestOpen, setIsQuestOpen] = useState(false);
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [isBossOpen, setIsBossOpen] = useState(false);

    // Draggable Scroll Hook
    const { ref: scrollRef, events: scrollEvents } = useDraggableScroll();

    // 1. Detect Today's Plan
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const todayKey = days[todayIndex];
    const todayPlan = weeklyPlan?.[todayKey];

    // 2. Generate Smart Daily Quest on Load
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

    const handleStartDungeon = (dungeonId: string) => {
        let muscles: any[] = [];
        switch (dungeonId) {
            case 'forge':
                muscles = ['Pecho', 'Espalda'];
                break;
            case 'titan':
                muscles = ['Piernas', 'Cardio'];
                break;
            case 'shadow':
                muscles = ['Hombros', 'Bíceps', 'Tríceps'];
                break;
            default:
                muscles = ['Abdominales'];
        }

        const newRoutine = generateDailyRoutine(muscles, level || 1);
        setRoutine(newRoutine);
        router.push('/routine');
    };

    return (
        <div className="min-h-screen">
            <PixelHeader />
            <main className="max-w-md mx-auto space-y-6 pb-24 pt-24 px-4">

                {/* Daily Quest Section */}
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

                {/* Planify Hero */}
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
                    <div
                        {...scrollEvents}
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide select-none"
                        style={scrollEvents.style}
                    >
                        {daysShort.map((day) => {
                            const plan = weeklyPlan?.[day];
                            const isToday = day === todayKey;
                            return (
                                <div
                                    key={day}
                                    className={cn(
                                        "flex-shrink-0 w-24 p-2 border-2 text-center transition-all pointer-events-none",
                                        isToday ? "border-secondary bg-secondary/10" : "border-gray-800 bg-black/20",
                                        plan?.isActive ? "opacity-100" : "opacity-30"
                                    )}
                                >
                                    <div className="font-vt323 text-lg uppercase mb-1">{DAY_NAMES[day]}</div>
                                    {plan?.isActive ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <Swords className="w-4 h-4 text-secondary" />
                                            <span className="font-press-start text-[6px] text-white overflow-hidden text-ellipsis w-full whitespace-nowrap">
                                                {plan.muscles[0]}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-600 text-[10px] font-press-start mt-2 block">
                                            -
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

                {/* Epic Boss Encounter */}
                {level >= 3 ? (
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
                ) : (
                    <section className="opacity-50 grayscale">
                        <PixelCard className="border-gray-800 bg-black/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-800 flex items-center justify-center">
                                    <Lock className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="font-press-start text-[10px] text-gray-500">JEFE BLOQUEADO</h3>
                                    <p className="font-vt323 text-gray-600 text-sm">Alcanza el Nivel 3 para desafiar al Jefe.</p>
                                </div>
                            </div>
                        </PixelCard>
                    </section>
                )}

                {/* Progressive Dungeons */}
                <section>
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <Sword className="w-4 h-4 text-gray-400" />
                        <h3 className="font-press-start text-[8px] text-gray-400 uppercase">Campaña de Ascensión</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {[
                            {
                                id: 'forge',
                                name: 'LA FORJA DEL COLOSO',
                                desc: 'Solo para Novatos. Fuerza bruta.',
                                color: 'border-red-900/50 bg-red-900/5',
                                textColor: 'text-red-500',
                                reqLevel: 1
                            },
                            {
                                id: 'titan',
                                name: 'EL ASCENSO DEL TITÁN',
                                desc: 'Requiere Nivel 5. Resistencia al dolor.',
                                color: 'border-blue-900/50 bg-blue-900/5',
                                textColor: 'text-blue-500',
                                reqLevel: 5
                            },
                            {
                                id: 'shadow',
                                name: 'SOMBRAS DEL VACÍO',
                                desc: 'Requiere Nivel 10. Voluntad de acero.',
                                color: 'border-purple-900/50 bg-purple-900/5',
                                textColor: 'text-purple-500',
                                reqLevel: 10
                            }
                        ].map((dungeon) => {
                            const isLocked = (level || 1) < dungeon.reqLevel && !(dungeonUnlocks || []).includes(dungeon.id);

                            return (
                                <PixelCard
                                    key={dungeon.id}
                                    onClick={() => !isLocked && handleStartDungeon(dungeon.id)}
                                    className={cn(
                                        "relative overflow-hidden p-4 transition-all",
                                        dungeon.color,
                                        isLocked ? "opacity-50 grayscale cursor-not-allowed" : "opacity-100 hover:scale-[1.02] cursor-pointer"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isLocked ? (
                                                    <span className="bg-gray-800 text-gray-500 font-press-start text-[6px] px-1 py-0.5 rounded-sm">BLOQUEADO</span>
                                                ) : (
                                                    <span className="bg-white/10 text-white font-press-start text-[6px] px-1 py-0.5 rounded-sm">DISPONIBLE</span>
                                                )}
                                                <h4 className={cn("font-press-start text-[10px]", dungeon.textColor)}>{dungeon.name}</h4>
                                            </div>
                                            <p className="font-vt323 text-gray-400 text-sm">{dungeon.desc}</p>
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-sm">
                                            {isLocked ? <Lock className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-white" />}
                                        </div>
                                    </div>
                                </PixelCard>
                            );
                        })}
                    </div>
                </section>

                <WeeklyPlannerModal isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} />
                <BossChallengeModal isOpen={isBossOpen} onClose={() => setIsBossOpen(false)} />

            </main>
        </div>
    );
}

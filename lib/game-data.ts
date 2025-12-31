import { DailyQuest, Talent } from "./store";

export const XP_CURVE_MULTIPLIER = 1000;

export const QUEST_TEMPLATES: Omit<DailyQuest, 'xpReward'>[] = [
    { title: "El Despertar", description: ["Completa 1 entrenamiento hoy."] },
    { title: "Caminante de Hierro", description: ["Registra al menos 3 ejercicios."] },
    { title: "Voluntad de Acero", description: ["Entrena por 30 minutos o más."] },
    { title: "Sin Dolor no hay Gloria", description: ["Completa una rutina de Pecho o Espalda."] },
    { title: "Pasos de Gigante", description: ["Realiza ejercicios de Pierna hoy."] },
    { title: "Maestro de la Técnica", description: ["Completa 5 sets perfectos."] },
];

export const TALENT_TREE_DATA: Talent[] = [
    {
        id: 't_exp_1',
        name: 'Mente Abierta',
        description: '+5% XP ganada en todos los ejercicios.',
        level: 1,
        maxLevel: 5,
        type: 'xp_boost'
    },
    {
        id: 't_str_1',
        name: 'Fuerza Bruta',
        description: 'Las rutinas de Pecho y Espalda dan +10% XP.',
        level: 1,
        maxLevel: 3,
        type: 'stat_boost'
    },
    {
        id: 't_sta_1',
        name: 'Corazón de León',
        description: 'Recuperas estamina más rápido (Cosmético por ahora).',
        level: 1,
        maxLevel: 3,
        type: 'stat_boost'
    },
    {
        id: 't_streak_1',
        name: 'Determinación',
        description: 'Protege tu racha 1 día si olvidas entrar.',
        level: 1,
        maxLevel: 1,
        type: 'streak_shield'
    }
];

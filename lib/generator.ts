import { Exercise, MuscleGroup, EXERCISE_DB } from "./exercises";
import { RoutineItem, RoutineConfig } from "./store";

// Helper to shuffle array
const shuffle = <T>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
};

export const generateDailyRoutine = (targetMuscles: MuscleGroup[], level: number): RoutineItem[] => {
    if (targetMuscles.length === 0) return [];

    const routine: RoutineItem[] = [];

    // Config based on level (Basic logic for now)
    const baseSets = level > 5 ? 4 : 3;
    const baseReps = 10; // Hypertrophy standard

    targetMuscles.forEach(muscle => {
        // Filter exercises for this muscle
        const muscleExercises = EXERCISE_DB.filter(ex => ex.muscle === muscle);

        // Strategy: 1 Compound (Heavy) + 2 Isolation per muscle
        // Note: Our DB generator added tags, we can use 'diff' as proxy for compound/heavy if 'Hard'

        const compounds = shuffle(muscleExercises.filter(ex => ex.difficulty === 'Pro' || ex.difficulty === 'Deidad'));
        const isolations = shuffle(muscleExercises.filter(ex => ex.difficulty === 'Novato' || ex.difficulty === 'Intermedio'));

        // Pick 1 Main Lift
        if (compounds.length > 0) {
            routine.push({
                ...compounds[0],
                instanceId: crypto.randomUUID(),
                config: { sets: baseSets, reps: 6, weight: 0, restTime: 120, technique: 'Normal' }
            });
        }

        // Pick 2 Accessories
        isolations.slice(0, 2).forEach(ex => {
            routine.push({
                ...ex,
                instanceId: crypto.randomUUID(),
                config: { sets: 3, reps: 12, weight: 0, restTime: 90, technique: 'Normal' }
            });
        });
    });

    // If routine is too short (e.g. only 1 muscle group), add filler core/cardio
    if (routine.length < 5) {
        const fillers = shuffle(EXERCISE_DB.filter(ex => ex.muscle === 'Abdominales' || ex.muscle === 'Cardio'));
        fillers.slice(0, 5 - routine.length).forEach(ex => {
            routine.push({
                ...ex,
                instanceId: crypto.randomUUID(),
                config: { sets: 3, reps: 15, weight: 0, restTime: 60, technique: 'Normal' }
            });
        });
    }

    return routine;
};

export const generateDailyQuest = (muscles: MuscleGroup[]): { title: string, description: string[], xpReward: number } => {
    const randomChoice = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    if (muscles.includes('Piernas')) {
        const quests = [
            {
                title: 'Despertar de Piernas',
                description: ['20 Sentadillas de peso corporal', '1 min Sentadilla isométrica'],
                xpReward: 50,
                relatedExercises: ['Sentadilla', 'Sentadilla Isométrica']
            },
            {
                title: 'Piernas de Acero',
                description: ['30 Zancadas (15/pierna)', '20 Elevaciones de Talón'],
                xpReward: 60,
                relatedExercises: ['Zancadas', 'Elevación Gemelos']
            },
            {
                title: 'Sentadillas con Salto', // Match helper name
                description: ['15 Sentadillas con salto', '30 seg Sentadilla isométrica'],
                xpReward: 55,
                relatedExercises: ['Sentadilla con Salto', 'Sentadilla Isométrica']
            }
        ];
        return randomChoice(quests);
    }
    if (muscles.includes('Pecho')) {
        const quests = [
            {
                title: 'Cobre Pectoral',
                description: ['15 Flexiones', '20 Exposiciones de Pecho (Aperturas imaginarias)'],
                xpReward: 50,
                relatedExercises: ['Flexiones', 'Aperturas']
            },
            {
                title: 'Flexiones Diamante',
                description: ['10 Flexiones Diamante', '15 Flexiones en rodillas'],
                xpReward: 60,
                relatedExercises: ['Flexiones Diamante', 'Flexiones']
            },
            {
                title: 'Empuje Espartano',
                description: ['12 Flexiones Explosivas', '20 seg Plancha'],
                xpReward: 70,
                relatedExercises: ['Flexiones Explosivas', 'Plancha']
            }
        ];
        return randomChoice(quests);
    }
    if (muscles.includes('Espalda') || muscles.includes('Bíceps')) {
        return randomChoice([
            {
                title: 'Alas de Murciélago',
                description: ['10 Dominadas (o Remo en puerta)', '30s Supermans'],
                xpReward: 50,
                relatedExercises: ['Dominadas', 'Supermans']
            },
            {
                title: 'Espalda de Titán',
                description: ['15 Remo invertido', '20 Buenos Días (sin peso)'],
                xpReward: 55,
                relatedExercises: ['Remo con Barra', 'Buenos Días']
            }
        ]);
    }
    if (muscles.includes('Cardio')) {
        return randomChoice([
            {
                title: 'Corazón de Hierro',
                description: ['50 Jumping Jacks', '2 min Trote estático'],
                xpReward: 50,
                relatedExercises: ['Saltar Comba']
            },
            {
                title: 'Velocidad de la Luz',
                description: ['30 Burpees', '1 min Descanso activo'],
                xpReward: 70,
                relatedExercises: ['Burpees']
            }
        ]);
    }

    // Default / Mix
    return randomChoice([
        {
            title: 'Activación General',
            description: ['20 Jumping Jacks', '10 Burpees'],
            xpReward: 50,
            relatedExercises: ['Burpees']
        },
        {
            title: 'Guerrero Matutino',
            description: ['1 min Plancha', '20 Abdominales'],
            xpReward: 50,
            relatedExercises: ['Plancha', 'Crunch']
        },
        {
            title: 'Agilidad Felina',
            description: ['30 Escaladores', '15 Zancadas laterales'],
            xpReward: 55,
            relatedExercises: ['Zancadas']
        }
    ]);
};

export interface WeightSuggestion {
    exerciseName: string;
    currentWeight: number;
    suggestedWeight: number;
    reason: string;
}

export const getWeightSuggestions = (history: any[]): WeightSuggestion[] => {
    if (!history || history.length < 2) return [];

    const workoutLogs = history.filter(h => h.type === 'workout' && h.exercises);
    if (workoutLogs.length < 2) return [];

    const suggestions: WeightSuggestion[] = [];
    const exerciseStats: Record<string, { weights: number[], dates: string[] }> = {};

    // Group weights by exercise name
    workoutLogs.forEach(log => {
        log.exercises.forEach((ex: RoutineItem) => {
            if (!exerciseStats[ex.name]) {
                exerciseStats[ex.name] = { weights: [], dates: [] };
            }
            exerciseStats[ex.name].weights.push(ex.config.weight);
            exerciseStats[ex.name].dates.push(log.date);
        });
    });

    // Analyze each exercise
    Object.keys(exerciseStats).forEach(name => {
        const stats = exerciseStats[name];
        if (stats.weights.length >= 2) {
            const lastWeight = stats.weights[0]; // History is reversed (newest first)
            const prevWeight = stats.weights[1];

            // If consistency is high (same weight twice), suggest increase
            if (lastWeight > 0 && lastWeight === prevWeight) {
                suggestions.push({
                    exerciseName: name,
                    currentWeight: lastWeight,
                    suggestedWeight: lastWeight + 2, // Default increment
                    reason: 'Has dominado este peso 2 veces seguidas. ¡Sube el nivel!'
                });
            }
        }
    });

    return suggestions;
};

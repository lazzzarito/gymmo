import exercises from '../data/exercises.json';

interface Exercise {
  id: number;
  name: string;
  tags: string[];
  tier: number;
}

interface Routine {
  name: string;
  exercises: Exercise[];
}

const getTierFromClass = (className: string): number => {
  switch (className.toLowerCase()) {
    case 'novice':
      return 1;
    case 'intermediate':
      return 2;
    case 'pro':
      return 3;
    default:
      return 1;
  }
};

export const generateRoutine = (userClass: string): Routine => {
  const userTier = getTierFromClass(userClass);
  const filteredExercises = exercises.filter(ex => ex.tier <= userTier);

  // Simple routine generation: pick 3 random exercises
  const routineExercises = filteredExercises.sort(() => 0.5 - Math.random()).slice(0, 3);

  return {
    name: "Today's Battle",
    exercises: routineExercises,
  };
};

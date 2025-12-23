import { grimoire, Exercise } from '../data/exercises';

/**
 * Generates a simple workout routine.
 * For the MVP, it randomly selects a specified number of exercises from the grimoire.
 * 
 * @param numberOfExercises The number of exercises to include in the routine.
 * @returns An array of exercises.
 */
export const generateRoutine = (numberOfExercises: number = 3): Exercise[] => {
  const shuffled = [...grimoire].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfExercises);
};

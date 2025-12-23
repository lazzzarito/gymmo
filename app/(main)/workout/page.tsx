'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoutine } from '../../services/routineGenerator';
import { Exercise } from '../../data/exercises';
import { useUser } from '../../context/UserContext';

const WorkoutPage = () => {
  const [routine, setRoutine] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { character, gainXpAndCoins } = useUser(); // Destructure gainXpAndCoins
  const router = useRouter();

  useEffect(() => {
    // Generate a routine for the user
    const newRoutine = generateRoutine(3); // A simple 3-exercise routine for now
    setRoutine(newRoutine);
    setIsLoading(false);
  }, []);

  const handleFinishWorkout = () => {
    if (!character) return;

    gainXpAndCoins(100, 25); // Award 100 XP and 25 GymCoins for completing a workout

    // Navigate back to the hub after workout
    router.push('/hub');
  };

  if (isLoading) {
    return <p className="font-press-start text-primary">Generating your workout...</p>;
  }

  return (
    <div className="w-full max-w-md p-6 bg-surface border-4 border-background rounded-lg text-center shadow-lg">
      <h1 className="font-press-start text-2xl text-primary mb-6">Dungeon Run</h1>
      
      <div className="space-y-4 text-left">
        {routine.map((exercise, index) => (
          <div key={exercise.id} className="p-4 bg-background rounded-lg">
            <p className="font-press-start text-secondary text-lg">{index + 1}. {exercise.name}</p>
            <p className="font-vt323 text-text mt-1">{exercise.description}</p>
            <div className="flex space-x-2 mt-2">
              {exercise.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded-full font-vt323">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleFinishWorkout}
        className="mt-8 font-press-start text-sm bg-secondary text-background py-3 px-6 rounded-md hover:bg-green-400 transition-colors"
      >
        FINISH WORKOUT
      </button>
    </div>
  );
};

export default WorkoutPage;

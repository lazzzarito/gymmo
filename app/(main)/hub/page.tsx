'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';

// ActionCard now accepts onClick, disabled state, and a custom button color
const ActionCard = ({ title, description, buttonText, onClick, disabled, buttonColor = 'bg-primary' }: { title: string, description: string, buttonText: string, onClick?: () => void, disabled?: boolean, buttonColor?: string }) => (
  <div className="w-full max-w-md p-6 bg-surface border-4 border-background rounded-lg text-center shadow-lg">
    <h2 className="font-press-start text-xl text-primary mb-2">{title}</h2>
    <p className="font-vt323 text-lg mb-4">{description}</p>
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`font-press-start text-sm text-white py-2 px-4 rounded-md transition-colors ${disabled ? 'bg-gray-600 cursor-not-allowed' : `${buttonColor} hover:opacity-80`}`}
    >
      {buttonText}
    </button>
  </div>
);


export default function HubPage() {
  const { character, gainXpAndCoins } = useUser(); // Destructure gainXpAndCoins
  const [dailyQuestCompleted, setDailyQuestCompleted] = useState(false);
  const router = useRouter();

  const handleDailyQuest = () => {
    if (!character || dailyQuestCompleted) return;

    gainXpAndCoins(50, 10); // Award 50 XP and 10 GymCoins

    setDailyQuestCompleted(true);
  };
  
  const handleStartRoutine = () => {
    router.push('/workout');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8">
      {/* Daily Quest */}
      <ActionCard 
        title="The Daily Quest"
        description={dailyQuestCompleted ? "You completed today's quest. Well done!" : "20 Squats right now!"}
        buttonText={dailyQuestCompleted ? "COMPLETED" : "ACCEPT"}
        onClick={handleDailyQuest}
        disabled={dailyQuestCompleted}
      />

      {/* Dungeon Run */}
      <ActionCard 
        title="Dungeon Run"
        description="Time for today's main workout routine."
        buttonText="START ROUTINE"
        onClick={handleStartRoutine}
        buttonColor="bg-secondary"
      />
    </div>
  );
}
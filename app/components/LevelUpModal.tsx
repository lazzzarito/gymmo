'use client';

import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';

const LevelUpModal = () => {
  const { showLevelUp, dismissLevelUp, character } = useUser();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showLevelUp) {
      setVisible(true);
    } else {
      // Optional: Add a small delay before hiding to allow for exit animations
      setVisible(false);
    }
  }, [showLevelUp]);

  if (!visible || !character) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md p-8 bg-surface border-4 border-primary rounded-lg text-center shadow-2xl">
        <h2 className="font-press-start text-3xl text-secondary mb-4 animate-bounce">LEVEL UP!</h2>
        <p className="font-vt323 text-2xl text-text mb-6">Congratulations, you've reached Level {character.level}!</p>
        <button 
          onClick={dismissLevelUp} 
          className="font-press-start text-sm bg-primary text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;

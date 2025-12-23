'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the character data
export interface Character {
  gender: string;
  skinTone: string;
  hairColor: string;
  age: number | string;
  weight: number | string;
  height: number | string;
  class: string;
  name?: string; // Add a name later if needed
  // RPG Stats
  level: number;
  xp: number;
  gymCoins: number;
  xpForNextLevel: number;
}

// Define the shape of the context
interface UserContextType {
  character: Character | null;
  saveCharacter: (characterData: Character) => void;
  updateCharacter: (characterData: Partial<Character>) => void;
  gainXpAndCoins: (xpGained: number, coinsGained: number) => void; // New function
  showLevelUp: boolean;
  dismissLevelUp: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(() => {
    // Initial state from localStorage on client
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const item = window.localStorage.getItem('gymmo-character');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Failed to parse character from localStorage", error);
      return null;
    }
  });
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Effect to save character to localStorage whenever it changes
  useEffect(() => {
    if (character) {
      try {
        window.localStorage.setItem('gymmo-character', JSON.stringify(character));
      } catch (error) {
        console.error("Failed to save character to localStorage", error);
      }
    }
  }, [character]);

  const saveCharacter = (characterData: Character) => {
    setCharacter(characterData);
  };

  const updateCharacter = (characterData: Partial<Character>) => {
    setCharacter(prevCharacter => {
      if (!prevCharacter) return null;
      return { ...prevCharacter, ...characterData };
    });
  };

  const gainXpAndCoins = (xpGained: number, coinsGained: number) => {
    setCharacter(prevCharacter => {
      if (!prevCharacter) return null;

      let newXp = prevCharacter.xp + xpGained;
      let newLevel = prevCharacter.level;
      let newXpForNextLevel = prevCharacter.xpForNextLevel; // Assume static for now

      let didLevelUp = false;
      if (newXp >= newXpForNextLevel) {
        didLevelUp = true;
        newLevel += 1;
        newXp -= newXpForNextLevel; // Reset XP for new level
        // In the future, newXpForNextLevel could increase based on newLevel
      }
      
      const newCharacter = {
        ...prevCharacter,
        xp: newXp,
        level: newLevel,
        gymCoins: prevCharacter.gymCoins + coinsGained,
        xpForNextLevel: newXpForNextLevel,
      };

      if (didLevelUp) {
        setShowLevelUp(true);
      }

      return newCharacter;
    });
  };

  const dismissLevelUp = () => {
    setShowLevelUp(false);
  };

  return (
    <UserContext.Provider value={{ character, saveCharacter, updateCharacter, gainXpAndCoins, showLevelUp, dismissLevelUp }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


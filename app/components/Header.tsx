'use client';

import { useUser } from '../context/UserContext';
import PixelAvatar from './PixelAvatar';

const Header = () => {
  const { character } = useUser();

  if (!character) return null;

  const { level, xp, xpForNextLevel, gymCoins } = character;

  return (
    <header className="w-full bg-surface p-4 flex justify-between items-center border-b-4 border-background">
      {/* Left Side: Avatar and Level */}
      <div className="flex items-center space-x-3">
        <PixelAvatar />
        <div>
          <p className="font-press-start text-sm text-primary">LVL {level}</p>
        </div>
      </div>

      {/* Middle: XP Bar */}
      <div className="flex-grow mx-4">
        <div className="w-full bg-background rounded-full h-4 border-2 border-gray-700">
          <div 
            className="bg-secondary h-full rounded-full" 
            style={{ width: `${(xp / xpForNextLevel) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-xs font-vt323 mt-1">{xp} / {xpForNextLevel} XP</p>
      </div>

      {/* Right Side: GymCoins */}
      <div className="flex items-center">
        <p className="font-press-start text-sm text-yellow-400 mr-2">{gymCoins}</p>
        {/* Placeholder for GymCoin icon */}
        <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-yellow-700"></div>
      </div>
    </header>
  );
};

export default Header;

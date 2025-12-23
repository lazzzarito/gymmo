'use client';

import { useUser } from '../context/UserContext';

const PixelAvatar = () => {
  const { character } = useUser();

  if (!character) {
    return (
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border-2 border-primary">
        <span className="text-2xl">?</span>
      </div>
    );
  }

  const { skinTone, hairColor, gender } = character;

  // Simple SVG-based pixel avatar
  // The 'shape-rendering: crispEdges' ensures the pixelated look
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: skinTone }}>
      <svg width="100%" height="100%" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
        {/* Basic hair style */}
        <rect x="3" y="1" width="6" height="1" fill={hairColor} />
        <rect x="2" y="2" width="8" height="1" fill={hairColor} />
        <rect x="2" y="3" width="1" height="1" fill={hairColor} />
        <rect x="9" y="3" width="1" height="1" fill={hairColor} />
        
        {/* Eyes */}
        <rect x="4" y="5" width="1" height="1" fill="#000" />
        <rect x="7" y="5" width="1" height="1" fill="#000" />

      </svg>
    </div>
  );
};

export default PixelAvatar;

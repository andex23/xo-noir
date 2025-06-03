
// This file is DEPRECATED and can be deleted.
// Its functionality has been moved to and updated in components/LandingScreen.tsx
// for the "XO Noir" theme.

import React from 'react';

interface GameStartScreenProps {
  onStart: () => void;
  disabled: boolean;
}

const GameStartScreen: React.FC<GameStartScreenProps> = ({ onStart, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 h-full w-full">
      <img 
        src="https://i.imgur.com/4S7wD9m.jpeg" // Placeholder representing the broken record image
        alt="A broken vinyl record, symbolizing a musical mystery" 
        className="mb-6 rounded-lg shadow-xl border-2 border-purple-600/40 opacity-80" 
        style={{ width: '200px', height: '200px', objectFit: 'cover' }} // Adjusted for a more square image
      />
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-600 mb-3 neon-text-violet filter brightness-110">
        Song Sleuth
      </h1>
       <p className="text-sm text-neutral-400 mb-1 tracking-wider neon-text-red brightness-110">XO Edition</p>
      <p className="text-md sm:text-lg text-neutral-300 mb-8 max-w-md leading-relaxed">
        The city sleeps, but the echoes of music remain. Decipher the clues, identify the tracks. How deep does your knowledge run?
      </p>
      <button
        onClick={onStart}
        disabled={disabled}
        className="px-10 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white text-lg sm:text-xl font-semibold rounded-lg shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed button-glow-violet"
      >
        {disabled && process.env.API_KEY ? 'Initializing Interface...' : disabled ? 'Awaiting API Key...' : "Begin Investigation"}
      </button>
      {disabled && !process.env.API_KEY && <p className="text-xs text-red-400 mt-4">System Alert: API Key missing. Investigation stalled.</p>}
      {disabled && process.env.API_KEY && <p className="text-xs text-neutral-500 mt-4">Establishing secure connection to Gemini Archives...</p>}
    </div>
  );
};

export default GameStartScreen;

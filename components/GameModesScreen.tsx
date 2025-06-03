
import React from 'react';
import { GameMode, GameStatus, UserProfile } from '../types'; // Import UserProfile

interface GameModesScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onNavigate: (status: GameStatus) => void;
  feedbackMessage?: string | null;
  userProfile: UserProfile | null; // Add userProfile prop
}

const GameModesScreen: React.FC<GameModesScreenProps> = ({ onSelectMode, onNavigate, feedbackMessage, userProfile }) => {
  const gameModes = [
    { mode: GameMode.SOLO, label: "Solo Mode", description: "Guess songs alone, track XP & ascend the ranks." },
    { mode: GameMode.GROUP_CHALLENGE, label: "Group Challenge", description: "Play with up to 6 friends (Coming Soon)" },
    { mode: GameMode.KNOCKOUT, label: "Knockout Mode", description: "Tournament: guess wrong and you’re out (Coming Soon)" },
    // { mode: GameMode.RANK_LADDER, label: "XO Rank Ladder", description: "View competitive tier-based rankings (Coming Soon)" },
  ];

  const handleModeClick = (mode: GameMode) => {
    if (mode === GameMode.GROUP_CHALLENGE || mode === GameMode.KNOCKOUT ) {
        alert(`${gameModes.find(gm => gm.mode === mode)?.label} is coming soon!`);
        return;
    }
    // if (mode === GameMode.RANK_LADDER) { // Handled by direct navigation button now
    //     onNavigate(GameStatus.VIEWING_LEADERBOARD);
    //     return;
    // }
    onSelectMode(mode);
  };


  return (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 w-full h-full">
      <h2 className="text-4xl md:text-5xl font-noir-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-red-600 mb-2 neon-text-violet filter brightness-110">
        Choose Your Path
      </h2>
      {userProfile && <p className="text-sm text-neutral-400 mb-4">Welcome, Agent <span className="font-semibold text-purple-300">{userProfile.username}</span>.</p>}


      {feedbackMessage && (
        <p className="mb-4 text-sm text-yellow-300 neon-text-yellow italic">{feedbackMessage}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl mb-8">
        {gameModes.map(({ mode, label, description }) => (
          <button
            key={mode}
            onClick={() => handleModeClick(mode)}
            disabled={mode !== GameMode.SOLO} // Only Solo is active for now
            className={`p-6 rounded-lg shadow-xl transition-all duration-200 ease-in-out 
                        transform hover:scale-105 focus:outline-none 
                        border border-purple-700/50
                        bg-neutral-800/70 hover:bg-neutral-700/80
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 button-glow-violet`}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-300 neon-text-violet mb-2">{label}</h3>
            <p className="text-xs sm:text-sm text-neutral-400">{description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
        <button
            onClick={() => onNavigate(GameStatus.VIEWING_LEADERBOARD)}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-cyan-400 button-glow-cyan"
        >
            View Leaderboards
        </button>
        <button
            onClick={() => onNavigate(GameStatus.VIEWING_STATS)}
            className="w-full px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-400 button-glow-blue"
        >
            Agent Stats
        </button>
      </div>
       <button
        onClick={() => onNavigate(GameStatus.LANDING_SCREEN)}
        className="mt-8 px-6 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-neutral-500"
      >
        Back to Entrance
      </button>
    </div>
  );
};

export default GameModesScreen;
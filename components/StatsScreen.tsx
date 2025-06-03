
import React from 'react';

interface StatsScreenProps {
  onBack: () => void;
  playerXP: number;
  playerRank: string;
  username?: string; // Optional username
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onBack, playerXP, playerRank, username }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 w-full h-full">
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 mb-6 filter brightness-125 neon-text-violet">
        Agent Profile & Stats
      </h2>
      <div className="p-6 bg-neutral-800/50 rounded-lg shadow-xl border border-purple-700/30 min-w-[300px] space-y-4 mb-8">
        {username && (
           <div>
            <p className="text-sm text-purple-300 font-semibold tracking-wider uppercase">Agent Alias</p>
            <p className="text-2xl font-bold text-neutral-100 neon-text-violet">{username}</p>
        </div>
        )}
        <div>
            <p className="text-sm text-teal-300 font-semibold tracking-wider uppercase">Experience Points</p>
            <p className="text-2xl font-bold text-neutral-100 neon-text-teal">{playerXP}</p>
        </div>
        <div>
            <p className="text-sm text-pink-300 font-semibold tracking-wider uppercase">Current Rank</p>
            <p className="text-xl font-bold text-neutral-100 neon-text-pink">{playerRank}</p>
        </div>
        <p className="text-neutral-400 italic pt-3">Detailed dossier and performance metrics under compilation...</p>
        {/* Placeholder for future stats like win/loss, streaks etc. */}
      </div>
      <button
        onClick={onBack}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-400 button-glow-violet"
      >
        Return to Operations
      </button>
    </div>
  );
};

export default StatsScreen;
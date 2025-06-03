
import React from 'react';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 w-full h-full">
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-6 filter brightness-125 neon-text-violet">
        XO Noir Leaderboards
      </h2>
      <p className="text-neutral-300 mb-8 text-lg">
        The most elusive agents will soon be ranked here.
      </p>
      <div className="p-6 bg-neutral-800/50 rounded-lg shadow-xl border border-purple-700/30 min-w-[300px]">
        <p className="text-neutral-400 italic">Leaderboard data transmissions incoming... ETA: Unknown.</p>
        {/* Placeholder for future leaderboard entries */}
      </div>
      <button
        onClick={onBack}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-400 button-glow-violet"
      >
        Return to Operations
      </button>
    </div>
  );
};

export default LeaderboardScreen;

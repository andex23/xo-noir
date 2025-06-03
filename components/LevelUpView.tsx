
import React from 'react';

interface LevelUpViewProps {
  level: number;
  score: number; 
  xp: number;
  rank: string;
  onContinue: () => void;
  feedback?: string | null;
  onReturnToMainMenu: () => void;
}

const LevelUpView: React.FC<LevelUpViewProps> = ({ level, score, xp, rank, onContinue, feedback, onReturnToMainMenu }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 w-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-20 h-20 text-yellow-400  mb-4 animate-pulse">
        <defs>
          <linearGradient id="levelUpIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#facc15', stopOpacity: 1}} /> {/* yellow-400 */}
            <stop offset="100%" style={{stopColor: '#c084fc', stopOpacity: 1}} /> {/* purple-400 */}
          </linearGradient>
        </defs>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" stroke="url(#levelUpIconGradient)" />
      </svg>

      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 mb-3 filter brightness-125 neon-text-violet">
        STATUS UPGRADED
      </h2>
      <p className="text-xl text-neutral-100 mb-2">
        You've reached <span className="font-bold text-yellow-300 neon-text-yellow">Clearance Level {level}</span>!
      </p>
      {feedback && <p className="text-md text-neutral-300 mb-4">{feedback}</p>}
       <div className="text-lg text-neutral-200 mb-6 space-y-1">
        <p>Total XP: <span className="font-bold text-teal-300 neon-text-teal">{xp}</span></p>
        <p>New Rank: <span className="font-bold text-pink-300 neon-text-pink">{rank}</span></p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={onContinue}
          className="px-10 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white text-lg sm:text-xl font-semibold rounded-lg shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 button-glow-violet"
        >
          Access Next Dossier
        </button>
         <button
            onClick={onReturnToMainMenu}
            className="px-6 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-neutral-500"
          >
            Main Menu
        </button>
      </div>
    </div>
  );
};

export default LevelUpView;

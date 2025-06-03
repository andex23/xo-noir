
import React from 'react';
import { GameMode } from '../types'; 

interface ScoreboardProps {
  score: number;
  level: number;
  songsDone: number;
  songsNeeded: number;
  xp: number;
  currentRank: string;
  gameMode: GameMode | null;
  onReturnToMainMenu: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ 
    score, 
    level, 
    songsDone, 
    songsNeeded, 
    xp, 
    currentRank, 
    gameMode,
    onReturnToMainMenu
}) => {
  const progressPercent = songsNeeded > 0 ? (songsDone / songsNeeded) * 100 : 0;
  const isSoloMode = gameMode === GameMode.SOLO;
  const showMainMenuButton = gameMode === GameMode.SOLO || gameMode === GameMode.GROUP_CHALLENGE || gameMode === GameMode.KNOCKOUT;


  return (
    <div className="w-full bg-neutral-800/60 p-4 rounded-lg shadow-lg mb-6 border border-purple-700/50 backdrop-blur-sm">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-3 text-center sm:text-left"> {/* Changed sm:grid-cols-3 to sm:grid-cols-2 */}
        {isSoloMode && (
          <div>
            <p className="text-xs sm:text-sm text-purple-300 font-semibold tracking-wider uppercase text-glow-subtle-violet">Level</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-100 neon-text-violet">{level}</p>
          </div>
        )}
        <div>
          <p className="text-xs sm:text-sm text-teal-300 font-semibold tracking-wider uppercase text-glow-subtle-teal">XP</p>
          <p className="text-xl sm:text-2xl font-bold text-neutral-100 neon-text-teal">{xp}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-pink-300 font-semibold tracking-wider uppercase text-glow-subtle-pink">Rank</p>
          <p className="text-lg sm:text-xl font-bold text-neutral-100 neon-text-pink">{currentRank}</p>
        </div>
         {isSoloMode && (
          <div className="sm:text-left"> {/* Removed col-span-2 and sm:col-span-1. Changed sm:text-right to sm:text-left */}
            <p className="text-xs sm:text-sm text-purple-300 font-semibold tracking-wider uppercase text-glow-subtle-violet">Score</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-100 neon-text-violet">{score}</p>
          </div>
        )}
      </div>
      
      {isSoloMode && songsNeeded > 0 && (
        <div className="mb-3">
          <p className="text-xs text-neutral-400 mb-1.5 text-center">
            Level Progress: {songsDone} / {songsNeeded} tracks identified
          </p>
          <div className="w-full bg-neutral-700 rounded-full h-2.5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out shadow-md" 
              style={{ width: `${progressPercent}%` }}
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
              aria-label={`Level ${level} progress: ${songsDone} of ${songsNeeded} songs guessed correctly`}
            ></div>
          </div>
        </div>
      )}
      {showMainMenuButton && (
        <div className="mt-3 text-center">
          <button
            onClick={onReturnToMainMenu}
            className="px-5 py-2 bg-neutral-700 hover:bg-neutral-600/80 text-neutral-300 text-xs font-semibold rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-neutral-800 focus:ring-neutral-500"
          >
            Return to Main Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;

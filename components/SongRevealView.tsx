
import React from 'react';
import { SongData, FeedbackType } from '../types';
import ImageDisplay from './ImageDisplay';

interface SongRevealViewProps {
  song: SongData | null;
  imageUrl: string | null;
  feedback: string | null;
  feedbackType?: FeedbackType;
  onNext: () => void;
  score: number;
  level: number;
  xp: number;
  rank: string;
  isSkipped?: boolean;
  onReturnToMainMenu: () => void;
}

const SongRevealView: React.FC<SongRevealViewProps> = ({ 
    song, 
    imageUrl, 
    feedback, 
    feedbackType, 
    onNext, 
    score, 
    level, 
    xp, 
    rank, 
    isSkipped,
    onReturnToMainMenu
}) => {
  if (!song) return <p className="text-neutral-400 italic">Unveiling the truth...</p>;

  let dynamicFeedback = feedback;
  let feedbackColorClass = 'text-neutral-300';

  if (!dynamicFeedback) {
    dynamicFeedback = isSkipped ? `The case file pointed to: "${song.title}" (Skipped)` : `Target Identified: "${song.title}"`;
    feedbackType = isSkipped ? 'skipped' : 'correct';
  }

  if (feedbackType === 'correct') feedbackColorClass = 'text-green-400 neon-text-green';
  else if (feedbackType === 'skipped') feedbackColorClass = 'text-yellow-400 neon-text-yellow';
  else if (feedbackType === 'warning') feedbackColorClass = 'text-orange-400';
  else if (feedbackType === 'info') feedbackColorClass = 'text-blue-400';


  return (
    <div className="flex flex-col items-center text-center p-4 w-full">
      
      {dynamicFeedback && <p className={`text-lg sm:text-xl font-semibold ${feedbackColorClass} my-4 px-2`}>{dynamicFeedback}</p>}

      <div className="my-4 w-full max-w-lg shadow-xl border-2 border-purple-600/30 rounded-lg overflow-hidden">
        <ImageDisplay imageUrl={imageUrl} altText={`Visual evidence for ${song.title}`} showPlaceholder={true} placeholderText="Acquiring visual data..."/>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 my-3 filter brightness-125 neon-text-violet">
        {song.title}
      </h2>

      <div className="my-3 text-neutral-300 space-y-1">
        <p>Total XP: <span className="font-bold text-teal-400 neon-text-teal">{xp}</span></p>
        <p>Current Rank: <span className="font-bold text-pink-400 neon-text-pink">{rank}</span></p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white text-lg font-semibold rounded-lg shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 button-glow-green"
        >
          Continue Investigation
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

export default SongRevealView;

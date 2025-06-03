import React from 'react';

interface ClueDisplayProps {
  clues: string[];
  revealedCount: number;
  onRevealNextClue: () => void;
  totalClues: number;
}

const ClueDisplay: React.FC<ClueDisplayProps> = ({ clues, revealedCount, onRevealNextClue, totalClues }) => {
  if (!clues || clues.length === 0) {
    return <p className="text-neutral-500 my-6 text-center italic">Awaiting transmission...</p>;
  }

  const canRevealMore = revealedCount < totalClues;

  return (
    <div className="my-4 md:my-6 p-4 md:p-6 bg-neutral-800/70 rounded-xl shadow-xl border border-purple-800/70 w-full backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-purple-400 neon-text-violet mb-4 text-center tracking-wider">
        EVIDENCE LOG
      </h3>
      <ul className="space-y-3 mb-4">
        {clues.slice(0, revealedCount).map((clue, index) => (
          <li 
            key={index} 
            className="p-3.5 bg-neutral-900/80 rounded-lg text-neutral-200 text-sm md:text-base leading-relaxed shadow-md border-l-4 border-purple-500 transition-all duration-300 ease-in-out hover:shadow-purple-500/30"
            aria-label={`Clue ${index + 1}`}
          >
            <span className="font-medium text-purple-400 mr-2 text-glow-subtle-violet">Clue {index + 1}:</span>{clue}
          </li>
        ))}
        {revealedCount === 0 && totalClues > 0 && (
          <li className="p-3 bg-neutral-700/50 rounded-md text-neutral-400 text-sm md:text-base italic text-center">
            No clues revealed yet. Hit "Reveal Clue" to start.
          </li>
        )}
      </ul>
      <div className="mt-5 text-center">
        {canRevealMore ? (
          <button
            onClick={onRevealNextClue}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-400 button-glow-violet transform active:scale-[0.97]"
          >
            Reveal Next Clue ({revealedCount + 1}/{totalClues})
          </button>
        ) : (
           revealedCount > 0 && <p className="text-sm text-neutral-400 italic">All clues revealed.</p>
        )}
      </div>
       <p className="text-xs text-neutral-500 mt-4 text-center">
          {revealedCount} of {totalClues} clues deciphered.
        </p>
    </div>
  );
};

export default ClueDisplay;
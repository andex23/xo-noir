
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { FeedbackType } from '../types';

interface GuessInputFormProps {
  onSubmit: (guess: string) => void;
  onSkip: () => void;
  onUseHint: () => void;
  disabled: boolean;
  skipDisabled: boolean;
  hintDisabled: boolean;
  feedback?: string | null;
  feedbackType?: FeedbackType;
  xp: number;
  xpCostForHint: number;
}

const GuessInputForm: React.FC<GuessInputFormProps> = ({ 
    onSubmit, 
    onSkip, 
    onUseHint,
    disabled, 
    skipDisabled, 
    hintDisabled,
    feedback, 
    feedbackType,
    xp,
    xpCostForHint
}) => {
  const [guess, setGuess] = useState('');
  const [animateClass, setAnimateClass] = useState('');
  const feedbackRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (feedbackType === 'incorrect') {
      setAnimateClass('animate-shake');
      const timer = setTimeout(() => setAnimateClass(''), 500); // Duration of shake animation
      return () => clearTimeout(timer);
    } else {
      setAnimateClass('');
    }
  }, [feedbackType, feedback]);

  useEffect(() => {
    if (feedback && feedbackRef.current) {
        feedbackRef.current.focus(); // For screen readers to announce change
    }
  }, [feedback]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onSubmit(guess.trim());
      // setGuess(''); // Clear input after submission - App.tsx clears on wrong/correct
    }
  };

  const handleSkipClick = () => {
    if (!skipDisabled) {
      onSkip();
    }
  };

  const handleHintClick = () => {
    if(!hintDisabled) {
        onUseHint();
    }
  }

  let feedbackColorClass = 'text-neutral-400'; // Default
  if (feedbackType === 'correct') feedbackColorClass = 'text-green-400 text-glow-subtle-green';
  else if (feedbackType === 'incorrect') feedbackColorClass = 'text-red-400 text-glow-subtle-red';
  else if (feedbackType === 'skipped' || feedbackType === 'info') feedbackColorClass = 'text-yellow-400 text-glow-subtle-yellow';
  else if (feedbackType === 'warning') feedbackColorClass = 'text-orange-400';
  else if (feedbackType === 'success') feedbackColorClass = 'text-green-400';


  return (
    <form onSubmit={handleSubmit} className={`w-full my-5 space-y-4 ${animateClass}`}>
      <div>
        <label htmlFor="song-guess" className="sr-only">
          Enter Your Suspected Track:
        </label>
        <input
          id="song-guess"
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter the name of the track..."
          disabled={disabled}
          className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm transition-all duration-150 input-focus-glow-violet"
          aria-describedby={feedback ? "guess-feedback" : undefined}
          aria-invalid={feedbackType === 'incorrect'}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="submit"
          disabled={disabled || !guess.trim()}
          className="w-full p-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] button-glow-violet"
        >
          {disabled ? 'Analyzing...' : 'Submit Intel'}
        </button>
        <button
          type="button"
          onClick={handleSkipClick}
          disabled={skipDisabled}
          className="w-full p-3 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          Drop Case (Skip)
        </button>
      </div>
      <div className="mt-3">
         <button
          type="button"
          onClick={handleHintClick}
          disabled={hintDisabled}
          className="w-full p-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] button-glow-cyan"
        >
          Use Hint (Cost: {xpCostForHint} XP)
        </button>
      </div>
      {feedback && (
        <p 
          id="guess-feedback"
          ref={feedbackRef}
          tabIndex={-1}
          className={`text-center text-sm mt-3 ${feedbackColorClass} ${feedbackType === 'incorrect' ? 'font-semibold' : ''}`}
          aria-live="assertive"
        >
          {feedback}
        </p>
      )}
    </form>
  );
};

export default GuessInputForm;

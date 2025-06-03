
import React from 'react';
import { UserProfile } from '../types'; // Import UserProfile

interface LandingScreenProps {
  onStartDescent: () => void;
  apiKeyReady: boolean;
  userProfile: UserProfile | null; // Add userProfile prop
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartDescent, apiKeyReady, userProfile }) => {
  const buttonDisabled = !apiKeyReady;
  let buttonText = "🎧 Start the Descent";
  if (buttonDisabled) {
    buttonText = process.env.API_KEY ? "Initializing Interface..." : "Awaiting API Key...";
  }

  const welcomeMessage = userProfile 
    ? `Welcome back, Agent ${userProfile.username}. The shadows await.`
    : "In a city of silence and echo, only the faithful hear the truth. Step into the darkness.";

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 h-full w-full">
      <div className="mb-8">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 text-purple-500 neon-text-violet opacity-70 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 19.5 11 12m0 0-7.5-7.5M11 12H21" />
            <circle cx="8" cy="8" r="3" stroke="var(--color-xo-crimson)" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" stroke="var(--color-xo-violet)" strokeWidth="1.5" />
            <line x1="6" y1="18" x2="18" y2="6" stroke="var(--color-xo-electric-blue)" strokeWidth="1" />
          </svg>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-noir-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-red-600 mb-4 neon-text-violet filter brightness-110">
        XO Noir
      </h1>
      <p className="text-md sm:text-lg text-neutral-300 mb-10 max-w-lg leading-relaxed italic text-glow-subtle-violet">
        {welcomeMessage}
      </p>
      <button
        onClick={onStartDescent}
        disabled={buttonDisabled}
        className={`px-10 py-4 bg-gradient-to-r 
                    from-purple-700 to-indigo-800 
                    hover:from-purple-600 hover:to-indigo-700 
                    text-white text-lg sm:text-xl font-semibold rounded-lg 
                    shadow-xl transition-all duration-200 ease-in-out 
                    transform hover:scale-105 
                    focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 
                    disabled:opacity-60 disabled:cursor-not-allowed 
                    button-glow-violet animate-pulse-glow`}
      >
        {buttonText}
      </button>
      {buttonDisabled && !process.env.API_KEY && <p className="text-xs text-red-400 mt-5 neon-text-crimson">System Alert: API Key missing. Descent protocol stalled.</p>}
      {buttonDisabled && process.env.API_KEY && <p className="text-xs text-neutral-500 mt-5">Establishing secure connection to the Void...</p>}
    </div>
  );
};

export default LandingScreen;
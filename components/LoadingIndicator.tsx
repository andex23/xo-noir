import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  subMessage?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Processing...", subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 w-full h-full">
      <svg className="animate-spin h-12 w-12 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl text-neutral-200 font-semibold text-glow-subtle-violet">{message}</p>
      {subMessage && <p className="text-sm text-neutral-400 mt-1">{subMessage}</p>}
      {!subMessage && <p className="text-sm text-neutral-400 mt-1">The shadows hold secrets...</p>}
    </div>
  );
};

export default LoadingIndicator;
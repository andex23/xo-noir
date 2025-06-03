import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 w-full bg-red-900/30 border border-red-700/70 rounded-lg shadow-xl backdrop-blur-sm">
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mb-4 neon-text-red opacity-80">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="text-xl text-red-300 font-semibold mb-2 neon-text-red">System Interference Detected</p>
      <p className="text-neutral-300 mb-6 text-sm sm:text-base">{message || "An unknown corruption occurred. The signal is lost."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 button-glow-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-red-500"
        >
          Re-establish Connection
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
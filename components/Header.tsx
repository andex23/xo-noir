
import React from 'react';

interface HeaderProps {
  onNavigateToProfile: () => void; // Changed from onSaveProgress
}

const Header: React.FC<HeaderProps> = ({ onNavigateToProfile }) => {
  return (
    <header className="w-full py-5 sm:py-6 mb-4 sm:mb-6 text-center relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-6 flex items-center space-x-3">
        {/* Placeholder Settings Icon */}
        <button aria-label="Settings" className="text-neutral-500 hover:text-purple-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.057-1.228a48.105 48.105 0 0 1 2.7 0c.497.221.967.686 1.057 1.228.09.542-.01 1.092-.234 1.583A9.753 9.753 0 0 1 12 6c-.75 0-1.456-.124-2.117-.355a10.034 10.034 0 0 0-.234-1.583Zm-3.44.095a.24.24 0 0 1-.228-.098A9.848 9.848 0 0 0 2.25 6c0 .75.124 1.456.355 2.117.041.11.09.216.143.317l-1.46 1.46c-.23.23-.23.612 0 .842l1.46 1.46c-.052.101-.092.208-.143.317A9.753 9.753 0 0 1 2.25 12c0 .75.124 1.456.355 2.117.041.11.09.216.143.317l-1.46 1.46c-.23.23-.23.612 0 .842l1.46 1.46c-.052.101-.092.208-.143.317A9.753 9.753 0 0 1 2.25 18c0 .75.124 1.456.355 2.117a.24.24 0 0 1 .228.098 9.848 9.848 0 0 0 3.645 2.533c.497.221.967.686 1.057 1.228.09.542-.01 1.092-.234 1.583A9.753 9.753 0 0 1 6 21.75c-.75 0-1.456.124-2.117.355a10.034 10.034 0 0 0 .234 1.583c.221.497.686.967 1.228 1.057a48.105 48.105 0 0 1 2.7 0c.497-.221.967-.686 1.057-1.228.09-.542.01-1.092.234-1.583A9.753 9.753 0 0 1 12 18c.75 0 1.456.124 2.117.355.223.491.234 1.041.234 1.583.221.497.686.967 1.228 1.057a48.105 48.105 0 0 0 2.7 0c.497-.221.967-.686 1.057-1.228.09-.542-.01-1.092-.234-1.583A9.753 9.753 0 0 1 18 21.75c.75 0 1.456.124 2.117.355.223.491.234 1.041.234 1.583.221.497.686.967 1.228 1.057a48.105 48.105 0 0 0 2.7 0c.497-.221.967-.686 1.057-1.228.09-.542.01-1.092.234-1.583A9.753 9.753 0 0 1 21.75 18c0-.75-.124-1.456-.355-2.117a.24.24 0 0 1-.228-.098 9.848 9.848 0 0 0-3.645-2.533c-.497-.221-.967-.686-1.057-1.228-.09-.542.01-1.092.234-1.583A9.753 9.753 0 0 1 18 12.25c.75 0 1.456-.124 2.117-.355.223-.491.234-1.041.234-1.583-.221-.497-.686-.967-1.228-1.057a48.105 48.105 0 0 0-2.7 0c-.497.221-.967-.686-1.057 1.228-.09.542.01-1.092-.234-1.583A9.753 9.753 0 0 1 12 9.75c-.75 0-1.456-.124-2.117-.355a10.034 10.034 0 0 0 .234-1.583c.221-.497.686-.967 1.228-1.057a48.105 48.105 0 0 0-2.7 0c-.497.221-.967-.686-1.057 1.228Z" />
          </svg>
        </button>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-noir-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-red-600 neon-text-violet filter brightness-110 inline-block">
        XO NOIR
      </h1>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 flex items-center space-x-3">
        <button 
          aria-label="View Profile" 
          className="text-neutral-500 hover:text-purple-400 transition-colors"
          onClick={onNavigateToProfile} // Changed
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
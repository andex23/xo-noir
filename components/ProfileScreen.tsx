import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile | null;
  xp: number; // Current session XP, might differ from profile until saved
  rank: string; // Current session rank
  onSaveProfile: (username: string) => void;
  onClearProfile: () => void;
  onBack: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  xp,
  rank,
  onSaveProfile,
  onClearProfile,
  onBack,
}) => {
  const [usernameInput, setUsernameInput] = useState(userProfile?.username || '');
  const [editMode, setEditMode] = useState(!userProfile); // Start in edit mode if no profile

  useEffect(() => {
    setUsernameInput(userProfile?.username || '');
    if (!userProfile) {
        setEditMode(true);
    }
  }, [userProfile]);

  const handleSave = () => {
    if (usernameInput.trim()) {
      onSaveProfile(usernameInput.trim());
      setEditMode(false); 
    } else {
      alert("Username cannot be empty."); // Simple validation
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your profile and reset all progress? This action cannot be undone.")) {
      onClearProfile();
      setUsernameInput(''); // Clear input field as well
      setEditMode(true); // Go to edit mode for new profile creation
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 w-full h-full">
      <h2 className="text-3xl md:text-4xl font-noir-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-sky-400 via-teal-400 to-emerald-500 mb-6 neon-text-violet filter brightness-110">
        Agent Dossier
      </h2>

      <div className="p-6 bg-neutral-800/60 rounded-xl shadow-xl border border-purple-700/40 w-full max-w-md mb-6 backdrop-blur-sm">
        {editMode || !userProfile ? (
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-purple-300 mb-1 text-glow-subtle-violet">
              Enter Your Agent Alias:
            </label>
            <input
              type="text"
              id="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g., ShadowSleuthXO"
              className="w-full p-3 bg-neutral-900/80 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm transition-all duration-150 input-focus-glow-violet"
            />
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-purple-300 text-glow-subtle-violet">Agent Alias:</p>
            <p className="text-2xl font-semibold text-neutral-100 neon-text-violet">{userProfile.username}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-xs text-teal-300 uppercase tracking-wider font-semibold">XP</p>
                <p className="text-xl font-bold text-neutral-100 neon-text-teal">{userProfile?.xp ?? xp}</p>
            </div>
            <div>
                <p className="text-xs text-pink-300 uppercase tracking-wider font-semibold">Rank</p>
                <p className="text-xl font-bold text-neutral-100 neon-text-pink">{userProfile?.currentRankingTierName ?? rank}</p>
            </div>
        </div>
        
        {!editMode && userProfile && (
            <button
                onClick={() => setEditMode(true)}
                className="w-full mb-3 px-6 py-2.5 bg-neutral-700 hover:bg-neutral-600/80 text-neutral-300 text-sm font-semibold rounded-md shadow-sm transition-colors duration-150 ease-in-out"
            >
                Edit Alias
            </button>
        )}

        {(editMode || !userProfile) && (
             <button
                onClick={handleSave}
                className="w-full mb-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-md button-glow-green"
            >
                {userProfile ? 'Save Changes' : 'Create & Save Profile'}
            </button>
        )}

        {userProfile && (
          <button
            onClick={handleClear}
            className="w-full px-6 py-2.5 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-lg shadow-md button-glow-crimson"
          >
            Clear Profile & Reset
          </button>
        )}
      </div>

      <button
        onClick={onBack}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-indigo-400 button-glow-violet"
      >
        Back to Operations
      </button>
    </div>
  );
};

export default ProfileScreen;

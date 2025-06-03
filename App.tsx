
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameStatus, SongData, GameMode, FeedbackType, UserProfile } from './types';
import { GeminiService } from './services/geminiService';
import { ProfileService } from './services/profileService';
import { INITIAL_LEVEL, INITIAL_SCORE, SONGS_TO_NEXT_LEVEL, POINTS_PER_SONG, XP_PER_CORRECT_GUESS, XP_PENALTY_FOR_SKIP, XP_COST_FOR_HINT, RANKING_TIERS, INITIAL_XP } from './constants';

import Header from './components/Header';
import LandingScreen from './components/LandingScreen';
import GameModesScreen from './components/GameModesScreen';
import ProfileScreen from './components/ProfileScreen'; // New
import MultiplayerLobbyScreen from './components/MultiplayerLobbyScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import StatsScreen from './components/StatsScreen';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorDisplay from './components/ErrorDisplay';
import Scoreboard from './components/Scoreboard';
import ClueDisplay from './components/ClueDisplay';
import GuessInputForm from './components/GuessInputForm';
import SongRevealView from './components/SongRevealView';
import LevelUpView from './components/LevelUpView';

function App(): React.ReactElement {
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.LOADING_CONFIG,
    userProfile: null, // New
    currentSong: null,
    currentSongImage: null,
    userGuess: '',
    score: INITIAL_SCORE,
    level: INITIAL_LEVEL,
    songsCorrectThisLevel: 0,
    feedbackMessage: null,
    feedbackType: null,
    errorMessage: null,
    playedSongTitles: [],
    revealedCluesCount: 0,
    xp: INITIAL_XP,
    currentRankingTierName: RANKING_TIERS[0].name,
    selectedGameMode: null,
    players: [], 
    roomCode: null, 
    isHost: false, 
    globalFeedbackMessage: null,
    globalFeedbackType: null,
  });
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);

  const getCurrentRankingTier = useCallback((currentXp: number): string => {
    let tier = RANKING_TIERS[0];
    for (let i = RANKING_TIERS.length - 1; i >= 0; i--) {
      if (currentXp >= RANKING_TIERS[i].minXp) {
        tier = RANKING_TIERS[i];
        break;
      }
    }
    return tier.name;
  }, []);
  
  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      try {
        console.log("Initializing Gemini Service...");
        const service = new GeminiService(apiKey);
        setGeminiService(service);
        
        console.log("Attempting to load user profile...");
        const loadedProfile = ProfileService.loadProfile();
        if (loadedProfile) {
          console.log("Profile loaded:", loadedProfile);
          setGameState(prev => ({
            ...prev,
            status: GameStatus.LANDING_SCREEN,
            userProfile: loadedProfile,
            xp: loadedProfile.xp,
            level: loadedProfile.level,
            currentRankingTierName: loadedProfile.currentRankingTierName,
            playedSongTitles: loadedProfile.playedSongTitles || [], // Ensure playedSongTitles is initialized
          }));
        } else {
          setGameState(prev => ({ ...prev, status: GameStatus.LANDING_SCREEN }));
        }
        console.log("Gemini Service initialized, game status set to LANDING_SCREEN.");

      } catch (error) {
        console.error("Critical Error Initializing Services:", error);
        setGameState(prev => ({
          ...prev,
          status: GameStatus.ERROR,
          errorMessage: error instanceof Error ? `Service Init Failed: ${error.message}` : "Failed to initialize core services."
        }));
      }
    } else {
      console.warn("API_KEY is not configured.");
      setGameState(prev => ({
        ...prev,
        status: GameStatus.ERROR,
        errorMessage: "API_KEY is not configured. The experience cannot begin."
      }));
    }
  }, [getCurrentRankingTier]); // getCurrentRankingTier is stable
  

  const songsNeededForCurrentLevel = gameState.selectedGameMode === GameMode.SOLO ? (SONGS_TO_NEXT_LEVEL[gameState.level - 1] || SONGS_TO_NEXT_LEVEL[SONGS_TO_NEXT_LEVEL.length - 1]) : 0;
  
  const loadNextSong = useCallback(async () => {
    console.log("loadNextSong called. Current status:", gameState.status, "Selected mode:", gameState.selectedGameMode);
    if (!geminiService) {
      console.error("loadNextSong: GeminiService not initialized.");
      setGameState(prev => ({ ...prev, status: GameStatus.ERROR, errorMessage: "Core service not initialized. Cannot load song." }));
      return;
    }

    if (gameState.selectedGameMode !== GameMode.SOLO && 
        gameState.selectedGameMode !== GameMode.GROUP_CHALLENGE && 
        gameState.selectedGameMode !== GameMode.KNOCKOUT) {
        console.warn(`loadNextSong: Song loading attempted for incompatible or unselected game mode. Mode: ${gameState.selectedGameMode}, Status: ${gameState.status}`);
        // Do not set to ERROR, could be mid-navigation. Let useEffect handle if status doesn't change.
        return;
    }
    
    setGameState(prev => ({
      ...prev,
      status: GameStatus.LOADING_SONG, 
      currentSong: null,
      currentSongImage: null,
      userGuess: '',
      feedbackMessage: null,
      feedbackType: null,
      revealedCluesCount: 0,
    }));
    console.log("Game status confirmed as LOADING_SONG. Attempting to fetch song from GeminiService.");

    try {
      const difficultyLevel = gameState.selectedGameMode === GameMode.SOLO ? gameState.level : 3; 
      // Use profile's playedSongTitles if available and relevant, otherwise current session's
      const titlesToExclude = gameState.userProfile?.playedSongTitles && gameState.selectedGameMode === GameMode.SOLO 
                               ? gameState.userProfile.playedSongTitles 
                               : gameState.playedSongTitles;

      const song = await geminiService.getSongForGuessing(difficultyLevel, titlesToExclude);
      console.log("Song data received from GeminiService:", song);
      setGameState(prev => ({
        ...prev,
        status: GameStatus.GUESSING,
        currentSong: song,
        // Add to current session played titles. Profile saving will handle merging.
        playedSongTitles: prev.status === GameStatus.LOADING_SONG ? [...prev.playedSongTitles, song.title] : prev.playedSongTitles,
        revealedCluesCount: song.clues.length > 0 ? 1 : 0,
      }));
      console.log("Game status set to GUESSING.");
    } catch (error) {
      console.error("Error in loadNextSong during getSongForGuessing:", error);
      let detailedErrorMessage = "Failed to load the next song. The signal is lost in the void.";
      if (error instanceof Error) {
        detailedErrorMessage = `Error fetching song: ${error.message}.`;
      } else if (typeof error === 'string') {
        detailedErrorMessage = `Error fetching song: ${error}`;
      }
      setGameState(prev => ({
        ...prev,
        status: GameStatus.ERROR,
        errorMessage: detailedErrorMessage
      }));
    }
  }, [geminiService, gameState.level, gameState.playedSongTitles, gameState.selectedGameMode, gameState.status, gameState.userProfile]);

  useEffect(() => {
    if (gameState.status === GameStatus.LOADING_SONG && (gameState.selectedGameMode === GameMode.SOLO || gameState.selectedGameMode === GameMode.GROUP_CHALLENGE || gameState.selectedGameMode === GameMode.KNOCKOUT)) {
      console.log("useEffect: Triggering loadNextSong for mode:", gameState.selectedGameMode);
      loadNextSong();
    }
  }, [gameState.status, gameState.selectedGameMode, loadNextSong]);

  const resetForNewGame = useCallback((mode: GameMode) => {
    console.log("resetForNewGame called for mode:", mode);
    
    let targetStatus: GameStatus;
    let errorMessage: string | null = null;

    if (mode === GameMode.SOLO) {
        targetStatus = GameStatus.LOADING_SONG;
    } else if (mode === GameMode.GROUP_CHALLENGE || mode === GameMode.KNOCKOUT) {
        targetStatus = GameStatus.MULTIPLAYER_LOBBY;
    } else if (mode === GameMode.RANK_LADDER){
        targetStatus = GameStatus.VIEWING_LEADERBOARD; // Go to leaderboard directly
    } else {
        targetStatus = GameStatus.SHOWING_GAME_MODES; 
        errorMessage = "Invalid game mode selected for reset.";
    }

     setGameState(prev => ({
      ...prev,
      status: targetStatus,
      currentSong: null,
      currentSongImage: null,
      userGuess: '',
      // Keep score, level, xp, rank if profile exists, otherwise reset
      score: prev.userProfile ? prev.userProfile.xp : INITIAL_SCORE, // Or map XP to score
      level: prev.userProfile ? prev.userProfile.level : INITIAL_LEVEL,   
      xp: prev.userProfile ? prev.userProfile.xp : INITIAL_XP,
      currentRankingTierName: prev.userProfile ? prev.userProfile.currentRankingTierName : RANKING_TIERS[0].name,
      songsCorrectThisLevel: 0,
      feedbackMessage: errorMessage, 
      feedbackType: errorMessage ? 'error' : null,
      errorMessage: errorMessage,
      playedSongTitles: prev.userProfile?.playedSongTitles || [], // Reset session played titles or use profile's
      revealedCluesCount: 0,
      selectedGameMode: mode,
      players: [],
      roomCode: null,
      isHost: false,
    }));
  }, []); 


  const handleStartDescent = useCallback(() => {
    setGameState(prev => ({ ...prev, status: GameStatus.SHOWING_GAME_MODES }));
  }, []);

  const handleGameModeSelect = useCallback((mode: GameMode) => {
    resetForNewGame(mode);
  }, [resetForNewGame]);

  const handleReturnToMainMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: GameStatus.SHOWING_GAME_MODES,
      currentSong: null,
      currentSongImage: null,
      userGuess: '',
      feedbackMessage: "Game ended. Select a new mode or manage profile.",
      feedbackType: 'info',
      revealedCluesCount: 0,
      selectedGameMode: null, // Clear selected mode to allow fresh choice
    }));
  }, []);
  
  const handleNavigateToProfile = useCallback(() => {
    setGameState(prev => ({ ...prev, status: GameStatus.SHOWING_PROFILE_SCREEN, feedbackMessage: null, globalFeedbackMessage: null }));
  }, []);

  const handleCreateOrUpdateProfile = useCallback((username: string) => {
    const updatedProfile: UserProfile = {
      ...(gameState.userProfile || ProfileService.createNewProfile(username)), // Use existing or create new
      username: username, // Ensure username is updated
      xp: gameState.xp,
      level: gameState.level,
      currentRankingTierName: gameState.currentRankingTierName,
      playedSongTitles: Array.from(new Set([...(gameState.userProfile?.playedSongTitles || []), ...gameState.playedSongTitles])), // Merge and deduplicate
    };
    ProfileService.saveProfile(updatedProfile);
    setGameState(prev => ({
      ...prev,
      userProfile: updatedProfile,
      status: GameStatus.SHOWING_GAME_MODES, // Or back to where they were
      globalFeedbackMessage: "Profile saved. Your legend grows.",
      globalFeedbackType: 'success',
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, globalFeedbackMessage: null })), 3000);
  }, [gameState.userProfile, gameState.xp, gameState.level, gameState.currentRankingTierName, gameState.playedSongTitles]);

  const handleClearProfileData = useCallback(() => {
    console.log("App.tsx: handleClearProfileData called."); // Added log
    ProfileService.clearProfile();
    setGameState(prev => ({
      ...prev,
      userProfile: null,
      xp: INITIAL_XP,
      level: INITIAL_LEVEL,
      score: INITIAL_SCORE,
      currentRankingTierName: RANKING_TIERS[0].name,
      playedSongTitles: [],
      songsCorrectThisLevel: 0,
      status: GameStatus.SHOWING_GAME_MODES, // Or LANDING_SCREEN
      globalFeedbackMessage: "Profile cleared. A fresh slate in the shadows.",
      globalFeedbackType: 'warning',
    }));
    setTimeout(() => setGameState(prev => ({ ...prev, globalFeedbackMessage: null })), 3000);
  }, []);


  const handleGuessSubmit = useCallback(async (guess: string) => {
    if (!gameState.currentSong || gameState.status !== GameStatus.GUESSING || !gameState.selectedGameMode) return;

    setGameState(prev => ({ ...prev, status: GameStatus.SUBMITTING_GUESS, userGuess: guess, feedbackMessage: null, feedbackType: null }));

    const correctSongTitle = gameState.currentSong.title.trim().toLowerCase();
    const userGuessNormalized = guess.trim().toLowerCase();

    if (userGuessNormalized === correctSongTitle) {
      const newXp = gameState.xp + XP_PER_CORRECT_GUESS;
      const newScore = gameState.score + POINTS_PER_SONG; 
      const newSongsCorrectThisLevel = gameState.selectedGameMode === GameMode.SOLO ? gameState.songsCorrectThisLevel + 1 : gameState.songsCorrectThisLevel;
      
      setGameState(prev => ({
        ...prev,
        xp: newXp,
        score: newScore,
        songsCorrectThisLevel: newSongsCorrectThisLevel,
        currentRankingTierName: getCurrentRankingTier(newXp),
        feedbackMessage: `Correct: "${gameState.currentSong?.title}". Visualizing...`,
        feedbackType: 'correct',
        status: GameStatus.GENERATING_IMAGE,
      }));

      try {
        if (geminiService && gameState.currentSong) {
          const imageUrl = await geminiService.generateImageFromPrompt(gameState.currentSong.imagePrompt);
          setGameState(prev => ({
            ...prev,
            currentSongImage: imageUrl || null,
            status: GameStatus.REVEALED_ANSWER,
          }));
        } else { throw new Error("Service/song data unavailable for image."); }
      } catch (error) {
        setGameState(prev => ({
          ...prev,
          status: GameStatus.REVEALED_ANSWER, 
          feedbackMessage: `${prev.feedbackMessage || `Correct: "${gameState.currentSong?.title}"`}. (Image gen failed: ${error instanceof Error ? error.message : "Unknown"})`,
          feedbackType: 'warning',
        }));
      }
    } else {
      setGameState(prev => ({
        ...prev,
        status: GameStatus.GUESSING,
        userGuess: '', 
        feedbackMessage: `Distortion... "${guess}" is not the signal. Try again.`,
        feedbackType: 'incorrect',
      }));
    }
  }, [gameState.currentSong, gameState.score, gameState.songsCorrectThisLevel, gameState.xp, geminiService, gameState.status, gameState.selectedGameMode, getCurrentRankingTier]);

  const handleSkipSong = useCallback(async () => {
    if (!gameState.currentSong || gameState.status !== GameStatus.GUESSING) return;
    
    const newXp = Math.max(0, gameState.xp + XP_PENALTY_FOR_SKIP);

    setGameState(prev => ({
      ...prev,
      xp: newXp, 
      currentRankingTierName: getCurrentRankingTier(newXp),
      status: GameStatus.GENERATING_IMAGE,
      feedbackMessage: `Revealing intel for "${prev.currentSong?.title}".`,
      feedbackType: 'info',
    }));

    try {
      if (geminiService && gameState.currentSong) {
        const imageUrl = await geminiService.generateImageFromPrompt(gameState.currentSong.imagePrompt);
        setGameState(prev => ({
          ...prev,
          currentSongImage: imageUrl || null,
          status: GameStatus.SONG_SKIPPED_REVEALED,
          feedbackMessage: `The song was: "${gameState.currentSong?.title}". Skipped.`,
          feedbackType: 'skipped',
        }));
      } else { throw new Error("Service/song data unavailable for skip image."); }
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        status: GameStatus.SONG_SKIPPED_REVEALED,
        currentSongImage: null,
        feedbackMessage: `Song: "${gameState.currentSong?.title}". Skipped. (Image error: ${error instanceof Error ? error.message : "Unknown"})`,
        feedbackType: 'warning',
      }));
    }
  }, [geminiService, gameState.currentSong, gameState.status, gameState.xp, getCurrentRankingTier]);

  const handleRevealNextClue = useCallback(() => {
    if (gameState.currentSong && gameState.revealedCluesCount < gameState.currentSong.clues.length) {
      setGameState(prev => ({
        ...prev,
        revealedCluesCount: prev.revealedCluesCount + 1,
        feedbackMessage: null, 
        feedbackType: null,
      }));
    }
  }, [gameState.currentSong, gameState.revealedCluesCount]);
  
  const handleUseHint = useCallback(() => {
    if (gameState.xp >= XP_COST_FOR_HINT && gameState.currentSong && gameState.revealedCluesCount < gameState.currentSong.clues.length) {
      const newXp = gameState.xp - XP_COST_FOR_HINT;
      setGameState(prev => ({
        ...prev,
        xp: newXp,
        currentRankingTierName: getCurrentRankingTier(newXp),
        revealedCluesCount: prev.revealedCluesCount + 1, 
        feedbackMessage: `Hint unlocked. ${XP_COST_FOR_HINT} XP deducted.`,
        feedbackType: 'info',
      }));
    } else if (gameState.xp < XP_COST_FOR_HINT) {
         setGameState(prev => ({ ...prev, feedbackMessage: "Not enough XP for a hint.", feedbackType: 'warning'}));
    } else {
        setGameState(prev => ({ ...prev, feedbackMessage: "All clues revealed or no more hints.", feedbackType: 'info'}));
    }
  }, [gameState.currentSong, gameState.revealedCluesCount, gameState.xp, getCurrentRankingTier]);


  const handleProceedToNextStage = useCallback(() => {
    if (gameState.selectedGameMode === GameMode.SOLO && gameState.songsCorrectThisLevel >= songsNeededForCurrentLevel) {
      const newLevel = gameState.level + 1;
      setGameState(prev => ({
        ...prev,
        status: GameStatus.LEVEL_UP_TRANSITION,
        level: newLevel,
        songsCorrectThisLevel: 0,
        feedbackMessage: `LEVEL UP! Reached Level ${newLevel}!`,
        feedbackType: 'success',
      }));
    } else {
      setGameState(prev => ({...prev, status: GameStatus.LOADING_SONG })); 
    }
  }, [gameState.songsCorrectThisLevel, songsNeededForCurrentLevel, gameState.level, gameState.selectedGameMode]);


  const handleContinueAfterLevelUp = useCallback(() => {
    setGameState(prev => ({...prev, status: GameStatus.LOADING_SONG })); 
  }, []);
  
  const navigateTo = useCallback((status: GameStatus) => {
    setGameState(prev => ({ ...prev, status, errorMessage: null, feedbackMessage: null, globalFeedbackMessage: null }));
  }, []);

  function renderAppContent(): React.ReactElement {
    switch (gameState.status) {
      case GameStatus.LOADING_CONFIG:
        return <LoadingIndicator message="Calibrating the Void..." />;
      case GameStatus.LANDING_SCREEN:
        return <LandingScreen 
                  onStartDescent={handleStartDescent} 
                  apiKeyReady={!!geminiService && process.env.API_KEY !== undefined}
                  userProfile={gameState.userProfile}
                />;
      case GameStatus.SHOWING_GAME_MODES:
        return <GameModesScreen 
                  onSelectMode={handleGameModeSelect} 
                  onNavigate={navigateTo} 
                  feedbackMessage={gameState.feedbackMessage} 
                  userProfile={gameState.userProfile}
                />;
      case GameStatus.SHOWING_PROFILE_SCREEN: // New
        return <ProfileScreen
                  userProfile={gameState.userProfile}
                  xp={gameState.xp} // Pass current session XP as well
                  rank={gameState.currentRankingTierName} // Pass current session rank
                  onSaveProfile={handleCreateOrUpdateProfile}
                  onClearProfile={handleClearProfileData}
                  onBack={() => navigateTo(GameStatus.SHOWING_GAME_MODES)}
               />;
      case GameStatus.MULTIPLAYER_LOBBY:
        return <MultiplayerLobbyScreen 
                    roomCode={gameState.roomCode || "XXXXXX"} 
                    players={gameState.players} 
                    isHost={gameState.isHost} 
                    onStartGame={() => { 
                        if (gameState.selectedGameMode === GameMode.GROUP_CHALLENGE || gameState.selectedGameMode === GameMode.KNOCKOUT) {
                            setGameState(prev => ({...prev, status: GameStatus.LOADING_SONG})); 
                        } else {
                            setGameState(prev => ({...prev, status: GameStatus.ERROR, errorMessage: "Cannot start: mode not set for multiplayer."}));
                        }
                    }}
                    onLeaveLobby={() => navigateTo(GameStatus.SHOWING_GAME_MODES)}
                />;
      case GameStatus.LOADING_SONG:
        return <LoadingIndicator message="Searching the Echoes..." subMessage="A new mystery unfolds..." />;
      case GameStatus.GUESSING:
      case GameStatus.SUBMITTING_GUESS:
        return (
          <>
            <Scoreboard 
                score={gameState.score} 
                level={gameState.level} 
                songsDone={gameState.songsCorrectThisLevel} 
                songsNeeded={songsNeededForCurrentLevel} 
                xp={gameState.xp}
                currentRank={gameState.currentRankingTierName}
                gameMode={gameState.selectedGameMode}
                onReturnToMainMenu={handleReturnToMainMenu}
            />
            {gameState.currentSong && (
              <ClueDisplay
                clues={gameState.currentSong.clues}
                revealedCount={gameState.revealedCluesCount}
                onRevealNextClue={handleRevealNextClue}
                totalClues={gameState.currentSong.clues.length}
              />
            )}
            <GuessInputForm
              onSubmit={handleGuessSubmit}
              onSkip={handleSkipSong}
              onUseHint={handleUseHint}
              disabled={gameState.status === GameStatus.SUBMITTING_GUESS}
              skipDisabled={gameState.status === GameStatus.SUBMITTING_GUESS}
              hintDisabled={gameState.status === GameStatus.SUBMITTING_GUESS || gameState.xp < XP_COST_FOR_HINT || (gameState.currentSong ? gameState.revealedCluesCount >= gameState.currentSong.clues.length : true) }
              feedback={gameState.feedbackMessage}
              feedbackType={gameState.feedbackType}
              xp={gameState.xp}
              xpCostForHint={XP_COST_FOR_HINT}
            />
            {gameState.status === GameStatus.SUBMITTING_GUESS && <LoadingIndicator message="Analyzing Signal..." />}
          </>
        );
      case GameStatus.GENERATING_IMAGE:
         return (
          <>
             <Scoreboard 
                score={gameState.score} 
                level={gameState.level} 
                songsDone={gameState.songsCorrectThisLevel} 
                songsNeeded={songsNeededForCurrentLevel} 
                xp={gameState.xp}
                currentRank={gameState.currentRankingTierName}
                gameMode={gameState.selectedGameMode}
                onReturnToMainMenu={handleReturnToMainMenu}
            />
            <LoadingIndicator message={gameState.feedbackMessage || "Visualizing the Echoes..."} subMessage="Crafting sonic art..." />
          </>
        );
      case GameStatus.REVEALED_ANSWER:
      case GameStatus.SONG_SKIPPED_REVEALED:
        return (
          <SongRevealView
            song={gameState.currentSong}
            imageUrl={gameState.currentSongImage}
            feedback={gameState.feedbackMessage}
            feedbackType={gameState.feedbackType}
            onNext={handleProceedToNextStage}
            score={gameState.score} 
            level={gameState.level}
            xp={gameState.xp}
            rank={gameState.currentRankingTierName}
            isSkipped={gameState.status === GameStatus.SONG_SKIPPED_REVEALED}
            onReturnToMainMenu={handleReturnToMainMenu}
          />
        );
      case GameStatus.LEVEL_UP_TRANSITION: 
        return (
          <LevelUpView
            level={gameState.level}
            score={gameState.score} 
            xp={gameState.xp}
            rank={gameState.currentRankingTierName}
            onContinue={handleContinueAfterLevelUp}
            feedback={gameState.feedbackMessage}
            onReturnToMainMenu={handleReturnToMainMenu}
          />
        );
      case GameStatus.VIEWING_LEADERBOARD:
        return <LeaderboardScreen onBack={() => navigateTo(GameStatus.SHOWING_GAME_MODES)} />;
      case GameStatus.VIEWING_STATS:
        return <StatsScreen 
                  onBack={() => navigateTo(GameStatus.SHOWING_GAME_MODES)} 
                  playerXP={gameState.userProfile?.xp ?? gameState.xp} 
                  playerRank={gameState.userProfile?.currentRankingTierName ?? gameState.currentRankingTierName} 
                  username={gameState.userProfile?.username}
                />;
      case GameStatus.ERROR:
        return <ErrorDisplay message={gameState.errorMessage || "A critical system error occurred."} onRetry={() => window.location.reload()} />; 
      default: {
        // const exhaustiveCheck: never = gameState.status; // This will error if a case is missed
        console.warn("Unhandled game state in renderAppContent:", gameState.status);
        return <ErrorDisplay message={`Unexpected game state: ${gameState.status}.`} onRetry={() => window.location.reload()} />;
      }
    }
  };
  
  let globalFeedbackColorClasses = 'bg-neutral-700 border-neutral-600 text-neutral-100';
  if (gameState.globalFeedbackType === 'success') {
    globalFeedbackColorClasses = 'bg-green-700/90 border-green-600/90 text-green-100 neon-text-green';
  } else if (gameState.globalFeedbackType === 'error') {
    globalFeedbackColorClasses = 'bg-red-700/90 border-red-600/90 text-red-100 neon-text-red';
  } else if (gameState.globalFeedbackType === 'warning') {
    globalFeedbackColorClasses = 'bg-yellow-700/90 border-yellow-600/90 text-yellow-100 neon-text-yellow';
  }


  return (
    <div className="min-h-screen bg-xo-black flex flex-col items-center p-2 sm:p-4 relative">
      {gameState.globalFeedbackMessage && (
        <div 
          className={`fixed top-5 right-5 p-3 rounded-lg shadow-xl text-sm z-50 transition-all duration-300 ease-in-out transform ${globalFeedbackColorClasses} animate-pulse-glow border`}
          role="alert"
          aria-live="assertive"
        >
          {gameState.globalFeedbackMessage}
        </div>
      )}
      <Header onNavigateToProfile={handleNavigateToProfile} />
      <main className="container mx-auto max-w-3xl w-full flex-grow flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 my-4 rounded-xl shadow-2xl shadow-purple-900/50 border border-purple-700/30 blurred-glass">
        {renderAppContent()}
      </main>
      <footer className="text-center py-6 text-neutral-600 text-xs">
        <p>XO Noir &copy; {new Date().getFullYear()}</p>
        <p>Powered by Gemini & Imagen AI. Enter the void.</p>
      </footer>
    </div>
  );
};

export default App;

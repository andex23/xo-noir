
import React from 'react';
import { GameState } from '../types'; // Assuming GameState might be relevant for player types

interface MultiplayerLobbyScreenProps {
  roomCode: string;
  players: GameState['players']; // Use the player type from GameState
  isHost: boolean;
  onStartGame: () => void;
  onLeaveLobby: () => void;
}

const MultiplayerLobbyScreen: React.FC<MultiplayerLobbyScreenProps> = ({
  roomCode,
  players,
  isHost,
  onStartGame,
  onLeaveLobby,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 w-full h-full">
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-6 filter brightness-125 neon-text-violet">
        Multiplayer Lobby
      </h2>
      <p className="text-neutral-300 mb-3">Room Code: <span className="font-bold text-teal-400 neon-text-teal tracking-widest">{roomCode}</span></p>
      
      <div className="my-4 p-4 bg-neutral-800/50 rounded-lg w-full max-w-md border border-purple-700/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Operatives:</h3>
        {players.length > 0 ? (
          <ul className="space-y-2">
            {players.map((player, index) => (
              <li key={player.id || index} className="text-neutral-200 p-2 bg-neutral-700/60 rounded-md shadow">
                {player.name} {player.isReady ? '(Ready)' : '(Waiting)'} {isHost && player.id === "host_id_placeholder" ? "[Host]" : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400 italic">Awaiting connections...</p>
        )}
      </div>

      {isHost && (
        <button
          onClick={onStartGame}
          disabled={players.length === 0} // Basic condition, might need more complex ready check
          className="mt-4 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white text-lg font-semibold rounded-lg shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 button-glow-green disabled:opacity-50"
        >
          Begin Investigation
        </button>
      )}
      <button
        onClick={onLeaveLobby}
        className="mt-4 px-6 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-neutral-500"
      >
        Exit Lobby
      </button>
      <p className="text-xs text-neutral-500 mt-6">Multiplayer features are currently under development. This is a placeholder UI.</p>
    </div>
  );
};

export default MultiplayerLobbyScreen;

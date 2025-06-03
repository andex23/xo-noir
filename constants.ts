
import { RankingTier } from "./types";

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
export const IMAGEN_MODEL = 'imagen-3.0-generate-002';

// For Solo Mode
export const SONGS_TO_NEXT_LEVEL = [2, 3, 3, 4, 4, 5, 5, 6, 7, 10]; // Songs to complete for levels 1, 2, 3, etc.
export const INITIAL_LEVEL = 1;
export const INITIAL_SCORE = 0; // Still used for solo level progression potentially
export const INITIAL_XP = 0; // Added and exported
export const POINTS_PER_SONG = 100; // Base for score, can be XP base too
export const XP_PER_CORRECT_GUESS = 150;
export const XP_PENALTY_FOR_SKIP = -25;
export const XP_COST_FOR_HINT = 50; // Example cost

export const RANKING_TIERS: RankingTier[] = [
  { name: "Bronze Listener", minXp: 0, badge: "🎧" },
  { name: "Dawn Dreamer", minXp: 1000, badge: "🌒" },
  { name: "Trilogy OG", minXp: 2500, badge: "🌑" },
  { name: "After Hours Architect", minXp: 5000, badge: "🩸" },
  { name: "XO Legend", minXp: 10000, badge: "⚡" },
];

export function GENERATE_SONG_PROMPT_TEMPLATE(level: number, excludedSongTitles: string[]): string {
  return `
You are a creative game master for "XO Noir", a The Weeknd song guessing game with a dark, cinematic, noir theme.
The player is currently on solo level ${level}, or this might be for a competitive mode.
Your goal is to provide a The Weeknd song for the player to guess, along with poetic, evocative clues and an image prompt.

**Instructions:**
1.  Pick a The Weeknd song.
    *   For solo levels 1-3, pick fairly popular songs.
    *   For solo levels 4+, or competitive modes, you can pick less common but still recognizable songs, including deep cuts for higher levels/difficulty.
    *   **Crucially, DO NOT pick any of the following songs (if the list is not empty): ${excludedSongTitles.join(', ')}.**
2.  Generate 2 to 4 distinct clues for the chosen song. Clues should be poetic, mysterious, and fit the noir theme.
    *   Clue 1: Cryptic, thematic, a whisper in the neon rain.
    *   Clue 2: More specific lyric snippet, a faded memory from a video, an echo of an album's soul.
    *   Clue 3 (optional, good for higher levels): A collaborator, a sound characteristic, a year veiled in shadow.
    *   Clue 4 (optional, for very hard): An obscure reference, a hidden meaning.
3.  Provide an \`imagePrompt\` for an AI image generator (like Imagen) to create a visual that evokes the song's atmosphere. Think Blade Runner x Trilogy, moody, neon-drenched cityscapes, mysterious figures, symbolic objects.

**Output Format:**
Your response MUST be a valid JSON object with the following structure:
{
  "songTitle": "The Exact Official Song Title",
  "clues": ["Clue 1 text", "Clue 2 text", "..."],
  "imagePrompt": "Descriptive prompt for image generation, e.g., 'A lone figure in a signature Weeknd jacket staring at a holographic advertisement in a rain-slicked, neon-lit alleyway, crimson and electric blue glow, cinematic, mysterious, XO Noir aesthetic.'"
}

**Example (for "The Hills"):**
{
  "songTitle": "The Hills",
  "clues": [
    "A confession whispered when the city's asleep, where desire meets danger.",
    "Flames engulf a car in its visual story, a descent into a darker self.",
    "This track admits 'when I'm fucked up, that's the real me,' revealing a raw truth.",
    "Released around 2015, it marked a shift towards a more mainstream yet still shadowy sound."
  ],
  "imagePrompt": "A burning luxury car crashed on a dark, desolate road, The Weeknd silhouette emerging from the flames, eerie red glow against a twilight sky, cinematic, high contrast, XO Noir theme."
}

Ensure the song title is precise. The clues should be challenging but fair, guiding the player through the musical labyrinth.
`;
}

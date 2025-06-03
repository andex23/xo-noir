
import { UserProfile } from '../types';
import { RANKING_TIERS, INITIAL_XP, INITIAL_LEVEL } from '../constants';

const PROFILE_STORAGE_KEY = 'xoNoirUserProfile';

export class ProfileService {
  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      console.log("ProfileService: Profile saved to localStorage.", profile);
    } catch (error) {
      console.error("ProfileService: Error saving profile to localStorage.", error);
      // Optionally, notify the user or implement a fallback
    }
  }

  static loadProfile(): UserProfile | null {
    try {
      const profileJson = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileJson) {
        const profile = JSON.parse(profileJson) as UserProfile;
        // Ensure loaded profile has all necessary fields, providing defaults if not
        const validatedProfile: UserProfile = {
          username: profile.username || "Agent X",
          xp: typeof profile.xp === 'number' ? profile.xp : INITIAL_XP,
          level: typeof profile.level === 'number' ? profile.level : INITIAL_LEVEL,
          currentRankingTierName: profile.currentRankingTierName || RANKING_TIERS[0].name,
          playedSongTitles: Array.isArray(profile.playedSongTitles) ? profile.playedSongTitles : [],
        };
        console.log("ProfileService: Profile loaded from localStorage.", validatedProfile);
        return validatedProfile;
      }
      console.log("ProfileService: No profile found in localStorage.");
      return null;
    } catch (error) {
      console.error("ProfileService: Error loading profile from localStorage.", error);
      return null;
    }
  }

  static clearProfile(): void {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      console.log("ProfileService: Profile cleared from localStorage.");
    } catch (e: any) { // Corrected syntax here
      console.error("ProfileService: Error clearing profile from localStorage.", e);
    }
  }

  static createNewProfile(username: string): UserProfile {
    return {
      username: username,
      xp: INITIAL_XP,
      level: INITIAL_LEVEL,
      currentRankingTierName: RANKING_TIERS[0].name,
      playedSongTitles: [],
    };
  }
}

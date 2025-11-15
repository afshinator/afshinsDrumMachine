import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  UserPreferences,
} from "@/constants/misc";
import { getJSONObject, setJSONObject } from "@/utils/asyncStorage";

export const preferencesStorage = {
  /**
   * Get user preferences from AsyncStorage
   * If none exist, persist and return defaults
   */
  async get(): Promise<UserPreferences> {
    try {
      const stored = await getJSONObject<UserPreferences>(
        PREFERENCES_STORAGE_KEY
      );
      if (!stored) {
        // Persist defaults on first load
        await preferencesStorage.set(DEFAULT_PREFERENCES);
        return DEFAULT_PREFERENCES;
      }
      return stored;
    } catch (error) {
      console.error("Error reading preferences:", error);
      return DEFAULT_PREFERENCES;
    }
  },

  async set(preferences: UserPreferences): Promise<void> {
    try {
      await setJSONObject(PREFERENCES_STORAGE_KEY, preferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
      throw error;
    }
  },

  async update(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const current = await this.get();
      const updated = { ...current, ...updates };
      await this.set(updated);
      return updated;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },

  async reset(): Promise<void> {
    try {
      await this.set(DEFAULT_PREFERENCES);
    } catch (error) {
      console.error("Error resetting preferences:", error);
      throw error;
    }
  },
};

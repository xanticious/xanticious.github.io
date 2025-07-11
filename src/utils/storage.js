/**
 * Storage utility for managing localStorage operations
 */
export class StorageManager {
  static getSettings() {
    const defaultSettings = { type: "Home", style: "Modern" };
    try {
      const saved = localStorage.getItem("userSettings");
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (error) {
      console.warn("Failed to load settings:", error);
      return defaultSettings;
    }
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  }
}

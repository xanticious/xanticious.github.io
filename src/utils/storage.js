/**
 * Storage utility for managing localStorage operations
 */
export class StorageManager {
  static getSettings() {
    const defaultSettings = {
      type: "Home",
      style: "Modern",
      showRecent: true,
      recentItemsCount: 10,
    };
    try {
      const saved = localStorage.getItem("userSettings");
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
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

  static getRecentItems() {
    try {
      const saved = localStorage.getItem("recentItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load recent items:", error);
      return [];
    }
  }

  static addRecentItem(urlData) {
    try {
      const settings = this.getSettings();
      const maxItems = settings.recentItemsCount || 10;
      let recent = this.getRecentItems();

      // Remove if already exists to avoid duplicates
      recent = recent.filter((item) => item.url !== urlData.url);

      // Add to beginning with default favicon extension if missing
      recent.unshift({
        ...urlData,
        faviconExtension: urlData.faviconExtension || "ico",
        timestamp: Date.now(),
      });

      // Trim to max length
      recent = recent.slice(0, maxItems);

      localStorage.setItem("recentItems", JSON.stringify(recent));
      return true;
    } catch (error) {
      console.error("Failed to save recent item:", error);
      return false;
    }
  }
}

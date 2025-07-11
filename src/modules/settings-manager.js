import { StorageManager } from "../utils/storage.js";

/**
 * Manages application settings and dynamic style loading
 */
export class SettingsManager {
  constructor() {
    this.defaultSettings = {
      type: "Home",
      style: "Modern",
      showRecent: true,
      recentItemsCount: 10,
    };
  }

  async loadAndApplySettings() {
    const settings = StorageManager.getSettings();
    let { type, style } = settings;

    if (style === "Random") {
      style = await this.getRandomStyle();
    }

    await this.loadStylesheet(style);
    return { type, style };
  }

  async getRandomStyle() {
    try {
      const { DataService } = await import("../utils/data-service.js");
      const data = await DataService.loadStyles();
      const nonRandomStyles = Object.values(data.styles)
        .flat()
        .filter((s) => s.value !== "Random" && s.implemented);

      if (nonRandomStyles.length === 0) {
        return "Modern";
      }

      const randomStyle =
        nonRandomStyles[Math.floor(Math.random() * nonRandomStyles.length)];
      return randomStyle.value;
    } catch (error) {
      console.error("Failed to get random style:", error);
      return "Modern";
    }
  }

  async loadStylesheet(style) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/styles/${style.toLowerCase().replaceAll("-", "_")}.css`;
    document.head.appendChild(link);
  }

  static navigateToSettings() {
    window.location.href = "settings.html";
  }
}

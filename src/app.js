import { SettingsManager } from "./modules/settings-manager.js";
import { GoogleSearch } from "./modules/google-search.js";
import { LinkRenderer } from "./modules/link-renderer.js";
import { LinkSearch } from "./modules/link-search.js";

/**
 * Main application class that orchestrates all modules
 */
export class App {
  constructor() {
    this.settingsManager = new SettingsManager();
    this.googleSearch = null;
    this.linkRenderer = new LinkRenderer();
    this.linkSearch = new LinkSearch();
  }

  async initialize() {
    try {
      // Load and apply settings first
      await this.settingsManager.loadAndApplySettings();

      // Initialize Google search
      this.googleSearch = new GoogleSearch();

      // Load and render links
      const categoryMap = await this.linkRenderer.loadAndRender();

      // Initialize link search with category data
      this.linkSearch.initialize(categoryMap);

      // Setup global functions for buttons
      this.setupGlobalFunctions();
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  }

  setupGlobalFunctions() {
    // Make functions available globally for onclick handlers
    window.navigateToSettings = SettingsManager.navigateToSettings;
    window.clearSearch = () => this.linkSearch.clearSearch();
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.initialize();
});

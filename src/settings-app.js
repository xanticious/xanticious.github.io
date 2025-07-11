import { DataService } from "./utils/data-service.js";
import { StorageManager } from "./utils/storage.js";
import { DOMUtils } from "./utils/dom.js";

/**
 * Settings page application
 */
export class SettingsApp {
  constructor() {
    this.typeSelect = null;
    this.styleSelect = null;
  }

  async initialize() {
    this.typeSelect = DOMUtils.getElement("#type");
    this.styleSelect = DOMUtils.getElement("#style");

    if (!this.typeSelect || !this.styleSelect) {
      console.error("Settings form elements not found");
      return;
    }

    await this.loadAndPopulateStyles();
    this.loadCurrentSettings();
    this.sortTypeOptions();
    this.setupGlobalFunctions();
  }

  async loadAndPopulateStyles() {
    try {
      const data = await DataService.loadStyles();
      const allStyles = this.extractImplementedStyles(data);
      this.populateStyleSelect(allStyles);
    } catch (error) {
      console.error("Failed to load styles:", error);
    }
  }

  extractImplementedStyles(data) {
    return Object.values(data.styles)
      .flat()
      .filter((style) => style.implemented);
  }

  populateStyleSelect(styles) {
    const sortedStyles = styles.sort((a, b) => a.label.localeCompare(b.label));

    sortedStyles.forEach((style) => {
      const option = DOMUtils.createElement("option", {
        textContent: style.label,
        attributes: { value: style.value },
      });
      this.styleSelect.appendChild(option);
    });
  }

  loadCurrentSettings() {
    const savedSettings = StorageManager.getSettings();
    this.typeSelect.value = savedSettings.type;
    this.styleSelect.value = savedSettings.style;
  }

  sortTypeOptions() {
    const options = Array.from(this.typeSelect.options);
    options
      .sort((a, b) => a.text.localeCompare(b.text))
      .forEach((option) => this.typeSelect.appendChild(option));
  }

  saveSettings() {
    const settings = {
      type: this.typeSelect.value,
      style: this.styleSelect.value,
    };

    const success = StorageManager.saveSettings(settings);
    if (success) {
      window.location.href = "index.html";
    } else {
      alert("Failed to save settings. Please try again.");
    }
  }

  setupGlobalFunctions() {
    window.saveSettings = () => this.saveSettings();
  }
}

// Initialize the settings app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const settingsApp = new SettingsApp();
  settingsApp.initialize();
});

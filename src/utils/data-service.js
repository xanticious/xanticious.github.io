/**
 * Data fetching utilities
 */
export class DataService {
  static async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch data from ${url}:`, error);
      throw error;
    }
  }

  static async loadCategories() {
    return await this.fetchJSON("data/categories.json");
  }

  static async loadStyles() {
    return await this.fetchJSON("data/styles.json");
  }

  static async loadCategoryUrls(categoryId) {
    try {
      return await this.fetchJSON(`data/urls/${categoryId}.json`);
    } catch (error) {
      console.warn(`No URL file found for category: ${categoryId}`);
      return null;
    }
  }
}

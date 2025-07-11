/**
 * Handles Google search functionality
 */
export class GoogleSearch {
  constructor() {
    this.searchBox = null;
    this.searchType = null;
    this.initialize();
  }

  initialize() {
    this.searchBox = document.getElementById("googleSearchBox");
    this.searchType = document.getElementById("googleSearchType");

    if (!this.searchBox || !this.searchType) {
      console.warn("Google search elements not found");
      return;
    }

    this.setupEventListeners();
    this.focusSearchBox();
  }

  setupEventListeners() {
    this.searchBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch();
      }
    });
  }

  focusSearchBox() {
    window.addEventListener("load", () => {
      this.searchBox.focus();
    });
  }

  performSearch() {
    const query = this.searchBox.value.trim();
    if (!query) return;

    const searchUrl = this.buildSearchUrl(query, this.searchType.value);
    window.location.href = searchUrl;
  }

  buildSearchUrl(query, searchType) {
    const encodedQuery = encodeURIComponent(query);
    const baseUrl = "https://www.google.com";

    const searchUrls = {
      all: `${baseUrl}/search?q=${encodedQuery}`,
      images: `${baseUrl}/search?q=${encodedQuery}&tbm=isch`,
      videos: `${baseUrl}/search?q=${encodedQuery}&tbm=vid`,
      shopping: `${baseUrl}/search?q=${encodedQuery}&tbm=shop`,
      "short-videos": `${baseUrl}/search?q=${encodedQuery}&tbm=vid&tbs=dur:s`,
      news: `${baseUrl}/search?q=${encodedQuery}&tbm=nws`,
      forums: `${baseUrl}/search?q=${encodedQuery}&tbm=dis`,
      web: `${baseUrl}/search?q=${encodedQuery}`,
      maps: `https://www.google.com/maps/search/${encodedQuery}`,
      books: `${baseUrl}/search?q=${encodedQuery}&tbm=bks`,
    };

    return searchUrls[searchType] || searchUrls.all;
  }
}

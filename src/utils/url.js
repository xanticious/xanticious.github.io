/**
 * URL utility functions
 */
export class URLUtils {
  static updateSearchParam(key, value) {
    const url = new URL(window.location);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, "", url);
  }

  static getSearchParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  }

  static navigateToHash(hash) {
    const url = new URL(window.location);
    url.hash = hash;
    window.history.pushState({}, "", url);

    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  static normalizeUrlForMatching(url) {
    try {
      const urlObj = new URL(url);
      let hostname = urlObj.hostname;
      // Remove 'www.' prefix
      hostname = hostname.replace(/^www\./, "");
      // Remove top-level domain (everything after the last dot)
      hostname = hostname.replace(/\.[^.]+$/, "");
      // Combine all remaining parts without dots
      return hostname.replace(/\./g, "");
    } catch {
      // If URL parsing fails, return original string without dots
      return url.replace(/\./g, "");
    }
  }
}

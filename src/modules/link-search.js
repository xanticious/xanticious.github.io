import { DOMUtils } from "../utils/dom.js";
import { URLUtils } from "../utils/url.js";

/**
 * Handles search and filtering functionality for links
 */
export class LinkSearch {
  constructor() {
    this.searchBox = null;
    this.clearFiltersBtn = null;
    this.noResultsMessage = null;
    this.container = null;
    this.categoryMap = {};
  }

  initialize(categoryMap) {
    this.categoryMap = categoryMap;
    this.searchBox = DOMUtils.getElement("#searchBox");
    this.clearFiltersBtn = DOMUtils.getElement("#clearFiltersBtn");
    this.noResultsMessage = DOMUtils.getElement("#noResultsMessage");
    this.container = DOMUtils.getElement("#container");

    if (!this.searchBox) {
      console.warn("Search box not found");
      return;
    }

    this.setupEventListeners();
    this.handleInitialSearch();
  }

  setupEventListeners() {
    this.searchBox.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (query) {
        URLUtils.updateSearchParam("search", query);
        this.performSearch(query);
      } else {
        this.clearSearch();
      }
    });
  }

  handleInitialSearch() {
    const searchQuery = URLUtils.getSearchParam("search");
    if (searchQuery) {
      this.searchBox.value = searchQuery;
      this.performSearch(searchQuery);
    }
  }

  performSearch(query) {
    if (!query) {
      this.clearSearch();
      return;
    }

    const searchTerms = this.parseSearchTerms(query);
    let hasVisibleResults = false;

    DOMUtils.show(this.clearFiltersBtn);

    hasVisibleResults = this.filterCategories(searchTerms);

    this.updateUI(hasVisibleResults);
  }

  parseSearchTerms(query) {
    return query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0);
  }

  filterCategories(searchTerms) {
    let hasVisibleResults = false;

    DOMUtils.getAllElements(".category").forEach((categoryDiv) => {
      const categoryId = categoryDiv.dataset.categoryId;
      const categoryName = this.categoryMap[categoryId]?.toLowerCase() || "";
      let categoryHasVisibleLinks = false;

      const categoryMatches = this.checkCategoryMatch(
        searchTerms,
        categoryName,
        categoryId
      );
      categoryHasVisibleLinks = this.filterLinksInCategory(
        categoryDiv,
        searchTerms,
        categoryMatches
      );

      if (categoryHasVisibleLinks || categoryMatches) {
        DOMUtils.removeClass(categoryDiv, "hidden");
        hasVisibleResults = true;

        if (categoryMatches && !categoryHasVisibleLinks) {
          this.showAllLinksInCategory(categoryDiv);
          hasVisibleResults = true;
        }
      } else {
        DOMUtils.addClass(categoryDiv, "hidden");
      }
    });

    return hasVisibleResults;
  }

  checkCategoryMatch(searchTerms, categoryName, categoryId) {
    return searchTerms.some(
      (term) =>
        categoryName.includes(term) || categoryId.toLowerCase().includes(term)
    );
  }

  filterLinksInCategory(categoryDiv, searchTerms, categoryMatches) {
    let categoryHasVisibleLinks = false;

    categoryDiv.querySelectorAll(".links li").forEach((linkItem) => {
      const linkMatches = this.checkLinkMatch(linkItem, searchTerms);

      if (linkMatches || categoryMatches) {
        DOMUtils.removeClass(linkItem, "hidden");
        categoryHasVisibleLinks = true;
      } else {
        DOMUtils.addClass(linkItem, "hidden");
      }
    });

    return categoryHasVisibleLinks;
  }

  checkLinkMatch(linkItem, searchTerms) {
    const linkText = linkItem.textContent.toLowerCase();
    const linkData = linkItem.dataset;

    return searchTerms.some((term) => {
      return (
        linkText.includes(term) ||
        (linkData.shortName &&
          linkData.shortName.toLowerCase().includes(term)) ||
        (linkData.url &&
          URLUtils.normalizeUrlForMatching(linkData.url.toLowerCase()).includes(
            term
          ))
      );
    });
  }

  showAllLinksInCategory(categoryDiv) {
    categoryDiv.querySelectorAll(".links li").forEach((li) => {
      DOMUtils.removeClass(li, "hidden");
    });
  }

  updateUI(hasVisibleResults) {
    if (hasVisibleResults) {
      DOMUtils.show(this.container);
      DOMUtils.hide(this.noResultsMessage);
    } else {
      DOMUtils.hide(this.container);
      DOMUtils.show(this.noResultsMessage);
    }
  }

  clearSearch() {
    this.searchBox.value = "";
    DOMUtils.hide(this.clearFiltersBtn);
    DOMUtils.hide(this.noResultsMessage);
    DOMUtils.show(this.container);

    URLUtils.updateSearchParam("search", "");

    DOMUtils.getAllElements(".category, .links li").forEach((el) => {
      DOMUtils.removeClass(el, "hidden");
    });
  }
}

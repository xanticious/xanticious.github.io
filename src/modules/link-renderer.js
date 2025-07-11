import { DOMUtils } from "../utils/dom.js";
import { URLUtils } from "../utils/url.js";
import { DataService } from "../utils/data-service.js";
import { StorageManager } from "../utils/storage.js";

/**
 * Handles loading and rendering of categorized links
 */
export class LinkRenderer {
  constructor() {
    this.container = null;
    this.categoryMap = {};
  }

  async loadAndRender() {
    try {
      this.container = DOMUtils.getElement("#container");
      if (!this.container) {
        throw new Error("Container element not found");
      }

      const settings = StorageManager.getSettings();
      const isWorkMode = settings.type === "Work";

      const categories = await DataService.loadCategories();
      const filteredCategories = this.filterCategoriesByMode(
        categories,
        isWorkMode
      );

      this.buildCategoryMap(filteredCategories);

      // Add recent category if enabled
      if (settings.showRecent) {
        this.renderRecentCategory();
      }

      const categorizedLinks = await this.loadUrlsForCategories(
        filteredCategories
      );
      this.renderCategories(filteredCategories, categorizedLinks);

      return this.categoryMap;
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  filterCategoriesByMode(categories, isWorkMode) {
    return categories.filter((cat) => {
      if (cat.isWorkOnly && !isWorkMode) {
        return false;
      }
      if (cat.id === "home_favorites" && isWorkMode) {
        return false;
      }
      return true;
    });
  }

  buildCategoryMap(categories) {
    this.categoryMap = {};
    categories.forEach((cat) => {
      this.categoryMap[cat.id] = cat.name;
    });
  }

  renderRecentCategory() {
    const recentItems = StorageManager.getRecentItems();
    if (recentItems.length === 0) {
      return;
    }

    const recentCategory = {
      id: "recent",
      name: "Recent",
    };

    const categoryDiv = this.createCategoryElement(recentCategory);
    const linksList = this.createLinksList(recentItems);

    categoryDiv.appendChild(linksList);
    this.container.appendChild(categoryDiv);

    // Add to category map
    this.categoryMap["recent"] = "Recent";
  }

  async loadUrlsForCategories(categories) {
    const categorizedLinks = {};

    await Promise.all(
      categories.map(async (cat) => {
        const urls = await DataService.loadCategoryUrls(cat.id);
        if (urls) {
          categorizedLinks[cat.id] = urls;
        }
      })
    );

    return categorizedLinks;
  }

  renderCategories(categories, categorizedLinks) {
    categories.forEach((cat) => {
      const links = categorizedLinks[cat.id];
      if (!links || !links.urls || links.urls.length === 0) {
        return;
      }

      const categoryDiv = this.createCategoryElement(cat);
      const linksList = this.createLinksList(links.urls);

      categoryDiv.appendChild(linksList);
      this.container.appendChild(categoryDiv);
    });
  }

  createCategoryElement(category) {
    const categoryDiv = DOMUtils.createElement("div", {
      className: "category",
      dataset: { categoryId: category.id },
    });

    const heading = this.createCategoryHeading(category.id, category.name);
    categoryDiv.appendChild(heading);

    return categoryDiv;
  }

  createCategoryHeading(categoryId, categoryName) {
    const heading = DOMUtils.createElement("h2", {
      textContent: categoryName,
      id: categoryId,
    });

    heading.addEventListener("click", () => {
      URLUtils.navigateToHash(categoryId);
    });

    return heading;
  }

  createLinksList(urls) {
    const ul = DOMUtils.createElement("ul", { className: "links" });

    const sortedUrls = this.sortUrlsByName(urls);

    sortedUrls.forEach((urlData) => {
      const linkItem = this.createLinkItem(urlData);
      ul.appendChild(linkItem);
    });

    return ul;
  }

  sortUrlsByName(urls) {
    return urls.sort((a, b) => a.name.localeCompare(b.name));
  }

  createLinkItem(urlData) {
    const { url, name, shortName, faviconName, faviconExtension } = urlData;

    const li = DOMUtils.createElement("li", {
      dataset: {
        shortName: shortName,
        url: url,
      },
    });

    const link = this.createLink(
      url,
      name,
      shortName,
      faviconName,
      faviconExtension
    );
    li.appendChild(link);

    return li;
  }

  createLink(url, name, shortName, faviconName, faviconExtension) {
    const a = DOMUtils.createElement("a", {
      attributes: { href: url },
    });

    const img = this.createFavicon(
      name,
      shortName,
      faviconName,
      faviconExtension
    );
    const span = DOMUtils.createElement("span", {
      className: "link-text",
      textContent: name,
    });

    a.appendChild(img);
    a.appendChild(span);

    // Add event listeners to track recent items
    this.addRecentTrackingListeners(a, {
      url,
      name,
      shortName,
      faviconName,
      faviconExtension,
    });

    return a;
  }

  createFavicon(name, shortName, faviconName, faviconExtension) {
    return DOMUtils.createElement("img", {
      attributes: {
        src: `images/${faviconName || shortName}.${faviconExtension}`,
        alt: name,
      },
    });
  }

  addRecentTrackingListeners(linkElement, urlData) {
    // Track left clicks
    linkElement.addEventListener("click", (e) => {
      this.trackRecentItem(urlData);
    });

    // Track middle clicks (typically opens in new tab)
    linkElement.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        // Middle mouse button
        this.trackRecentItem(urlData);
      }
    });

    // Track keyboard navigation (Enter key)
    linkElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.trackRecentItem(urlData);
      }
    });

    // Track context menu actions (right-click)
    linkElement.addEventListener("contextmenu", (e) => {
      // Small delay to allow for "open in new tab" actions
      setTimeout(() => {
        this.trackRecentItem(urlData);
      }, 100);
    });
  }

  trackRecentItem(urlData) {
    const settings = StorageManager.getSettings();
    if (settings.showRecent) {
      StorageManager.addRecentItem(urlData);
    }
  }
}

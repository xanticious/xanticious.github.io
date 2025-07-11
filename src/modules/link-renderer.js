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
}

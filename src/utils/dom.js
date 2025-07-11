/**
 * DOM utility functions
 */
export class DOMUtils {
  static createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.className) {
      element.className = options.className;
    }

    if (options.id) {
      element.id = options.id;
    }

    if (options.textContent) {
      element.textContent = options.textContent;
    }

    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (options.dataset) {
      Object.entries(options.dataset).forEach(([key, value]) => {
        element.dataset[key] = value;
      });
    }

    return element;
  }

  static getElement(selector) {
    return document.querySelector(selector);
  }

  static getAllElements(selector) {
    return document.querySelectorAll(selector);
  }

  static show(element) {
    if (element) {
      element.style.display = "block";
    }
  }

  static hide(element) {
    if (element) {
      element.style.display = "none";
    }
  }

  static addClass(element, className) {
    if (element) {
      element.classList.add(className);
    }
  }

  static removeClass(element, className) {
    if (element) {
      element.classList.remove(className);
    }
  }

  static toggleClass(element, className) {
    if (element) {
      element.classList.toggle(className);
    }
  }
}

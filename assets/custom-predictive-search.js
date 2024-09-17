class PredSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-predictive-results]');
    this.predictiveSearchContentAttribute = this.getAttribute('content-id');
    this.searchTerm = null;
    this.debounceTimer = null;
    this.debounceTime = this.getAttribute('timer') || 400;

    this.initializeListeners();
  }

  initializeListeners() {
    this.input.addEventListener('input', this.debounce(this.search.bind(this), parseInt(this.debounceTime)));
  }

  async search() {
    this.searchTerm = this.input.value;

    if (this.searchTerm.trim().length > 0) {
      const url = this.buildFullUrl();

      const resultsMarkup = await this.fetchResults(url);
      this.renderResults(resultsMarkup);
    } else {
      this.resetResults();
    }
  }

  async fetchResults(url) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.text();
      const resultsMarkup = new DOMParser()
        .parseFromString(responseData, 'text/html')
        .querySelector(`[${this.predictiveSearchContentAttribute}]`).innerHTML;

      return resultsMarkup;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  buildFullUrl() {
    const attributes = this.getAttributeNames();
    let url = `search/suggest?q=${this.searchTerm}`;

    const rejected = ['id', 'class', 'content-id'];

    attributes.forEach((attribute) => {
      if (rejected.includes(attribute)) return;

      const value = this.getAttribute(attribute);

      if (value) url += `&${attribute}=${value}`;
    });

    return url + '&section_id=render-search-results';
  }

  renderResults(markup) {
    this.predictiveSearchResults.innerHTML = markup;
  }

  resetResults() {
    this.predictiveSearchResults.innerHTML = '';
  }

  debounce(func, delay) {
    return (...args) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => func(...args), delay);
    };
  }
}

customElements.define('pred-search', PredSearch);

class PredSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-pred-search]');
    this.searchTerm = null;
    this.debounceTimer = null;

    // change id into the data-attr
    // rename pred-search
    // render-.... | pred-search.liquid
    // add additional attributes
    // timer attr for debounce | 400

    this.initializeListeners();
  }

  initializeListeners() {
    this.input.addEventListener('keyup', this.debounce(this.search.bind(this), 400));
  }

  async search() {
    this.searchTerm = this.input.value;

    if (this.searchTerm.trim().length > 0) {
      const url = `search/suggest?q=${this.searchTerm}&section_id=pred-search`;

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
        .querySelector('#pred-search-section').innerHTML;

      return resultsMarkup;
    } catch (error) {
      console.error('Error:', error);
    }
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

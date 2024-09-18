{
  /*
    This is predictive search component that allows you to get specific data based on attributes you pass.
    You can refer to this link to check the available parameters: https://shopify.dev/docs/api/ajax/reference/predictive-search
    
    You can also set a "timer" attribute, which controls the debounce time before fetching the data, by default it is 400.

    To use this component, you only need to include the tag, an input field, and a render element with 
    the required 'data-predictive-results' attribute.

    The component also requires the 'content-id' attribute with a value from your render-search-results.liquid file.

    Example usage:

    <prediction-search
      content-id="data-search-content"
      timer="400"
      resources[type]="products, queries"
      resources[limit]="10"
      resources[options][unavailable_products]="hide"
    >
      <input
        type="search"
        value="{{ search.terms |  escape }}"
      >
      <div class="search-results" data-predictive-results></div>
    </prediction-search> 
  */
}

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

class VariantChange extends HTMLElement {
  constructor() {
    super();
    this.selectedOptions = [];
    this.addEventListener('click', this.handleClick);
  }

  handleClick(event) {
    const target = event.target.tagName;

    if (target.toLowerCase() === 'button') {
      this.selectedOptions = this.getSelectedOptions();
      this.getCurrentVariant();
    }
  }

  getSelectedOptions() {
    const selectedOptions = this.querySelectorAll('button[active-variant]');

    let formattedSelectedOptions = [];

    selectedOptions.forEach((option) => {
      formattedSelectedOptions.push(option.getAttribute('data-variant-id'));
    });

    return formattedSelectedOptions;
  }

  getCurrentVariant() {
    const variants = JSON.parse(this.querySelector('[type="application/json"]').innerHTML);
    let currentVariant;

    variants.forEach((item) => {
      item.options.forEach((option, index) => {
        if (this.selectedOptions[index] == option) {
          currentVariant = item;
        }
      });
    });

    console.log(currentVariant);
  }

  fetchProduct() {
    fetch(window.Shopify.routes.root + 'products/t-shirt.js')
      .then((response) => response.json())
      .then((product) => console.log(product));
  }
}

customElements.define('variant-change', VariantChange);

class VariantChange extends HTMLElement {
  constructor() {
    super();
    this.selectedOptions = null;
    this.currentVariant = null;
    this.variantValueAttribute = 'data-variant-value';
    this.variantActiveAttribute = 'data-active-variant';
    this.variantIdAttribute = 'data-variant-id';
    this.groupIdAttribute = 'data-group-id';

    this.addEventListener('click', this.handleClick);
  }

  handleClick(event) {
    const target = event.target;

    if (target.tagName.toLowerCase() === 'button' && target.hasAttribute(this.variantValueAttribute)) {
      this.changeVariant(target);

      this.selectedOptions = this.getSelectedOptions();
      this.currentVariant = this.getCurrentVariant();

      this.changeProductFormInputData('product-form-input', this.currentVariant.id);

      console.log(this.currentVariant);
    }
  }

  changeVariant(target) {
    const variantId = target.getAttribute(this.variantIdAttribute);
    const variantGroup = this.querySelector(`[${this.groupIdAttribute}="${variantId}"]`);

    variantGroup.querySelectorAll(`button[${this.variantActiveAttribute}]`).forEach((variant) => {
      variant.removeAttribute(this.variantActiveAttribute);
    });

    target.setAttribute(this.variantActiveAttribute, '');
  }

  changeProductFormInputData(inputId, variantId) {
    const input = this.querySelector(`input[id=${inputId}]`);

    input.value = variantId;
  }

  getSelectedOptions() {
    return Array.from(this.querySelectorAll(`button[${this.variantActiveAttribute}]`)).map((option) =>
      option.getAttribute(this.variantValueAttribute)
    );
  }

  getCurrentVariant() {
    const variants = JSON.parse(this.querySelector('[type="application/json"]').innerHTML);

    return variants.find((variant) => {
      return variant.options.every((value, index) => value === this.selectedOptions[index]);
    });
  }

  fetchProduct() {
    fetch(window.Shopify.routes.root + 'products/t-shirt.js')
      .then((response) => response.json())
      .then((product) => console.log(product));
  }
}

customElements.define('variant-change', VariantChange);

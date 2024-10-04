class VariantChange extends HTMLElement {
  // change structure into getting active from url ?variant , to set active variants and make it dyncamic
  constructor() {
    super();
    this.selectedOptions = null;
    this.currentVariant = null;
    this.variantTrigger = 'button';
    this.variantValueAttribute = 'data-variant-value';
    this.variantActiveAttribute = 'data-active-variant';
    this.variantIdAttribute = 'data-variant-id';
    this.groupIdAttribute = 'data-group-id';

    this.addEventListener('click', this.handleClick);
  }

  handleClick(event) {
    const target = event.target;

    if (target.tagName.toLowerCase() === this.variantTrigger && target.hasAttribute(this.variantValueAttribute)) {
      this.changeVariant(target);

      this.selectedOptions = this.getSelectedOptions();
      this.currentVariant = this.getCurrentVariant();

      this.changeProductFormInputData('product-form-input', this.currentVariant.id);

      console.log(this.currentVariant);
      this.fetchProduct();
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
    const input = this.querySelector(`input[id="product-form-input"]`);
    const variants = JSON.parse(this.querySelector('[type="application/json"]').innerHTML);

    const test = variants.find((item) => {
      return item.id == input.value;
    });

    return test.options;
    // return Array.from(this.querySelectorAll(`button[${this.variantActiveAttribute}]`)).map((option) =>
    //   option.getAttribute(this.variantValueAttribute)
    // );
  }

  getCurrentVariant() {
    const variants = JSON.parse(this.querySelector('[type="application/json"]').innerHTML);

    return variants.find((variant) => {
      return variant.options.every((value, index) => value === this.selectedOptions[index]);
    });
  }

  fetchProduct() {
    fetch(`t-shirt?variant=${this.currentVariant.id}?section_id=product-section`)
      .then((response) => response.text())
      .then((product) => {
        document.querySelector('.product-section').innerHTML = product;
      });
  }
}

customElements.define('variant-change', VariantChange);

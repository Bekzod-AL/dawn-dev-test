class VariantChange extends HTMLElement {
  constructor() {
    super();
    this.selectedOptions = null;
    this.currentVariant = null;
    this.variantTrigger = 'data-variant-trigger';
    this.variantValueAttribute = 'data-variant-value';
    this.variantActiveAttribute = 'data-active-variant';
    this.variantIdAttribute = 'data-variant-id';
    this.groupIdAttribute = 'data-group-id';
    this.formInputAttribute = 'data-form-input';
    this.submitButtonAttribute = 'data-submit-button';

    this.setVariantFromUrl();
    this.addEventListener('click', this.handleInputClick);
    this.addEventListener('change', this.handleSelectChange);
  }

  handleInputClick(event) {
    const target = event.target;

    if (target.hasAttribute(this.variantTrigger)) {
      this.changeInputVariantToActive(target);

      this.selectedOptions = this.getSelectedOptions();
      this.currentVariant = this.getCurrentVariant();

      this.urlReplace(this.currentVariant.id);
      this.changeProductFormInputData(this.currentVariant.id);
      this.updateProductPage();
    }
  }

  handleSelectChange(event) {
    const target = event.target;

    if (target.tagName.toLowerCase() == 'select') {
      this.selectedOptions = Array.from(this.querySelectorAll('select'), (select) => select.value);
      this.currentVariant = this.getCurrentVariant();

      this.urlReplace(this.currentVariant.id);

      this.changeProductFormInputData(this.currentVariant.id);
      this.updateProductPage();
    }
  }

  setVariantFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const variantId = urlParams.get('variant');

    if (variantId) {
      this.changeProductFormInputData(variantId);
    }
  }

  urlReplace(value) {
    const currentUrlAttribute = 'data-current-url';
    const currentUrl = this.querySelector(`[${currentUrlAttribute}]`).getAttribute(`${currentUrlAttribute}`);

    window.history.replaceState({}, '', `${currentUrl}?variant=${value}`);
  }

  changeInputVariantToActive(target) {
    const variantId = target.getAttribute(this.variantIdAttribute);
    const variantGroup = this.querySelector(`[${this.groupIdAttribute}="${variantId}"]`);

    variantGroup.querySelectorAll(`[${this.variantTrigger}]`).forEach((variant) => {
      variant.removeAttribute(this.variantActiveAttribute);
    });

    target.setAttribute(this.variantActiveAttribute, '');
  }

  changeProductFormInputData(variantId) {
    const input = this.querySelector(`input[${this.formInputAttribute}]`);

    input.value = variantId;
  }

  getSelectedOptions() {
    return Array.from(this.querySelectorAll(`[${this.variantActiveAttribute}]`)).map((option) =>
      option.getAttribute(this.variantValueAttribute)
    );
  }

  getCurrentVariant() {
    const variants = JSON.parse(this.querySelector('[type="application/json"]').innerHTML);

    return variants.find((variant) => {
      return variant.options.every((value, index) => value === this.selectedOptions[index]);
    });
  }

  async updateProductPage() {
    const submitButton = document.querySelector(`[${this.submitButtonAttribute}]`);
    submitButton.disabled = true;

    try {
      const url = window.location.href;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const responseData = await res.text();
      const resultsMarkup = new DOMParser().parseFromString(responseData, 'text/html');

      document.querySelector('.product-section').innerHTML = resultsMarkup.querySelector('.product-section').innerHTML;
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      submitButton.disabled = false;
    }
  }
}

customElements.define('variant-change', VariantChange);

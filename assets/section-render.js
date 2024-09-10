class SectionRender extends HTMLElement {
  constructor() {
    super();

    this.triggerButtons = this.querySelectorAll('[section-render-trigger]');
    this._url = null;
    // create vars for attr
    // rename button
    // use params to pass url
    // remove get set
  }

  connectedCallback() {
    this.triggerButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleTrigger(button);
      });
    });
  }

  get url() {
    return this._url;
  }

  set url(newUrl) {
    this._url = newUrl;
  }

  handleTrigger(button) {
    const url = button.getAttribute('section-render-url');
    const sectionId = button.getAttribute('section-render-trigger');

    this.url = url;

    this.updateSection(sectionId);
  }

  async updateSection(sectionId) {
    const section = this.querySelector(`[section-render-target=${sectionId}]`);

    try {
      const res = await fetch(this.url);

      if (!res.ok) {
        throw new Error(`Load error: ${res.status} ${res.statusText}`);
      }

      const content = await res.text();
      const updatedContent = document.createElement('div');
      updatedContent.innerHTML = content;

      section.innerHTML = updatedContent.innerHTML;
    } catch (error) {
      console.error('Error on section loading:', error);
    }
  }
}

customElements.define('section-render', SectionRender);

class SectionRender extends HTMLElement {
  constructor() {
    super();
    this.renderTriggerAttr = 'section-render-trigger';
    this.renderTargetAttr = 'section-render-target';

    this.triggerButtons = this.querySelectorAll(`[${this.renderTriggerAttr}]`);
    this.url = null;
  }

  connectedCallback() {
    this.triggerButtons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        const sectionId = el.getAttribute(this.renderTriggerAttr);
        this.url = el.getAttribute('section-render-url');

        this.updateSection(sectionId);
      });
    });
  }

  async updateSection(sectionId) {
    const section = this.querySelector(`[${this.renderTargetAttr}=${sectionId}]`);

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

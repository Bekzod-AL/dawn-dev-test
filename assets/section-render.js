class SectionRender extends HTMLElement {
  constructor() {
    super();
    this.renderTriggerAttr = 'section-render-trigger';
    this.renderTargetAttr = 'section-render-target';
    this.renderUrlAttr = 'section-render-url';

    this.triggerButtons = this.querySelectorAll(`[${this.renderTriggerAttr}]`);
    this.url = null;

    // test multiple contents
    // 2 section in 1 trigger
  }

  connectedCallback() {
    this.triggerButtons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        const sectionId = el.getAttribute(this.renderTriggerAttr);
        this.url = el.getAttribute(this.renderUrlAttr);

        this.updateSection(sectionId);
      });
    });
  }

  async updateSection(sectionId) {
    const sections = this.querySelectorAll(`[${this.renderTargetAttr}=${sectionId}]`);

    try {
      const res = await fetch(this.url);

      if (!res.ok) {
        throw new Error(`Load error: ${res.status} ${res.statusText}`);
      }

      const content = await res.text();

      const updatedContent = document.createElement('div');
      updatedContent.innerHTML = content;

      sections.forEach((section) => {
        section.innerHTML = updatedContent.innerHTML;
      });
    } catch (error) {
      console.error('Error on section loading:', error);
    }
  }
}

customElements.define('section-render', SectionRender);

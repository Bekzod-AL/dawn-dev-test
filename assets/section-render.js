class SectionRender extends HTMLElement {
  constructor() {
    super();

    this.triggerAttribute = 'section-render-trigger';
    this.sectionAttribute = 'section-render-target';
  }

  connectedCallback() {
    const trigger = this.querySelector(`[${this.triggerAttribute}]`);
    const triggerId = trigger.getAttribute(`${this.triggerAttribute}`);

    const section = this.querySelector(`[section-render-target="${triggerId}"]`);

    this.initializeTrigger(trigger, section);
  }

  initializeTrigger(trigger, section) {
    trigger.addEventListener('click', () => {
      this.updateSection(section);
    });
  }

  async updateSection(section) {
    const sectionTarget = section.getAttribute(`${this.sectionAttribute}`);
    const url = section.getAttribute('section-render-url');

    console.log(section);
    console.log(sectionTarget);

    const res = await fetch(`${url}`);
    const content = await res.text();

    const updatedContent = document.createElement('div');
    updatedContent.innerHTML = content;

    section.innerHTML = updatedContent.querySelector(`[${this.sectionAttribute}=${sectionTarget}]`).innerHTML;
  }
}

customElements.define('section-render', SectionRender);

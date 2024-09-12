class SectionRender extends HTMLElement {
  constructor() {
    super();
    this.renderTriggerAttr = 'section-render-trigger';
    this.renderTargetAttr = 'section-render-target';
    this.renderUrlAttr = 'section-render-url';

    this.triggerButtons = this.querySelectorAll(`[${this.renderTriggerAttr}]`);
    this.url = null;

    // rename target to content
    // divide into functions
    // rename variables
  }

  connectedCallback() {
    this.triggerButtons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        let sectionId = el.getAttribute(this.renderTriggerAttr);

        if (sectionId.includes(',')) {
          sectionId = sectionId.split(',');
        }

        this.url = el.getAttribute(this.renderUrlAttr);

        this.updateSection(sectionId);
      });
    });
  }

  async updateSection(sectionIds) {
    let sections = null;

    if (Array.isArray(sectionIds)) {
      sections = sectionIds.map((id) => Array.from(this.querySelectorAll(`[${this.renderTargetAttr}=${id}]`))).flat();
    } else {
      sections = this.querySelectorAll(`[${this.renderTargetAttr}=${sectionIds}]`);
    }

    try {
      const res = await fetch(this.url);

      if (!res.ok) {
        throw new Error(`Load error: ${res.status} ${res.statusText}`);
      }

      const content = await res.text();

      let updatedContent = document.createElement('div');

      if (this.isJsonObject(content)) {
        const object = JSON.parse(content);
        const objectKeys = Object.keys(object);

        const sectionIdsData = sectionIds.reduce((accumulator, sectionId, index) => {
          if (objectKeys[index]) {
            accumulator[sectionId] = object[objectKeys[index]];
          }
          return accumulator;
        }, {});

        sections.forEach((section) => {
          const targetId = section.getAttribute(this.renderTargetAttr);

          if (sectionIdsData[targetId]) {
            updatedContent.innerHTML = sectionIdsData[targetId];
            section.innerHTML = updatedContent.innerHTML;
          }
        });
      } else {
        updatedContent.innerHTML = content;

        sections.forEach((section) => {
          section.innerHTML = updatedContent.innerHTML;
        });
      }
    } catch (error) {
      console.error('Error on section loading:', error);
    }
  }

  isJsonObject(str) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (error) {
      return false;
    }
  }
}

customElements.define('section-render', SectionRender);

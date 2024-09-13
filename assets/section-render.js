class SectionRender extends HTMLElement {
  constructor() {
    super();
    this.renderTriggerAttr = 'section-render-trigger';
    this.renderTargetAttr = 'section-render-content';
    this.renderUrlAttr = 'section-render-url';

    this.triggerButtons = this.querySelectorAll(`[${this.renderTriggerAttr}]`);
    this.url = null;
  }

  connectedCallback() {
    this.triggerButtons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();

        let sectionId = el.getAttribute(this.renderTriggerAttr);
        this.url = el.getAttribute(this.renderUrlAttr);

        if (sectionId.includes(',')) {
          sectionId = sectionId.split(',');
        }

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

      const responseData = await res.text();

      let contentContainer = document.createElement('div');

      if (this.isJsonObject(responseData)) {
        this.renderMultipleContents(sections, responseData, sectionIds, contentContainer);
      } else {
        this.renderSingleContent(sections, responseData, contentContainer);
      }
    } catch (error) {
      console.error('Error on section loading:', error);
    }
  }

  renderMultipleContents(sections, response, sectionIds, contentContainer) {
    const parsedResponse = JSON.parse(response);
    const parsedResponseKeys = Object.keys(parsedResponse);

    const sectionsMarkup = sectionIds.reduce((accumulator, sectionId, index) => {
      const sectionName = parsedResponseKeys[index];

      if (sectionName) {
        accumulator[sectionId] = parsedResponse[sectionName];
      }
      return accumulator;
    }, {});

    sections.forEach((section) => {
      const contentId = section.getAttribute(this.renderTargetAttr);
      console.log(section);

      if (sectionsMarkup[contentId]) {
        contentContainer.innerHTML = sectionsMarkup[contentId];
        const isTheSameSection = contentContainer.querySelector('section-render');

        if (isTheSameSection) {
          console.log(section);
          // section.innerHTML = isTheSameSection.innerHTML;

          console.log('yes, the same');
        } else {
          console.log('no');
          section.innerHTML = contentContainer.innerHTML;
        }
      }
    });
  }

  renderSingleContent(sections, response, contentContainer) {
    contentContainer.innerHTML = response;
    console.log(contentContainer.querySelectorAll('section-render'));

    sections.forEach((section) => {
      section.innerHTML = contentContainer.innerHTML;
    });
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

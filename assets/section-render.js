{
  /*
    This component dynamically renders sections specified in the triggers.
    It listens for button clicks and fetches HTML content based on the 
    sections passed in the attributes.

    Example usage:
    
    <section-render>
        <!-- Button triggers rendering of two sections in order -->
        <button
          section-render-trigger="custom-content,custom-content-2"
          section-render-url="{{ shop.url }}?sections=contact-form,featured-blog"
        >
          Trigger button 1
        </button>

        <!-- Button triggers rendering of one section -->
        <button
          section-render-trigger="custom-content-3"
          section-render-url="{{ shop.url }}?section_id=contact-form"
        >
          Trigger button 2
        </button>

        <!-- Containers to render fetched content -->
        <div section-render-content="custom-content">1 content...</div>
        <div section-render-content="custom-content-2">2 content</div>
        <div section-render-content="custom-content-3">3 content</div>
    </section-render>

    !!! Important !!!
    The order of IDs in the trigger attribute (section-render-trigger) must match 
    the order of the sections in the URL (section-render-url).
    For example: 
    section-render-trigger="custom-content,custom-content-2" 
    should correspond to 
    section-render-url="?sections=contact-form,featured-blog", 
    meaning "custom-content" will render "contact-form" and "custom-content-2" will render "featured-blog".
  */
}

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

      if (sectionsMarkup[contentId]) {
        contentContainer.innerHTML = sectionsMarkup[contentId];

        section.innerHTML = contentContainer.innerHTML;
      }
    });
  }

  renderSingleContent(sections, response, contentContainer) {
    contentContainer.innerHTML = response;

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

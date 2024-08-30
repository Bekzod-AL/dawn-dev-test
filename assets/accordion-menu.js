// Before using make sure to implement script tag in your liquid file: <script src="{{ 'accordion-menu.js' | asset_url }}" defer></script>
// example code:
// <accordion-menu>
//   <details>
//     <summary>Details</summary>
//     <div>Example content</div>
//   </details>
// </accordion-menu>

class AccordionMenu extends HTMLElement {
  constructor() {
    super();
    this.accordion = this.querySelector('details');
    this.summaryTag = this.querySelector('summary');
    this.content = this.summaryTag.nextElementSibling;
    this.ensureStyles();
  }

  connectedCallback() {
    this.initializeAccordion();
  }

  ensureStyles() {
    if (!document.getElementById('accordion-menu-styles')) {
      this.insertAdjacentHTML(
        'beforebegin',
        `<style id="accordion-menu-styles">
           details.accordion-menu-animated > summary + * {
            overflow-y: hidden;
            opacity: 1;
            transition: all 0.4s ease;
          }
  
          details.accordion-menu-animated > summary + *.accordion-menu-closed {
            max-height: 0;
            margin: 0;
            padding: 0;
            opacity: 0;
          }
         </style>`
      );
    }
  }

  initializeAccordion() {
    this.addInitialClasses();
    this.addEventListeners();
  }

  addInitialClasses() {
    const classAnimated = 'accordion-menu-animated';
    const classClosed = 'accordion-menu-closed';

    this.accordion.classList.add(classAnimated);
    this.content.classList.add(classClosed);
  }

  addEventListeners() {
    this.summaryTag.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleAccordion();
    });
  }

  toggleAccordion() {
    if (this.isAccordionOpen()) {
      this.closeAccordion();
    } else {
      this.openAccordion();
    }
  }

  isAccordionOpen() {
    return this.accordion.hasAttribute('open');
  }

  closeAccordion() {
    this.content.style.removeProperty('max-height');
    this.content.classList.add('accordion-menu-closed');

    setTimeout(() => {
      this.accordion.removeAttribute('open');
    }, 400);
  }

  openAccordion() {
    this.accordion.setAttribute('open', '');

    if (!this.content.getAttribute('data-content-height')) {
      this.setContentHeight();
    }

    setTimeout(() => {
      this.content.classList.remove('accordion-menu-closed');
      this.content.style.maxHeight = this.content.getAttribute('data-content-height');
    }, 0);
  }

  setContentHeight() {
    this.content.style.maxHeight = 'none';
    this.content.setAttribute('data-content-height', `${this.content.scrollHeight}px`);
    this.content.style.removeProperty('max-height');
  }
}

customElements.define('accordion-menu', AccordionMenu);

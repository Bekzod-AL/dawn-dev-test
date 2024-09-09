// Before using make sure to implement script tag in your liquid file: <script src="{{ 'accordion-block.js' | asset_url }}" defer></script>
//
// By default animation style is "ease-out" and animation duration is 400 , but you can provide own properties:
//
// <accordion-block data-animation-style="ease-in" data-animation-duration="600">
//   <details>
//     <summary>Details</summary>
//     <div>Example content</div>
//   </details>
// </accordion-block>

class AccordionBlock extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector('details');
    this.summary = this.querySelector('summary');
    this.content = this.summary.nextElementSibling;

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.initializeAccordion();
  }

  initializeAccordion() {
    this.summary.addEventListener('click', (e) => {
      e.preventDefault();
      this.details.style.overflow = 'hidden';

      if (this.isClosing || !this.details.open) {
        this.open();
      } else if (this.isExpanding || this.details.open) {
        this.close();
      }
    });
  }

  open() {
    this.details.style.height = `${this.details.offsetHeight}px`;
    this.details.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animateAccordion(startHeight, endHeight);

    this.animation.onfinish = () => this.resetStates(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  close() {
    this.isClosing = true;
    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animateAccordion(startHeight, endHeight);

    this.animation.onfinish = () => this.resetStates(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  animateAccordion(startValue, endValue) {
    const duration = parseInt(this.dataset['animationDuration']) || 400;
    const easing = this.dataset['animationStyle'] || 'ease-out';

    this.animation = this.details.animate(
      {
        height: [startValue, endValue],
      },
      {
        duration,
        easing,
      }
    );
  }

  resetStates(accordionStatus) {
    this.details.open = accordionStatus;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.details.style.height = '';
    this.details.style.overflow = '';
  }
}

customElements.define('accordion-block', AccordionBlock);

// Before using make sure to implement script tag in your liquid file: <script src="{{ 'accordion-block.js' | asset_url }}" defer></script>
// example code:
// <accordion-block>
//   <details>
//     <summary>Details</summary>
//     <div>Example content</div>
//   </details>
// </accordion-block>

class DetailsBlock extends HTMLElement {
  constructor() {
    super();
    this.accordion = this.querySelector('details');
    this.summaryTag = this.querySelector('summary');
    this.content = this.summaryTag.nextElementSibling;

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.initializeAccordion();
  }

  initializeAccordion() {
    this.summaryTag.addEventListener('click', (e) => {
      e.preventDefault();
      this.accordion.style.overflow = 'hidden';

      if (this.isClosing || !this.accordion.open) {
        this.open();
      } else if (this.isExpanding || this.accordion.open) {
        this.close();
      }
    });
  }

  open() {
    this.accordion.style.height = `${this.accordion.offsetHeight}px`;
    this.accordion.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.accordion.offsetHeight}px`;
    const endHeight = `${this.summaryTag.offsetHeight + this.content.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animateAccordion(startHeight, endHeight);

    this.animation.onfinish = () => this.resetStates(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  close() {
    this.isClosing = true;
    const startHeight = `${this.accordion.offsetHeight}px`;
    const endHeight = `${this.summaryTag.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animateAccordion(startHeight, endHeight);

    this.animation.onfinish = () => this.resetStates(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  animateAccordion(startValue, endValue) {
    this.animation = this.accordion.animate(
      {
        height: [startValue, endValue],
      },
      {
        duration: 400,
        easing: 'ease-out',
      }
    );
  }

  resetStates(accordionStatus) {
    this.accordion.open = accordionStatus;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.accordion.style.height = '';
    this.accordion.style.overflow = '';
  }
}

customElements.define('details-block', DetailsBlock);

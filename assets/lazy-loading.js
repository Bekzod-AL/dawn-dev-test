// web component

const videoElement = document.createElement('template');
videoElement.innerHTML = `
  <video data-lazy-load autoplay loop  muted>
    <source>
  </video>
`;

class LazyVideoComponent extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.append(videoElement.content.cloneNode(true));
    }
    this.observer = null;
    this.update();
  }

  connectedCallback() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const video = this.shadowRoot.querySelector('video');

        Array.from(video.children).forEach((child) => {
          if (child.tagName === 'SOURCE') {
            child.src = child.getAttribute('data-src');
          }
        });

        video.load();
        video.removeAttribute('data-lazy-load');

        this.observer.unobserve(video);
      });
    });

    this.observer.observe(this);
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  update() {
    const videoTag = this.shadowRoot.querySelector('video');
    const sourceTag = videoTag.querySelector('source');
    const videoSrc = this.getAttribute('data-video-src');
    const videoPoster = this.getAttribute('data-video-poster');
    const videoType = this.getAttribute('data-video-type');

    videoTag.setAttribute('poster', videoPoster);
    sourceTag.setAttribute('data-src', videoSrc);
    sourceTag.setAttribute('type', videoType);
  }
}

customElements.define('x-lazy-video', LazyVideoComponent);

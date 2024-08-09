document.addEventListener('DOMContentLoaded', () => {
  const lazyVideos = Array.from(document.querySelectorAll('[data-lazy-load]'));

  if ('IntersectionObserver' in window) {
    const lazyVideoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const video = entry.target;
        Array.from(video.children).forEach((child) => {
          if (child.tagName === 'SOURCE') {
            child.src = child.getAttribute('data-src');
          }
        });

        video.load();
        video.removeAttribute('data-lazy-load');
        lazyVideoObserver.unobserve(video);
      });
    });

    lazyVideos.forEach((video) => {
      lazyVideoObserver.observe(video);
    });
  }
});

// web component

class LazyVideoComponent extends HTMLElement {
  connectedCallback() {
    this.appendChild(document.createElement('video'));
    this.update();
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback() {
    this.update();
  }

  update() {
    const videoTag = this.querySelector('video');
    const video = this.getAttribute('data-video-src');

    console.log(video);

    // if (videoTag && video) {
    //   video.sources.forEach((source) => {
    //     console.log(source);
    //   });
    // }
  }
}

customElements.define('x-lazy-video', LazyVideoComponent);

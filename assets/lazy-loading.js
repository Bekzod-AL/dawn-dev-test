// web component

class LazyVideoComponent extends HTMLElement {
  constructor() {
    super();

    this.videoElement = document.createElement('template');
    this.videoElement.innerHTML = `
      <video data-lazy-load autoplay loop muted>
        <source>
      </video>
    `;
    this.videoAttribute = 'data-lazy-load';

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.append(this.videoElement.content.cloneNode(true));
    }
    this.observer = null;
    this.update();
  }

  connectedCallback() {
    this.setObserver();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  setObserver() {
    this.observer = new IntersectionObserver((entries) => {
      const video = this.shadowRoot.querySelector('video');

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.handleVideoInView(video);
        } else {
          this.handleVideoOutOfView(video);
        }
      });
    });

    this.observer.observe(this);
  }

  handleVideoInView(video) {
    if (video.hasAttribute(this.videoAttribute)) {
      this.loadVideo(video);
      this.observer.unobserve(video);
    } else {
      console.log(`Resuming video at ${video.currentTime.toFixed(2)}s / ${video.duration.toFixed(2)}s`);
      video.play();
    }
  }

  handleVideoOutOfView(video) {
    if (!video.hasAttribute(this.videoAttribute)) {
      console.log(`Video paused at ${video.currentTime.toFixed(2)}s / ${video.duration.toFixed(2)}s`);
      video.pause();
    }
  }

  loadVideo(video) {
    Array.from(video.children).forEach((child) => {
      if (child.tagName === 'source'.toUpperCase()) {
        child.src = child.getAttribute('data-src');
      }
    });

    video.load();
    video.removeAttribute(this.videoAttribute);
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

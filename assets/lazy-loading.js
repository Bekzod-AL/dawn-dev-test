// web component

class LazyVideoComponent extends HTMLElement {
  constructor() {
    super();

    this.videoElement = document.createElement('template');
    this.videoElement.innerHTML = `<video data-lazy-load autoplay loop muted></video>`;

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
    const videoSources = JSON.parse(this.getAttribute('data-video-sources'));
    const videoPoster = this.getAttribute('data-video-poster');

    videoSources.forEach((source) => {
      let sourceTag = document.createElement('source');

      sourceTag.setAttribute('data-src', source.url);
      sourceTag.setAttribute('type', source.mime_type);
      sourceTag.setAttribute('poster', videoPoster);

      videoTag.append(sourceTag);
    });
  }
}

customElements.define('x-lazy-video', LazyVideoComponent);

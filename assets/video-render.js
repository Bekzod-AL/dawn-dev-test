// web component

class LazyVideoComponent extends HTMLElement {
  constructor() {
    super();

    const width = this.getAttribute('width');
    const height = this.getAttribute('height');

    const aspectRatio = this.getAspectRatio(width, height);

    this.videoElement = document.createElement('template');
    this.videoElement.innerHTML = `
      <style>
        video {
          max-width: 100%;
          aspect-ratio: ${aspectRatio};
        }
      </style>
      
      <video muted autoplay></video>  
    `;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.append(this.videoElement.content.cloneNode(true));
    }

    this._isLoaded = false;
    this.observer = null;
    this.createVideoSources();
  }

  connectedCallback() {
    this.setObserver();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  get isLoaded() {
    return this._isLoaded;
  }

  set isLoaded(value) {
    this._isLoaded = value;
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
    if (!this.isLoaded) {
      this.loadVideo(video);
      this.observer.unobserve(video);
    } else {
      video.play();
    }
  }

  handleVideoOutOfView(video) {
    if (this.isLoaded) {
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
    this.isLoaded = true;
  }

  createVideoSources() {
    const videoTag = this.shadowRoot.querySelector('video');
    const videoSources = JSON.parse(this.getAttribute('sources'));

    videoSources.forEach((source) => {
      let sourceTag = document.createElement('source');

      sourceTag.setAttribute('data-src', source.url);
      sourceTag.setAttribute('type', source.mime_type);

      videoTag.append(sourceTag);
    });

    this.addVideoAttributes(videoTag);
    this.removeComponentAttributes();

    if (JSON.parse(videoTag.getAttribute('fullwidth'))) this.setFullWidth(videoTag);
  }

  addVideoAttributes(videoTag) {
    const allAtributes = this.getAttributeNames();

    allAtributes.forEach((attribute) => {
      const value = this.getAttribute(attribute);
      videoTag.setAttribute(attribute, value);
    });

    this.removeVideoAttributes();
  }

  removeVideoAttributes() {
    const attributes = ['class', 'sources'];

    attributes.forEach((attribute) => {
      this.shadowRoot.querySelector('video').removeAttribute(attribute);
    });
  }

  removeComponentAttributes() {
    const attributes = ['width', 'height', 'part', 'fullwidth', 'loop'];

    attributes.forEach((attribute) => {
      this.removeAttribute(attribute);
    });
  }

  getAspectRatio(width, height) {
    if (width === 'auto' || height === 'auto') return 'auto';

    return parseInt(width) / parseInt(height);
  }

  setFullWidth(video) {
    video.style.width = '100%';
  }
}

customElements.define('lazy-video', LazyVideoComponent);

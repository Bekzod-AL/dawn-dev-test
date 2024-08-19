// web component

class LazyVideoComponent extends HTMLElement {
  constructor() {
    super();

    this.videoElement = document.createElement('template');
    this.videoElement.innerHTML = `
      <video muted autoplay></video>  
    `;

    this._isLoaded = false;

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

  update() {
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
  }

  addVideoAttributes(videoTag) {
    const allAtributes = this.getAttributeNames();

    allAtributes.forEach((attribute) => {
      if (attribute === 'sources'.toLowerCase()) return;

      const value = this.getAttribute(attribute);
      videoTag.setAttribute(attribute, value);
    });
  }

  removeComponentAttributes() {
    const attributes = ['width', 'height', 'class'];

    attributes.forEach((attribute) => {
      this.removeAttribute(attribute);
    });
  }
}

customElements.define('lazy-video', LazyVideoComponent);

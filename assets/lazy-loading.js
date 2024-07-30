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

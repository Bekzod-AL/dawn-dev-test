document.addEventListener('DOMContentLoaded', () => {
  const lazyVideos = [].slice.call(document.querySelectorAll('[data-lazy-load]'));

  if ('IntersectionObserver' in window) {
    let lazyVideoObserver = new IntersectionObserver((entries) => {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (let source in video.target.children) {
            let videoSource = video.target.children[source];

            if (typeof videoSource.tagName === 'string' && videoSource.tagName === 'SOURCE') {
              videoSource.src = videoSource.getAttribute('src');
            }
          }

          video.target.load();
          video.target.attributes.removeNamedItem('data-lazy-load');
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});

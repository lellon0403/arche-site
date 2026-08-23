(function () {
  var tabs = document.querySelectorAll('#tabs button');
  var lines = {};

  document.querySelectorAll('.line').forEach(function (element) {
    lines[element.id.replace('line-', '')] = element;
  });

  tabs.forEach(function (button) {
    button.addEventListener('click', function () {
      var key = button.dataset.line;
      tabs.forEach(function (item) {
        item.setAttribute('aria-selected', String(item === button));
      });
      Object.keys(lines).forEach(function (line) {
        lines[line].hidden = line !== key;
      });
    });
  });

  document.querySelectorAll('[data-copy-server]').forEach(function (button) {
    button.addEventListener('click', function () {
      var address = button.dataset.copyServer;
      navigator.clipboard.writeText(address).then(function () {
        button.dataset.copied = 'true';
        var label = button.querySelector('span');
        if (label) label.textContent = '복사됨';
      }).catch(function () {
        window.prompt('서버 주소를 복사하세요.', address);
      });
    });
  });

  var mapLink = document.querySelector('[data-map-link]');
  if (mapLink) {
    var mapPrefetched = false;
    var prefetchMap = function () {
      if (mapPrefetched) return;
      mapPrefetched = true;
      [
        ['map.html', 'document'],
        ['data/world-map.json', 'fetch'],
        ['map-tiles/2/x-1/z-1.webp', 'image'],
        ['map-tiles/2/x-1/z0.webp', 'image'],
        ['map-tiles/2/x0/z-1.webp', 'image'],
        ['map-tiles/2/x0/z0.webp', 'image']
      ].forEach(function (asset) {
        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = asset[0];
        link.as = asset[1];
        document.head.appendChild(link);
      });
    };
    mapLink.addEventListener('pointerenter', prefetchMap, { once: true });
    mapLink.addEventListener('focus', prefetchMap, { once: true });
    mapLink.addEventListener('touchstart', prefetchMap, { once: true, passive: true });
  }
})();

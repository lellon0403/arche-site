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
})();

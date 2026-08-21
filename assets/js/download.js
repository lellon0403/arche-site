(function () {
  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function addMeta(container, value) {
    if (!value) return;
    var item = document.createElement('span');
    item.textContent = value;
    container.appendChild(item);
  }

  function fillNotes(container, notes) {
    container.replaceChildren();
    (notes || []).forEach(function (note) {
      var item = document.createElement('li');
      item.textContent = note;
      container.appendChild(item);
    });
  }

  function renderClient(client) {
    if (!client) return;

    setText('[data-release-status]', '최신 배포');
    setText('[data-release-title]', client.title || '아르케 클라이언트');
    setText('[data-release-description]', client.description || '서버 접속에 필요한 최신 클라이언트입니다.');

    var meta = document.querySelector('[data-release-meta]');
    meta.replaceChildren();
    addMeta(meta, client.version);
    addMeta(meta, client.publishedAt);
    addMeta(meta, client.size);

    var button = document.querySelector('[data-release-download]');
    button.href = client.file;
    button.setAttribute('download', '');
    button.removeAttribute('aria-disabled');
    button.textContent = (client.version || '최신 버전') + ' 다운로드';

    fillNotes(document.querySelector('[data-release-notes]'), client.notes);

    if (client.sha256) {
      var hash = document.querySelector('[data-release-hash]');
      hash.hidden = false;
      hash.querySelector('code').textContent = client.sha256;
    }
  }

  function renderPatches(patches) {
    if (!patches || patches.length === 0) return;
    var list = document.querySelector('[data-patch-list]');
    list.replaceChildren();

    patches.forEach(function (patch) {
      var item = document.createElement('article');
      item.className = 'history-item';

      var time = document.createElement('time');
      time.textContent = patch.publishedAt || '';

      var copy = document.createElement('div');
      var title = document.createElement('strong');
      title.textContent = patch.version || '패치';
      var description = document.createElement('p');
      description.textContent = patch.description || '';
      copy.append(title, description);

      var link = document.createElement('a');
      link.href = patch.file;
      link.setAttribute('download', '');
      link.textContent = patch.size ? '다운로드 · ' + patch.size : '다운로드';

      item.append(time, copy, link);
      list.appendChild(item);
    });
  }

  function bindCopyButtons(address) {
    document.querySelectorAll('[data-copy-server]').forEach(function (button) {
      var serverAddress = address || button.dataset.copyServer;
      button.dataset.copyServer = serverAddress;
      var value = button.querySelector('b');
      if (value) value.textContent = serverAddress;

      button.addEventListener('click', function () {
        navigator.clipboard.writeText(serverAddress).then(function () {
          button.dataset.copied = 'true';
          var label = button.querySelector('span');
          if (label) label.textContent = '복사됨';
        }).catch(function () {
          window.prompt('서버 주소를 복사하세요.', serverAddress);
        });
      });
    });
  }

  fetch('data/releases.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('release manifest unavailable');
      return response.json();
    })
    .then(function (releaseData) {
      bindCopyButtons(releaseData.serverAddress);
      renderClient(releaseData.client);
      renderPatches(releaseData.patches);
    })
    .catch(function () {
      bindCopyButtons('play.lellon.kr');
    });
})();

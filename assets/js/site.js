(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 직업 계열 탭 — 클릭과 방향키 */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"][data-line]'));

  function selectTab(tab, focus) {
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(item.getAttribute('aria-controls'));
      if (!panel) return;
      panel.hidden = !selected;
      panel.classList.toggle('is-entering', selected && !reduceMotion);
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (event) {
      var next = null;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      else if (event.key === 'Home') next = tabs[0];
      else if (event.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      event.preventDefault();
      selectTab(next, true);
    });
  });

  /* 서버 주소 복사 */
  document.querySelectorAll('[data-copy-server]').forEach(function (button) {
    var label = button.querySelector('[data-copy-label]') || button.querySelector('span');
    var resetTimer = null;
    button.addEventListener('click', function () {
      var address = button.dataset.copyServer;
      if (!navigator.clipboard) {
        window.prompt('서버 주소를 복사하세요.', address);
        return;
      }
      navigator.clipboard.writeText(address).then(function () {
        button.dataset.copied = 'true';
        if (label) label.textContent = '복사됨';
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          button.dataset.copied = 'false';
          if (label) label.textContent = '복사';
        }, 2400);
      }).catch(function () {
        window.prompt('서버 주소를 복사하세요.', address);
      });
    });
  });

  /* 섹션 등장 — 화면에 들어올 때 한 번 */
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealItems.forEach(function (item) { item.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* 현재 읽는 섹션을 메뉴에 표시 */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav nav a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (link) { byId[link.getAttribute('href').slice(1)] = link; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (item) { item.classList.toggle('is-current', item === link); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }
})();

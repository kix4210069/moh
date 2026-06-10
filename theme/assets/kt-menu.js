/* KetShop slide menu — opens from the hamburger */
(function () {
  if (window.__ktMenu) return;
  window.__ktMenu = true;

  var overlay = document.querySelector('[data-kt-menu-overlay]');
  var menu = document.querySelector('[data-kt-menu]');
  if (!menu || !overlay) return;

  function open() { overlay.classList.add('is-open'); menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('is-open'); menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-kt-menu-toggle], .nav-toggle')) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-kt-menu-close]')) { close(); return; }
    var t = e.target.closest('[data-kt-sub]');
    if (t) {
      e.preventDefault();
      var sub = t.closest('li').querySelector('.kt-menu__sub');
      if (sub) { sub.classList.toggle('is-open'); t.textContent = sub.classList.contains('is-open') ? '−' : '+'; }
    }
  });
})();

/* KetShop native sections — carousels, countdown, mobile nav */
(function () {
  if (window.__ktHomeInit) return;
  window.__ktHomeInit = true;
  /* Carousel arrows: each .arrows controls the nearest [data-row] in its section */
  document.querySelectorAll('.kt [data-arrows]').forEach(function (group) {
    var sec = group.closest('[data-kt-section]') || document;
    var row = sec.querySelector('[data-row]');
    if (!row) return;
    group.querySelectorAll('.arrow').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = btn.getAttribute('data-scroll') === 'prev' ? -1 : 1;
        row.scrollBy({ left: dir * row.clientWidth * 0.8, behavior: 'smooth' });
      });
    });
  });

  /* Mobile nav toggle */
  document.querySelectorAll('[data-nav-toggle]').forEach(function (t) {
    t.addEventListener('click', function () {
      var nav = document.getElementById(t.getAttribute('data-target'));
      if (nav) nav.classList.toggle('open');
    });
  });

  /* Countdown: resets daily at local midnight, or counts to a fixed date if provided */
  document.querySelectorAll('[data-countdown]').forEach(function (root) {
    var hEl = root.querySelector('[data-h]');
    var mEl = root.querySelector('[data-m]');
    var sEl = root.querySelector('[data-s]');
    if (!hEl || !mEl || !sEl) return;
    var fixed = root.getAttribute('data-deadline');
    function tick() {
      var now = new Date(), end;
      if (fixed) { end = new Date(fixed); }
      else { end = new Date(now); end.setHours(23, 59, 59, 999); }
      var diff = Math.max(0, Math.floor((end - now) / 1000));
      hEl.textContent = String(Math.floor(diff / 3600)).padStart(2, '0');
      mEl.textContent = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      sEl.textContent = String(diff % 60).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  });
})();

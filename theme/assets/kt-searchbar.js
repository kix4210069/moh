/* KetShop search overlay — opens on the magnifier, live results */
(function () {
  if (window.__ktSearch) return;
  window.__ktSearch = true;

  function money(v) {
    if (v == null || v === '') return '';
    var s = String(v);
    if (/^\d+$/.test(s)) return '€' + (parseInt(s, 10) / 100).toFixed(2).replace('.', ',');
    return s;
  }

  var ov = document.createElement('div');
  ov.className = 'kt-srch-overlay';
  ov.innerHTML =
    '<div class="kt-srch-panel">' +
      '<form class="kt-srch-form" action="/search" method="get" role="search">' +
        '<span class="kt-srch-ic">🔍</span>' +
        '<input type="search" name="q" class="kt-srch-input" placeholder="Rechercher un maillot, une équipe..." autocomplete="off">' +
        '<input type="hidden" name="type" value="product">' +
        '<button type="button" class="kt-srch-close" aria-label="Fermer">✕</button>' +
      '</form>' +
      '<div class="kt-srch-results"><div class="kt-srch-hint">Tapez le nom d\'une équipe, d\'un joueur ou d\'un pays…</div></div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(ov); });

  var input = ov.querySelector('.kt-srch-input');
  var results = ov.querySelector('.kt-srch-results');

  function open() { ov.classList.add('is-open'); document.body.style.overflow = 'hidden'; setTimeout(function () { input.focus(); }, 60); }
  function close() { ov.classList.remove('is-open'); document.body.style.overflow = ''; }

  ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('.kt-srch-close')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* Open from the magnifier icon (instead of navigating) */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-kt-search-toggle], [aria-label="Recherche"]');
    if (t) { e.preventDefault(); open(); }
  });

  /* Live predictive results */
  var timer;
  input.addEventListener('input', function () {
    var q = input.value.trim();
    clearTimeout(timer);
    if (q.length < 2) { results.innerHTML = '<div class="kt-srch-hint">Tapez le nom d\'une équipe, d\'un joueur ou d\'un pays…</div>'; return; }
    timer = setTimeout(function () {
      fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=8&resources[options][unavailable_products]=last')
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var ps = (d.resources && d.resources.results && d.resources.results.products) || [];
          if (!ps.length) { results.innerHTML = '<div class="kt-srch-empty">Aucun maillot trouvé pour « ' + q + ' »</div>'; return; }
          results.innerHTML = ps.map(function (p) {
            var img = (p.featured_image && p.featured_image.url) ? p.featured_image.url : (p.image || '');
            return '<a class="kt-srch-item" href="' + p.url + '">' +
              '<span class="kt-srch-thumb">' + (img ? '<img src="' + img + '" alt="">' : '') + '</span>' +
              '<span class="kt-srch-info"><span class="kt-srch-t">' + p.title + '</span><span class="kt-srch-p">' + money(p.price) + '</span></span>' +
            '</a>';
          }).join('') + '<a class="kt-srch-all" href="/search?q=' + encodeURIComponent(q) + '&type=product">Voir tous les résultats →</a>';
        })
        .catch(function () {});
    }, 220);
  });
})();

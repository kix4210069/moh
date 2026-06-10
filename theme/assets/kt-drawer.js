/* KetShop slide cart drawer — Shopify AJAX */
(function () {
  if (window.__ktDrawer) return;
  window.__ktDrawer = true;

  var FREE_SHIP = (window.KT_FREESHIP_CENTS || 6000); // 60 € by default
  var fmt = function (cents) { return '€' + (cents / 100).toFixed(2).replace('.', ','); };

  /* ---- Build drawer DOM ---- */
  var overlay = document.createElement('div');
  overlay.className = 'kt-drawer-overlay';
  var drawer = document.createElement('aside');
  drawer.className = 'kt-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML =
    '<div class="kt-drawer__loading"><div class="kt-spin"></div></div>' +
    '<div class="kt-drawer__head"><strong>Mon panier</strong><button class="kt-drawer__close" aria-label="Fermer">✕</button></div>' +
    '<div class="kt-drawer__ship"><div class="kt-drawer__shiptext"></div><div class="kt-drawer__track"><div class="kt-drawer__fill"></div></div></div>' +
    '<div class="kt-drawer__items"></div>' +
    '<div class="kt-drawer__foot">' +
      '<div class="kt-drawer__sub"><span>Sous-total</span><span class="kt-drawer__total">€0,00</span></div>' +
      '<div class="kt-drawer__taxes">Taxes et livraison calculées au paiement.</div>' +
      '<a href="/checkout" class="kt-drawer__checkout">Commander</a>' +
      '<a href="/cart" class="kt-drawer__viewcart">Voir le panier</a>' +
    '</div>';
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  });

  var itemsEl = drawer.querySelector('.kt-drawer__items');
  var totalEl = drawer.querySelector('.kt-drawer__total');
  var shipText = drawer.querySelector('.kt-drawer__shiptext');
  var shipFill = drawer.querySelector('.kt-drawer__fill');

  function open() { overlay.classList.add('is-open'); drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function close() { overlay.classList.remove('is-open'); drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  overlay.addEventListener('click', close);
  drawer.addEventListener('click', function (e) { if (e.target.closest('.kt-drawer__close')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* ---- Render ---- */
  function render(cart) {
    if (!cart.items || cart.items.length === 0) {
      itemsEl.innerHTML = '<div class="kt-drawer__empty">Votre panier est vide.</div>';
    } else {
      itemsEl.innerHTML = cart.items.map(function (it) {
        var meta = [];
        if (it.variant_title && it.variant_title.indexOf('Default') === -1) meta.push(it.variant_title);
        (it.options_with_values || []).forEach(function () {});
        for (var k in it.properties || {}) { if (k.charAt(0) !== '_' && it.properties[k]) meta.push(k + ' : ' + it.properties[k]); }
        var img = it.image ? '<img src="' + it.image + '" alt="">' : '';
        return '<div class="kt-ditem" data-key="' + it.key + '">' +
          '<a class="kt-ditem__img" href="' + it.url + '">' + img + '</a>' +
          '<div><a class="kt-ditem__title" href="' + it.url + '">' + it.product_title + '</a>' +
            '<div class="kt-ditem__meta">' + meta.join('<br>') + '</div>' +
            '<div class="kt-dqty"><button data-d="minus" aria-label="Moins">−</button><span>' + it.quantity + '</span><button data-d="plus" aria-label="Plus">+</button></div>' +
            '<button class="kt-ditem__remove" data-remove>Supprimer</button>' +
          '</div>' +
          '<div class="kt-ditem__price">' + fmt(it.final_line_price) + '</div>' +
        '</div>';
      }).join('');
    }
    totalEl.textContent = fmt(cart.total_price);
    var remaining = FREE_SHIP - cart.total_price;
    if (cart.item_count === 0) { shipText.innerHTML = 'Ajoutez des articles pour profiter de la livraison offerte 🚚'; shipFill.style.width = '0%'; }
    else if (remaining > 0) { shipText.innerHTML = 'Plus que <b>' + fmt(remaining) + '</b> pour la livraison offerte 🚚'; shipFill.style.width = Math.min(100, cart.total_price * 100 / FREE_SHIP) + '%'; }
    else { shipText.innerHTML = '🎉 Livraison offerte débloquée !'; shipFill.style.width = '100%'; }
  }

  function loading(on) { drawer.classList.toggle('is-loading', on); }

  function refresh(openAfter) {
    loading(true);
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { render(cart); loading(false); if (openAfter) open(); updateCount(cart.item_count); })
      .catch(function () { loading(false); });
  }

  function change(key, qty) {
    loading(true);
    fetch('/cart/change.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); })
      .then(function (cart) { render(cart); loading(false); updateCount(cart.item_count); });
  }

  function updateCount(n) {
    document.querySelectorAll('.cart__badge').forEach(function (b) { b.textContent = n; });
  }

  /* ---- Item interactions ---- */
  itemsEl.addEventListener('click', function (e) {
    var row = e.target.closest('.kt-ditem'); if (!row) return;
    var key = row.getAttribute('data-key');
    var qtyEl = row.querySelector('.kt-dqty span');
    var q = parseInt(qtyEl.textContent, 10) || 1;
    if (e.target.closest('[data-remove]')) { change(key, 0); }
    else if (e.target.closest('[data-d="plus"]')) { change(key, q + 1); }
    else if (e.target.closest('[data-d="minus"]')) { change(key, Math.max(0, q - 1)); }
  });

  /* ---- Intercept add-to-cart forms ---- */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.action || form.action.indexOf('/cart/add') === -1) return;
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) { btn.dataset.label = btn.textContent; btn.textContent = 'Ajout en cours…'; btn.disabled = true; }
    fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function () { return refresh(true); })
      .catch(function () { form.submit(); })
      .finally(function () { if (btn) { btn.textContent = btn.dataset.label || 'Ajouter au panier'; btn.disabled = false; } });
  });

  /* ---- Open drawer from cart icon ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.cart, [data-kt-cart-toggle]');
    if (t) { e.preventDefault(); refresh(true); }
  });
})();

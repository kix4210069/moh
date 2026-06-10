/* KetShop product page interactions */
(function () {
  var root = document.querySelector('[data-kt-product]');
  if (!root) return;

  /* ---- Gallery ---- */
  var mainImg = root.querySelector('#kt-main-img');
  root.querySelectorAll('.kt-thumb').forEach(function (t) {
    t.addEventListener('click', function () {
      if (mainImg) mainImg.src = t.getAttribute('data-src');
      root.querySelectorAll('.kt-thumb').forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
    });
  });

  /* ---- Quantity ---- */
  var qty = root.querySelector('#kt-qty');
  root.querySelectorAll('[data-qty]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!qty) return;
      var v = parseInt(qty.value, 10) || 1;
      v += (b.getAttribute('data-qty') === 'plus' ? 1 : -1);
      if (v < 1) v = 1;
      qty.value = v;
    });
  });

  /* ---- Variants ---- */
  var variants = window.ktVariants || [];
  var idInput = root.querySelector('#kt-variant-id');
  var priceEl = root.querySelector('#kt-price');
  var addBtn = root.querySelector('.kt-addcart');
  var optionCount = root.querySelectorAll('.kt-optgroup').length;

  function money(cents) {
    return '€' + (cents / 100).toFixed(2).replace('.', ',') + ' EUR';
  }
  function currentSelection() {
    var sel = [];
    root.querySelectorAll('.kt-optgroup').forEach(function (g) {
      var active = g.querySelector('.kt-opt.is-active');
      sel.push(active ? active.getAttribute('data-value') : null);
    });
    return sel;
  }
  function findVariant(sel) {
    return variants.find(function (v) {
      return v.options.length === sel.length && v.options.every(function (o, i) { return o === sel[i]; });
    });
  }
  function update() {
    if (!optionCount) return;
    var sel = currentSelection();
    if (sel.indexOf(null) !== -1) return;
    var v = findVariant(sel);
    if (v) {
      if (idInput) idInput.value = v.id;
      if (priceEl) priceEl.textContent = money(v.price);
      if (addBtn) {
        addBtn.disabled = !v.available;
        addBtn.textContent = v.available ? 'Ajouter au panier' : 'Rupture de stock';
      }
    }
  }
  root.querySelectorAll('.kt-opt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-soldout')) return;
      var group = btn.closest('.kt-optgroup');
      group.querySelectorAll('.kt-opt').forEach(function (x) { x.classList.remove('is-active'); });
      btn.classList.add('is-active');
      update();
    });
  });
  update();
})();

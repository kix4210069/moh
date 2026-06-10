/* KetShop cart — quantity steppers auto-submit the cart form */
(function () {
  var form = document.getElementById('kt-cart-form');
  if (!form) return;
  form.querySelectorAll('[data-cqty]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('input[name="updates[]"]');
      if (!input) return;
      var v = parseInt(input.value, 10) || 0;
      v += (btn.getAttribute('data-cqty') === 'plus' ? 1 : -1);
      if (v < 0) v = 0;
      input.value = v;
      form.requestSubmit ? form.requestSubmit(form.querySelector('[name="update"]')) : form.submit();
    });
  });
})();

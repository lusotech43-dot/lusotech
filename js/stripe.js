(function () {
  'use strict';

  /* -----------------------------------------
     Configuration
     ----------------------------------------- */
  var API_URL = '';

  /* -----------------------------------------
     Payment status from redirect query params
     ----------------------------------------- */
  (function checkPaymentStatus() {
    var params = new URLSearchParams(window.location.search);
    var payment = params.get('payment');
    var container = document.getElementById('payment-status');
    if (!container) return;

    if (payment === 'success') {
      container.style.display = 'block';
      container.innerHTML = '<div class="card" style="padding: var(--space-6); text-align: center;">\
        <h3 style="color: var(--green-400); margin-bottom: var(--space-3);">\u2713 Payment successful!</h3>\
        <p>Your subscription is now active. You\'ll receive a confirmation email shortly.</p>\
        <a href="products.html" class="btn btn-ghost" style="margin-top: var(--space-4);">Back to products</a>\
      </div>';
      window.history.replaceState({}, '', '/products.html');
    } else if (payment === 'cancelled') {
      container.style.display = 'block';
      container.innerHTML = '<div class="card" style="padding: var(--space-6); text-align: center;">\
        <h3 style="margin-bottom: var(--space-3);">Payment cancelled</h3>\
        <p>No charges were made. Feel free to try again whenever you\'re ready.</p>\
      </div>';
      window.history.replaceState({}, '', '/products.html');
    }
  })();

  /* -----------------------------------------
     Buy button -> Stripe Checkout
     ----------------------------------------- */
  var buyBtns = document.querySelectorAll('.js-buy');
  if (!buyBtns.length) return;

  function handleBuyClick(e) {
    e.preventDefault();
    var btn = e.currentTarget;
    var originalText = btn.textContent;
    btn.textContent = 'Redirecting\u2026';
    btn.disabled = true;

    fetch(API_URL + '/api/create-subscription', { method: 'POST' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || 'Failed to create session');
        }
      })
      .catch(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Something went wrong. Please try again later.');
      });
  }

  for (var i = 0; i < buyBtns.length; i++) {
    buyBtns[i].addEventListener('click', handleBuyClick);
  }
})();

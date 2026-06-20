(function () {
  'use strict';

  var currentPage = '';

  function renderNavbar() {
    return '\
<header class="navbar">\
  <div class="container nav-inner">\
    <a class="nav-brand" href="index.html">\
      <img src="brand/simpleicon.png" alt="LusoTech">\
      <span>LusoTech</span>\
    </a>\
    <nav class="nav-menu" id="nav-menu">\
      <ul class="nav-links">\
        <li><a class="nav-link" href="index.html" data-i18n="nav.home"' + (currentPage === 'index' ? ' aria-current="page"' : '') + '>Home</a></li>\
        <li><a class="nav-link" href="about.html" data-i18n="nav.about"' + (currentPage === 'about' ? ' aria-current="page"' : '') + '>About</a></li>\
        <li><a class="nav-link" href="portfolio.html" data-i18n="nav.portfolio"' + (currentPage === 'portfolio' ? ' aria-current="page"' : '') + '>Portfolio</a></li>\
        <li><a class="nav-link" href="products.html" data-i18n="nav.products"' + (currentPage === 'products' ? ' aria-current="page"' : '') + '>Products</a></li>\
      </ul>\
      <div class="nav-actions">\
        <div class="nav-utils">\
          <div class="lang-switch" role="group" data-i18n-attr="aria-label:lang.label" aria-label="Language">\
            <button type="button" class="lang-btn" data-lang="en" data-i18n-attr="aria-label:lang.label">EN</button>\
            <button type="button" class="lang-btn" data-lang="pt" data-i18n-attr="aria-label:lang.label">PT</button>\
          </div>\
          <button type="button" class="theme-toggle" aria-pressed="false" data-i18n-attr="aria-label:theme.toLight" aria-label="Switch to light theme">\
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>\
            </svg>\
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\
              <circle cx="12" cy="12" r="4"/>\
              <line x1="12" y1="2"  x2="12" y2="4"/>\
              <line x1="12" y1="20" x2="12" y2="22"/>\
              <line x1="2"  y1="12" x2="4"  y2="12"/>\
              <line x1="20" y1="12" x2="22" y2="12"/>\
              <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>\
              <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>\
              <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/>\
            </svg>\
          </button>\
        </div>\
        <a class="btn btn-ghost btn-sm" href="index.html#contact" data-i18n="nav.contact">Contact</a>\
        <a class="btn btn-primary btn-sm" href="products.html" data-i18n="nav.cta">Get started</a>\
      </div>\
    </nav>\
    <button class="nav-toggle" id="nav-toggle" data-i18n-attr="aria-label:nav.toggle" aria-label="Toggle menu">\
      <span></span><span></span><span></span>\
    </button>\
  </div>\
</header>';
  }

  function renderFooter() {
    return '\
<footer class="footer">\
  <div class="container">\
    <div class="footer-grid">\
      <div>\
        <a class="footer-brand" href="index.html">\
          <img src="brand/simpleicon.png" alt="LusoTech">\
          <span>LusoTech</span>\
        </a>\
        <p class="footer-about" data-i18n="footer.about">Engineered digital solutions for businesses and private individuals.</p>\
      </div>\
      <div class="footer-col">\
        <h4 data-i18n="footer.studio">Studio</h4>\
        <ul>\
          <li><a href="index.html" data-i18n="nav.home">Home</a></li>\
          <li><a href="about.html" data-i18n="nav.about">About</a></li>\
          <li><a href="portfolio.html" data-i18n="nav.portfolio">Portfolio</a></li>\
          <li><a href="products.html" data-i18n="nav.products">Products</a></li>\
        </ul>\
      </div>\
      <div class="footer-col">\
        <h4 data-i18n="footer.services">Services</h4>\
        <ul>\
          <li><a href="index.html#services" data-i18n="footer.serv.custom">Custom Websites</a></li>\
          <li><a href="index.html#services" data-i18n="footer.serv.desktop">Desktop Applications</a></li>\
          <li><a href="index.html#services" data-i18n="footer.serv.automation">Business Automation</a></li>\
          <li><a href="index.html#services" data-i18n="footer.serv.maintenance">Maintenance & Support</a></li>\
        </ul>\
      </div>\
      <div class="footer-col">\
        <h4 data-i18n="footer.contact">Contact</h4>\
        <ul>\
          <li><a href="mailto:lusotech43@gmail.com" data-i18n="footer.mail">lusotech43@gmail.com</a></li>\
          <li><a href="tel:+351961549300" data-i18n="footer.phone">+351 961 549 300</a></li>\
          <li><a href="index.html#contact" data-i18n="footer.send">Send a brief</a></li>\
        </ul>\
      </div>\
    </div>\
    <div class="footer-bottom">\
      <span data-i18n="footer.copy">© 2026 LusoTech. All rights reserved.</span>\
    </div>\
  </div>\
</footer>';
  }

  var navEl = document.getElementById('nav-placeholder');
  if (navEl) {
    currentPage = navEl.getAttribute('data-page') || '';
    navEl.outerHTML = renderNavbar();
  }

  var footerEl = document.getElementById('footer-placeholder');
  if (footerEl) {
    footerEl.outerHTML = renderFooter();
  }
})();

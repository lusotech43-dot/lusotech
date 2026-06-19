/* =========================================
   LusoTech — i18n engine
   Reads data-i18n="key" on elements and
   replaces their text/HTML with the active
   language string from i18n.js.
   ========================================= */

(function (global) {
  'use strict';

  const I18N_DATA = global.__I18N_DATA__ || {};
  const languages = Object.keys(I18N_DATA);
  let current = languages[0] || 'en';

  function t(key) {
    const dict = I18N_DATA[current] || {};
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
  }

  function setLang(lang) {
    if (!I18N_DATA[lang]) return;
    current = lang;
    document.documentElement.setAttribute('lang', lang);

    // data-i18n (text/html)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      // preserve user-set content flag (rare)
      const mode = el.getAttribute('data-i18n-mode') || 'html';
      if (mode === 'text') el.textContent = val;
      else el.innerHTML = val;
    });

    // data-i18n-attr — format: "attr1:key1;attr2:key2"
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const spec = el.getAttribute('data-i18n-attr');
      spec.split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    // data-i18n-list — for <select>: child <option data-i18n-list="key">
    document.querySelectorAll('[data-i18n-list]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n-list'));
    });

    // Notify other components (e.g. chat widget dynamic messages)
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } }));
  }

  global.I18N = {
    t,
    setLang,
    get lang() { return current; },
    languages,
  };
})(window);

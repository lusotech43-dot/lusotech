/* =========================================
   LusoTech — Main JS
   ========================================= */

(function () {
  'use strict';

  /* -----------------------------------------
     Theme toggle (dark / light)
     ----------------------------------------- */
  const THEME_KEY = 'lusotech-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const isLight = theme === 'light';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.setAttribute(
        'aria-label',
        (window.I18N && window.I18N.t(isLight ? 'theme.toDark' : 'theme.toLight')) ||
          (isLight ? 'Switch to dark theme' : 'Switch to light theme')
      );
      const label = btn.querySelector('.theme-toggle-label');
      if (label) {
        label.textContent =
          (window.I18N && window.I18N.t(isLight ? 'theme.dark' : 'theme.light')) ||
          (isLight ? 'Dark' : 'Light');
      }
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  }

  // Apply saved/initial theme immediately (called from inline head script too)
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    let theme = saved;
    if (!theme) {
      theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
        ? 'light'
        : 'dark';
    }
    applyTheme(theme);
  }

  // Run the theme apply on script load (before DOMContentLoaded) so the page
  // doesn't flash. The buttons' aria-pressed state is set later in DOMContentLoaded.
  (function applyThemeEarly() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (_) {}
    let theme = saved;
    if (!theme) {
      theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
        ? 'light'
        : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  })();

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  /* -----------------------------------------
     Navbar — scroll state + mobile toggle
     ----------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* -----------------------------------------
     Reveal on scroll
     ----------------------------------------- */
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  /* -----------------------------------------
     Portfolio filter
     ----------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
          const cat = card.dataset.category;
          if (filter === 'all' || (cat && cat.split(' ').includes(filter))) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(() => { card.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }

  /* -----------------------------------------
     Portfolio expandable cards
     ----------------------------------------- */
  if (projectCards.length) {
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const btn = e.target.closest('.project-expand-btn');
        if (btn) return;
        const wasExpanded = card.classList.contains('expanded');
        projectCards.forEach(c => c.classList.remove('expanded'));
        if (!wasExpanded) {
          card.classList.add('expanded');
        }
      });
    });

    document.querySelectorAll('.project-expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.project-card');
        const wasExpanded = card.classList.contains('expanded');
        projectCards.forEach(c => c.classList.remove('expanded'));
        if (!wasExpanded) {
          card.classList.add('expanded');
        }
      });
    });
  }

  /* -----------------------------------------
     Escape key - close lightbox + chat
     ----------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeLightbox === 'function') closeLightbox();
      if (chatPanel && chatPanel.classList.contains('open')) toggleChat();
    }
  });

  /* -----------------------------------------
     Contact form submit (Formspree)
     ----------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.dataset.original || btn.textContent;
      btn.dataset.original = original;
      btn.setAttribute('data-i18n', 'contact.submitting');
      btn.textContent = (window.I18N && window.I18N.t('contact.submitting')) || 'Sending…';
      btn.disabled = true;

      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        budget: document.getElementById('budget').value,
        message: document.getElementById('message').value,
        _replyto: document.getElementById('email').value,
        _subject: 'New project inquiry from ' + document.getElementById('name').value,
      };

      fetch(contactForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      })
      .then(r => r.json())
      .then(res => {
        if (res.ok) {
          btn.setAttribute('data-i18n', 'contact.success');
          btn.textContent = (window.I18N && window.I18N.t('contact.success')) || '✓ Message sent';
          contactForm.reset();
        } else {
          throw new Error(res.error || 'Form submission failed');
        }
      })
      .catch(() => {
        btn.setAttribute('data-i18n', 'contact.submit');
        btn.textContent = (window.I18N && window.I18N.t('contact.submit')) || 'Send message';
      })
      .finally(() => {
        btn.disabled = false;
      });
    });
  }

  /* -----------------------------------------
     AI Chat widget
     ----------------------------------------- */
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatSuggestions = document.getElementById('chat-suggestions');

  function t(key) { return (window.I18N && window.I18N.t(key)) || key; }

  function appendMessage(text, who) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg-' + who;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    if (!chatMessages) return null;
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg-bot chat-typing-wrap';
    wrap.innerHTML = '<div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return wrap;
  }

  function botReply(userText) {
    const typing = showTyping();
    setTimeout(() => {
      if (typing) typing.remove();
      const text = (userText || '').toLowerCase();
      let replyKey = 'chat.reply.fallback';
      if (/servi|service|offer|faç|oferec/.test(text)) replyKey = 'chat.reply.services';
      else if (/pric|price|€|euros?|cost|custo|preç|valor|budget|orçament/.test(text)) replyKey = 'chat.reply.pricing';
      else if (/start|begin|come[çc]|inici|kickoff/.test(text)) replyKey = 'chat.reply.start';
      else if (/call|meet|chamad|reuni|marc|agend|schedu/.test(text)) replyKey = 'chat.reply.call';
      else if (/portfolio|project|projeto|prograss|mytree|autosocial|lusotech|trabalh|work/.test(text)) replyKey = 'chat.reply.portfolio';
      else if (/tech|stack|technolog|tecnolog|framework|vanilla|node|electron|sql/.test(text)) replyKey = 'chat.reply.tech';
      else if (/about|sobr|quem|who|company|empres|equip|team/.test(text)) replyKey = 'chat.reply.about';
      appendMessage(t(replyKey), 'bot');
    }, 900 + Math.random() * 600);
  }

  function sendMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatInput.value = '';
    if (chatSuggestions) chatSuggestions.style.display = 'none';
    botReply(text);
  }

  function toggleChat() {
    if (!chatPanel || !chatToggle) return;
    const opening = !chatPanel.classList.contains('open');
    chatPanel.classList.toggle('open');
    chatToggle.classList.toggle('open');
    chatToggle.setAttribute('aria-expanded', String(opening));
    chatPanel.setAttribute('aria-hidden', String(!opening));
    chatToggle.setAttribute('aria-label', opening ? t('chat.aria.close') : t('chat.aria.open'));
    if (opening) {
      if (chatInput) setTimeout(() => chatInput.focus(), 250);
      if (chatMessages && chatMessages.dataset.seeded !== '1') {
        chatMessages.dataset.seeded = '1';
        appendMessage(t('chat.greeting'), 'bot');
      }
    }
  }

  if (chatToggle) chatToggle.addEventListener('click', toggleChat);
  if (chatClose) chatClose.addEventListener('click', toggleChat);
  if (chatSend) chatSend.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  if (chatSuggestions) {
    chatSuggestions.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-suggestion');
      if (!btn) return;
      const text = btn.textContent.trim();
      if (chatInput) chatInput.value = text;
      sendMessage();
    });
  }

  // Re-seed the greeting when the user changes language
  document.addEventListener('i18n:change', () => {
    if (!chatMessages) return;
    if (chatMessages.dataset.seeded === '1' && chatPanel && chatPanel.classList.contains('open')) {
      // Append a re-greeting as a separator note
      appendMessage(t('chat.greeting'), 'bot');
    }
  });

  /* -----------------------------------------
     Animated number counters
     ----------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (t < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(c => counterIO.observe(c));
  }

  /* -----------------------------------------
     Language switcher (i18n)
     ----------------------------------------- */
  const STORAGE_KEY = 'lusotech-lang';
  const langButtons = document.querySelectorAll('.lang-btn');

  function setActiveLang(lang) {
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.documentElement.setAttribute('lang', lang);
  }

  function applyLang(lang) {
    if (!window.I18N || !window.I18N.languages.includes(lang)) return;
    window.I18N.setLang(lang);
    setActiveLang(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  if (langButtons.length) {
    const saved = (function () { try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; } })();
    const initial = saved && window.I18N.languages.includes(saved) ? saved : 'en';
    applyLang(initial);

    langButtons.forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
  } else if (window.I18N) {
    // No buttons on this page — still apply saved lang
    const saved = (function () { try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; } })();
    if (saved && window.I18N.languages.includes(saved)) {
      window.I18N.setLang(saved);
    } else {
      window.I18N.setLang('en');
    }
  }

  /* -----------------------------------------
     Lightbox
     ----------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxNav = document.getElementById('lightbox-nav');
  let lightboxImages = [];
  let lightboxIndex = -1;

  function parseBgUrl(el) {
    const s = el.style.backgroundImage;
    if (!s) return null;
    const m = s.match(/url\(["']?([^"')]+)["']?\)/);
    return m ? m[1] : null;
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || index < 0 || index >= lightboxImages.length) return;
    lightboxIndex = index;
    lightboxImg.src = lightboxImages[index];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderThumbnails();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImages = [];
    lightboxIndex = -1;
    if (lightboxNav) lightboxNav.innerHTML = '';
  }

  function goToPrev() {
    if (lightboxImages.length < 2) return;
    let i = lightboxIndex - 1;
    if (i < 0) i = lightboxImages.length - 1;
    openLightbox(i);
  }

  function goToNext() {
    if (lightboxImages.length < 2) return;
    let i = lightboxIndex + 1;
    if (i >= lightboxImages.length) i = 0;
    openLightbox(i);
  }

  function renderThumbnails() {
    if (!lightboxNav) return;
    lightboxNav.innerHTML = '';
    lightboxImages.forEach((src, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'lightbox-thumb' + (i === lightboxIndex ? ' active' : '');
      thumb.innerHTML = '<img src="' + src + '" alt="" loading="lazy">';
      thumb.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(i); });
      lightboxNav.appendChild(thumb);
    });
    lightboxNav.scrollLeft = 0;
  }

  document.addEventListener('click', (e) => {
    const media = e.target.closest('.project-media.has-image');
    if (!media) return;
    const src = parseBgUrl(media);
    if (!src) return;
    const grid = media.closest('.project-media-grid');
    const siblings = grid ? Array.from(grid.querySelectorAll('.project-media.has-image')) : [media];
    lightboxImages = siblings.map(el => parseBgUrl(el)).filter(Boolean);
    const idx = lightboxImages.indexOf(src);
    openLightbox(idx);
  });

  document.querySelectorAll('.lightbox-close').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.querySelectorAll('.lightbox-arrow-prev').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); goToPrev(); });
  });

  document.querySelectorAll('.lightbox-arrow-next').forEach(el => {
    el.addEventListener('click', (e) => { e.stopPropagation(); goToNext(); });
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
})();

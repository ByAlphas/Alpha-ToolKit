/* ═══════════════════════════════════════════════════════════
   ALPHA TOOLKIT — assets/js/core/nav.js
   Navigation · Mega Menu · Mobile Menu · Scroll Reveal
   ═══════════════════════════════════════════════════════════ */

/* ── Navigation — Sticky + Mobile Toggle ─────────────────── */
(function initNavigation() {
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  if (!navbar) return;

  // Sticky scroll state — RAF throttled (max 1 call/frame → ~60fps)
  let rafPending = false;
  window.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
      rafPending = false;
    });
  }, { passive: true });

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isOpen = !navLinksEl.hidden;
      navLinksEl.hidden = isOpen;
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.hidden = true;
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section highlighting using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      });
    }, { rootMargin: '-30% 0px -65% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }
})();

/* ── Mega Nav Dropdown ────────────────────────────────────── */
(function initMegaNav() {
  const dropBtn = document.getElementById('navDropBtn');
  const mega    = document.getElementById('navMega');
  if (!dropBtn || !mega) return;

  function openMega() {
    mega.hidden = false;
    dropBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMega() {
    mega.hidden = true;
    dropBtn.setAttribute('aria-expanded', 'false');
  }

  dropBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mega.hidden ? openMega() : closeMega();
  });

  document.addEventListener('click', (e) => {
    if (!mega.hidden && !mega.contains(e.target) && e.target !== dropBtn) closeMega();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mega.hidden) { closeMega(); dropBtn.focus(); }
  });
})();

/* ── Scroll Reveal Animations ─────────────────────────────── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if (!window.IntersectionObserver) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ── Range Slider — Dynamic fill ──────────────────────────── */
(function initSliders() {
  document.querySelectorAll('input[type="range"]').forEach(slider => {
    function update() {
      const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty('--val', pct + '%');
    }
    slider.addEventListener('input', update);
    update();
  });
})();

/* ── Smooth Anchor Navigation ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    // Close mega menu if open
    const mega = document.getElementById('navMega');
    const dropBtn = document.getElementById('navDropBtn');
    if (mega && !mega.hidden) {
      mega.hidden = true;
      if (dropBtn) dropBtn.setAttribute('aria-expanded', 'false');
    }

    // Close mobile nav
    const navLinks = document.getElementById('navLinks');
    if (navLinks && !navLinks.hidden) {
      navLinks.hidden = true;
      const toggle = document.getElementById('navToggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Service Worker Registration ──────────────────────────── */
(function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const swPath = location.pathname.includes('/tools/') ? '../sw.js' : 'sw.js';
  navigator.serviceWorker.register(swPath).catch(function() {});
})();

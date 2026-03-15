/* ═══════════════════════════════════════════════════════════
   ALPHA TOOLKIT — assets/js/pages/home.js
   Homepage search + filter orchestration
   Depends on: tools-data.js (TOOLS_DATA global)
   ═══════════════════════════════════════════════════════════ */

(function initHubSearch() {
  'use strict';

  /* ── Element refs ──────────────────────────────────────── */
  const searchInput  = document.getElementById('hubSearch');
  const filterBtns   = document.querySelectorAll('.hub-filter-btn');
  const hubGrid      = document.getElementById('hubGrid');
  const noResults    = document.getElementById('hubNoResults');

  if (!hubGrid) return; // not on the homepage

  /* ── State ─────────────────────────────────────────────── */
  let activeFilter = 'all';
  let searchQuery  = '';

  /* ── Helpers ────────────────────────────────────────────── */
  function getCards() {
    return hubGrid.querySelectorAll('.hub-card[data-cat]');
  }

  function matchesFilter(card) {
    if (activeFilter === 'all') return true;
    return card.dataset.cat === activeFilter;
  }

  function matchesSearch(card) {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = (card.querySelector('.hub-card-title')?.textContent || '').toLowerCase();
    const desc  = (card.querySelector('.hub-card-desc')?.textContent  || '').toLowerCase();
    const tags  = (card.dataset.tags || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || tags.includes(q);
  }

  function applyFilters() {
    const cards = getCards();
    let visible = 0;

    cards.forEach(card => {
      const show = matchesFilter(card) && matchesSearch(card);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (noResults) {
      noResults.style.display = visible === 0 ? 'block' : 'none';
    }
  }

  /* ── Filter buttons ─────────────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter || 'all';
      applyFilters();
    });
  });

  /* ── Search input ───────────────────────────────────────── */
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = searchInput.value.trim();
        applyFilters();
      }, 150);
    });

    // Clear on Escape
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        applyFilters();
        searchInput.blur();
      }
    });
  }

  /* ── Initial run ────────────────────────────────────────── */
  applyFilters();
})();


/* ════════════════════════════════════════════════════════════
   Tool count badge — syncs stat number with actual tool count
   ════════════════════════════════════════════════════════════ */
(function syncToolCount() {
  'use strict';
  if (typeof TOOLS_DATA === 'undefined') return;

  const statEl = document.getElementById('toolCountStat');
  if (statEl) {
    statEl.textContent = TOOLS_DATA.length;
  }
})();


/* ════════════════════════════════════════════════════════════
   Hub card hover — subtle parallax tilt on mouse move
   ════════════════════════════════════════════════════════════ */
(function initCardTilt() {
  'use strict';

  const cards = document.querySelectorAll('.hub-card');
  const MAX_TILT = 6; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ════════════════════════════════════════════════════════════
   Keyboard shortcut — press "/" to focus search
   ════════════════════════════════════════════════════════════ */
(function initSearchShortcut() {
  'use strict';

  const searchInput = document.getElementById('hubSearch');
  if (!searchInput) return;

  document.addEventListener('keydown', e => {
    // Ignore if user is typing in another input / textarea
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

    if (e.key === '/') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
})();

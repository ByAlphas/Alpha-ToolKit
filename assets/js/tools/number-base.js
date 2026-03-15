(function initNumberBase() {
  'use strict';

  const binEl  = document.getElementById('numBin');
  const octEl  = document.getElementById('numOct');
  const decEl  = document.getElementById('numDec');
  const hexEl  = document.getElementById('numHex');
  const custInputEl = document.getElementById('custInput');
  const custFromEl  = document.getElementById('custFrom');
  const custToEl    = document.getElementById('custTo');
  const custResultEl = document.getElementById('custResult');

  if (!binEl) return;

  let updating = false;

  function updateAll(decimal) {
    if (updating) return;
    updating = true;
    if (decimal === null || isNaN(decimal)) {
      [binEl, octEl, decEl, hexEl].forEach(el => { el.value = ''; el.style.borderColor = ''; });
      updating = false;
      return;
    }
    const n = Math.floor(decimal);
    binEl.value = n.toString(2);
    octEl.value = n.toString(8);
    decEl.value = n.toString(10);
    hexEl.value = n.toString(16).toUpperCase();
    updating = false;
  }

  function handleInput(el, base) {
    const val = el.value.trim();
    if (!val) { updateAll(null); return; }
    const n = parseInt(val, base);
    if (isNaN(n)) { el.style.borderColor = '#f87171'; return; }
    el.style.borderColor = '';
    updateAll(n);
  }

  binEl.addEventListener('input', () => handleInput(binEl, 2));
  octEl.addEventListener('input', () => handleInput(octEl, 8));
  decEl.addEventListener('input', () => handleInput(decEl, 10));
  hexEl.addEventListener('input', () => handleInput(hexEl, 16));

  // Custom base
  function updateCustom() {
    const val   = custInputEl.value.trim();
    const from  = parseInt(custFromEl.value);
    const to    = parseInt(custToEl.value);
    if (!val || isNaN(from) || isNaN(to)) { custResultEl.textContent = '—'; return; }
    const n = parseInt(val, from);
    if (isNaN(n)) { custResultEl.textContent = 'Invalid'; return; }
    custResultEl.textContent = n.toString(to).toUpperCase();
  }

  [custInputEl, custFromEl, custToEl].forEach(el => el.addEventListener('input', updateCustom));

  // Copy buttons
  document.querySelectorAll('[data-copy-base]').forEach(btn => {
    btn.addEventListener('click', () => {
      const base = btn.dataset.copyBase;
      const map = { '2': binEl, '8': octEl, '10': decEl, '16': hexEl };
      const el = map[base];
      if (el && el.value) copyToClipboard(el.value, 'Base ' + base);
    });
  });

  // Default
  decEl.value = '255';
  handleInput(decEl, 10);
})();

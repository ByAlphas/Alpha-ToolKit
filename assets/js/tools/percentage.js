(function initPercentage() {
  'use strict';

  function getEl(id) { return document.getElementById(id); }

  // Mode 1
  const m1x = getEl('m1x'), m1y = getEl('m1y'), m1res = getEl('m1res');
  // Mode 2
  const m2x = getEl('m2x'), m2y = getEl('m2y'), m2res = getEl('m2res');
  // Mode 3
  const m3x = getEl('m3x'), m3y = getEl('m3y'), m3res = getEl('m3res');

  if (!m1x) return;

  function fmt(n) {
    if (isNaN(n) || !isFinite(n)) return '—';
    return +n.toFixed(8) + '';
  }

  function calcMode1() {
    const x = parseFloat(m1x.value), y = parseFloat(m1y.value);
    m1res.textContent = (isNaN(x) || isNaN(y)) ? '—' : fmt((x / 100) * y);
  }

  function calcMode2() {
    const x = parseFloat(m2x.value), y = parseFloat(m2y.value);
    if (isNaN(x) || isNaN(y) || y === 0) { m2res.textContent = '—'; return; }
    m2res.textContent = fmt((x / y) * 100) + '%';
  }

  function calcMode3() {
    const x = parseFloat(m3x.value), y = parseFloat(m3y.value);
    if (isNaN(x) || isNaN(y) || x === 0) { m3res.textContent = '—'; return; }
    const change = ((y - x) / Math.abs(x)) * 100;
    const sign = change > 0 ? '+' : '';
    m3res.textContent = sign + fmt(change) + '%';
    m3res.style.color = change >= 0 ? '#4ade80' : '#f87171';
  }

  [m1x, m1y].forEach(el => el.addEventListener('input', calcMode1));
  [m2x, m2y].forEach(el => el.addEventListener('input', calcMode2));
  [m3x, m3y].forEach(el => el.addEventListener('input', calcMode3));
})();

(function initAspectRatio() {
  'use strict';

  const arW = document.getElementById('arW');
  const arH = document.getElementById('arH');
  const arRatioOut = document.getElementById('arRatioOut');
  const arDecimalOut = document.getElementById('arDecimalOut');
  const arKnownSide = document.getElementById('arKnownSide');
  const arKnownVal = document.getElementById('arKnownVal');
  const arOtherVal = document.getElementById('arOtherVal');
  const arOrigW = document.getElementById('arOrigW');
  const arOrigH = document.getElementById('arOrigH');

  if (!arW) return;

  function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) { const t = b; b = a % b; a = t; }
    return a || 1;
  }

  function updateRatio() {
    const w = parseFloat(arW.value), h = parseFloat(arH.value);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      arRatioOut.textContent = '—';
      arDecimalOut.textContent = '—';
      return;
    }
    const d = gcd(w, h);
    arRatioOut.textContent = `${w / d} : ${h / d}`;
    arDecimalOut.textContent = (w / h).toFixed(6);
  }

  function updateResize() {
    const origW = parseFloat(arOrigW.value);
    const origH = parseFloat(arOrigH.value);
    const side  = arKnownSide.value;
    const val   = parseFloat(arKnownVal.value);
    if (isNaN(origW) || isNaN(origH) || isNaN(val) || origW <= 0 || origH <= 0 || val <= 0) {
      arOtherVal.value = '';
      return;
    }
    if (side === 'W') {
      arOtherVal.value = +(val * (origH / origW)).toFixed(4);
    } else {
      arOtherVal.value = +(val * (origW / origH)).toFixed(4);
    }
  }

  [arW, arH].forEach(el => el.addEventListener('input', updateRatio));
  [arOrigW, arOrigH, arKnownSide, arKnownVal].forEach(el => el.addEventListener('input', updateResize));

  // Common ratios click
  document.querySelectorAll('[data-ratio]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [w, h] = btn.dataset.ratio.split(':').map(Number);
      arW.value = w; arH.value = h;
      updateRatio();
    });
  });
})();

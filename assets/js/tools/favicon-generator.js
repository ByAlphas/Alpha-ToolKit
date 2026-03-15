(function initFaviconGenerator() {
  'use strict';

  const textEl    = document.getElementById('fgText');
  const bgColor   = document.getElementById('fgBg');
  const fgColor   = document.getElementById('fgFg');
  const fontSizeEl = document.getElementById('fgFontSize');
  const fontSizeVal = document.getElementById('fgFontSizeVal');
  const snippetEl = document.getElementById('fgSnippet');
  const SIZES = [16, 32, 48];

  if (!textEl) return;

  function draw() {
    const text = textEl.value || '?';
    const bg   = bgColor.value;
    const fg   = fgColor.value;
    const baseFontPct = parseInt(fontSizeEl.value) / 100;
    fontSizeVal.textContent = fontSizeEl.value + '%';

    SIZES.forEach(size => {
      const canvas = document.getElementById(`fgCanvas${size}`);
      if (!canvas) return;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = fg;
      const fontSize = Math.round(size * baseFontPct);
      ctx.font = `bold ${fontSize}px "Space Grotesk", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.slice(0, 2), size / 2, size / 2 + 1);
    });

    updateSnippet();
  }

  function updateSnippet() {
    const canvas32 = document.getElementById('fgCanvas32');
    if (!canvas32) return;
    const dataUrl = canvas32.toDataURL('image/png');
    snippetEl.value = `<link rel="icon" type="image/png" href="${dataUrl.substring(0,40)}..." />\n<link rel="apple-touch-icon" href="favicon-192.png" />`;
  }

  SIZES.forEach(size => {
    const btn = document.getElementById(`fgDownload${size}`);
    if (btn) {
      btn.addEventListener('click', () => {
        const canvas = document.getElementById(`fgCanvas${size}`);
        canvas.toBlob(blob => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `favicon-${size}.png`;
          a.click();
          URL.revokeObjectURL(a.href);
        });
      });
    }
  });

  [textEl, bgColor, fgColor, fontSizeEl].forEach(el => el.addEventListener('input', draw));
  draw();
})();

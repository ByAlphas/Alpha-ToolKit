(function initBase64ToImage() {
  'use strict';

  const inputEl   = document.getElementById('b2iInput');
  const previewEl = document.getElementById('b2iPreview');
  const infoEl    = document.getElementById('b2iInfo');
  const previewBtn = document.getElementById('b2iPreviewBtn');
  const downloadBtn = document.getElementById('b2iDownloadBtn');

  if (!inputEl) return;

  function decode() {
    let raw = inputEl.value.trim();
    if (!raw) return;
    // If raw base64 without header, prepend
    if (!raw.startsWith('data:')) {
      raw = 'data:image/png;base64,' + raw.replace(/\s+/g, '');
    }
    previewEl.onload = () => {
      infoEl.textContent = `Dimensions: ${previewEl.naturalWidth}×${previewEl.naturalHeight}px · Detected type: ${raw.split(';')[0].replace('data:','')}`;
      previewEl.style.display = 'block';
      downloadBtn.style.display = 'inline-flex';
    };
    previewEl.onerror = () => {
      showToast('Invalid Base64 image data', 'error');
      previewEl.style.display = 'none';
    };
    previewEl.src = raw;
  }

  previewBtn.addEventListener('click', decode);
  inputEl.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') decode(); });

  downloadBtn.addEventListener('click', () => {
    const src = previewEl.src;
    if (!src || src === window.location.href) return;
    const ext = (src.match(/data:image\/([^;]+)/) || ['','png'])[1];
    const a = document.createElement('a');
    a.href = src;
    a.download = `image.${ext}`;
    a.click();
  });
})();

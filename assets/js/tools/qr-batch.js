(function initQrBatch() {
  'use strict';

  const valuesEl   = document.getElementById('qrbValues');
  const sizeEl     = document.getElementById('qrbSize');
  const generateBtn = document.getElementById('qrbGenerate');
  const gridEl     = document.getElementById('qrbGrid');
  const countEl    = document.getElementById('qrbCount');

  if (!valuesEl) return;

  function waitForQRious(cb, tries = 0) {
    if (typeof QRious !== 'undefined') { cb(); return; }
    if (tries > 20) { showToast('QRious library failed to load', 'error'); return; }
    setTimeout(() => waitForQRious(cb, tries + 1), 200);
  }

  function generate() {
    waitForQRious(() => {
      const lines = valuesEl.value.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 50);
      const size = parseInt(sizeEl.value) || 150;
      if (!lines.length) { showToast('Enter at least one value', 'warn'); return; }
      gridEl.innerHTML = '';
      countEl.textContent = `Generating ${lines.length} QR code${lines.length !== 1 ? 's' : ''}...`;

      lines.forEach((line, i) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:.5rem;background:rgba(255,255,255,.04);border-radius:.75rem;padding:.75rem;';

        const label = document.createElement('div');
        label.style.cssText = 'font-size:.75rem;color:rgba(255,255,255,.55);text-align:center;word-break:break-all;max-width:' + (size+20) + 'px;';
        label.textContent = line.length > 40 ? line.slice(0, 37) + '...' : line;

        const canvas = document.createElement('canvas');
        // QRious renders white bg by default; wrap in white box for visibility
        canvas.style.cssText = 'border-radius:.5rem;display:block;background:#fff;';

        try {
          new QRious({ element: canvas, value: line, size: size, backgroundAlpha: 1, background: '#ffffff', foreground: '#000000' });
        } catch {
          showToast(`Failed to generate QR for: ${line}`, 'error');
          return;
        }

        const dlBtn = document.createElement('button');
        dlBtn.className = 'btn btn-secondary';
        dlBtn.style.cssText = 'font-size:.75rem;padding:.25rem .65rem;';
        dlBtn.textContent = 'Download';
        dlBtn.addEventListener('click', () => {
          canvas.toBlob(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `qr-${i+1}.png`;
            a.click();
            URL.revokeObjectURL(a.href);
          });
        });

        wrapper.appendChild(label);
        wrapper.appendChild(canvas);
        wrapper.appendChild(dlBtn);
        gridEl.appendChild(wrapper);
      });

      countEl.textContent = `${lines.length} QR code${lines.length !== 1 ? 's' : ''} generated`;
    });
  }

  generateBtn.addEventListener('click', generate);
})();

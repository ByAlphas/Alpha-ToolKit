(function initHtmlMinifier() {
  const inputEl = document.getElementById('hmin-input');
  const outputEl = document.getElementById('hmin-output');
  const minifyBtn = document.getElementById('hmin-btn');
  const copyBtn = document.getElementById('hmin-copy');
  const rmCommentsEl = document.getElementById('hmin-comments');
  const collapseEl = document.getElementById('hmin-collapse');
  const savingsEl = document.getElementById('hmin-savings');
  if (!inputEl) return;

  function minify() {
    let html = inputEl.value;
    if (!html.trim()) { showToast('Please enter HTML.', 'error'); return; }
    const origBytes = new TextEncoder().encode(html).length;

    if (rmCommentsEl && rmCommentsEl.checked) {
      html = html.replace(/<!--[\s\S]*?-->/g, '');
    }
    if (collapseEl && collapseEl.checked) {
      html = html.replace(/[ \t]+/g, ' ');
      html = html.replace(/\n\s*\n/g, '\n');
      html = html.replace(/>\s+</g, '><');
      html = html.trim();
    }

    outputEl.value = html;
    const minBytes = new TextEncoder().encode(html).length;
    const saved = origBytes - minBytes;
    const pct = origBytes > 0 ? ((saved / origBytes) * 100).toFixed(1) : 0;
    savingsEl.textContent = `${formatBytes(origBytes)} → ${formatBytes(minBytes)} · saved ${formatBytes(saved)} (${pct}%)`;
    savingsEl.style.display = 'block';
    showToast('HTML minified!', 'success');
  }

  minifyBtn.addEventListener('click', minify);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'Minified HTML');
    else showToast('Nothing to copy.', 'error');
  });
})();

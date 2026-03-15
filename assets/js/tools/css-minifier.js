(function initCssMinifier() {
  const inputEl = document.getElementById('cssmin-input');
  const outputEl = document.getElementById('cssmin-output');
  const minifyBtn = document.getElementById('cssmin-btn');
  const copyBtn = document.getElementById('cssmin-copy');
  const savingsEl = document.getElementById('cssmin-savings');
  if (!inputEl) return;

  function minify() {
    let css = inputEl.value;
    if (!css.trim()) { showToast('Please enter CSS.', 'error'); return; }
    const origBytes = new TextEncoder().encode(css).length;

    // Remove block comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    // Collapse whitespace
    css = css.replace(/\s+/g, ' ');
    // Remove spaces around punctuation
    css = css.replace(/\s*{\s*/g, '{');
    css = css.replace(/\s*}\s*/g, '}');
    css = css.replace(/\s*:\s*/g, ':');
    css = css.replace(/\s*;\s*/g, ';');
    css = css.replace(/\s*,\s*/g, ',');
    // Remove trailing semicolons before }
    css = css.replace(/;}/g, '}');
    // Remove leading/trailing whitespace
    css = css.trim();

    outputEl.value = css;
    const minBytes = new TextEncoder().encode(css).length;
    const saved = origBytes - minBytes;
    const pct = origBytes > 0 ? ((saved / origBytes) * 100).toFixed(1) : 0;
    savingsEl.textContent = `${formatBytes(origBytes)} → ${formatBytes(minBytes)} · saved ${formatBytes(saved)} (${pct}%)`;
    savingsEl.style.display = 'block';
    showToast('CSS minified!', 'success');
  }

  minifyBtn.addEventListener('click', minify);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'Minified CSS');
    else showToast('Nothing to copy.', 'error');
  });
})();

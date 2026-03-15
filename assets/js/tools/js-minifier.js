(function initJsMinifier() {
  const inputEl = document.getElementById('jsmin-input');
  const outputEl = document.getElementById('jsmin-output');
  const minifyBtn = document.getElementById('jsmin-btn');
  const copyBtn = document.getElementById('jsmin-copy');
  const savingsEl = document.getElementById('jsmin-savings');
  if (!inputEl) return;

  function minifyJs(code) {
    // Preserve strings and regex literals, then strip comments
    const strings = [];
    let s = code;

    // Replace string literals with placeholders
    s = s.replace(/(["'`])((?:\\[\s\S]|(?!\1)[^\\])*)\1/g, (m) => {
      strings.push(m);
      return `\x00STR${strings.length - 1}\x00`;
    });

    // Remove single-line comments
    s = s.replace(/\/\/[^\n]*/g, '');
    // Remove block comments (but not /* preserved */ style — just remove all)
    s = s.replace(/\/\*[\s\S]*?\*\//g, '');
    // Collapse whitespace and newlines
    s = s.replace(/[ \t]+/g, ' ');
    s = s.replace(/\n[ \t]*/g, '\n');
    s = s.replace(/\n+/g, '\n');
    // Remove spaces around operators
    s = s.replace(/ *([\=\+\-\*\/\%\!\&\|\?\:\,\;\{\}\(\)\[\]\<\>]) */g, '$1');
    s = s.trim();

    // Restore string literals
    s = s.replace(/\x00STR(\d+)\x00/g, (_, i) => strings[parseInt(i)]);

    return s;
  }

  function minify() {
    const code = inputEl.value;
    if (!code.trim()) { showToast('Please enter JavaScript.', 'error'); return; }
    const origBytes = new TextEncoder().encode(code).length;
    try {
      const minified = minifyJs(code);
      outputEl.value = minified;
      const minBytes = new TextEncoder().encode(minified).length;
      const saved = origBytes - minBytes;
      const pct = origBytes > 0 ? ((saved / origBytes) * 100).toFixed(1) : 0;
      savingsEl.textContent = `${formatBytes(origBytes)} → ${formatBytes(minBytes)} · saved ${formatBytes(saved)} (${pct}%)`;
      savingsEl.style.display = 'block';
      showToast('JS minified (basic)!', 'success');
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  minifyBtn.addEventListener('click', minify);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'Minified JS');
    else showToast('Nothing to copy.', 'error');
  });
})();

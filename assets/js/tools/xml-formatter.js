(function initXmlFormatter() {
  const inputEl = document.getElementById('xml-input');
  const outputEl = document.getElementById('xml-output');
  const formatBtn = document.getElementById('xml-format-btn');
  const minifyBtn = document.getElementById('xml-minify-btn');
  const copyBtn = document.getElementById('xml-copy');
  if (!inputEl) return;

  function indentXml(xml, indent) {
    const pad = ' '.repeat(indent);
    let result = '';
    let level = 0;
    const tokens = xml.replace(/>\s*</g, '><').match(/<\/?[^>]+>|[^<]+/g) || [];
    for (const token of tokens) {
      if (token.startsWith('</')) {
        level--;
        result += pad.repeat(level) + token + '\n';
      } else if (token.startsWith('<') && !token.startsWith('<?') && !token.startsWith('<!') && !token.endsWith('/>')) {
        result += pad.repeat(level) + token + '\n';
        level++;
      } else if (token.startsWith('<')) {
        result += pad.repeat(level) + token + '\n';
      } else {
        const t = token.trim();
        if (t) result += pad.repeat(level) + t + '\n';
      }
    }
    return result.trim();
  }

  function format() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter XML.', 'error'); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'application/xml');
      const err = doc.querySelector('parsererror');
      if (err) { showToast('XML parse error: ' + err.textContent.split('\n')[0], 'error'); return; }
      const serializer = new XMLSerializer();
      const str = serializer.serializeToString(doc);
      outputEl.value = indentXml(str, 2);
      showToast('XML formatted!', 'success');
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  function minify() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter XML.', 'error'); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'application/xml');
      const err = doc.querySelector('parsererror');
      if (err) { showToast('XML parse error: ' + err.textContent.split('\n')[0], 'error'); return; }
      const serializer = new XMLSerializer();
      outputEl.value = serializer.serializeToString(doc).replace(/>\s+</g, '><').trim();
      showToast('XML minified!', 'success');
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  formatBtn.addEventListener('click', format);
  minifyBtn.addEventListener('click', minify);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'XML');
    else showToast('Nothing to copy.', 'error');
  });
})();

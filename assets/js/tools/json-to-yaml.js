(function initJsonToYaml() {
  const inputEl = document.getElementById('j2y-input');
  const outputEl = document.getElementById('j2y-output');
  const convertBtn = document.getElementById('j2y-btn');
  const copyBtn = document.getElementById('j2y-copy');
  if (!inputEl) return;

  function needsQuotes(str) {
    if (str === '') return true;
    if (/^[\s]/.test(str) || /[\s]$/.test(str)) return true;
    if (/^(true|false|null|yes|no|on|off)$/i.test(str)) return true;
    if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(str)) return true;
    if (/[:{}[\]|>&*!,#?@`"'\\]/.test(str)) return true;
    if (/^---/.test(str) || /^\.\.\.$/.test(str)) return true;
    return false;
  }

  function toYaml(value, indent) {
    const pad = ' '.repeat(indent);
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') {
      if (needsQuotes(value)) {
        return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
      }
      return value;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      return value.map(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const keys = Object.keys(item);
          if (keys.length === 0) return pad + '- {}';
          const firstKey = keys[0];
          const firstVal = toYaml(item[firstKey], indent + 4);
          let lines = pad + '- ' + firstKey + ': ' + firstVal + '\n';
          for (let i = 1; i < keys.length; i++) {
            lines += pad + '  ' + keys[i] + ': ' + toYaml(item[keys[i]], indent + 4) + '\n';
          }
          return lines.replace(/\n$/, '');
        }
        const v = toYaml(item, indent + 2);
        if (v.includes('\n')) {
          return pad + '-\n' + v.split('\n').map(l => pad + '  ' + l).join('\n');
        }
        return pad + '- ' + v;
      }).join('\n');
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      return keys.map(key => {
        const v = value[key];
        if (typeof v === 'object' && v !== null) {
          if (Array.isArray(v) && v.length === 0) return pad + key + ': []';
          if (!Array.isArray(v) && Object.keys(v).length === 0) return pad + key + ': {}';
          return pad + key + ':\n' + toYaml(v, indent + 2);
        }
        return pad + key + ': ' + toYaml(v, indent + 2);
      }).join('\n');
    }
    return String(value);
  }

  function convert() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter JSON.', 'error'); return; }
    try {
      const parsed = JSON.parse(raw);
      outputEl.value = toYaml(parsed, 0);
      showToast('Converted to YAML!', 'success');
    } catch (e) {
      showToast('Invalid JSON: ' + e.message, 'error');
    }
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'YAML');
    else showToast('Nothing to copy.', 'error');
  });
})();

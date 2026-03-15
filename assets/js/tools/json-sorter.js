(function initJsonSorter() {
  const inputEl = document.getElementById('jsort-input');
  const outputEl = document.getElementById('jsort-output');
  const sortBtn = document.getElementById('jsort-btn');
  const copyBtn = document.getElementById('jsort-copy');
  if (!inputEl) return;

  function getSortDir() {
    const checked = document.querySelector('input[name="jsort-dir"]:checked');
    return checked ? checked.value : 'asc';
  }

  function sortKeys(val, desc) {
    if (Array.isArray(val)) return val.map(v => sortKeys(v, desc));
    if (val !== null && typeof val === 'object') {
      const sorted = Object.keys(val).sort((a, b) => desc ? b.localeCompare(a) : a.localeCompare(b));
      const out = {};
      sorted.forEach(k => { out[k] = sortKeys(val[k], desc); });
      return out;
    }
    return val;
  }

  function sort() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter JSON.', 'error'); return; }
    try {
      const parsed = JSON.parse(raw);
      const desc = getSortDir() === 'desc';
      const sorted = sortKeys(parsed, desc);
      outputEl.value = JSON.stringify(sorted, null, 2);
      showToast('Keys sorted!', 'success');
    } catch (e) {
      showToast('Invalid JSON: ' + e.message, 'error');
    }
  }

  sortBtn.addEventListener('click', sort);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'Sorted JSON');
    else showToast('Nothing to copy.', 'error');
  });
})();

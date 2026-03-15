(function initCsvToJson() {
  const inputEl = document.getElementById('csv2j-input');
  const outputEl = document.getElementById('csv2j-output');
  const convertBtn = document.getElementById('csv2j-btn');
  const copyBtn = document.getElementById('csv2j-copy');
  const indentSel = document.getElementById('csv2j-indent');
  if (!inputEl) return;

  function parseCsv(text) {
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (c === '"' && next === '"') { field += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { field += c; }
      } else {
        if (c === '"') { inQuotes = true; }
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\r' && next === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; }
        else if (c === '\n' || c === '\r') { row.push(field); rows.push(row); row = []; field = ''; }
        else { field += c; }
      }
    }
    row.push(field);
    if (row.some(f => f !== '')) rows.push(row);
    return rows;
  }

  function convert() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter CSV.', 'error'); return; }
    try {
      const rows = parseCsv(raw);
      if (rows.length < 2) { showToast('CSV needs at least a header and one data row.', 'error'); return; }
      const headers = rows[0];
      const result = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? row[i] : ''; });
        return obj;
      });
      const indent = parseInt(indentSel ? indentSel.value : '2', 10);
      outputEl.value = JSON.stringify(result, null, indent);
      showToast('Converted to JSON!', 'success');
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'JSON');
    else showToast('Nothing to copy.', 'error');
  });
})();

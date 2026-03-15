(function initUrlParser() {
  'use strict';

  const urlInput  = document.getElementById('urlInput');
  const parseBtn  = document.getElementById('parseBtn');
  const resultEl  = document.getElementById('urlResult');
  const paramsEl  = document.getElementById('urlParams');

  if (!urlInput) return;

  const FIELDS = [
    { key: 'protocol', label: 'Protocol' },
    { key: 'hostname', label: 'Host' },
    { key: 'port',     label: 'Port' },
    { key: 'pathname', label: 'Pathname' },
    { key: 'search',   label: 'Search' },
    { key: 'hash',     label: 'Hash' },
    { key: 'origin',   label: 'Origin' }
  ];

  function parse() {
    const raw = urlInput.value.trim();
    if (!raw) return;
    let url;
    try {
      url = new URL(raw);
    } catch {
      showToast('Invalid URL', 'error');
      resultEl.innerHTML = '';
      paramsEl.innerHTML = '';
      return;
    }

    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:.75rem;margin-bottom:1.5rem;">';
    FIELDS.forEach(f => {
      const val = url[f.key] || '—';
      html += `<div style="background:rgba(0,0,0,.25);border-radius:.5rem;padding:.75rem 1rem;">
        <div style="font-size:.75rem;font-weight:600;color:rgba(255,255,255,.45);margin-bottom:.25rem;">${f.label}</div>
        <div class="font-mono" style="font-size:.875rem;word-break:break-all;">${escapeHTML(val)}</div>
        <button class="btn btn-secondary" style="margin-top:.5rem;padding:.15rem .45rem;font-size:.7rem;" onclick="copyToClipboard(${JSON.stringify(val)},'${f.label}')">Copy</button>
      </div>`;
    });
    html += '</div>';
    resultEl.innerHTML = html;

    // Query params table
    const params = [...url.searchParams.entries()];
    if (params.length === 0) {
      paramsEl.innerHTML = '<p style="color:rgba(255,255,255,.4);font-size:.875rem;">No query parameters.</p>';
      return;
    }
    let thtml = '<h3 style="margin-bottom:.75rem;font-size:.9rem;font-weight:600;">Query Parameters</h3>';
    thtml += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.875rem;">';
    thtml += '<thead><tr><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid rgba(255,255,255,.1);">Key</th><th style="text-align:left;padding:.4rem .6rem;border-bottom:1px solid rgba(255,255,255,.1);">Value</th><th></th></tr></thead><tbody>';
    params.forEach(([k, v]) => {
      thtml += `<tr>
        <td class="font-mono" style="padding:.35rem .6rem;color:var(--accent-cyan,#00d4ff);">${escapeHTML(k)}</td>
        <td class="font-mono" style="padding:.35rem .6rem;word-break:break-all;">${escapeHTML(v)}</td>
        <td style="padding:.35rem .6rem;"><button class="btn btn-secondary" style="padding:.15rem .45rem;font-size:.7rem;" onclick="copyToClipboard(${JSON.stringify(v)},'${escapeHTML(k)}')">Copy</button></td>
      </tr>`;
    });
    thtml += '</tbody></table></div>';
    paramsEl.innerHTML = thtml;
  }

  parseBtn.addEventListener('click', parse);
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') parse(); });
})();

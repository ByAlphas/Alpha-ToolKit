(function initUserAgent() {
  'use strict';

  const uaInput  = document.getElementById('uaInput');
  const parseBtn = document.getElementById('uaParseBtn');
  const resultEl = document.getElementById('uaResult');

  if (!uaInput) return;

  // Pre-fill with current UA
  uaInput.value = navigator.userAgent;

  const BROWSERS = [
    { name: 'Edge',    rx: /Edg\/([^\s]+)/ },
    { name: 'Chrome',  rx: /Chrome\/([^\s]+)/ },
    { name: 'Firefox', rx: /Firefox\/([^\s]+)/ },
    { name: 'Safari',  rx: /Version\/([^\s]+).*Safari/ },
    { name: 'Opera',   rx: /OPR\/([^\s]+)/ },
    { name: 'IE',      rx: /(?:MSIE |rv:)([^\s;)]+)/ }
  ];

  const OS_PATTERNS = [
    { name: 'Windows 11', rx: /Windows NT 10\.0.*Win64/ },
    { name: 'Windows 10', rx: /Windows NT 10\.0/ },
    { name: 'Windows 8',  rx: /Windows NT 6\.[23]/ },
    { name: 'Windows 7',  rx: /Windows NT 6\.1/ },
    { name: 'macOS',      rx: /Mac OS X ([^\s;)]+)/ },
    { name: 'iOS',        rx: /iPhone OS ([^\s;)]+)/ },
    { name: 'Android',    rx: /Android ([^\s;)]+)/ },
    { name: 'Linux',      rx: /Linux/ }
  ];

  const ENGINE_PATTERNS = [
    { name: 'Blink',   rx: /Chrome/ },
    { name: 'Gecko',   rx: /Gecko\/[0-9]/ },
    { name: 'WebKit',  rx: /WebKit\/[0-9]/ }
  ];

  function detect(ua) {
    let browser = 'Unknown', bVersion = '';
    for (const b of BROWSERS) {
      const m = ua.match(b.rx);
      if (m) { browser = b.name; bVersion = m[1] || ''; break; }
    }

    let os = 'Unknown', osVersion = '';
    for (const o of OS_PATTERNS) {
      const m = ua.match(o.rx);
      if (m) {
        os = o.name;
        osVersion = m[1] ? m[1].replace(/_/g, '.') : '';
        break;
      }
    }

    let engine = 'Unknown';
    for (const e of ENGINE_PATTERNS) {
      if (e.rx.test(ua)) { engine = e.name; break; }
    }

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const isTablet = /iPad|Tablet/i.test(ua);
    const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

    return { browser, bVersion, os, osVersion, engine, device };
  }

  function renderResult(data, ua) {
    const rows = [
      ['Browser', `${data.browser} ${data.bVersion}`],
      ['OS', `${data.os} ${data.osVersion}`],
      ['Device Type', data.device],
      ['Rendering Engine', data.engine]
    ];
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem;margin-top:1rem;">';
    rows.forEach(([label, val]) => {
      html += `<div style="background:rgba(0,0,0,.25);border-radius:.5rem;padding:.75rem 1rem;">
        <div style="font-size:.75rem;font-weight:600;color:rgba(255,255,255,.45);margin-bottom:.25rem;">${label}</div>
        <div class="font-mono" style="font-size:.9rem;color:var(--accent-cyan,#00d4ff);">${escapeHTML(val.trim() || '—')}</div>
      </div>`;
    });
    html += '</div>';
    html += `<div style="margin-top:1rem;background:rgba(0,0,0,.2);border-radius:.5rem;padding:.75rem 1rem;"><div style="font-size:.75rem;font-weight:600;color:rgba(255,255,255,.45);margin-bottom:.25rem;">Full UA String</div><div class="font-mono" style="font-size:.8rem;word-break:break-all;">${escapeHTML(ua)}</div></div>`;
    resultEl.innerHTML = html;
  }

  function parse() {
    const ua = uaInput.value.trim();
    if (!ua) return;
    renderResult(detect(ua), ua);
  }

  parseBtn.addEventListener('click', parse);
  parse();
})();

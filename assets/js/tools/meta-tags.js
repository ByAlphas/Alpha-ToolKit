(function initMetaTags() {
  'use strict';

  const titleEl    = document.getElementById('metaTitle');
  const descEl     = document.getElementById('metaDesc');
  const kwEl       = document.getElementById('metaKw');
  const authorEl   = document.getElementById('metaAuthor');
  const robotsEl   = document.getElementById('metaRobots');
  const canonEl    = document.getElementById('metaCanon');
  const outputEl   = document.getElementById('metaOutput');
  const titleCount = document.getElementById('titleCount');
  const descCount  = document.getElementById('descCount');

  if (!titleEl) return;

  function updateCount(el, countEl, limit) {
    const len = el.value.length;
    countEl.textContent = `${len}/${limit}`;
    countEl.style.color = len > limit ? '#f87171' : 'rgba(255,255,255,.45)';
  }

  function generate() {
    const title    = titleEl.value.trim();
    const desc     = descEl.value.trim();
    const kw       = kwEl.value.trim();
    const author   = authorEl.value.trim();
    const robots   = robotsEl.value;
    const canon    = canonEl.value.trim();

    let code = '';
    if (title)  code += `<title>${escapeHTML(title)}</title>\n<meta name="title" content="${escapeHTML(title)}" />\n`;
    if (desc)   code += `<meta name="description" content="${escapeHTML(desc)}" />\n`;
    if (kw)     code += `<meta name="keywords" content="${escapeHTML(kw)}" />\n`;
    if (author) code += `<meta name="author" content="${escapeHTML(author)}" />\n`;
    if (robots) code += `<meta name="robots" content="${robots}" />\n`;
    if (canon)  code += `<link rel="canonical" href="${escapeHTML(canon)}" />\n`;
    outputEl.value = code.trim();
  }

  titleEl.addEventListener('input', () => { updateCount(titleEl, titleCount, 60); generate(); });
  descEl.addEventListener('input',  () => { updateCount(descEl, descCount, 160); generate(); });
  [kwEl, authorEl, robotsEl, canonEl].forEach(el => el.addEventListener('input', generate));

  document.getElementById('copyMetaBtn').addEventListener('click', () => {
    copyToClipboard(outputEl.value, 'Meta tags');
  });

  generate();
})();

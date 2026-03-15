(function initSqlFormatter() {
  const inputEl = document.getElementById('sql-input');
  const outputEl = document.getElementById('sql-output');
  const formatBtn = document.getElementById('sql-btn');
  const copyBtn = document.getElementById('sql-copy');
  const upperEl = document.getElementById('sql-upper');
  if (!inputEl) return;

  const KEYWORDS = [
    'SELECT','DISTINCT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN',
    'OUTER JOIN','FULL JOIN','CROSS JOIN','ON','ORDER BY','GROUP BY','HAVING','LIMIT',
    'OFFSET','INSERT INTO','INSERT','VALUES','UPDATE','SET','DELETE FROM','DELETE',
    'CREATE TABLE','CREATE INDEX','DROP TABLE','DROP','ALTER TABLE','ALTER',
    'UNION','UNION ALL','EXCEPT','INTERSECT','WITH','AS','CASE','WHEN','THEN','ELSE','END',
    'AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','IS NULL','IS NOT NULL','NULL',
    'COUNT','SUM','AVG','MIN','MAX','COALESCE','NULLIF','CAST','CONVERT'
  ];

  const NEWLINE_BEFORE = [
    'SELECT','FROM','WHERE','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
    'FULL JOIN','CROSS JOIN','JOIN','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET',
    'INSERT INTO','INSERT','VALUES','UPDATE','SET','DELETE FROM','DELETE',
    'UNION ALL','UNION','EXCEPT','INTERSECT','WITH','AND','OR'
  ];

  function formatSql(sql, uppercase) {
    let s = sql.replace(/\s+/g, ' ').trim();
    const tokens = [];
    const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b[\w.]+\b|[(),;*=<>!+\-/%]|\S)/g;
    let m;
    while ((m = re.exec(s)) !== null) tokens.push(m[0]);

    KEYWORDS.sort((a, b) => b.split(' ').length - a.split(' ').length || b.length - a.length);

    let result = '';
    let i = 0;
    let indent = 0;
    const lines = [];

    function addLine(line) { if (line.trim()) lines.push('  '.repeat(indent) + line.trim()); }

    let cur = '';
    while (i < tokens.length) {
      let matched = false;
      for (const kw of NEWLINE_BEFORE) {
        const parts = kw.split(' ');
        const slice = tokens.slice(i, i + parts.length).map(t => t.toUpperCase());
        if (JSON.stringify(slice) === JSON.stringify(parts)) {
          if (cur.trim()) addLine(cur);
          cur = '';
          const kwStr = uppercase ? kw : kw.toLowerCase();
          cur = kwStr + ' ';
          i += parts.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        cur += tokens[i] + ' ';
        i++;
      }
    }
    if (cur.trim()) addLine(cur);
    return lines.map(l => l.replace(/ +/g, ' ').trimEnd()).join('\n');
  }

  function doFormat() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter SQL.', 'error'); return; }
    const uppercase = upperEl ? upperEl.checked : true;
    outputEl.value = formatSql(raw, uppercase);
    showToast('SQL formatted!', 'success');
  }

  formatBtn.addEventListener('click', doFormat);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'SQL');
    else showToast('Nothing to copy.', 'error');
  });
})();

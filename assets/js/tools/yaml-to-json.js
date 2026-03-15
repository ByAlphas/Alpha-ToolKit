(function initYamlToJson() {
  const inputEl = document.getElementById('y2j-input');
  const outputEl = document.getElementById('y2j-output');
  const convertBtn = document.getElementById('y2j-btn');
  const copyBtn = document.getElementById('y2j-copy');
  const indentSel = document.getElementById('y2j-indent');
  if (!inputEl) return;

  function parseYaml(text) {
    const lines = text.split('\n');
    const root = {};
    const stack = [{ indent: -1, obj: root }];

    function getParent(indent) {
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      return stack[stack.length - 1].obj;
    }

    function castValue(val) {
      if (val === 'null' || val === '~') return null;
      if (val === 'true') return true;
      if (val === 'false') return false;
      if (val === '') return null;
      if (!isNaN(val) && val !== '') return Number(val);
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        return val.slice(1, -1);
      }
      return val;
    }

    let i = 0;
    const rootArr = [];
    let isRootList = false;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trimEnd();
      if (trimmed === '' || trimmed.trimStart().startsWith('#')) { i++; continue; }
      if (trimmed.trimStart() === '---' || trimmed.trimStart() === '...') { i++; continue; }

      const indent = trimmed.length - trimmed.trimStart().length;
      const content = trimmed.trimStart();

      if (content.startsWith('- ') || content === '-') {
        isRootList = true;
        break;
      }
      break;
    }

    if (isRootList) {
      const arrStack = [{ indent: -1, arr: rootArr }];
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        const trimmed = line.trimEnd();
        if (trimmed === '' || trimmed.trimStart().startsWith('#')) continue;
        if (trimmed.trimStart() === '---' || trimmed.trimStart() === '...') continue;
        const indent = trimmed.length - trimmed.trimStart().length;
        const content = trimmed.trimStart();
        if (content.startsWith('- ')) {
          const val = content.slice(2);
          const colIdx = val.indexOf(':');
          if (colIdx > 0 && !val.startsWith('"') && !val.startsWith("'")) {
            const obj = {};
            const k = val.slice(0, colIdx).trim();
            const v = val.slice(colIdx + 1).trim();
            obj[k] = castValue(v);
            rootArr.push(obj);
          } else {
            rootArr.push(castValue(val));
          }
        } else if (content.includes(':') && rootArr.length > 0 && typeof rootArr[rootArr.length - 1] === 'object') {
          const colIdx = content.indexOf(':');
          const k = content.slice(0, colIdx).trim();
          const v = content.slice(colIdx + 1).trim();
          rootArr[rootArr.length - 1][k] = castValue(v);
        }
      }
      return rootArr;
    }

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      const trimmed = line.trimEnd();
      if (trimmed === '' || trimmed.trimStart().startsWith('#')) continue;
      if (trimmed.trimStart() === '---' || trimmed.trimStart() === '...') continue;
      const indent = trimmed.length - trimmed.trimStart().length;
      const content = trimmed.trimStart();
      const colIdx = content.indexOf(':');
      if (colIdx <= 0) continue;
      const key = content.slice(0, colIdx).trim();
      const val = content.slice(colIdx + 1).trim();

      const parent = getParent(indent);

      if (val === '' || val === null) {
        const peekLine = lines[j + 1];
        if (peekLine !== undefined) {
          const peekTrimmed = peekLine.trimEnd();
          const peekContent = peekTrimmed.trimStart();
          if (peekContent.startsWith('- ')) {
            const arr = [];
            parent[key] = arr;
            stack.push({ indent, obj: parent, key });
            let k = j + 1;
            while (k < lines.length) {
              const li = lines[k].trimEnd();
              if (li === '') { k++; continue; }
              const lc = li.trimStart();
              if (!lc.startsWith('- ')) break;
              arr.push(castValue(lc.slice(2)));
              k++;
            }
            j = k - 1;
            continue;
          } else {
            const obj = {};
            parent[key] = obj;
            stack.push({ indent, obj });
          }
        } else {
          parent[key] = null;
        }
      } else {
        parent[key] = castValue(val);
      }
    }
    return root;
  }

  function convert() {
    const raw = inputEl.value.trim();
    if (!raw) { showToast('Please enter YAML.', 'error'); return; }
    try {
      const parsed = parseYaml(raw);
      const indent = parseInt(indentSel ? indentSel.value : '2', 10);
      outputEl.value = JSON.stringify(parsed, null, indent);
      showToast('Converted to JSON!', 'success');
    } catch (e) {
      showToast('Parse error: ' + e.message, 'error');
    }
  }

  convertBtn.addEventListener('click', convert);
  copyBtn.addEventListener('click', () => {
    if (outputEl.value) copyToClipboard(outputEl.value, 'JSON');
    else showToast('Nothing to copy.', 'error');
  });
})();

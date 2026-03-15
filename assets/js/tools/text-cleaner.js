(function () {
  'use strict';

  function initTextCleaner() {
    var cleanBtn = document.getElementById('tc-clean-btn');
    var copyBtn  = document.getElementById('tc-copy-btn');
    var inputEl  = document.getElementById('tc-input');
    var outputEl = document.getElementById('tc-output');
    if (!cleanBtn) return;

    cleanBtn.addEventListener('click', function () {
      var text = inputEl.value;
      var stats = [];

      if (document.getElementById('tc-crlf').checked) {
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        stats.push('CRLF normalized');
      }

      if (document.getElementById('tc-trim').checked) {
        text = text.split('\n').map(function (l) { return l.trim(); }).join('\n');
        stats.push('lines trimmed');
      }

      if (document.getElementById('tc-blank').checked) {
        var before = text.split('\n').length;
        text = text.split('\n').filter(function (l) { return l.trim() !== ''; }).join('\n');
        var removed = before - text.split('\n').length;
        stats.push(removed + ' blank line(s) removed');
      }

      if (document.getElementById('tc-spaces').checked) {
        text = text.replace(/[ \t]+/g, ' ');
        stats.push('extra spaces collapsed');
      }

      if (document.getElementById('tc-special').checked) {
        text = text.replace(/[^\x20-\x7E\n]/g, '');
        stats.push('special chars removed');
      }

      outputEl.value = text;
      showToast(stats.length ? stats.join(', ') : 'No options selected');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Cleaned text');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextCleaner);
  } else {
    initTextCleaner();
  }
})();

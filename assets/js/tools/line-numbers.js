(function () {
  'use strict';

  function initLineNumbers() {
    var applyBtn = document.getElementById('ln-apply-btn');
    var copyBtn  = document.getElementById('ln-copy-btn');
    var inputEl  = document.getElementById('ln-input');
    var outputEl = document.getElementById('ln-output');
    if (!applyBtn) return;

    function getRadio(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    applyBtn.addEventListener('click', function () {
      var text  = inputEl.value;
      var mode  = getRadio('ln-mode') || 'add';
      var start = parseInt(document.getElementById('ln-start').value, 10) || 1;
      var sep   = document.getElementById('ln-sep').value;

      var lines = text.split('\n');

      if (mode === 'add') {
        var result = lines.map(function (line, i) {
          return (i + start) + sep + line;
        });
        outputEl.value = result.join('\n');
        showToast('Line numbers added');
      } else {
        var pattern = new RegExp('^\\d+[^\\w]*\\s*');
        var result = lines.map(function (line) {
          return line.replace(pattern, '');
        });
        outputEl.value = result.join('\n');
        showToast('Line numbers removed');
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Text');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLineNumbers);
  } else {
    initLineNumbers();
  }
})();

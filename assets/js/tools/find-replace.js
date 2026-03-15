(function () {
  'use strict';

  function initFindReplace() {
    var replaceBtn = document.getElementById('fr-replace-btn');
    var copyBtn    = document.getElementById('fr-copy-btn');
    var findEl     = document.getElementById('fr-find');
    var replaceEl  = document.getElementById('fr-replace');
    var inputEl    = document.getElementById('fr-input');
    var outputEl   = document.getElementById('fr-output');
    var statsEl    = document.getElementById('fr-stats');
    if (!replaceBtn) return;

    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    replaceBtn.addEventListener('click', function () {
      var find    = findEl.value;
      var replace = replaceEl.value;
      var text    = inputEl.value;

      if (!find) {
        showToast('Enter a search term', 'error');
        return;
      }

      var flags = '';
      if (document.getElementById('fr-global').checked)   flags += 'g';
      if (!document.getElementById('fr-case').checked)    flags += 'i';
      if (document.getElementById('fr-regex').checked && flags.indexOf('m') === -1) flags += 'm';

      var pattern;
      try {
        var src = document.getElementById('fr-regex').checked ? find : escapeRegex(find);
        pattern = new RegExp(src, flags);
      } catch (e) {
        showToast('Invalid regex: ' + e.message, 'error');
        return;
      }

      var matches = text.match(pattern);
      var count   = matches ? matches.length : 0;
      var result  = text.replace(pattern, replace);

      outputEl.value = result;
      if (statsEl) statsEl.textContent = count + ' match(es) replaced.';
      showToast(count + ' replacement(s) made');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Result');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFindReplace);
  } else {
    initFindReplace();
  }
})();

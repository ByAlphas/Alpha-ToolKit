(function () {
  'use strict';

  function initTextSorter() {
    var sortBtn = document.getElementById('ts-sort-btn');
    var copyBtn = document.getElementById('ts-copy-btn');
    var inputEl = document.getElementById('ts-input');
    var outputEl = document.getElementById('ts-output');
    if (!sortBtn) return;

    function getRadio(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    sortBtn.addEventListener('click', function () {
      var text = inputEl.value;
      if (!text.trim()) {
        showToast('Input is empty', 'error');
        return;
      }
      var lines = text.split('\n');
      var type  = getRadio('ts-type')  || 'alpha';
      var order = getRadio('ts-order') || 'asc';

      lines.sort(function (a, b) {
        if (type === 'alpha')   return a.localeCompare(b);
        if (type === 'numeric') return parseFloat(a) - parseFloat(b);
        if (type === 'length')  return a.length - b.length;
        return 0;
      });

      if (order === 'desc') lines.reverse();
      outputEl.value = lines.join('\n');
      showToast('Sorted ' + lines.length + ' lines');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Sorted text');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextSorter);
  } else {
    initTextSorter();
  }
})();

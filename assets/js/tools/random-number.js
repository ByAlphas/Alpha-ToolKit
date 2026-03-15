(function () {
  'use strict';

  function initRandomNumber() {
    var generateBtn = document.getElementById('rn-generate-btn');
    var copyBtn     = document.getElementById('rn-copy-btn');
    var outputEl    = document.getElementById('rn-output');
    if (!generateBtn) return;

    function getRadio(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    generateBtn.addEventListener('click', function () {
      var min      = parseFloat(document.getElementById('rn-min').value) || 0;
      var max      = parseFloat(document.getElementById('rn-max').value) || 100;
      var count    = Math.min(parseInt(document.getElementById('rn-count').value, 10) || 10, 1000);
      var type     = getRadio('rn-type') || 'integer';
      var decimals = parseInt(document.getElementById('rn-decimals').value, 10) || 2;
      var unique   = document.getElementById('rn-unique').checked;

      if (min > max) { showToast('Min must be ≤ Max', 'error'); return; }

      var rangeSize = max - min;
      if (unique && type === 'integer' && rangeSize + 1 < count) {
        showToast('Range too small for unique integers', 'error');
        return;
      }

      var results = [];
      var seen = new Set();
      var maxAttempts = count * 100;
      var attempts = 0;

      while (results.length < count && attempts < maxAttempts) {
        attempts++;
        var val;
        if (type === 'integer') {
          val = Math.floor(min) + secureRandInt(Math.floor(max) - Math.floor(min) + 1);
        } else {
          val = (min + (secureRandInt(1000001) / 1000000) * rangeSize).toFixed(decimals);
          val = parseFloat(val).toFixed(decimals);
        }
        var key = String(val);
        if (unique) {
          if (!seen.has(key)) { seen.add(key); results.push(val); }
        } else {
          results.push(val);
        }
      }

      outputEl.value = results.join('\n');
      showToast('Generated ' + results.length + ' number(s)');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Numbers');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRandomNumber);
  } else {
    initRandomNumber();
  }
})();

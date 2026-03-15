(function () {
  'use strict';

  function initRandomString() {
    var generateBtn = document.getElementById('rs-generate-btn');
    var copyBtn     = document.getElementById('rs-copy-btn');
    var lengthEl    = document.getElementById('rs-length');
    var lengthDisp  = document.getElementById('rs-length-display');
    var countEl     = document.getElementById('rs-count');
    var outputEl    = document.getElementById('rs-output');
    if (!generateBtn) return;

    var UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var LOWER   = 'abcdefghijklmnopqrstuvwxyz';
    var NUMBERS = '0123456789';
    var SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?/~`';

    if (lengthEl && lengthDisp) {
      lengthEl.addEventListener('input', function () {
        lengthDisp.textContent = lengthEl.value;
      });
      lengthDisp.textContent = lengthEl.value;
    }

    generateBtn.addEventListener('click', function () {
      var length  = parseInt(lengthEl ? lengthEl.value : 16, 10);
      var count   = parseInt(countEl  ? countEl.value  : 1,  10);
      var custom  = document.getElementById('rs-custom');
      var charset = '';

      if (custom && custom.value.trim()) {
        charset = custom.value;
      } else {
        if (document.getElementById('rs-upper').checked)   charset += UPPER;
        if (document.getElementById('rs-lower').checked)   charset += LOWER;
        if (document.getElementById('rs-numbers').checked) charset += NUMBERS;
        if (document.getElementById('rs-symbols').checked) charset += SYMBOLS;
      }

      if (!charset) {
        showToast('Select at least one charset', 'error');
        return;
      }

      var lines = [];
      for (var i = 0; i < count; i++) {
        var str = '';
        for (var j = 0; j < length; j++) {
          str += charset[secureRandInt(charset.length)];
        }
        lines.push(str);
      }
      outputEl.value = lines.join('\n');
      showToast('Generated ' + count + ' string(s)');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Strings');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRandomString);
  } else {
    initRandomString();
  }
})();

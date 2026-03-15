(function () {
  'use strict';

  function initTextReverser() {
    var reverseBtn = document.getElementById('tr-reverse-btn');
    var swapBtn    = document.getElementById('tr-swap-btn');
    var copyBtn    = document.getElementById('tr-copy-btn');
    var inputEl    = document.getElementById('tr-input');
    var outputEl   = document.getElementById('tr-output');
    if (!reverseBtn) return;

    function getRadio(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    reverseBtn.addEventListener('click', function () {
      var text = inputEl.value;
      var mode = getRadio('tr-mode') || 'char';
      var result;

      if (mode === 'char') {
        result = text.split('').reverse().join('');
      } else if (mode === 'word') {
        result = text.split('\n').map(function (line) {
          return line.split(' ').reverse().join(' ');
        }).join('\n');
      } else {
        result = text.split('\n').reverse().join('\n');
      }

      outputEl.value = result;
      showToast('Text reversed (' + mode + ' mode)');
    });

    if (swapBtn) {
      swapBtn.addEventListener('click', function () {
        var tmp = inputEl.value;
        inputEl.value  = outputEl.value;
        outputEl.value = tmp;
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Reversed text');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextReverser);
  } else {
    initTextReverser();
  }
})();

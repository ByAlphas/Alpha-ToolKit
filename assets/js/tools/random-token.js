(function initRandomToken() {
  'use strict';

  const lengthSlider  = document.getElementById('rtLength');
  const lengthDisplay = document.getElementById('rtLengthVal');
  const formatSelect  = document.getElementById('rtFormat');
  const countInput    = document.getElementById('rtCount');
  const genBtn        = document.getElementById('rtGenBtn');
  const outputArea    = document.getElementById('rtOutput');
  const copyBtn       = document.getElementById('rtCopyBtn');

  if (!genBtn || !outputArea) return;

  function hexToken(byteLen) {
    const arr = new Uint8Array(byteLen);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function base64urlToken(byteLen) {
    const arr = new Uint8Array(byteLen);
    crypto.getRandomValues(arr);
    let bin = '';
    arr.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function alphanumToken(charLen) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < charLen; i++) result += chars[secureRandInt(chars.length)];
    return result;
  }

  function generate() {
    const len    = parseInt(lengthSlider ? lengthSlider.value : 32, 10);
    const fmt    = formatSelect ? formatSelect.value : 'hex';
    const count  = Math.min(Math.max(parseInt(countInput ? countInput.value : 1, 10) || 1, 1), 100);
    const tokens = [];

    for (let i = 0; i < count; i++) {
      if (fmt === 'hex')              tokens.push(hexToken(len));
      else if (fmt === 'base64')     tokens.push(btoa(String.fromCharCode(...new Uint8Array(len).map(() => (crypto.getRandomValues(new Uint8Array(1))[0])))));
      else if (fmt === 'base64url')  tokens.push(base64urlToken(len));
      else                           tokens.push(alphanumToken(len));
    }

    outputArea.value = tokens.join('\n');
    showToast(`${count} token${count > 1 ? 's' : ''} generated!`, 'success');
  }

  if (lengthSlider && lengthDisplay) {
    lengthSlider.addEventListener('input', () => {
      lengthDisplay.textContent = lengthSlider.value;
    });
  }

  genBtn.addEventListener('click', generate);

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!outputArea.value) { showToast('Nothing to copy.', 'error'); return; }
      copyToClipboard(outputArea.value, 'Tokens');
    });
  }

  // Generate one token on load
  generate();
})();

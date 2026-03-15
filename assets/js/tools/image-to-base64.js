(function initImageToBase64() {
  'use strict';

  const dropZone  = document.getElementById('i2bDrop');
  const fileInput = document.getElementById('i2bFile');
  const preview   = document.getElementById('i2bPreview');
  const output    = document.getElementById('i2bOutput');
  const format    = document.getElementById('i2bFormat');
  const infoEl    = document.getElementById('i2bInfo');

  if (!dropZone) return;

  let currentDataUrl = '';
  let currentFile = null;

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    currentFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      currentDataUrl = e.target.result;
      preview.src = currentDataUrl;
      preview.style.display = 'block';
      const img = new Image();
      img.onload = () => {
        infoEl.textContent = `${file.name} · ${formatBytes(file.size)} · ${img.naturalWidth}×${img.naturalHeight}px · Base64: ${formatBytes(currentDataUrl.length)}`;
      };
      img.src = currentDataUrl;
      updateOutput();
    };
    reader.readAsDataURL(file);
  }

  function updateOutput() {
    if (!currentDataUrl) return;
    const fmt = format.value;
    const raw = currentDataUrl.split(',')[1];
    if (fmt === 'raw') {
      output.value = raw;
    } else if (fmt === 'img') {
      output.value = `<img src="${currentDataUrl}" alt="image" />`;
    } else if (fmt === 'css') {
      output.value = `background-image: url('${currentDataUrl}');`;
    } else {
      output.value = currentDataUrl;
    }
  }

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
  format.addEventListener('change', updateOutput);

  document.getElementById('copyI2bBtn').addEventListener('click', () => {
    copyToClipboard(output.value, 'Base64');
  });
})();

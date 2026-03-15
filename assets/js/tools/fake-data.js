(function () {
  'use strict';

  function initFakeData() {
    var generateBtn = document.getElementById('fd-generate-btn');
    var copyBtn     = document.getElementById('fd-copy-btn');
    var downloadBtn = document.getElementById('fd-download-btn');
    var outputEl    = document.getElementById('fd-output');
    if (!generateBtn) return;

    var firstNames = [
      'James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Barbara',
      'David','Elizabeth','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen',
      'Emily','Daniel','Ashley','George','Jessica','Joshua','Amanda','Kevin','Melissa','Brian'
    ];
    var lastNames = [
      'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
      'Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','Perez','White','Harris',
      'Clark','Walker','Young','Green','King','Wright','Scott','Torres','Hill','Adams'
    ];
    var emailDomains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','protonmail.com','example.com'];
    var streets = ['Main St','Oak Ave','Maple Dr','Cedar Ln','Pine Rd','Elm St','Park Ave','Lake Dr','Hill Rd','River Ln'];
    var cities  = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin'];
    var countries = ['USA','Canada','UK','Australia','Germany','France','Brazil','Japan','India','Mexico'];
    var companies = ['Acme Corp','Globex','Initech','Umbrella Inc','Waystar Royco','Pied Piper','Hooli','Sterling Cooper','Dunder Mifflin','Bluth Company'];
    var jobTitles = ['Software Engineer','Product Manager','Designer','Data Scientist','Marketing Manager','Sales Rep','DevOps Engineer','Business Analyst','HR Manager','Finance Lead'];

    function pick(arr) { return arr[secureRandInt(arr.length)]; }
    function randInt(min, max) { return min + secureRandInt(max - min + 1); }

    function buildRecord() {
      var first = pick(firstNames);
      var last  = pick(lastNames);
      var record = {};
      if (document.getElementById('fd-name').checked)    record.name    = first + ' ' + last;
      if (document.getElementById('fd-email').checked)   record.email   = first.toLowerCase() + '.' + last.toLowerCase() + randInt(10,99) + '@' + pick(emailDomains);
      if (document.getElementById('fd-phone').checked)   record.phone   = '+1-' + randInt(200,999) + '-' + randInt(100,999) + '-' + randInt(1000,9999);
      if (document.getElementById('fd-address').checked) record.address = randInt(1,999) + ' ' + pick(streets) + ', ' + pick(cities) + ', ' + pick(countries);
      if (document.getElementById('fd-company').checked) record.company = pick(companies);
      if (document.getElementById('fd-job').checked)     record.job     = pick(jobTitles);
      if (document.getElementById('fd-age').checked)     record.age     = randInt(18, 75);
      if (document.getElementById('fd-gender').checked)  record.gender  = secureRandInt(2) === 0 ? 'Male' : 'Female';
      return record;
    }

    function getFmt() {
      var el = document.querySelector('input[name="fd-fmt"]:checked');
      return el ? el.value : 'json';
    }

    function recordsToCsv(records) {
      if (!records.length) return '';
      var keys = Object.keys(records[0]);
      var rows = [keys.join(',')];
      records.forEach(function (r) {
        rows.push(keys.map(function (k) {
          var v = String(r[k] !== undefined ? r[k] : '');
          if (v.indexOf(',') !== -1 || v.indexOf('"') !== -1) v = '"' + v.replace(/"/g, '""') + '"';
          return v;
        }).join(','));
      });
      return rows.join('\n');
    }

    generateBtn.addEventListener('click', function () {
      var count = parseInt(document.getElementById('fd-count').value, 10) || 10;
      var fieldChecked = ['fd-name','fd-email','fd-phone','fd-address','fd-company','fd-job','fd-age','fd-gender']
        .some(function (id) { return document.getElementById(id).checked; });
      if (!fieldChecked) { showToast('Select at least one field', 'error'); return; }

      var records = [];
      for (var i = 0; i < count; i++) records.push(buildRecord());

      var fmt = getFmt();
      outputEl.value = fmt === 'csv' ? recordsToCsv(records) : JSON.stringify(records, null, 2);
      showToast('Generated ' + count + ' record(s)');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Fake data');
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var fmt  = getFmt();
        var text = outputEl.value;
        if (!text) { showToast('Nothing to download', 'error'); return; }
        var mime = fmt === 'csv' ? 'text/csv' : 'application/json';
        var ext  = fmt === 'csv' ? 'csv' : 'json';
        var blob = new Blob([text], { type: mime });
        var url  = URL.createObjectURL(blob);
        var a    = document.createElement('a');
        a.href = url;
        a.download = 'fake-data.' + ext;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded fake-data.' + ext);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFakeData);
  } else {
    initFakeData();
  }
})();

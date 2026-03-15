(function () {
  'use strict';

  function initRandomName() {
    var generateBtn = document.getElementById('rname-generate-btn');
    var copyBtn     = document.getElementById('rname-copy-btn');
    var outputEl    = document.getElementById('rname-output');
    if (!generateBtn) return;

    var maleNames = [
      'James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles',
      'Christopher','Daniel','Matthew','Anthony','Mark','Donald','Steven','Paul','Andrew','Joshua',
      'Kenneth','Kevin','Brian','George','Timothy','Ronald','Edward','Jason','Jeffrey','Ryan',
      'Jacob','Gary','Nicholas','Eric','Jonathan','Stephen','Larry','Justin','Scott','Brandon'
    ];

    var femaleNames = [
      'Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen',
      'Lisa','Nancy','Betty','Margaret','Sandra','Ashley','Dorothy','Kimberly','Emily','Donna',
      'Michelle','Carol','Amanda','Melissa','Deborah','Stephanie','Rebecca','Sharon','Laura','Cynthia',
      'Kathleen','Amy','Angela','Shirley','Anna','Brenda','Pamela','Emma','Nicole','Helen'
    ];

    var lastNames = [
      'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
      'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
      'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
      'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
      'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'
    ];

    function getRadio(name) {
      var el = document.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : null;
    }

    generateBtn.addEventListener('click', function () {
      var count  = parseInt(document.getElementById('rname-count').value, 10) || 10;
      var gender = document.getElementById('rname-gender').value;
      var fmt    = getRadio('rname-fmt') || 'full';
      var lines  = [];

      for (var i = 0; i < count; i++) {
        var pool;
        if (gender === 'male')   pool = maleNames;
        else if (gender === 'female') pool = femaleNames;
        else pool = secureRandInt(2) === 0 ? maleNames : femaleNames;

        var first = pool[secureRandInt(pool.length)];
        var last  = lastNames[secureRandInt(lastNames.length)];

        if      (fmt === 'first') lines.push(first);
        else if (fmt === 'last')  lines.push(last);
        else                      lines.push(first + ' ' + last);
      }

      outputEl.value = lines.join('\n');
      showToast('Generated ' + count + ' name(s)');
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(outputEl.value, 'Names');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRandomName);
  } else {
    initRandomName();
  }
})();

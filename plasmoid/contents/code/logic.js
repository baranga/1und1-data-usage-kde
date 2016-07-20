
function usage() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {

  };
  req.open('GET', 'https://center.vodafone.de/vfcenter/index.html?browser=web');
}


var counter = 0;
function init(label) {
  console.log("init");
  counter = 0;
  label.text = "initialize...";
}

function update(label) {
  console.log("update()");

  fetchData(function (err, data, isStaleData) {
    if (err) {
      label.text = "error: " + err;
      return;
    }
    renderData(label, data, isStaleData);
  })
}

var lastData = {count: 0, total: 0};
var fetchingData = false;
var FRESH_DATA = false;
var STALE_DATA = true;
var UNIT_MULTIPLIER = {
  'kB': 1000,
  'MB': 1000000,
  'GB': 1000000000
};

function fetchData(next) {
  if (fetchingData) {
    console.log("still fetching data");
    return next(null, lastData, STALE_DATA);
  }

  fetchingData = true;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    console.log("ready state changed to: " + req.readyState);
    if (req.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    if (req.status !== 200) {
      return next('server error: ' + req.status);
    }

    console.log('loading done');
    fetchingData = false;

    var regex = /<span class="count">([0-9,.]+)\s+([KMG]B)<\/span>/g;
    var parts = [];
    var part;
    while((part = regex.exec(req.responseText)) !== null) {
      parts.push(part);
    }
    console.log(JSON.stringify(parts));

    if (!parts) {
      return next('no match');
    }
    if (parts.length !== 2) {
      return next('invalid markup');
    }

    var values = [];
    parts.forEach(function (part) {
      var digits = part[1].replace(',', '.');
      var num = parseFloat(digits, 10);
      values.push(num * UNIT_MULTIPLIER[part[2]]);
    });

    lastData = {
      count: values[0],
      total: values[1]
    };
    print(JSON.stringify(lastData));

    next(null, lastData, FRESH_DATA);
  };
  req.timeout = 1000;
  req.open('GET', 'https://center.vodafone.de/vfcenter/index.html?browser=web');
  req.send();
  next(null, lastData, STALE_DATA);
}

function renderData(label, data, isStaleData) {
  label.text = (
    formatNumber(data.count) +
    ' / ' +
    formatNumber(data.total)
  );

  var ratio = data.count / data.total;
  label.text += ' ' + (ratio * 100).toString() + '%';
  if (ratio > 0.9) {
    label.text += ' r';
  } else if (ratio > 0.8) {
    label.text += ' y';
  } else {
    label.text += ' g';
  }

  if (isStaleData) {
    label.text += ' *';
  }
}

function formatNumber(num) {
  var mag = Math.log(num) / Math.LN10;;
  var div = 1;
  var suffix = 'B';

  if (mag >= 9) {
    div = 1000000000;
    suffix = 'GB';
  } else if (mag >= 6) {
    div = 1000000;
    suffix = 'MB';
  } else if (mag >= 3) {
    div = 1000;
    suffix = 'kB';
  }

  var formatted;
  if (num % div) {
    formatted = (num / div).toFixed(1);
  } else {
    formatted = (num / div).toString();
  }

  return formatted + suffix;
}
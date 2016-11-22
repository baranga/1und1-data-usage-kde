
var UNIT_MULTIPLIER = {
  'KB': 1000,
  'MB': 1000000,
  'GB': 1000000000
};

var Runner = function (initialData) {
  initialData = initialData || {};
  this.data = {
    count: initialData.count || 0,
    total: initialData.total || 0
  };
  this.error = null;
  this._fetching = false;
  this._fetchCallbacks = [];
};
Runner.prototype = {
  update: function (onUpdated) {
    console.log('Runner.update(): kick off fetch');
    onUpdated = onUpdated || function () {};
    this._fetch(onUpdated);
  },

  _fetch: function (onFetched) {
    this._fetchCallbacks.push(onFetched);

    if (this._fetching) {
      console.log('Runner._fetch(): skip fetch, still running');
      return;
    }
    this._fetching = true;

    var that = this;
    this._startFetch(function (req) {
      that._fetching = false;
      that._onFetchDone(req);

      var callbacks = that._fetchCallbacks;
      that._fetchCallbacks = [];
      for(var i = 0, l = callbacks.length; i < l; i += 1) {
        callbacks[i](that.error, that.data);
      }
    });
  },

  _startFetch: function (onDone) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      console.log("Runner._startFetch(): ready state changed to: " + req.readyState);
      if (req.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      onDone(req);
    };
    req.timeout = 1000;
    req.open('GET', 'https://center.vodafone.de/vfcenter/index.html?browser=web');
    req.send();
  },

  _onFetchDone: function (req) {
    if (req.status !== 200) {
      this.error = 'invalid response status: ' + req.status;
      console.log('Runner._onFetchDone(): error: ' + this.error);
      return;
    }
    this.error = null;

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
      values.push(num * UNIT_MULTIPLIER[part[2].toUpperCase()]);
    });

    this.data = {
      count: values[0],
      total: values[1]
    };
  },

  renderAbsUsageText: function () {
    return (
      this._formatByteNumber(this.data.count) +
      ' / ' +
      this._formatByteNumber(this.data.total)
    );
  },

  renderRelUsageText: function (precision, addPercentageSign) {
    if (typeof precision === 'undefined' || precision === null) {
      precision = 2;
    }
    var ratio = 0;
    if (this.data.total > 0) {
      ratio = this.data.count / this.data.total * 100;
    }

    var text = ratio.toLocaleString(Qt.locale(), 'f', precision);
    if (addPercentageSign) {
      text  += '%';
    }

    return text;
  },

  renderCombinedUsageText: function () {
    return this.renderAbsUsageText() + ' (' + this.renderRelUsageText(2, true) + ')';
  },

  _formatByteNumber: function (num) {
    var mag = Math.log(num) / Math.LN10;
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
    //if (num % div) {
    //  formatted = (num / div).toFixed(1);
    //} else {
    //  formatted = (num / div).toString();
    //}
    formatted = (num / div).toLocaleString();

    return formatted + suffix;
  }
};

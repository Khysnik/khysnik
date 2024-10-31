function $undo(previous) {
  var hist = previous || [],
    curs = previous ? previous.length : 0,
    noop = window["$noop"] || function(_) {};
  return {
    get: function() {
      return hist.slice(0, curs >= 0 ? curs : 0);
    },
    cursor: function() {
      return curs;
    },
    history: function() {
      return hist;
    },
    clear: function() {
      hist.length = curs = 0;
    },
    add: function(val) {
      hist.splice(curs++, hist.length, val);
      return val;
    },
    each: function(cb) {
      if (curs > hist.length) curs = hist.length;
      for (var i = 0; i < curs; i++) cb(hist[i]);
    },
    redo: function(cb) {
      if (curs++ > hist.length) curs = hist.length + 1;
      if (curs <= 0) curs = 1;
      if (hist[curs - 1]) {
        var out = hist[curs - 1].redo ? hist[curs - 1].redo() : hist[curs - 1];
        (cb || noop)(out);
      }
      return out;
    },
    undo: function(cb) {
      if (--curs < -1) curs = -1;
      if (curs >= hist.length) curs = hist.length - 1;
      if (hist[curs]) {
        var out = hist[curs].undo ? hist[curs].undo() : hist[curs];
        (cb || noop)(out);
      }
      return out;
    },
  };
}

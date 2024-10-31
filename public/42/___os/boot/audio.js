system42("audio", function(le) {
  "use strict";

  // http://stackoverflow.com/a/13116795

  window["Howl"] =
    window["Howl"] ||
    function() {
      this.play = $noop;
      this.pause = $noop;
    };

  var cache = {};

  function $audio(opt, buffer) {
    var out;
    if (typeof opt === "string") {
      if (le._settings.sounds[opt]) opt = le._settings.sounds[opt];
      if (cache[opt]) {
        out = cache[opt];
      } else {
        out = new Howl({ buffer: !!buffer, urls: [opt] });
        cache[opt] = out;
      }
    } else {
      var h = new Howl(opt);
      return h;
    }
    //console.log(out);
    return out;
  }

  $audio.config = function(opt) {
    return new Howl(opt);
  };

  $audio.stream = function(opt) {
    // better than bollean trap
    return $audio(opt, true);
  };

  window.$audio = $audio;
});

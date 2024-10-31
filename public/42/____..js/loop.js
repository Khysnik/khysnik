//http://stackoverflow.com/a/15851584/1289275

function $loop(callback, delay) {
  "use strict";

  var lastUpdate, timerId, play;

  function rAFDelta(now) {
    callback((now - lastUpdate) / 1000);
    timerId = requestAnimationFrame(rAFDelta);
    lastUpdate = performance.now();
  }
  function sToDelta() {
    callback((performance.now() - lastUpdate) / 1000);
    timerId = setTimeout(sToDelta, delay);
    lastUpdate = performance.now();
  }
  function rAF() {
    callback();
    timerId = requestAnimationFrame(rAF);
  }
  function sTo() {
    callback();
    timerId = setTimeout(sTo, delay);
  }

  function init(d) {
    pause();
    if (d !== undefined) delay = d;
    // if delta is requested as an argument
    if (callback.length) play = delay && delay > 0 ? sToDelta : rAFDelta;
    else play = delay && delay > 0 ? sTo : rAF;
    play(0);
    return instance;
  }
  function pause() {
    if (delay) clearTimeout(timerId);
    else cancelAnimationFrame(timerId);
    return instance;
  }

  var playing = false;
  function toggle() {
    if (playing) {
      pause();
      playing = false;
    } else {
      init();
      playing = true;
    }
    return instance;
  }

  var instance = {
    callback: callback,
    play: init,
    pause: pause,
    toggle: toggle,
    fn: function(cb) {
      callback = cb;
    },
    destroy: function() {
      pause();
      instance = null; // helpful ?
    },
  };

  return instance;
}

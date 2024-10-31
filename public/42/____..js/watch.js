function $watch(el) {
  el = el || {};

  /**
   * Private variables and methods
   */
  var callbacks = {},
    slice = Array.prototype.slice,
    onEachEvent = function(e, fn) {
      e.replace(/\S+/g, fn);
    },
    defineProperty = function(key, value) {
      Object.defineProperty(el, key, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false,
      });
    };

  el.observers = callbacks;

  /**
   * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
   * @param  { String } events - events ids
   * @param  { Function } fn - callback function
   * @returns { Object } el
   */
  defineProperty("on", function(events, fn) {
    if (typeof fn != "function") return el;

    onEachEvent(events, function(name, pos) {
      (callbacks[name] = callbacks[name] || []).push(fn);
      fn.typed = pos > 0;
    });

    return el;
  });

  /**
   * Removes the given space separated list of `events` listeners
   * @param   { String } events - events ids
   * @param   { Function } fn - callback function
   * @returns { Object } el
   */
  defineProperty("off", function(events, fn) {
    if (events == "*" && !fn) callbacks = {};
    else {
      onEachEvent(events, function(name) {
        if (fn) {
          var arr = callbacks[name];
          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
            if (cb == fn) arr.splice(i--, 1);
          }
        } else delete callbacks[name];
      });
    }
    return el;
  });

  /**
   * Listen to the given space separated list of `events` and execute the `callback` at most once
   * @param   { String } events - events ids
   * @param   { Function } fn - callback function
   * @returns { Object } el
   */
  defineProperty("once", function(events, fn) {
    function on() {
      el.off(events, on);
      fn.apply(el, arguments);
    }
    return el.on(events, on);
  });

  /**
   * Execute all callback functions that listen to the given space separated list of `events`
   * @param   { String } events - events ids
   * @returns { Object } el
   */
  defineProperty("trigger", function(events) {
    // getting the arguments
    // skipping the first one
    var args = slice.call(arguments, 1),
      fns;

    onEachEvent(events, function(name) {
      fns = slice.call(callbacks[name] || [], 0);

      for (var i = 0, fn; (fn = fns[i]); ++i) {
        if (fn.busy) return;
        fn.busy = 1;
        fn.apply(el, fn.typed ? [name].concat(args) : args);
        if (fns[i] !== fn) {
          i--;
        }
        fn.busy = 0;
      }

      if (callbacks["*"] && name != "*")
        el.trigger.apply(el, ["*", name].concat(args));
    });

    return el;
  });

  return el;
}
/*function $watch(that, obj) { 'use strict';

  // thanks : riotjs & fishbone.js
  var
    slice = Array.prototype.slice,
    thisArg = obj || that,
    observers = {} //that.observers = that.observers || {}

  that.on = function(e, fn) {
    e.replace(/\S+/g, function(name, pos) {
      (observers[name] = observers[name] || []).push(fn)
    })
    return that
  }

  that.once = function(e, fn) {
    function on() {
      fn.apply(thisArg, arguments)
      setTimeout(function() {
        that.off(e, on)
      }, 0)
    }
    return that.on(e, on)
  }

  that.off = function(e, fn) {
    var prop, arr, i, cb
    if (e === "*") {for (prop in observers) if (observers.hasOwnProperty(prop)) delete observers[prop]}
    else if (fn) {
      e.replace(/\S+/g, function(name) {
        var arr = observers[name]
        for (var i = 0, cb; cb = arr && arr[i]; ++i) {
          //console.log('cb == fn', fn, cb)
          if (cb == fn) arr.splice(i--, 1)
        }
      })
    } else {
      e.replace(/\S+/g, function(name) {
        if (observers[name]) observers[name].length = 0
      })
    }
    return that
  }

  that.trigger = function(e) {
    var fns = observers[e], args, i, l;
    if (fns) {
      args = slice.call(arguments, 1)
      for (i = 0, l = fns.length; i < l; i++) {
        //console.log(typeof fns[i])
        //if (typeof fns[i] === 'function')
          fns[i].apply(thisArg, args)
      }
    }
    return that
  }

  that.setThisArg = function(obj) {
    thisArg = obj
  }

  return that;
}*/

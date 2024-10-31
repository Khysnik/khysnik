!(function(global) {
  "use strict";

  var ready = {},
    tasks = {},
    slice = Array.prototype.slice,
    cfg = {
      onerror: $noop,
      onready: $noop,
    };

  function _kernel(opt, fn) {
    if (arguments.length > 2) {
      var arr = slice.call(arguments);
      var fn = arr.pop();
      _kernel.series(arr, fn);
    } else if ($io.is.obj(opt) && typeof fn == "function")
      (_kernel.data = opt), fn(opt);
    else if ($io.is.arr(opt) && typeof fn == "function")
      _kernel.parallel(opt, fn);
    else if (typeof opt == "string" && typeof fn == "function")
      _kernel.task(opt, fn);
    else if (typeof opt == "function") _kernel.task("modules", opt);
    else if (typeof opt == "string" && !fn) _kernel.launch(opt);
  }

  _kernel.ready = ready;
  _kernel.tasks = tasks;

  _kernel.paused = false;

  _kernel.stop = function(opt) {
    _kernel.paused = true;
    _kernel.off("*");
    for (var key in _kernel.tasks) delete _kernel.tasks[key];
    for (var key in _kernel.ready) delete _kernel.ready[key];
    for (var key in _kernel.observers) delete _kernel.observers[key];
    // _kernel.ready = {};
    // _kernel.tasks = {};
    // _kernel.observers = {};
  };

  _kernel.config = function(opt) {
    $extend(cfg, opt);
  };

  _kernel.task = function(name, fn) {
    (tasks[name] = tasks[name] || []).push(fn);
    return this;
  };
  _kernel.series = function(arr, fn) {
    var transfers = {};
    function step(i) {
      if (i < arr.length) {
        var item = arr[i];
        if (typeof item === "string") {
          //console.log('item', item);
          _kernel.launch(item);
          _kernel.on(item + ":ready", function(arg) {
            if (arg.length) transfers[item] = arg;
            step(++i);
          });
        } else {
          _kernel.parallel(item, function(_, arg) {
            if (arg.length) $extend(transfers, arg);
            step(++i);
          });
        }
      } else {
        try {
          fn(_kernel.data, transfers);
        } catch (err) {
          err.message = "kernel.series.fn : " + err.message;
          cfg.onerror(err);
        }
      }
    }
    step(0);
    return this;
  };
  _kernel.parallel = function(arr, fn) {
    var transfers = {};
    function check(arg) {
      for (var i = 0, l = arr.length; i < l; i++) {
        if (ready[arr[i]] !== true) return;
      }
      try {
        fn(_kernel.data, transfers);
      } catch (err) {
        err.message = "kernel.parallel.fn : " + err.message;
        cfg.onerror(err);
      }
    }
    $io.arr.all(arr, function(item) {
      if (typeof item === "string") {
        _kernel.launch(item);
        _kernel.on(item + ":ready", function(arg) {
          if (arg.length) transfers[item] = arg;
          ready[item] = true;
          check();
        });
      } else {
        _kernel.series(item, function(_, arg) {
          if (arg.length) $extend(transfers, arg);
          ready[item] = true;
          check();
        });
      }
    });
    return this;
  };
  _kernel.launch = function(e) {
    if (_kernel.paused) return;
    var nb = 0,
      transfers,
      fns = tasks[e],
      i,
      l;
    function done() {
      ready[e] = true;
      cfg.onready(e);
      _kernel.trigger(e + ":ready", _kernel.data, transfers);
      _kernel.off(e + ":ready");
    }
    function check(transfer) {
      if (transfer) (transfers = transfers || []).push(transfer);
      if (--nb === 0) done();
    }

    if (fns) {
      for (i = 0, l = fns.length; i < l; i++) {
        if (_kernel.paused) return;
        ++nb;
        !(function(fn, check) {
          setTimeout(function() {
            try {
              if (fn.length > 1) fn(_kernel.data, check);
              else check(fn(_kernel.data));
            } catch (err) {
              err.message = e + " : " + err.message;
              cfg.onerror(err);
              check(err);
            }
          }, 0);
        })(fns[i], check);
      }
    }
    return this;
  };

  global.$kernel = $watch(_kernel);
})(this);

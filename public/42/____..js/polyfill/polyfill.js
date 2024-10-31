if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
}
/////////////////////////////////////////////////////////////////////////////
// http://mozilla.github.io/pdf.js/web/compatibility.js
/////////////////////////////////////////////////////////////////////////////

// https://gist.github.com/paulirish/5438650
Date.now =
  Date.now ||
  function() {
    return +new Date();
  };
(function() {
  // prepare base perf object
  if (typeof window.performance === "undefined") {
    window.performance = {};
  }
  if (!window.performance.now) {
    var nowOffset = Date.now();
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }
    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
})();

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (
      typeof position !== "number" ||
      !isFinite(position) ||
      Math.floor(position) !== position ||
      position > subjectString.length
    ) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

// https://gist.github.com/timhall/4078614
/////////////////////////////////////////////////////////////////////////////////
// Updated requestAnimationFrame polyfill that uses new high-resolution timestamp
//
// References:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://gist.github.com/1579671
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
(function() {
  "use strict";
  var lastTime = 0,
    vendors = ["ms", "moz", "webkit", "o"],
    // Feature check for performance (high-resolution timers)
    hasPerformance = !!(window.performance && window.performance.now);

  for (
    var x = 0, max = vendors.length;
    x < max && !window.requestAnimationFrame;
    x += 1
  ) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }

  if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame
  ) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  // Add new wrapper for browsers that don't have performance
  if (!hasPerformance) {
    // Store reference to existing rAF and initial startTime
    var rAF = window.requestAnimationFrame,
      startTime = +new Date();

    // Override window rAF to include wrapped callback
    window.requestAnimationFrame = function(callback, element) {
      // Wrap the given callback to pass in performance timestamp
      var wrapped = function(timestamp) {
        // Get performance-style timestamp
        var performanceTimestamp =
          timestamp < 1e12 ? timestamp : timestamp - startTime;
        return callback(performanceTimestamp);
      };
      // Call original rAF with wrapped callback
      rAF(wrapped, element);
    };
  }
})();

// String.prototype.repeat polyfill
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    "use strict";
    if (this == null)
      throw new TypeError("can't convert " + this + " to object");
    var str = "" + this;
    count = +count;
    if (count != count) count = 0;
    if (count < 0) throw new RangeError("repeat count must be non-negative");
    if (count == Infinity)
      throw new RangeError("repeat count must be less than infinity");
    count = Math.floor(count);
    if (str.length == 0 || count == 0) return "";
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (august 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so :
    if (str.length * count >= 1 << 28)
      throw new RangeError(
        "repeat count must not overflow maximum string size"
      );
    var rpt = "";
    for (;;) {
      if ((count & 1) == 1) rpt += str;
      count >>>= 1;
      if (count == 0) break;
      str += str;
    }
    return rpt;
  };
}

// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(global) {
  "use strict";
  global.console = global.console || {};
  var con = global.console;
  var prop, method;
  var empty = {};
  var dummy = function() {};
  var properties = "memory".split(",");
  var methods = (
    "assert,clear,count,debug,dir,dirxml,error,exception,group," +
    "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," +
    "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn"
  ).split(",");
  while ((prop = properties.pop())) con[prop] = con[prop] || empty;
  while ((method = methods.pop())) con[method] = con[method] || dummy;
})(typeof window === "undefined" ? this : window);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      "use strict";
      if (target === undefined || target === null) {
        throw new TypeError("Cannot convert first argument to object");
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(nextSource);
        for (
          var nextIndex = 0, len = keysArray.length;
          nextIndex < len;
          nextIndex++
        ) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    },
  });
}

// https://github.com/YuzuJS/setImmediate
(function(global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }

  var nextHandle = 1; // Spec says greater than zero
  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;

  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    }
    // Copy function arguments
    var args = new Array(arguments.length - 1);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    }
    // Store and register the task
    var task = { callback: callback, args: args };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback;
    var args = task.args;
    switch (args.length) {
      case 0:
        callback();
        break;
      case 1:
        callback(args[0]);
        break;
      case 2:
        callback(args[0], args[1]);
        break;
      case 3:
        callback(args[0], args[1], args[2]);
        break;
      default:
        callback.apply(undefined, args);
        break;
    }
  }

  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];
      if (task) {
        currentlyRunningATask = true;
        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function(handle) {
      process.nextTick(function() {
        runIfPresent(handle);
      });
    };
  }

  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;
      global.onmessage = function() {
        postMessageIsAsynchronous = false;
      };
      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

    var messagePrefix = "setImmediate$" + Math.random() + "$";
    var onGlobalMessage = function(event) {
      if (
        event.source === global &&
        typeof event.data === "string" &&
        event.data.indexOf(messagePrefix) === 0
      ) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();
    channel.port1.onmessage = function(event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function(handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;
    registerImmediate = function(handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");
      script.onreadystatechange = function() {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };
      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  }

  // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

  // Don't get fooled by e.g. browserify environments.
  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(
  typeof self === "undefined"
    ? typeof global === "undefined"
      ? this
      : global
    : self
);

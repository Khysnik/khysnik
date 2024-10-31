/*
FAQ

Why different from jquery ?

The jquery api is almost perfect,
if you want to use an lightweight implementation
try zepto, ki.js ...

This library has a less versatile API but is more focused on performances and events delegation
*/

!(function(global) {
  "use strict";

  // little jQuery shims
  /////////////////////////////////////////////////////////////////////////////

  // thanks : http://stackoverflow.com/a/24107652
  var tapped = false;
  function doubleTap(e, cb) {
    if (!tapped) {
      tapped = setTimeout(function() {
        tapped = null;
      }, 300);
    } else {
      clearTimeout(tapped);
      tapped = null;
      //console.log('doubletap', cb);
      cb(e);
      e.preventDefault();
    }
  }

  var attachedTo = [];

  function _el(elem, startNode) {
    var elem = elem || {};

    if (typeof elem === "string") (startNode || document).querySelector(elem);
    if (elem.nodeType !== 1) elem = document;

    var $,
      notWatched = true;
    $io.arr.all(attachedTo, function(item) {
      if (item.elem === elem) notWatched = false;
    });
    if (notWatched) attachedTo.push({ elem: elem, attach: [] });

    return ($ = {
      get: function() {
        return elem;
      },
      html: function(t) {
        if (!t) return elem.innerHTML;
        else elem.innerHTML = t;
        return $;
      },
      add: function(t) {
        elem.innerHTML = elem.innerHTML + t;
        return $;
      },
      empty: function() {
        while (elem.firstChild) elem.removeChild(elem.firstChild);
        return $;
      },
      each: function(selector, cb) {
        var arr = elem.querySelectorAll(selector);
        for (var i = 0, l = arr.length; i < l; i++) {
          cb.call(arr[i], arr[i], i);
        }
        return $;
      },
      append: function(n) {
        var temp, nods;
        if (typeof n == "string") {
          //console.log(n);
          temp = document.createElement("div");
          temp.innerHTML = n;
          nods = temp.childNodes;
          //console.log(nods);
          for (var i = 0, l = nods.length; i < l; i++)
            if (nods[i] && nods[i].nodeType === 1) elem.appendChild(nods[i]);
        } else elem.appendChild(n);
        return $;
      },
      click: function() {
        if ("createEvent" in document) {
          var evt = document.createEvent("MouseEvents");
          evt.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
          );
          elem.dispatchEvent(evt);
        } else elem.fireEvent("onclick");
      },
      trigger: function(eventName) {
        if (eventName === "click") {
          // @todo : tests behaviour change between HTMLEvents & MouseEvents
          $.click();
          return;
        }
        if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent(eventName, false, true);
          elem.dispatchEvent(evt);
        } else elem.fireEvent("on" + eventName);
      },
      on: function(events, childs, handler, useCapture) {
        if (typeof childs === "function") {
          useCapture = handler;
          handler = childs;
          childs = null;
        }

        useCapture = !!useCapture;

        function processHandler(e) {
          // WARNING OPINIATED BEHAVIOUR
          /////////////////////////////////////////////////////////////////////////////
          if (this.disabled) return;
          /////////////////////////////////////////////////////////////////////////////
          if (handler.call(this, e) === false) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }

        var scopeHandler = childs
          ? $delegate(childs, processHandler)
          : processHandler;

        events.replace(/[^\s]+/g, function(name) {
          if (name === "doubletap") {
            scopeHandler = (function(fn) {
              return function(e) {
                doubleTap(e, fn.bind(this));
                e.stopPropagation();
              };
            })(scopeHandler);
            elem.addEventListener("touchstart", scopeHandler, useCapture);
          } else {
            elem.addEventListener(name, scopeHandler, useCapture);
          }
          $io.arr.all(attachedTo, function(item) {
            if (item.elem === elem) {
              item.attach.push({
                name: name,
                childs: childs,
                handler: handler,
                scopeHandler: scopeHandler,
                useCapture: useCapture,
              });
            }
          });
        });

        return $;
      },
      off: function(events, childs, handler) {
        if (!handler) (handler = childs), (childs = null);

        events.replace(/[^\s]+/g, function(name) {
          $io.arr.all(attachedTo, function(item) {
            if (item.elem === elem) {
              //console.log(name, item.attach);
              $io.arr.all(item.attach, function(attach) {
                if (
                  attach.name == name &&
                  attach.childs == childs &&
                  attach.handler == handler
                ) {
                  elem.removeEventListener(
                    name,
                    attach.scopeHandler,
                    attach.useCapture
                  );
                }
              });
            }
          });
        });

        return $;
      },
    });
  }

  _el.create = function(selector, child, replaceLast) {
    var tree = selector.split(/[>| ]+/);
    if (replaceLast) tree.pop();
    if (!tree && child) return child;
    var first;
    var last;
    $io.arr.all(tree, function(item) {
      item.replace(/(\w+)?(#(\w+))?(\.([\w|.]+))?/, function(
        a,
        name,
        b,
        id,
        c,
        cla
      ) {
        // https://regex101.com/r/dJ1vR4/1
        var el = document.createElement(name ? name : "div");
        if (id) el.id = id;
        if (cla) el.className = cla.split(".").join(" ");
        if (last) last.appendChild(el);
        last = el;
        if (!first) first = last;
      });
    });
    if (child) last.appendChild(child);
    return first;
  };

  _el.each = function(selector, cb) {
    var arr = document.querySelectorAll(selector);
    for (var i = 0, l = arr.length; i < l; i++) {
      cb.call(arr[i], arr[i], i);
    }
    return _el;
  };

  global.$el = _el;
})(this);

/*var matches = (function(el) {
  if (!el) return;
  var p = el.prototype;
  var m = (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector)
  el.prototype.matches = m;
  return m;
}(Element));*/

/*
function isId(selector) {return /^#[a-z0-9\-_]+$/i.test(selector)}
function isTag(selector) {return /^[a-z\-]+$/i.test(selector)}
*/

/*
function isTouchDevice() {
  return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
}
console.log(isTouchDevice());
*/

/*

'swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'

*/

/*  var NATIVE = ('focusin focusout focus blur load resize scroll unload click dblclick '+
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
    'change select keydown keypress keyup error contextmenu ' +

    'dragstart drag dragenter dragleave dragover drop dragend ' +

    'MSGesture MSGestureEnd ' +
    'touchstart MSPointerDown pointerdown ' +
    'touchmove MSPointerMove pointermove ' +
    'touchend MSPointerUp pointerup ' +
    'touchcancel MSPointerCancel pointercancel'
  ).split(' ');

  //console.log(NATIVE);*/

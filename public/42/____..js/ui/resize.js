!(function(global) {
  "use strict";

  var $noop = global.$noop || function(_) {};

  // thanks : http://stackoverflow.com/a/8960307

  function on(e, fn) {
    document.documentElement.addEventListener(e, fn, false);
  }
  function off(e, fn) {
    document.documentElement.removeEventListener(e, fn, false);
  }
  function getPos(e) {
    var touch = e.changedTouches ? e.changedTouches[0] : null;
    return touch
      ? { x: touch.clientX, y: touch.clientY }
      : { x: e.clientX, y: e.clientY };
  }

  function blockIframes() {
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0, l = iframes.length; i < l; i++) {
      //console.log(iframes[i].style.pointerEvents);
      iframes[i].dataset.oldPointerEvents = iframes[i].style.pointerEvents; //window.getComputedStyle(iframes[i], null).getPropertyValue("pointer-events");
      iframes[i].style.pointerEvents = "none";
    }
  }
  function unblockIframes() {
    var iframes = document.querySelectorAll("iframe");
    for (var i = 0, l = iframes.length; i < l; i++) {
      iframes[i].style.pointerEvents = iframes[i].dataset.oldPointerEvents;
      delete iframes[i].dataset.oldPointerEvents;
    }
  }

  function cancelTransform(el) {
    el.dataset.oldTransform = el.style.transitionDuration;
    el.style.transitionDuration = "0s";
  }
  function restoreTransform(el) {
    //console.log(el.dataset.oldTransform);
    el.style.transitionDuration = el.dataset.oldTransform;
    delete el.dataset.oldTransform;
  }

  var _resizer = document.createElement("div");
  _resizer.style.position = "absolute";
  _resizer.style.zIndex = "999";
  _resizer.style.top = "0";
  _resizer.style.bottom = "0";
  _resizer.style.left = "0";
  _resizer.style.right = "0";
  _resizer.style.pointerEvents = "auto";

  function _resize(el, opt) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) {
      throw new Error("$resize : element missing");
      return;
    }

    if (el.getAttribute("data-js-resize-init")) return;
    else el.setAttribute("data-js-resize-init", true);

    // seek the first postioned ancestor
    var parent = el.parentNode;
    while (
      parent &&
      parent.parentNode &&
      parent.parentNode.nodeType !== 9 &&
      window.getComputedStyle(parent, null).position == "static"
    )
      parent = parent.parentNode;

    if (typeof opt == "string") opt = { handles: opt };

    var style = window.getComputedStyle(el, null),
      def = {
        handles: "e, s, se",
        onstart: $noop,
        onresize: $noop,
        onstop: $noop,
      },
      cfg = $extend(def, opt),
      elIsAbsolute = style.position == "fixed" || style.position == "absolute",
      parPos = el.getBoundingClientRect(),
      parTop = parPos.top,
      parLeft = parPos.left,
      dirs = [];

    //console.log(el, style.position);
    if (style.position == "static" || style.position == "")
      el.style.position = "relative";

    if (cfg.handles == "all") {
      //dirs = ['n', 'w', 'e', 's', 'topleft', 'topright', 'bottomleft', 'bottomright'];
      dirs = ["n", "w", "e", "s", "nw", "ne", "sw", "se"];
    } else {
      //dirs = cfg.handles.split(',');
      //console.log(dirs);
      cfg.handles.replace(/([^,\s]+)/g, function(_, a) {
        // http://regex101.com/r/xY4uC3/2
        //console.log(a);
        dirs.push(a);
      });
    }

    var instances = [];

    for (var i = 0, l = dirs.length; i < l; i++)
      instances.push(init(el, dirs[i]));

    function init(el, dir) {
      var x,
        y,
        w,
        h,
        t,
        l,
        p,
        resizer = _resizer.cloneNode(),
        dir = dir || "s",
        resize;

      try {
        resize = $io.fn.throttle(resizeFn, 15);
      } catch (e) {
        resize = resizeFn;
      }

      resizer.className = "js-resizer js-resizer-" + dir;

      if (dir == "n") {
        resizer.style.bottom = "auto";
        resizer.style.height = "6px";
        resizer.style.cursor = "n-resize";
      } else if (dir == "s") {
        resizer.style.top = "auto";
        resizer.style.height = "6px";
        resizer.style.cursor = "s-resize";
      } else if (dir == "e") {
        resizer.style.left = "auto";
        resizer.style.width = "6px";
        resizer.style.cursor = "e-resize";
      } else if (dir == "w") {
        resizer.style.right = "auto";
        resizer.style.width = "6px";
        resizer.style.cursor = "w-resize";
      } else if (dir == "nw") {
        resizer.style.bottom = "auto";
        resizer.style.right = "auto";
        resizer.style.height = "6px";
        resizer.style.width = "6px";
        resizer.style.cursor = "nw-resize";
      } else if (dir == "ne") {
        resizer.style.bottom = "auto";
        resizer.style.left = "auto";
        resizer.style.height = "6px";
        resizer.style.width = "6px";
        resizer.style.cursor = "ne-resize";
      } else if (dir == "sw") {
        resizer.style.top = "auto";
        resizer.style.right = "auto";
        resizer.style.height = "6px";
        resizer.style.width = "6px";
        resizer.style.cursor = "sw-resize";
      } else if (dir == "se") {
        resizer.style.top = "auto";
        resizer.style.left = "auto";
        resizer.style.height = "6px";
        resizer.style.width = "6px";
        resizer.style.cursor = "se-resize";
      }

      el.appendChild(resizer);

      function handleStart(e) {
        e.preventDefault();
        e.stopPropagation();
        start(e);
      }
      resizer.addEventListener("mousedown", handleStart, false);
      resizer.addEventListener("touchstart", handleStart, false);

      function hideContextMenu(e) {
        e.preventDefault();
      }

      function start(e) {
        var pos = getPos(e);
        x = pos.x;
        y = pos.y;
        w = el.offsetWidth;
        h = el.offsetHeight;
        t = el.offsetTop;
        l = el.offsetLeft;

        on("mousemove", resize);
        on("touchmove", resize);
        on("mouseup", stop);
        on("touchend", stop);
        on("contextmenu", hideContextMenu);

        blockIframes();
        cancelTransform(el);
        document.documentElement.style.cursor = dir + "-resize";
        cfg.onstart && cfg.onstart(el, e);
      }

      function stop(e) {
        document.documentElement.style.cursor = "auto";
        unblockIframes();
        restoreTransform(el);
        off("mousemove", resize);
        off("touchmove", resize);
        off("mouseup", stop);
        off("touchend", stop);
        off("contextmenu", hideContextMenu);
        cfg.onstop && cfg.onstop(el, e);
      }

      function resizeFn(e) {
        var pos = getPos(e);

        if (dir === "s" || dir === "se" || dir === "sw")
          el.style.height = h + pos.y - y + "px";
        if (dir === "e" || dir === "ne" || dir === "se") {
          el.style.width = w + pos.x - x + "px";
        }
        if (dir === "n" || dir === "ne" || dir === "nw") {
          var newSize = pos.y - y;
          if (elIsAbsolute) {
            el.style.top = t + newSize + "px";
          }
          el.style.height = h - newSize + "px";
        }
        if (dir === "w" || dir === "nw" || dir === "sw") {
          var newSize = pos.x - x;
          if (elIsAbsolute) {
            el.style.left = l + newSize + "px";
          }
          el.style.width = w - newSize + "px";
        }

        cfg.onresize && cfg.onresize(el, e);
      }

      function destroy() {
        resizer.removeEventListener("mousedown", handleStart, false);
        resizer.removeEventListener("touchstart", handleStart, false);
        if (resizer.parentNode) resizer.parentNode.removeChild(resizer);
        //console.log('removed resizer ' + dir);
      }

      return { destroy: destroy };
    }

    function destroy() {
      for (var i = 0, l = instances.length; i < l; i++) {
        instances[i].destroy();
      }
    }

    return { destroy: destroy };
  }

  global.$resize = _resize;
})(this);

/*
@todo : flex resizing
right
//el.style.flexGrow = 0;
//el.style.flexShrink = 0;
//el.style.flexBasis = (w + e.clientX - x) + 'px';

left
//console.log('screenX:%s, x:%s', screenX, x);
//el.style.flexGrow = 0;
//el.style.flexShrink = 0;
//el.style.flexBasis = (screenX - e.clientX) + 'px';
*/

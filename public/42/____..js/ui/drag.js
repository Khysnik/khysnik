!(function(global) {
  "use strict";

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

  function _drag(el, selector, opt) {
    if (typeof selector === "object") {
      opt = selector;
      selector = null;
    }

    if (typeof el === "string") el = document.querySelector(el);
    if (!el) {
      throw new Error("$drag : element missing");
      return;
    }

    var def = {
        constrain: false,
        ghost: false,
        grid: false,
        position: "absolute",
        handle: null,
        distance: 5,
        oninit: $noop,
        onstart: $noop,
        ondrag: $noop,
        onstop: $noop,
        ondrop: $noop,
      },
      cfg = $extend(def, opt),
      x,
      y,
      t,
      l,
      relativeStartX,
      relativeStartY,
      maxY,
      maxX,
      minY = 0,
      minX = 0,
      parent,
      positionedParent,
      handler,
      onmousedown = selector ? $delegate(selector, init) : init;

    // for dynamic boolean
    if (typeof cfg.ghost === "function") {
      Object.defineProperty(cfg, "ghost", {
        get: function() {
          return opt.ghost(cfg);
        },
      });
    }
    if (typeof cfg.grid === "function") {
      Object.defineProperty(cfg, "grid", {
        get: opt.grid,
      });
    }

    _drag.elem = el;
    _drag.zone = null;
    _drag.isDragging = false;

    if (selector) {
      handler = el;
      parent = positionedParent = el;
    } else {
      handler = cfg.handle || el;
      parent = el.parentNode;
      positionedParent = parent;
      // seek the first postioned ancestor
      while (
        positionedParent.parentNode &&
        positionedParent.parentNode.nodeType !== 9 &&
        window.getComputedStyle(parent, null).position == "static"
      )
        positionedParent = positionedParent.parentNode;
    }
    maxY = positionedParent.offsetHeight - el.offsetHeight - 0.5; // removing 0.5px could prevent scrollbar to appear on chrome
    maxX = positionedParent.offsetWidth - el.offsetWidth - 0.5;

    function move(e) {
      var pos = getPos(e);
      x = pos.x - relativeStartX;
      y = pos.y - relativeStartY;

      if (
        _drag.isDragging ||
        Math.abs(x) > cfg.distance ||
        Math.abs(y) > cfg.distance
      ) {
        //e.preventDefault();
        preventDefault(e);
        if (!_drag.isDragging) start(e);
        x += l;
        y += t;
        if (cfg.constrain) {
          x = x > maxX ? maxX : x < minX ? minX : x;
          y = y > maxY ? maxY : y < minY ? minY : y;
        }
        if (cfg.grid) {
          x = ~~((x + cfg.grid[0] / 2) / cfg.grid[0]) * cfg.grid[0];
          y = ~~((y + cfg.grid[1] / 2) / cfg.grid[1]) * cfg.grid[1];
        }

        if (cfg.ghost) {
          if (_drag.ghost) {
            _drag.ghost.style.left = x + "px";
            _drag.ghost.style.top = y + "px";
          }
        } else {
          _drag.elem.style.left = x + "px";
          _drag.elem.style.top = y + "px";
        }
        _drag.x = x;
        _drag.y = y;
        cfg.ondrag.call(_drag.elem, e, x, y);

        if (cfg.zone) zone(e, pos);
      }
    }

    function zone(e, pos) {
      var currTarg = document.elementFromPoint(pos.x, pos.y);

      for (var selector in cfg.zone) {
        if (cfg.zone.hasOwnProperty(selector)) {
          var Z = cfg.zone[selector];
          var targ = currTarg;
          while (targ && targ.nodeType == 1 && !targ.matches(selector))
            targ = targ.parentNode;
          if (!targ || targ.nodeType == 9) {
            if (_drag.zone) {
              if (Z.leave) Z.leave(e, _drag.zone, _drag.elem);
              _drag.zone = null;
            }
          } else {
            if (_drag.zone !== targ) {
              if (Z.leave && _drag.zone) Z.leave(e, _drag.zone, _drag.elem);
              if (Z.enter) Z.enter(e, targ, _drag.elem);
            }
            _drag.zone = targ;
          }
          if (Z.move && _drag.zone) Z.move(e, _drag.zone, _drag.elem);
        }
      }
    }
    function dropInZone(e) {
      var out = false;
      var pos = getPos(e);
      var currTarg = document.elementFromPoint(pos.x, pos.y);

      for (var selector in cfg.zone) {
        if (cfg.zone.hasOwnProperty(selector)) {
          var Z = cfg.zone[selector];
          if (Z.drop && _drag.zone) {
            out = true;
            Z.drop(e, _drag.zone, _drag.elem);
          }
        }
      }
      return out;
    }

    function start(e) {
      if (cfg.ghost) {
        //console.log("????????????",_drag.ghost);
        document.body.appendChild(_drag.ghost);
      } else {
        var style = getComputedStyle(_drag.elem, null);
        l = _drag.elem.offsetLeft - (parseInt(style.marginLeft) || 0);
        t = _drag.elem.offsetTop - (parseInt(style.marginTop) || 0);
        if (cfg.position === "absolute" || cfg.position === "fixed") {
          _drag.elem.style.position =
            style.position == "fixed" ? "fixed" : "absolute";
          // Not sure about this :
          // In order to have correct width and height
          // we probably should force border-box sizing in case there is no "*{box-sizing:border-box}" in css)
          _drag.elem.style.boxSizing = _drag.elem.style.webkitBoxSizing = _drag.elem.style.MozBoxSizing =
            "border-box";
          _drag.elem.style.height = _drag.elem.offsetHeight + "px";
          _drag.elem.style.width = _drag.elem.offsetWidth + "px";
          _drag.elem.style.left = l + "px";
          _drag.elem.style.top = t + "px";
        } else {
          var rl = parseInt(style.left) || 0,
            rt = parseInt(style.top) || 0;
          if (cfg.constrain) {
            maxY = maxY - t + rt;
            minY = minY - t + rt;
            maxX = maxX - l + rl;
            minX = minX - l + rl;
          }
          l = rl;
          t = rt;
          _drag.elem.style.position = "relative";
          _drag.elem.style.left = l + "px";
          _drag.elem.style.top = t + "px";
        }
        _drag.elem.classList.add("ui_is_dragging");
      }
      cfg.onstart.call(_drag.elem, e);
      //_drag.elem = _drag.elem;
      //_drag.ghost = _drag.ghost;
      _drag.isDragging = true;
    }

    function init(e, elem) {
      //e.preventDefault();
      preventDefault(e);
      //console.log(selector, this);
      if (elem) _drag.elem = elem;
      else if (selector) _drag.elem = this;
      else _drag.elem = el;
      //_drag.elem = this;

      var pos = getPos(e);
      relativeStartX = pos.x;
      relativeStartY = pos.y;

      if (cfg.ghost) {
        _drag.ghost = _drag.createGhost(_drag.elem);
        var rect = _drag.elem.getBoundingClientRect();
        l = rect.left;
        t = rect.top;
      } else {
        _drag.ghost = null;
        l = _drag.elem.offsetLeft;
        t = _drag.elem.offsetTop;
      }

      _drag.initialPos.x = l;
      _drag.initialPos.y = t;

      move(e);

      on("mousemove", move);
      on("touchmove", move);
      on("mouseup", stop);
      on("touchend", stop);
      on("contextmenu", preventDefault);
      cfg.oninit.call(_drag.elem, e);
    }

    function stop(e) {
      off("mousemove", move);
      off("touchmove", move);
      off("mouseup", stop);
      off("touchend", stop);
      off("contextmenu", preventDefault);

      if (_drag.isDragging) {
        var dropCalled = false;
        if (cfg.zone && _drag.elem) dropCalled = dropInZone(e);
        if (!dropCalled) cfg.ondrop.call(_drag.elem, e);
        cfg.onstop.call(_drag.elem, e);
      }

      //_drag.removeGhost();
      if (_drag.elem) {
        _drag.elem.classList.remove("ui_is_dragging");
      }
      _drag.zone = null;
      _drag.elem = null;
      _drag.initialPos.x = null;
      _drag.initialPos.y = null;
      _drag.x = null;
      _drag.y = null;
      _drag.cfg = null;
      _drag.isDragging = false;
    }

    function preventDefault(e) {
      document.activeElement.blur();
      e.preventDefault();
    }

    handler.addEventListener("mousedown", onmousedown, false);
    handler.addEventListener("touchstart", onmousedown, false);

    /*if (cfg.onDataTransfer) {
      handler.addEventListener('dragover', function(e) {
        //console.log(_drag.elem);
        if (!_drag.elem) init(e, cfg.onDataTransfer(e, e.dataTransfer))
      }, false);
    }*/

    return {
      destroy: function() {
        _drag.isDragging = false;
        _drag.removeGhost();
        stop();
        handler.removeEventListener("mousedown", onmousedown, false);
        handler.removeEventListener("touchstart", onmousedown, false);
      },
    };
  }

  _drag.createGhost = function(el, cfg) {
    el.classList.add("ui_is_dragging");
    var ghostEl = el.cloneNode(true);
    var goDescendants = ghostEl.getElementsByTagName("*");
    var elDescendants = el.getElementsByTagName("*");
    ghostEl.style.cssText = getComputedStyle(el, null).cssText;
    for (var i = 0, l = goDescendants.length; i < l; i++) {
      goDescendants[i].style.cssText = getComputedStyle(
        elDescendants[i],
        null
      ).cssText;
      goDescendants[i].style.pointerEvents = "none";
    }
    ghostEl.classList.add("js-ghost");
    ghostEl.style.pointerEvents = "none";
    ghostEl.style.position = "fixed";
    ghostEl.style.zIndex = 9999;
    ghostEl.style.opacity = ".7";
    el.classList.remove("ui_is_dragging");
    return ghostEl;
  };

  _drag.initialPos = { x: null, y: null };

  _drag.revert = function(cb, delay) {
    $transition.revert(_drag.ghost || _drag.elem, _drag.initialPos, function() {
      if (_drag.ghost) _drag.removeGhost();
    });
  };
  _drag.removeGhost = function() {
    if (
      _drag.ghost &&
      _drag.ghost.parentNode &&
      _drag.ghost.parentNode === document.body
    )
      document.body.removeChild(_drag.ghost);
    _drag.ghost = null;
  };

  global.$drag = _drag;
})(this);

!(function(global) {
  "use strict";

  // http://stackoverflow.com/a/8393767
  function getTransitionPrefix() {
    var el = document.createElement("div"),
      prefixes = ["Webkit", "Moz", "O", "ms"],
      i;
    if ("transition" in el.style) return "transition";
    for (i = 0; i < prefixes.length; i++)
      if (prefixes[i] + "Transition" in el.style)
        return prefixes[i] + "Transition";
    return "transition";
  }
  var transition = getTransitionPrefix();
  //console.log(transition);

  function _transition(el) {
    console.log(el);
  }

  _transition.revert = function(el, initialPos, cb, delay) {
    if (delay === undefined) delay = 300;
    if (el && initialPos.x !== null) {
      //console.log(el);
      var oldTransition = el.style[transition];
      el.style[transition] =
        "left " + delay + "ms ease, top " + delay + "ms ease";
      el.style.left = initialPos.x + "px";
      el.style.top = initialPos.y + "px";
      setTimeout(function() {
        el.style[transition] = oldTransition;
        if (typeof cb === "function") cb();
      }, delay);
    }
  };
  global.$transition = _transition;
})(this);

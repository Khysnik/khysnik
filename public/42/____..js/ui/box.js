!(function(global) {
  "use strict";

  // Element matches Polyfill
  !(function(p) {
    if (Element && !p.matches)
      p.matches =
        p.matchesSelector ||
        p.mozMatchesSelector ||
        p.msMatchesSelector ||
        p.oMatchesSelector ||
        p.webkitMatchesSelector;
  })(Element.prototype);

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

  // http://stackoverflow.com/a/19614185
  function overlap(r1, r2) {
    return !(
      r1.right <= r2.left ||
      r1.left >= r2.right ||
      r1.bottom <= r2.top ||
      r1.top >= r2.bottom
    );
  }

  function $box(el, selector, opt) {
    if (typeof selector === "object") {
      opt = selector;
      selector = null;
    }

    if (typeof el === "string") el = document.querySelector(el);
    if (!el) {
      throw new Error("$box : element missing");
      return;
    }

    var def = {
        distance: 10,
        oninit: $noop,
        onstart: $noop,
        ondraw: function(e, x, y) {},
        onstop: $noop,
      },
      cfg = $extend(def, opt),
      x,
      y,
      W,
      H,
      relativeStartX,
      relativeStartY,
      currentEl = el,
      onmousedown;

    if (selector) {
      onmousedown = function(e) {
        var targ = e.target;
        while (targ && targ.nodeType == 1 && !targ.matches(selector))
          targ = targ.parentNode;
        if (!targ || targ.nodeType == 9) return;
        currentEl = targ;
        init.call(currentEl, e);
      };
    } else {
      onmousedown = init;
    }

    var box = document.createElement("div");
    box.className = "ui_select_box";
    box.style.position = "fixed";
    box.style.zIndex = 9999;
    box.style.border = "1px dotted #000";
    box.style.backgroundColor = "rgba(0,0,0,.1)";
    box.style.display = "none";

    var rBox = {
      right: 0,
      left: 0,
      bottom: 0,
      top: 0,
    };

    function select() {
      if (cfg.target) {
        var elems = currentEl.querySelectorAll(cfg.target);
        var selection = [];
        for (var i = 0, l = elems.length; i < l; i++) {
          if (overlap(rBox, elems[i].getBoundingClientRect()))
            selection.push(elems[i]);
        }
        return selection;
      }
    }

    var lastScrollTop = 0;
    var started = false;
    function start(e) {
      cfg.onstart.call(currentEl, e, box);
      started = true;
    }
    function draw(e) {
      var pos = getPos(e);
      x = pos.x - relativeStartX;
      y = pos.y - relativeStartY;
      var W = Math.abs(x);
      var H = Math.abs(y);
      rBox.top = y > 0 ? relativeStartY : pos.y;
      rBox.left = x > 0 ? relativeStartX : pos.x;
      box.style.top = rBox.top + "px";
      box.style.left = rBox.left + "px";

      if (
        (W > cfg.distance || H > cfg.distance) &&
        lastScrollTop === currentEl.scrollTop
      ) {
        e.preventDefault();
        if (!started) start(e);
        box.style.display = "block";
        rBox.right = rBox.left + W;
        rBox.bottom = rBox.top + H;
        box.style.width = W + "px";
        box.style.height = H + "px";
        cfg.ondraw.call(currentEl, e, select());
      }
    }
    function init(e) {
      if (this.isEqualNode(e.target || e.srcElement)) {
        lastScrollTop = currentEl.scrollTop;

        var pos = getPos(e);
        currentEl.appendChild(box);
        relativeStartX = pos.x;
        relativeStartY = pos.y;
        draw(e);
        on("mousemove", draw);
        on("touchmove", draw);
        on("mouseup", stop);
        on("touchend", stop);
        on("contextmenu", stop);
        cfg.oninit.call(currentEl, e, box);
      }
    }
    function stop(e) {
      off("mousemove", draw);
      off("touchmove", draw);
      off("mouseup", stop);
      off("touchend", stop);
      off("contextmenu", stop);
      cfg.onstop.call(currentEl, e, select());
      box.style.display = "none";
      currentEl.removeChild(box);
      started = false;
      lastScrollTop = currentEl.scrollTop;
    }

    el.addEventListener("mousedown", onmousedown, false);
    el.addEventListener("touchstart", onmousedown, false);

    return {
      destroy: function() {
        el.removeEventListener("mousedown", onmousedown, false);
        el.removeEventListener("touchstart", onmousedown, false);
      },
    };
  }
  $box.overlap = overlap;
  global.$box = $box;
})(this);

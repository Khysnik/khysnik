!(function(global) {
  "use strict";

  function flip(str, el, base) {
    str = str.replace(/([a-z]+)([+-])?/g, function(_, pos, off) {
      // http://regex101.com/r/iW2tI2/1
      return (
        (pos == "top"
          ? "bottom"
          : pos == "bottom"
            ? "top"
            : pos == "right"
              ? "left"
              : pos == "left"
                ? "right"
                : pos) + (off == "+" ? "-" : off == "-" ? "+" : "")
      );
      //( off || '')
    });
    return normalize(str, el, base);
  }

  function normalize(s, el, base) {
    //var out = base || {top: 0, left: 0}, h = el.scrollHeight || 0, w = el.offsetWidth || 0;
    var out = base || { top: 0, left: 0 },
      h = el.offsetHeight || 0,
      w = el.offsetWidth || 0;
    //console.log('h', h, el);
    s.replace(
      /(?:(right|left|center)(?:([+-])(\d+)(%)?)?)? ?(?:(top|bottom|center)(?:([+-])(\d+)(%)?)?)?/, // http://regex101.com/r/bJ1iJ3/1
      function(_, hori, opX, offsetX, xIsPer, vert, opY, offsetY, yIsPer) {
        if (!vert) vert = "center";
        if (!hori) hori = "center";
        if (hori == "right") out.left += w;
        if (hori == "center") out.left += w / 2;
        if (vert == "bottom") out.top += h;
        if (vert == "center") out.top += h / 2;
        if (xIsPer) offsetX = w / 100 * +offsetX;
        if (yIsPer) offsetY = h / 100 * +offsetY;
        if (offsetX) out.left = out.left - +(opX + offsetX);
        if (offsetY) out.top = out.top - +(opY + offsetY);
      }
    );
    return out;
  }

  function _pos(el, opt) {
    if (!el) throw new Error("$pos: element is undefined");

    el.style.position = "fixed";

    // seek the first postioned ancestor for a fixed element
    var isInScroller = false,
      parent = el.parentNode,
      parentStyle = window.getComputedStyle(parent, null),
      parentPos = { top: 0, left: 0 };
    while (
      parent.parentNode &&
      parent.parentNode.nodeType !== 9 &&
      parentStyle.transform == "none" &&
      parentStyle.perspective == "none"
    ) {
      if (parent.getAttribute("data-ui-menu-scroller")) isInScroller = parent;
      parent = parent.parentNode;
      parentStyle = window.getComputedStyle(parent, null);
    }
    parentPos = parent.getBoundingClientRect();

    var def = {
        my: "left top",
        at: "left bottom",
        of: {}, //{offsetHeight: 0, offsetWidth: 0}
        collision: "flip",
        within: window, //parent //null //window
        transform: false,
        overflow: "none",
      },
      cfg = $extend(def, opt),
      init,
      x,
      y,
      my = normalize(cfg.my, el),
      at = normalize(cfg.at, cfg.of),
      top = at.top - my.top - parentPos.top,
      left = at.left - my.left - parentPos.left,
      within = { x: 0, y: 0, h: 0, w: 0 };

    var withinPos = {};
    if ($io.isWindow(cfg.within) || !cfg.within) {
      within.h = window.innerHeight;
      within.w = window.innerWidth;
    } else {
      //if (isInScroller) cfg.within = isInScroller;
      //console.log(cfg.within.constructor.name);
      withinPos = cfg.within.getBoundingClientRect();
      within.x = withinPos.left;
      within.y = withinPos.top;
      within.h = cfg.within.offsetHeight;
      within.w = cfg.within.offsetWidth;
    }

    function adjustBigH() {
      var pos = cfg.of.getBoundingClientRect(),
        spaceUp = pos.top - within.y,
        sapceDown = within.h - spaceUp - cfg.of.offsetHeight,
        newH;
      if (el.parentNode.isEqualNode(cfg.of)) newH = within.h;
      else newH = spaceUp > sapceDown ? spaceUp : sapceDown;
      el.style.height = newH + "px";
      el.setAttribute("data-ui-menu-scroller", true);
    }
    if (el.offsetHeight > within.h) {
      adjustBigH();
    }

    var minX = parentPos.left == withinPos.left ? 0 : withinPos.left,
      minY = parentPos.top == withinPos.top ? 0 : withinPos.top,
      maxX = within.w - el.offsetWidth + minX,
      maxY = within.h - el.offsetHeight + minY;

    if (cfg.of.nodeType === 1) {
      var style = window.getComputedStyle(cfg.of, null),
        syleTr =
          style.transform ||
          style.webkitTransform ||
          style.MozTransform ||
          style.msTransform;
    }

    //console.log(syleTr);
    if (syleTr && syleTr != "none") {
      el.style.transformOrigin = style.transformOrigin;
      init = function() {
        var CX, CY, CLeft, CTop;
        if (parentPos.left == 0) {
          CX = withinPos.left;
          CY = withinPos.top;
          CLeft = left;
          CTop = top;
        } else {
          CX = 0;
          CY = 0;
          CLeft = left + withinPos.left;
          CTop = top + withinPos.top;
        }
        el.style.left = cfg.of.offsetLeft + CX + "px";
        el.style.top = cfg.of.offsetTop + CY + "px";
        el.style.transform =
          syleTr + " translateX(" + CLeft + "px) translateY(" + CTop + "px)";
      };
    } else if (cfg.collision == "fit") {
      init = function(x, y) {
        x += left;
        y += top;
        x = x > maxX ? maxX : x < minX ? minX : x;
        y = y > maxY ? maxY : y < minY ? minY : y;
        el.style.left = x + "px";
        el.style.top = y + "px";
      };
    } else if (cfg.collision == "flip" || cfg.collision == "flipfit") {
      var flipMy = flip(cfg.my, el),
        flipAt = flip(cfg.at, cfg.of),
        flipTop = flipAt.top - flipMy.top - parentPos.top,
        flipLeft = flipAt.left - flipMy.left - parentPos.left;
      init =
        cfg.collision == "flipfit"
          ? // flipfit
            function(x, y, X, Y) {
              x += left;
              y += top;
              if (x > maxX || x < minX) x = X + flipLeft;
              if (y > maxY || y < minY) y = Y + flipTop;
              x = x > maxX ? maxX : x < minX ? minX : x;
              y = y > maxY ? maxY : y < minY ? minY : y;
              el.style.left = x + "px";
              el.style.top = y + "px";
            }
          : // flip
            function(x, y, X, Y) {
              x += left;
              y += top;
              if (x > maxX || x < minX) x = X + flipLeft;
              if (y > maxY || y < minY) y = Y + flipTop;
              //console.log(y, maxY);
              el.style.left = x + "px";
              el.style.top = y + "px";
            };
    } else {
      init = function(x, y) {
        el.style.left = x + left + "px";
        el.style.top = y + top + "px";
      };
    }

    function update(e) {
      if (!e) e = cfg.of;
      if (e.nodeType === 1) {
        var ofPos = e.getBoundingClientRect();
        x = ofPos.left;
        y = ofPos.top;
      } else if (e.preventDefault) {
        x = e.pageX;
        y = e.pageY;
      }
      //console.log(x);
      //init(x, y, x, y);
      init(x, y, x, y);
    }

    // send cfg.of to update in case it's an mouse event
    update(cfg.of);

    return {
      update: update,
    };

    // use $pos().update() for better performances, eg:
    /////////////////////////////////////////////////////////////////////////////
    //
    //  var tooltip = $pos(document.getElementById('tooltip'), {
    //    my: 'left+10 top+20',
    //    collision: 'flipfit'
    //  });
    //
    //  document.addEventListener('mousemove', function(event) {
    //    tooltip.update(event)
    //  }, false);
    //
    /////////////////////////////////////////////////////////////////////////////
  }

  global.$pos = _pos;
})(this);

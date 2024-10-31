!(function(global) {
  "use strict";

  var fns = {},
    uid = 0,
    def = { debounce: 0, noscroll: false, handler: null, delay: 0 };

  function _wheel(el, fn, opt) {
    if (typeof el == "object" && !(el instanceof HTMLElement))
      return (def = el);

    var id = el,
      cfg = $extend({}, def, opt),
      delay = cfg.delayy,
      elHandler = cfg.handler,
      intervalID,
      delayID;

    if (el + "" === el) {
      el = document.getElementById(id);
      if (!el) el = document.querySelector(id);
    }
    if (!el) return;

    uid++;
    fns[uid] = fn;
    el.setAttribute("data-wheel-id", uid);

    var callDelta = function(e) {
      //var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      var delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;
      fns[uid].call(el, delta, e);
      return false;
    };

    if (cfg.acceleration) {
      var factor = 0;
      var forward = true;
      intervalID = setInterval(function() {
        factor -= factor * 0.1;
        if (factor < 0) {
          factor = 0;
        }
      }, cfg.acceleration);
      callDelta = function(e) {
        factor += 1;
        //var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        var delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail : 0;

        if (delta > 0) {
          if (forward === false) factor = 1;
          forward = true;
        } else {
          if (forward === true) factor = 1;
          forward = false;
        }
        fns[uid].call(el, delta, factor, e);
        return false;
      };
    }

    function handler(e) {
      // cross-browser wheel delta
      e = window.event || e;
      if (elHandler) {
        if (elHandler.isEqualNode(e.target)) {
          e.preventDefault();
          callDelta(e);
        }
      } else if (cfg.noscroll) {
        e.preventDefault();
        callDelta(e);
      } else {
        callDelta(e);
      }
    }

    if (cfg.throttle) handler = $io.fn.throttle(handler, cfg.throttle);
    if (cfg.debounce) handler = $io.fn.debounce(handler, cfg.debounce);

    function delayStart(e) {
      e.preventDefault();
      clearTimeout(delayID);
      delayID = setTimeout(function() {
        start();
      }, delay);
    }
    function delayStop(e) {
      e.preventDefault();
      stop();
      clearTimeout(delayID);
    }

    el.addEventListener("mouseenter", delay ? delayStart : start, false);
    el.addEventListener("mouseleave", delay ? delayStop : stop, false);

    function start() {
      el.addEventListener("mousewheel", handler, false);
      el.addEventListener("DOMMouseScroll", handler, false);
    }
    function stop() {
      el.removeEventListener("mousewheel", handler, false);
      el.removeEventListener("DOMMouseScroll", handler, false);
    }

    return {
      destroy: function() {
        el.removeEventListener("mouseenter", delay ? delayStart : start, false);
        el.removeEventListener("mouseleave", delay ? delayStop : stop, false);
        // ?
        clearTimeout(delayID);
        clearInterval(intervalID);
        var id = el.getAttribute("data-wheel-id");
        if (id && fns[id]) delete fns[id];
        el.removeEventListener("mousewheel", handler, false);
        el.removeEventListener("DOMMouseScroll", handler, false);
        console.log("$wheel destroy : ", el.getAttribute("data-wheel-id"));
      },
    };
  }

  _wheel.scale = function(el, opt) {
    var cfg = $extend(
      {
        negatif: false,
      },
      opt
    );
    el.scaleX = 1;
    el.scaleY = 1;

    var W = el.offsetWidth;
    var H = el.offsetHeight;

    var wheelInst = _wheel(el, function(dt, e) {
      var currentScaleX = this.scaleX;
      var currentScaleY = this.scaleY;
      //this.scaleX += dt/10
      //this.scaleY += dt/10
      if (dt > 0) {
        this.scaleX += this.scaleX * 0.1;
        this.scaleY += this.scaleY * 0.1;
      } else {
        this.scaleX -= this.scaleX * 0.1;
        this.scaleY -= this.scaleY * 0.1;
      }
      //console.log('???', this.scaleY)
      if (cfg.negatif) {
        if (this.scaleX < 0.1) this.scaleX = 0.1;
        if (this.scaleY < 0.1) this.scaleY = 0.1;
      } else {
        if (this.scaleX < 1) this.scaleX = 1;
        if (this.scaleY < 1) this.scaleY = 1;
      }
      this.style.width = W * this.scaleX + "px";
      this.style.height = H * this.scaleY + "px";
      var factorX = 1 - this.scaleX / currentScaleX;
      var factorY = 1 - this.scaleY / currentScaleY;
      var left = this.offsetLeft;
      var top = this.offsetTop;
      left += (e.clientX - this.offsetLeft) * factorX;
      top += (e.clientY - this.offsetTop) * factorY;

      this.style.top = top + "px";
      this.style.left = left + "px";
    });

    return {
      destroy: function() {
        wheelInst.destroy();
        delete el.scaleW;
        delete el.scaleH;
      },
    };
  };

  global.$wheel = _wheel;
})(this);

// @todo timeout for noscroll

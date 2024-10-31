!(function(global) {
  "use strict";
  var _scroll = {
    to: function(el, anchor) {
      if (typeof el === "string") el = document.querySelector(el);
      if (typeof anchor === "string") anchor = el.querySelector(anchor);
      if (el && anchor) {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTop = anchor.offsetTop - el.clientHeight / 2;
        }
        if (el.scrollWidth > el.clientWidth) {
          el.scrollLeft =
            anchor.offsetLeft -
            (el.clientWidth / 2 +
              (anchor.offsetWidth + anchor.offsetWidth / 2));
        }
      }
    },
  };
  global.$scroll = _scroll;
})(this);

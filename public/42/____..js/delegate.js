!(function(global) {
  "use strict";

  // thanks : github.com/ftlabs/ftdomdelegate.git

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

  function _delegate(selector, fn) {
    return function(e) {
      var targ = e.target;
      while (targ && targ.nodeType === 1 && !targ.matches(selector))
        targ = targ.parentNode;
      if (!targ || targ.nodeType !== 1) return false;
      fn.call(targ, e);
    };
  }

  _delegate.get = function(e, selector) {
    var targ = e.target;
    while (targ && targ.nodeType === 1 && !targ.matches(selector))
      targ = targ.parentNode;
    if (!targ || targ.nodeType !== 1) return false;
    return targ;
  };

  global.$delegate = _delegate;
})(this);

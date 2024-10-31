!(function(global) {
  "use strict";

  var fn;

  window.addEventListener("popstate", function(e) {
    e.preventDefault();
    _nav.silent(location.href);
  });

  var baseURL = location.origin + "/";

  var _nav = function(url) {
    if (typeof url === "function") {
      fn = url;
      _nav.silent(location.href);
    } else {
      //if (url.indexOf(baseURL) === -1) url = baseURL + url;
      //history.pushState(null, null, url);
      //fn(url)
      _nav.display(url);
      _nav.silent(url);
    }
  };
  _nav.display = function(url) {
    if (url.indexOf(baseURL) === -1) url = baseURL + url;
    history.pushState(null, null, url);
  };
  _nav.silent = function(url) {
    fn(url);
  };
  _nav.baseURL = function(base) {
    baseURL = location.origin + base;
  };

  global.$nav = _nav;
})(this);

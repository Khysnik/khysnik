!(function(global) {
  "use strict";

  // thanks : https://github.com/jgallen23/aug

  var _hasOwnProperty = Object.prototype.hasOwnProperty,
    _slice = Array.prototype.slice,
    _toString = Object.prototype.toString;

  var isArray = Array.isArray
    ? Array.isArray
    : function(val) {
        return (
          (val &&
            typeof val == "object" &&
            typeof val.length == "number" &&
            _toString.call(val) == "[object Array]") ||
          false
        );
      };

  function _extend(deep) {
    var args,
      res,
      i,
      l,
      concat = false;
    if (typeof deep == "boolean" || typeof deep == "string") {
      args = _slice.call(arguments, 1);
      deep = deep === true ? "deep" : deep;
    } else {
      args = arguments;
      deep = false;
    }
    if (deep === "concat") {
      deep = "deep";
      concat = true;
    }
    res = args[0];
    for (i = 1, l = args.length; i < l; i++) {
      var o = args[i];
      for (var key in o) {
        var val = o[key];
        if (deep == "strict" && !_hasOwnProperty.call(res, key)) continue;
        if (deep == "deep" && _toString.call(val) === "[object Object]") {
          if (_toString.call(res[key]) !== "[object Object]") res[key] = {};
          _extend(deep, res[key], val);
          continue;
        }
        if (concat && isArray(val)) {
          if (!isArray(res[key])) res[key] = [].concat(val);
          else {
            res[key] = res[key].concat(val);
          }
          continue;
        }
        res[key] = val;
      }
    }
    return res;
  }

  _extend.deep = function() {
    return _extend.apply(this, ["deep"].concat(_slice.call(arguments)));
  };
  _extend.strict = function() {
    return _extend.apply(this, ["strict"].concat(_slice.call(arguments)));
  };
  _extend.clone = function() {
    return _extend.apply(this, ["deep", {}].concat(_slice.call(arguments)));
  };

  global.$extend = _extend;
})(this);

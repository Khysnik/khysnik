function $chain() {
  "use strict";
  function _prop(obj, item, key) {
    Object.defineProperty(obj, key, {
      get: function() {
        var out = item();
        return out === undefined ? this : out;
      },
    });
  }
  function _meth(obj, item, key) {
    obj[key] = function() {
      var out = item.apply(this, arguments);
      return out === undefined ? this : out;
    };
  }
  function _chain(obj, methods, isProp) {
    if ($io.isObject(methods)) {
      $io.obj.all(methods, function(item, key) {
        if (isProp === true) _prop(obj, item, key);
        else _meth(obj, item, key);
        if (isProp === "both") {
          _prop(obj, item, key);
          _meth(obj, item, key);
        }
      });
    }
    return $io.isObject(isProp) ? _chain(obj, isProp, true) : obj;
  }
  var out = _chain.apply(null, arguments);
  out["prop"] = function(p) {
    return _chain(this, p, true);
  };
  out["meth"] = function(m) {
    return _chain(this, m);
  };
  //console.log(out);
  return out;

  /*tests
  $chain($chain($log, props, true), methods);
  $chain($log).meth(methods).prop(props);
  $chain($log, methods, props);
  */
}

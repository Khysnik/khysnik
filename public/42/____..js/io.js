!(function(global) {
  "use strict";

  // io['input']['output'](input) // => output
  // io['input']['output']?['how']?(input) // => output

  // https://github.com/Cedriking/is.js

  var _toString = Object.prototype.toString,
    _fnToString = Function.prototype.toString,
    _hasOwnProperty = Object.prototype.hasOwnProperty,
    _slice = Array.prototype.slice,
    _io = {};

  _io.onerror = function(e) {
    console.log("$io error : ", e);
  };

  function getType(val) {
    return _toString.call(val).slice(8, -1);
  }
  _io.type = getType;

  /*
    88 .dP"Y8
    88 `Ybo."
    88 o.`Y8b
    88 8bodP'
  */
  /////////////////////////////////////////////////////////////////////////////
  var isArray = isNative(Array.isArray)
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

  function isArrayLike(val) {
    return (typeof val == "object" && typeof val.length == "number") || false;
  }

  function isString(val) {
    return typeof val == "string" || false;
  }

  function isFunction(val) {
    return typeof val == "function" || false;
  }

  function isObject(val) {
    return val && (typeof val !== "object" || val === null)
      ? false
      : _toString.call(val) == "[object Object]";
  }

  function isNumber(val) {
    return (typeof val == "number" && isFinite(val)) || false;
  }

  function isRegExp(value) {
    return (
      (value &&
        typeof value == "object" &&
        _toString.call(value) == "[object RegExp]") ||
      false
    );
  }

  function isArguments(val) {
    return (
      (val &&
        (typeof val.length == "number" &&
          _toString.call(val) == "[object Arguments]")) ||
      false
    );
  }

  function isNative(val) {
    return isFunction(val) && ("" + val).indexOf("[native code]") >= 0;
  }

  function isError(val) {
    return (
      (val &&
        typeof val == "object" &&
        _toString.call(val) == "[object Error]") ||
      false
    );
  }

  function isPrototype(val) {
    var c;
    return (
      val &&
      (c = val.constructor) &&
      typeof c == "function" &&
      c.prototype == val
    );
  }

  function isElement(val) {
    return (val && val.nodeType === 1) || false;
  }

  function isReallyNaN(val) {
    return _toString.call(val) == "[object Number]" && val != +val;
  }

  function isInfinity(val) {
    return _toString.call(val) == "[object Number]" && !isFinite(val);
  }

  function isWindow(val) {
    var t = _toString.call(val);
    return (
      t == "[object global]" ||
      t == "[object Window]" ||
      t == "[object DOMWindow]"
    );
  }

  function isDocument(val) {
    var t = _toString.call(val);
    return t == "[object HTMLDocument]" || t == "[object Document]";
  }

  function isNodeList(val) {
    var t = _toString.call(val);
    return (
      typeof val === "object" &&
      (t == "[object HTMLCollection]" ||
        t == "[object NodeList]" ||
        (t == "[object Object]" &&
          val.hasOwnProperty("length") &&
          (val.length === 0 ||
            (typeof val[0] === "object" && val[0].nodeType > 0))))
    );
  }

  // check if we can correctly use JSON stringify
  function isJSON(val) {
    var ok = false;
    if (
      isString(val) ||
      isNumber(val) ||
      typeof val === "boolean" ||
      val === null ||
      val === undefined
    ) {
      ok = true;
    } else if (isArray(val)) {
      arrEach(val, function(item) {
        return (ok = isJSON(item));
      });
    } else if (isObject(val)) {
      objEach(val, function(item) {
        return (ok = isJSON(item));
      });
    }
    return ok;
  }

  function is(val) {
    var istypeof = typeof val;
    return istypeof == "string"
      ? "String"
      : istypeof == "boolean"
        ? "Boolean"
        : istypeof == "function" || false
          ? "Function" // https://github.com/jashkenas/underscore/issues/1621
          : val === null
            ? "Null"
            : val === undefined
              ? "Undefined"
              : isNumber(val)
                ? "Number"
                : isReallyNaN(val)
                  ? "NaN"
                  : isElement(val)
                    ? "Element" // should use _toString.call once
                    : isArray(val)
                      ? "Array"
                      : isArguments(val)
                        ? "Arguments"
                        : isInfinity(val)
                          ? "Infinity"
                          : isError(val)
                            ? "Error"
                            : isNodeList(val)
                              ? "NodeList"
                              : isWindow(val)
                                ? "Window"
                                : isDocument(val)
                                  ? "Document"
                                  : val.constructor.name ||
                                    _toString.call(val).slice(8, -1);
  }
  _io.is = is;

  _io.is.arr = _io.is.Array = _io.isArray = isArray;
  _io.is.str = _io.is.String = _io.isString = isString;
  _io.is.fun = _io.is.Function = _io.isFunction = isFunction;
  _io.is.obj = _io.is.Object = _io.isObject = isObject;
  _io.is.num = _io.is.Number = _io.isNumber = isNumber;
  _io.is.reg = _io.is.RegExp = _io.isRegExp = isRegExp;
  _io.is.arg = _io.is.Arguments = _io.isArguments = isArguments;
  _io.is.inf = _io.is.Infinity = _io.isInfinity = isInfinity;
  _io.is.nan = _io.is.NaN = _io.isReallyNaN = isReallyNaN;
  _io.is.nat = _io.is.Native = _io.isNative = isNative;
  _io.is.err = _io.is.Error = _io.isError = isError;
  _io.is.pro = _io.is.Prototype = _io.isPrototype = isPrototype;
  _io.is.ele = _io.is.Element = _io.isElement = isElement;
  _io.is.win = _io.is.Window = _io.isWindow = isWindow;
  _io.is.doc = _io.is.Document = _io.isDocument = isDocument;
  _io.is.nodelist = _io.isNodeList = isNodeList;
  _io.is.json = _io.isJSON = isJSON;
  /////////////////////////////////////////////////////////////////////////////

  // Equal for RegExp, NaN, Function...
  function nativeEqual(a, b) {
    if (typeof a === typeof b && a + "" === b + "") return true;
  }

  /*
     dP"Yb  88""Yb  88888
    dP   Yb 88__dP     88
    Yb   dP 88""Yb o.  88
     YbodP  88oodP "bodP'
  */
  /////////////////////////////////////////////////////////////////////////////
  function keys(obj) {
    return !obj ? [] : Object.keys(obj);
  }

  function objEqual(a, b) {
    // thanks : http://stackoverflow.com/a/14853974/1289275
    var prop, aI, bI;
    for (prop in a) {
      aI = a[prop];
      bI = b[prop];
      if (a.hasOwnProperty(prop) != b.hasOwnProperty(prop)) return false;
      if (typeof aI != typeof bI) return false;
    }
    for (prop in b) {
      aI = a[prop];
      bI = b[prop];
      if (!a.hasOwnProperty(prop)) return false;
      if (aI === bI) continue;
      //if (isReallyNaN(aI) && isReallyNaN(bI)) continue;
      if (typeof aI != typeof bI) return false;
      //If the property is inherited, do not check any more (it must be equa! if both objects inherit it)
      if (!b.hasOwnProperty(prop)) continue;
      else if (isArrayLike(aI) && isArrayLike(bI) && arrEqual(aI, bI)) continue;
      else if (isObject(aI) && isObject(bI) && objEqual(aI, bI)) continue;
      else if (nativeEqual(aI, bI)) continue;
      return false;
    }
    return true;
  }

  function objAll(obj, cb) {
    var prop;
    for (prop in obj) if (obj.hasOwnProperty(prop)) cb(obj[prop], prop);
  }

  function objEach(obj, cb) {
    var prop;
    for (prop in obj)
      if (obj.hasOwnProperty(prop)) {
        if (cb(obj[prop], prop) === false) break;
      }
  }

  function obj2str(obj) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (_) {
      //console.log('???', _);
      try {
        var res = [];
        $io.arr.all(obj, function(i) {
          res.push(i);
        }); // _slice ?
        return "[" + res.join(", ") + "]";
      } catch (e) {
        //console.log(e);
        return "[Error]";
      }
    }
  }

  // https://github.com/watson/flatten-obj/blob/master/index.js
  function flatten(obj, sep, blacklist) {
    var isBlacklisted = function(obj) {
      return false;
      /*blacklist.some(function (type) {
              return obj instanceof type;
            });*/
    };

    var result = {};

    (function iterator(obj, prefix) {
      var n = 0;
      var keys = Object.keys(obj);
      var len = keys.length;
      var key, val;

      for (; n < len; n++) {
        key = keys[n];
        val = obj[key];

        if (isObject(val) && !isBlacklisted(val)) {
          iterator(val, prefix + key + (sep || "."));
          continue;
        }

        result[prefix + key] = val;
      }
    })(obj, "");

    return result;
  }

  /*function setPath(obj, str, sep) {
    sep = sep || '.';
    if (!str || str === sep) return obj;
    var
      i = 0,
      e = $io.reg.escape(sep),
      re = new RegExp('^'+e+'|'+e+'$', 'gi'),
      res
    ;
    str = str.replace(re, '').split(sep);
    while (obj && i < str.length) {
      if (obj[str[i]]) {
        obj = obj[str[i]]
      } else {
        obj = obj[str[i]] = {};
      }
      i++;
    }
    return obj
  }*/
  function getPath(obj, str, sep) {
    if (typeof str === "string") {
      sep = sep || ".";
      if (!str || str === sep) return obj;
      var i = 0,
        e = $io.reg.escape(sep),
        re = new RegExp("^" + e + "|" + e + "$", "gi"),
        res;
      str = str.replace(re, "").split(sep);
      while (obj && i < str.length) obj = obj[str[i++]];
      return obj;
    } else if (isRegExp(str)) {
      var flatObj = flatten(obj, sep),
        out = {};
      //console.log(flatObj);
      $io.arr.all(Object.keys(flatObj), function(item) {
        if (str.test(item)) out[item] = flatObj[item];
      });
      return out;
      //console.log('hourra', out);
    }
  }

  function path(obj, str, val) {
    var sep = typeof this === "string" ? this : ".";
    if (!str || str === sep) return obj;
    var i = 0,
      e = $io.reg.escape(sep),
      re = new RegExp("^" + e + "|" + e + "$", "gi"),
      res;
    str = str.replace(re, "").split(sep);
    while (obj && i < str.length) {
      if (obj[str[i]] !== undefined) {
        if (i === str.length - 1 && arguments.length > 2) {
          obj = obj[str[i]] = val;
        } else {
          obj = obj[str[i]];
        }
      } else if (arguments.length > 2) {
        obj = obj[str[i]] = i === str.length - 1 ? val : {};
      } else {
        obj = undefined;
      }
      i++;
    }
    return obj;
  }
  _io.obj = _io.Object = {};
  _io.obj.all = objAll;
  _io.obj.each = objEach;
  _io.obj.equal = objEqual;
  _io.obj.stringify = obj2str;
  _io.obj.getPath = getPath;
  //_io.obj.setPath = setPath;
  _io.obj.path = path;
  _io.obj.flatten = flatten;
  _io.obj.clear = function(obj) {
    for (var prop in obj) if (obj.hasOwnProperty(prop)) delete obj[prop];
    return obj;
  };
  _io.obj.isEmpty = function(obj) {
    for (var prop in obj) if (obj.hasOwnProperty(prop)) return false;
    return true;
  };
  /////////////////////////////////////////////////////////////////////////////

  /*
       db    88""Yb 88""Yb
      dPYb   88__dP 88__dP
     dP__Yb  88"Yb  88"Yb
    dP""""Yb 88  Yb 88  Yb
  */
  /////////////////////////////////////////////////////////////////////////////
  function arrEqual(a, b) {
    var i = a.length,
      aI,
      bI;
    if (i != b.length) return false;
    while (i--) {
      aI = a[i];
      bI = b[i];
      if (aI === bI) continue;
      //if (isReallyNaN(aI) && isReallyNaN(bI)) continue;
      else if (isArrayLike(aI) && isArrayLike(bI) && arrEqual(aI, bI)) continue;
      else if (isObject(aI) && isObject(bI) && objEqual(aI, bI)) continue;
      else if (nativeEqual(aI, bI)) continue;
      return false;
    }
    return true;
  }

  function arrAll(arr, cb) {
    if (!arr) return;
    var i = -1,
      l = arr.length;
    while (++i < l) cb(arr[i]);
  }

  function arrEach(arr, cb) {
    if (!arr) return;
    var i = -1,
      l = arr.length;
    while (++i < l) if (cb(arr[i], i, arr) === false) break;
  }

  function arrReduce(arr, cb, val) {
    var rval = val;
    for (var i = 0, l = arr.length; i < l; i++) rval = cb(rval, arr[i], i, arr);
    return rval;
  }

  function arrRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function arrInsert(a1, a2, index) {
    a1.splice.apply(a1, [index, 0].concat(a2));
    return a1;
  }

  function arrLimit(arr, limit, push) {
    arr.push(push);
    if (arr.length > limit) arr.shift();
    return arr;
  }

  function arr2str(arr) {
    var out = "[";
    for (var i = 0, l = arr.length; i < l; i++) {
      if (typeof arr[i] === "string")
        out += '"' + arr[i].replace(/"/g, '\\"') + '"';
      //else if (typeof arr[i] === 'number') out += arr[i];
      //else if (arr[i] === undefined) out += 'undefined';
      //else if (arr[i] === null) out += 'null';
      //else if (arr[i] === true) out += 'true';
      //else if (arr[i] === false) out += 'false';
      else if (_io.isArray(arr[i])) out += arr2str(arr[i]);
      else out += arr[i];

      if (i < l - 1) out += ", ";
    }
    out += "]";
    return out;
  }

  // Array Remove - By John Resig (MIT Licensed)
  function arrRemove(arr, from, to) {
    var rest = arr.slice((to || from) + 1 || arr.length);
    arr.length = from < 0 ? arr.length + from : from;
    return arr.push.apply(arr, rest);
  }

  // https://stackoverflow.com/a/6274381/1289275
  function arrShuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }

  _io.arr = _io.Array = {};
  _io.arr.stringify = arr2str;
  _io.arr.all = arrAll;
  _io.arr.each = arrEach;
  _io.arr.equal = arrEqual;
  _io.arr.reduce = arrReduce;
  _io.arr.random = arrRandom;
  _io.arr.shuffle = arrShuffle;
  _io.arr.insert = arrInsert;
  _io.arr.limit = arrLimit;
  _io.arr.remove = arrRemove;

  _io.arr.move = function(arr, item, n) {
    var index = arr.indexOf(item);
    if (index === -1) return;
    var replaced = arr.splice(index, 1);
    var n = index + n > 0 ? index + n : 0;
    if (replaced.length) arr.splice(n, 0, replaced[0]);
  };

  _io.arr.up = function(arr, item) {
    var index = arr.indexOf(item);
    if (index === -1 || index === arr.length - 1) return;
    var replaced = arr.splice(index + 1, 1, item);
    if (replaced.length) arr.splice(index, 1, replaced[0]);
  };

  _io.arr.down = function(arr, item) {
    var index = arr.indexOf(item);
    if (index <= 0) return;
    var replaced = arr.splice(index - 1, 1, item);
    if (replaced.length) arr.splice(index, 1, replaced[0]);
  };

  _io.arr.bottom = function(arr, item) {
    var index = arr.indexOf(item);
    if (index <= 0) return;
    var replaced = arr.splice(index, 1);
    if (replaced.length) arr.unshift(replaced[0]);
  };

  _io.arr.top = function(arr, item) {
    var index = arr.indexOf(item);
    if (index === -1 || index === arr.length - 1) return;
    var replaced = arr.splice(index, 1);
    if (replaced.length) arr.push(replaced[0]);
  };
  /////////////////////////////////////////////////////////////////////////////

  /*
    888888 88b 88 88   88 8b    d8
    88__   88Yb88 88   88 88b  d88
    88""   88 Y88 Y8   8P 88YbdP88
    888888 88  Y8 `YbodP' 88 YY 88
  */

  _io.arr.enum = function(list, cb) {
    var done,
      progress,
      $,
      nb = 0,
      total = 0;

    if (list.length === 0 || (list.length === 1 && list[0].length === 0)) {
      setImmediate(function() {
        if (typeof done === "function") done();
      });
    }

    function check() {
      if (--nb === 0 && typeof done === "function") done();
      if (typeof progress === "function")
        progress(100 - nb / total * 100, nb, total);
    }

    $io.arr.each(list, function(item, listIndex) {
      total += item.length;
      $io.arr.each(item, function(val, key) {
        nb++;
        setImmediate(function() {
          cb.call(
            {
              list: listIndex,
              index: nb,
            },
            val,
            key,
            check
          );
        });
      });
    });

    return ($ = {
      progress: function(cb) {
        progress = cb;
        return $;
      },
      done: function(cb) {
        done = cb;
        return $;
      },
    });
  };

  _io.enum = function(list, cb, done) {
    if (list.length === 0 || (list.length === 1 && list[0].length === 0))
      done();
    var nb = 0;

    function check(by) {
      if (--nb === 0) done();
      //console.log(nb, by);
    }
    $io.arr.each(list, function(item, listIndex) {
      var type = $io.is(item);
      //console.log(type);
      if (type === "Array" || type === "Object") {
        $io[type].each(item, function(val, key) {
          nb++;
          setImmediate(function() {
            cb.call(
              {
                list: listIndex,
                index: nb,
              },
              val,
              key,
              check
            );
          });
        });
      } else if (type === "Function") {
        nb++;
        setImmediate(function() {
          item.call(
            {
              list: listIndex,
              index: nb,
            },
            check
          );
        });
      } else {
        nb++;
        setImmediate(function() {
          cb.call(
            {
              list: listIndex,
              index: nb,
            },
            item,
            listIndex,
            check
          );
        });
      }
    });
  };

  /*
    .dP"Y8 888888 88""Yb
    `Ybo."   88   88__dP
    o.`Y8b   88   88"Yb
    8bodP'   88   88  Yb
  */
  /////////////////////////////////////////////////////////////////////////////
  _io.str = _io.String = {};
  _io.str.insertAt = function(str, cha, i) {
    return str.substr(0, i) + cha + str.substr(i + cha.length);
  };
  _io.str.replaceAt = function(str, chain1, chain2, i) {
    //var l = chain1.length > chain2.length ? chain1.length : chain2.length
    return str.substr(0, i) + chain2 + str.substr(i + chain1.length);
  };

  _io.str.truncate = function(str, num) {
    //return str.length > num ? str.slice(0, num) + '&hellip;' : str;
    return str.length > num ? str.slice(0, num) + "..." : str;
  };
  _io.str.slug = function(str) {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^-\w]/g, "");
  };
  _io.str.trim = function(str) {
    // thanks : http://jsperf.com/mega-trim-test/41
    var i, j;
    for (i = 0, j = str.length - 1; i <= j; i++) {
      if (str.charCodeAt(i) < 33) continue;
      else break;
    }
    for (; j >= i; j--) {
      if (str.charCodeAt(j) < 33) continue;
      else break;
    }
    return str.substring(i, j + 1);
  };
  // https://gist.github.com/minardimedia/3610889
  _io.str.camel = function(str) {
    // thanks : http://jsperf.com/mega-trim-test/41
    return str.replace(/(\-[a-z])/g, function(a) {
      return a.toUpperCase().replace("-", "");
    });
  };
  _io.str.dash = function(str) {
    // thanks : http://jsperf.com/mega-trim-test/41
    return str.replace(/([A-Z])/g, function(a) {
      return "-" + a.toLowerCase();
    });
  };
  _io.str.capitalise = function(str) {
    // thanks : http://jsperf.com/mega-trim-test/41
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  _io.str.htmlEscape = function(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };
  /////////////////////////////////////////////////////////////////////////////

  /*
    888888 88b 88
    88__   88Yb88
    88""   88 Y88
    88     88  Y8
  */
  /////////////////////////////////////////////////////////////////////////////
  function fn2str(fn, cb) {
    return !fn || typeof fn != "function" ? "_not_a_function_" : cb(fn);
  }
  // thanks : https://github.com/visionmedia/mocha-
  function fnStr(fn, isInner) {
    return fn2str(fn, function() {
      var begin = isInner ? /^function[\W\w]*?{/ : null,
        end = isInner ? /\s*\}$/ : null,
        str = fn
          .toString()
          .replace(begin, "")
          .replace(end, ""),
        indents = str.match(/(^\s*)/gm),
        indent = indents
          ? indents.length > 1
            ? indents.slice(1).reduce(function(a, b) {
                return a.length < b.length ? a : b;
              })
            : indents[0]
          : "";
      //return _io.str.trim(str.replace(new RegExp('^' + str.match(indent), 'gm'), '').replace(/^\t/gm, '  '));
      return _io.str.trim(
        str.replace(new RegExp("^" + str.match(indent), "gm"), "")
      );
    });
  }
  // thanks : https://gist.github.com/dfkaye/6384439
  function fnName(fn) {
    if (fn.name) return fn.name;
    return fn2str(fn, function() {
      var n = fn.toString().match(/^\s*function ([^\(\s]+)/);
      return (n && n[1]) || "anonymous";
    });
  }
  // thanks : http://stackoverflow.com/a/9924463
  function fnArg(fn) {
    if (!fn.length) return [];
    return fn2str(fn, function() {
      var str = fn.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, ""), // remove comments
        result = str
          .slice(str.indexOf("(") + 1, str.indexOf(")"))
          .match(/([^\s,]+)/g);
      return result === null ? [] : result;
    });
  }
  _io.fn = {};
  _io.fn.str = fnStr;
  _io.fn.outer = fnStr; // no "boolean trap" version
  _io.fn.inner = function(fn) {
    // => the function inner string
    return fnStr(fn, true);
  };
  _io.fn.name = fnName;
  _io.fn.arg = fnArg;
  _io.fn.prop = _io.fn.keys = function(fn) {
    return !fn ? [] : Object.keys(fn);
  };
  _io.fn.method = _io.fn.meth = function(fn) {
    var arr = Object.keys(fn),
      i = -1,
      l = arr.length,
      out = {};
    while (++i < l) out[arr[i]] = fn[arr[i]];
    return out;
  };

  // thanks : https://gist.github.com/micho/728639#comment-1000535
  _io.fn.throttle = function(fn, wait) {
    wait = wait > 0 ? wait : 100;
    var timeout;
    return function() {
      var args = arguments;
      var context = this;
      if (!timeout) {
        timeout = setTimeout(function() {
          timeout = 0;
          return fn.apply(context, args);
        }, wait);
      }
    };
  };
  _io.fn.debounce = function(fn, wait) {
    wait = wait > 0 ? wait : 100;
    var id, that, arg;
    return function() {
      that = this;
      arg = _slice.call(arguments, 0);
      clearTimeout(id);
      id = setTimeout(function() {
        fn.apply(that, arg);
      }, wait);
    };
  };
  _io.fn.leading = function(fn, wait) {
    wait = wait > 0 ? wait : 100;
    var id, that, arg;
    return function() {
      that = this;
      arg = _slice.call(arguments, 0);
      if (!id) fn.apply(that, arg);
      clearTimeout(id);
      id = setTimeout(function() {
        fn.apply(that, arg);
      }, wait);
    };
  };

  var queue = [];
  var timerID;
  function x(wait) {
    timerID = setTimeout(function() {
      var fn = queue.pop();
      fn[0]();
      if (queue.length) x(fn[1]);
    }, wait);
  }
  _io.fn.queue = function(fn, wait) {
    wait = wait || 10;
    queue.push([fn, wait]);
    clearTimeout(timerID);
    x(wait);
  };

  _io.fn.proxy = function(fn, action) {
    var proxied = fn;
    return function() {
      if (action.apply(this, arguments) !== false)
        proxied.apply(this, arguments);
    };
  };
  /////////////////////////////////////////////////////////////////////////////

  /*
       db    88""Yb  dP""b8
      dPYb   88__dP dP   `"
     dP__Yb  88"Yb  Yb  "88
    dP""""Yb 88  Yb  YboodP
  */
  /////////////////////////////////////////////////////////////////////////////
  function arg2arr(val) {
    // @todo : is array like ?
    return _slice.call(val);
  }
  _io.arg = {};
  _io.arg.arr = arg2arr;
  /////////////////////////////////////////////////////////////////////////////

  /*
    88""Yb 888888  dP""b8
    88__dP 88__   dP   `"
    88"Yb  88""   Yb  "88
    88  Yb 888888  YboodP
  */
  /////////////////////////////////////////////////////////////////////////////
  _io.reg = {};
  _io.reg.escape = function(str) {
    return str.replace(/[-[\]{}()*+?.\\\/^$|]/g, "\\$&");
  };
  /////////////////////////////////////////////////////////////////////////////

  /*
    Yb  dP 8b    d8 88
     YbdP  88b  d88 88
     dPYb  88YbdP88 88  .o
    dP  Yb 88 YY 88 88ood8
  */

  /////////////////////////////////////////////////////////////////////////////
  _io.xml = {};
  _io.xml.parse = function(str) {
    // http://stackoverflow.com/a/18538368
    var xml;
    if (window.DOMParser) {
      // Standard
      xml = new DOMParser().parseFromString(str, "text/xml");
    } else {
      // IE
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = "false";
      xml.loadXML(str);
    }
    return xml;
  };
  /////////////////////////////////////////////////////////////////////////////

  /*
     dP""b8 88      dP"Yb  88""Yb    db    88
    dP   `" 88     dP   Yb 88__dP   dPYb   88
    Yb  "88 88  .o Yb   dP 88""Yb  dP__Yb  88  .o
     YboodP 88ood8  YbodP  88oodP dP""""Yb 88ood8
  */
  /////////////////////////////////////////////////////////////////////////////
  _io.equal = function(a, b) {
    //console.log(typeof a, typeof b, a+'' === b+'');
    if (a === b) {
      return true;
    } else if (isArrayLike(a)) {
    /*else if (isReallyNaN(a) && isReallyNaN(b)) {
         return true;
       } */
      return arrEqual(a, b);
    } else if (isObject(a)) {
      return objEqual(a, b);
    } else if (nativeEqual(a, b)) {
      return true;
    }
    return false;
  };
  _io.each = function(collec, cb, thisArg) {
    if (collec) {
      if (isObject(collec)) {
        for (var i in collec) {
          if (_hasOwnProperty.call(collec, i)) {
            if (cb.call(thisArg, collec[i], i, collec) === false) break;
          }
        }
      } else {
        for (var i = 0, l = collec.length; i < l; i++) {
          if (cb.call(thisArg, collec[i], i, collec) === false) break;
        }
      }
    }
  };
  _io.map = function(collec, cb, deep, path, sep, blacklist) {
    var res = [];

    _io.each(collec, function(val, i, collec) {
      if (blacklist && blacklist.indexOf(i) > -1) return;
      if (deep && (isArray(val) || isObject(val))) {
        res = res.concat(
          _io.map(
            val,
            cb,
            deep,
            (path ? path + (sep || ".") : "") + i,
            sep,
            blacklist
          )
        );
      } else {
        var req = cb(val, i, collec, path);
        if (req) res.push(req);
      }
    });
    return res;
  };
  _io.find = function(what, path, obj, sep, blacklist) {
    var SEP = sep || ".",
      where = _io.obj.getPath(obj, path, SEP),
      reg;
    if (path.slice(-1) !== SEP) path = path + SEP;
    if (path.slice(0, 1) !== SEP) path = SEP + path;

    what.replace(/^\/(.*)\/(.{0,4})$/, function(_, source, flag) {
      if (source) what = flag ? new RegExp(source, flag) : new RegExp(source);
    });

    reg = _io.isRegExp(what) ? what : new RegExp(_io.reg.escape(what), "i");

    return _io.map(
      where,
      function(val, key, obj, folder) {
        //if (blacklist && blacklist.indexOf(key) > -1) return false;
        var lookIn = (folder ? folder + SEP : "") + key;
        return reg.test(lookIn) ? path + lookIn : false;
      },
      true,
      null,
      SEP,
      blacklist
    );

    // https://github.com/kriskowal/narwhal/blob/7eef0ee254993cebd7d8a046a87d547e6217ff52/lib/file.js#L240
    // https://github.com/isaacs/node-glob
    //.split(',').join('|')
    //.replace(/\*\*/g, '.*?')
    //.replace(/\*/g, '[^/]*')
    //.replace(/\?/g, '[^/]')
    //.replace(/\.\.\.\//, '(?:../)*')
  };

  /*
     dP""b8  dP"Yb  88b 88 Yb    dP 888888 88""Yb 888888
    dP   `" dP   Yb 88Yb88  Yb  dP  88__   88__dP   88
    Yb      Yb   dP 88 Y88   YbdP   88""   88"Yb    88
     YboodP  YbodP  88  Y8    YP    888888 88  Yb   88
  */

  function readWithFileReader(type, val, cb) {
    var $reader = new FileReader();
    /*$reader.addEventListener("loadend", function() {
      cb($reader.result);
    });*/
    $reader.onloadend = function() {
      cb($reader.result);
    };
    $reader[type](val);
  }

  function readAsArrayBuffer(val, cb) {
    readWithFileReader("readAsArrayBuffer", val, cb);
  }
  function readAsText(val, cb) {
    readWithFileReader("readAsText", val, cb);
  }
  function readAsBinaryString(val, cb) {
    readWithFileReader("readAsBinaryString", val, cb);
  }
  function readAsDataURL(val, cb) {
    readWithFileReader("readAsDataURL", val, cb);
  }

  function convertToBlob(val, cb, mime) {
    var out = new Blob([val], { type: mime || "text/plain; charset=UTF-8" });
    cb(out);
  }
  function returnURL(val, cb) {
    cb(window.URL.createObjectURL(val));
  }
  function returnSelf(val, cb) {
    cb(val);
  }

  _io.ArrayBuffer = {
    String: function(val, cb) {
      var dataView = new DataView(val);
      var decoder = new TextDecoder();
      var out = decoder.decode(dataView);
      cb(out);
      return out;
    },
    Blob: convertToBlob,
  };

  _io.Blob = {
    String: readAsText,
    ArrayBuffer: readAsArrayBuffer,
    BinaryString: readAsBinaryString,
    DataURL: readAsDataURL,
    URL: returnURL,
  };

  _io.File = {
    String: readAsText,
    ArrayBuffer: readAsArrayBuffer,
    BinaryString: readAsBinaryString,
    DataURL: readAsDataURL,
    Blob: convertToBlob,
    URL: returnURL,
  };

  _io.ArrayBuffer.ArrayBuffer = _io.Blob.Blob = _io.File.File = _io.String.String = _io.Object.Object = _io.Array.Array = returnSelf;

  _io.ArrayBuffer.Blob = _io.File.Blob = _io.String.Blob = convertToBlob;
  _io.Object.Blob = _io.Array.Blob = function(val, cb, mime) {
    tryStringify(val, function(val) {
      convertToBlob(val, cb, mime);
    });
  };

  _io.String.ArrayBuffer = function(val, cb, mime) {
    convertToBlob(
      val,
      function(blob) {
        readAsArrayBuffer(blob, cb);
      },
      mime
    );
  };
  _io.String.BinaryString = _io.ArrayBuffer.BinaryString = function(
    val,
    cb,
    mime
  ) {
    convertToBlob(
      val,
      function(blob) {
        readAsBinaryString(blob, cb);
      },
      mime
    );
  };
  _io.String.DataURL = _io.ArrayBuffer.DataURL = function(val, cb, mime) {
    convertToBlob(
      val,
      function(blob) {
        readAsDataURL(blob, cb);
      },
      mime
    );
  };
  _io.String.URL = _io.ArrayBuffer.URL = function(val, cb, mime) {
    convertToBlob(
      val,
      function(blob) {
        returnURL(blob, cb);
      },
      mime
    );
  };

  _io.Object.ArrayBuffer = _io.Array.ArrayBuffer = function(val, cb, mime) {
    tryStringify(val, function(val) {
      _io.String.ArrayBuffer(val, cb, mime);
    });
  };
  _io.Object.BinaryString = _io.Array.BinaryString = function(val, cb, mime) {
    tryStringify(val, function(val) {
      _io.String.BinaryString(val, cb, mime);
    });
  };
  _io.Object.DataURL = _io.Array.DataURL = function(val, cb, mime) {
    tryStringify(val, function(val) {
      _io.String.DataURL(val, cb, mime);
    });
  };
  _io.Object.URL = _io.Array.URL = function(val, cb, mime) {
    tryStringify(val, function(val) {
      _io.String.URL(val, cb, mime);
    });
  };

  _io.String.Object = _io.String.Array = tryParse;
  _io.Object.String = _io.Array.String = tryStringify;

  function tryStringify(val, cb) {
    try {
      cb(JSON.stringify(val));
    } catch (e) {
      try {
        cb(stringify(val));
      } catch (err) {
        _io.onerror(err);
      }
    }
  }
  function tryParse(val, cb) {
    try {
      cb(JSON.parse(val));
    } catch (e) {
      try {
        cb(parse(val));
      } catch (err) {
        _io.onerror(err);
      }
    }
  }

  /*
     dP""b8 88      dP"Yb  88b 88 888888
    dP   `" 88     dP   Yb 88Yb88 88__
    Yb      88  .o Yb   dP 88 Y88 88""
     YboodP 88ood8  YbodP  88  Y8 888888
  */
  // based on : https://github.com/vkiryukhin/jsonfn/blob/master/jsonfn.js

  function stringifyReplacer(key, value) {
    if (value instanceof Function || typeof value == "function")
      return value.toString();
    if (value instanceof RegExp) return "²RegExp²" + value;
    if (value instanceof Date) return "²Date__²" + value.getTime();
    return value;
  }
  function stringify(obj, format) {
    format = format || 0;
    obj = stringifyReplacer(null, obj);
    return JSON.stringify(obj, stringifyReplacer, format);
  }

  function parseReplacer(key, value) {
    if (typeof value != "string" || value.length < 8) return value;
    var prefix = value.substring(0, 8);
    if (prefix === "function") return eval("(" + value + ")");
    if (prefix === "²Date__²") return new Date(value.slice(8) * 1);
    if (prefix === "²RegExp²") return eval(value.slice(8));
    return value;
  }
  function parse(str) {
    str = parseReplacer(null, str);
    return JSON.parse(str, parseReplacer);
  }

  function clone(obj) {
    return parse(stringify(obj));
  }

  _io.stringify = stringify;
  _io.parse = parse;
  _io.clone = clone;

  global.$io = _io;
})(this);

/*
     db    88   88 888888  dP"Yb  88     88 88b 88 88  dP
    dPYb   88   88   88   dP   Yb 88     88 88Yb88 88odP
   dP__Yb  Y8   8P   88   Yb   dP 88  .o 88 88 Y88 88"Yb
  dP""""Yb `YbodP'   88    YbodP  88ood8 88 88  Y8 88  Yb
*/

!(function(global) {
  "use strict";

  // thanks :
  // http://www.codinghorror.com/blog/2008/10/the-problem-with-urls.html
  // https://github.com/component/regexps

  function autolink(str) {
    var _lip_ = [],
      l_i = 0;
    return (
      str
        // http://regex101.com/r/mN8xB0/1
        .replace(
          /(?:\(((?:https?:\/\/|www\.)[-A-Za-z0-9+$&@#\/%?=~_()|!:,.;]+[-A-Za-z0-9+$&@#\/%=~_()|])\))/gm,
          function(a, b) {
            _lip_.push(b);
            return "²_links_in_parens___" + "ktlu_²";
          }
        )
        // http://regex101.com/r/rA7aT0/3
        .replace(
          /((?:https?:\/\/|www\.)[-A-Za-z0-9+$&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+$&@#\/%=~_()|])/gm,
          function(a) {
            return (
              '<a target="_blank" href="' +
              (a.indexOf("http") == 0 ? a : "http://" + a) +
              '">' +
              a +
              "</a>"
            );
          }
        )
        // http://stackoverflow.com/a/13398311
        //.replace(/(^|[^@\w])@(\w{1,15})\b/g, '$1<a target="_blank" href="http://twitter.com/$2">@$2</a>')
        // http://regex101.com/r/zB7aN1/2
        .replace(/([\w.]*\w@[\w.]+\w)/gm, '<a href="mailto:$1">$1</a>')

        .replace(RegExp("²_links_in_parens___" + "ktlu_²", "g"), function() {
          var v = _lip_[l_i++];
          return '(<a target="_blank" href="' + v + '">' + v + "</a>)";
        })
    );
  }

  if (!global["$io"]["str"]) global["$io"] = { str: {} };
  global["$io"].str["autolink"] = autolink;
})(this);

/*
  88  88 88 88     88 888888
  88  88 88 88     88   88
  888888 88 88  .o 88   88
  88  88 88 88ood8 88   88
*/

!(function(global) {
  "use strict";

  // thanks :
  // https://github.com/visionmedia/mocha
  // http://prismjs.com

  //'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
  //'punctuation': /[{}[\];(),.:]/g

  function freeText(str) {
    str = str
      .replace(/</g, "²_less__" + "²")
      .replace(/>/g, "²_more__" + "²")
      .replace(/&/g, "²_amp__" + "²")
      .replace(/"/g, "²_quot__" + "²")
      .replace(/'/g, "²_squot__" + "²");
    str = $io.str.autolink(str);
    str = str
      .replace(RegExp("²_amp__" + "²", "g"), "&amp;")
      .replace(RegExp("²_quot__" + "²", "g"), "&quot;")
      .replace(RegExp("²_squot__" + "²", "g"), "&#39;")
      .replace(RegExp("²_less__" + "²", "g"), "&lt;")
      .replace(RegExp("²_more__" + "²", "g"), "&gt;");
    return str;
  }

  function hilit(js, inline) {
    if (typeof js != "string") return "";
    var _str_ = [],
      s_i = 0,
      _cmt_ = [],
      c_i = 0,
      _kmt_ = [],
      k_i = 0,
      _reg_ = [],
      r_i = 0;

    return (
      (inline ? "" : '<code class="language-javascript ui_hilit">') +
      js

        .replace(/\/\*[\W\w]*?\*\//g, function(a) {
          _cmt_.push(a);
          return "_comment__" + "ktlu_";
        }) // http://regex101.com/r/bD5sO6/1
        .replace(
          /([\r\n\s,.;[({=&|!])(\/(?!\/)(?:\[.+?]|\\.|[^\/\r\n])+\/[gimyu]{0,5})(?=\s*($|[\r\n,.;})\]]))/g,
          function(a, b, c) {
            _reg_.push(c);
            return b + "_regex____" + "ktlu_";
          }
        ) // http://regex101.com/r/zN0vW8/2
        .replace(
          /('(\\')?(([^\\]\\'|[^'\n]|\\\n)*)')|("(\\")?(([^\\]\\"|[^"\n]|\\\n)*)")/g,
          function(a) {
            _str_.push(a);
            return "_string___" + "ktlu_";
          }
        ) // https://regex101.com/r/mV5zZ3/2
        .replace(/\/\/.*/g, function(a) {
          _kmt_.push(a);
          return "_komment__" + "ktlu_";
        }) // http://regex101.com/r/bD5sO6/1

        .replace(
          /([+\/\|\^&%!~<>=-]|&amp;|&lt;?|&gt;?)/g,
          '<span class="sh_operator">$1</span>'
        )
        .replace(/(\$[a-z0-9_$]+)/gi, '<span class="sh_42">$1</span>')
        .replace(
          /((?!\d)[a-z0-9_$]+)(\s*:\s*function)/gi,
          '<span class="sh_function">$1</span>$2'
        )
        .replace(
          /\.((?!\d)[a-z0-9_$]+(?=\())/gi,
          '.<span class="sh_propfunction">$1</span>'
        )
        .replace(
          /((?!\d)[a-z0-9_$]+(?=\())/gi,
          '<span class="sh_function">$1</span>'
        )
        .replace(/([[\]{}().,;:])/g, '<span class="sh_punctuation">$1</span>')
        .replace(
          /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|true|false|NaN|-?Infinity)\b/g,
          '<span class="sh_number">$1</span>'
        )
        //.replace(/\bnew[ \t]+(\w+)/g, '<span class="sh_keyword">new</span> <span class="sh_function">$1</span>')
        .replace(
          /\b(break|case|catch|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
          '<span class="sh_keyword">$1</span>'
        )

        .replace(RegExp("_komment__" + "ktlu_", "g"), function() {
          return (
            '<span class="sh_comment">' +
            freeText(_kmt_[k_i++] || "") +
            "</span>"
          );
        })
        .replace(RegExp("_comment__" + "ktlu_", "g"), function() {
          return (
            '<span class="sh_comment">' +
            freeText(_cmt_[c_i++] || "") +
            "</span>"
          );
        })
        .replace(RegExp("_string___" + "ktlu_", "g"), function() {
          return (
            '<span class="sh_string">' +
            freeText(_str_[s_i++] || "") +
            "</span>"
          );
        })
        .replace(RegExp("_regex____" + "ktlu_", "g"), function() {
          return (
            '<span class="sh_keyword2">' +
            freeText(_reg_[r_i++] || "") +
            "</span>"
          );
        }) +
      (inline ? "" : "</code>")
    );
  }

  if (!global["$io"]["str"]) global["$io"] = { str: {} };
  global.$io.str.hilit = hilit;
  global.$io.str.freeText = freeText;
})(this);

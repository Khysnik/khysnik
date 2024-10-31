!(function(global) {
  "use strict";

  // thanks : http://toddmotto.com/writing-a-standalone-ajax-xhr-javascript-micro-library
  // thanks : http://visionmedia.github.io/superagent

  function isObject(obj) {
    return obj === Object(obj);
  }

  function serialize(obj) {
    if (!isObject(obj)) return obj;
    var pairs = [];
    for (var key in obj) {
      if (null != obj[key]) {
        pairs.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
        );
      }
    }
    return pairs.join("&");
  }

  function parse(req) {
    var result, isJson;
    try {
      result = JSON.parse(req.responseText);
      isJson = true;
    } catch (e) {
      result =
        req.responseType === "text" || req.responseType === ""
          ? req.responseText
          : null;
      isJson = false;
    }
    return [result, req.status, req, isJson];
  }

  function getXHR() {
    if (
      window.XMLHttpRequest &&
      ("file:" != window.location.protocol || !window.ActiveXObject)
    ) {
      return new XMLHttpRequest();
    } else {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {}
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
      } catch (e) {}
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
      } catch (e) {}
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {}
    }
    return false;
  }

  function xhr(type, url, data) {
    var error = new Error("nope");

    var request = getXHR(),
      methods = {
        done: function() {},
        fail: function() {},
        guest: function() {},
      },
      callbacks = {
        done: function(callback) {
          methods.done = callback;
          return callbacks;
        },
        fail: function(callback) {
          methods.fail = callback;
          return callbacks;
        },
        guest: function(callback) {
          methods.guest = callback;
          return callbacks;
        },
      };

    //request.withCredentials = true;
    var cfg = { arraybuffer: false };
    if (type == "GET" && data) (cfg = data), (data = null);

    if (url && url !== "/") {
      request.open(type, url, true);
      if (cfg.arraybuffer) request.responseType = "arraybuffer";
      request.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      //request.setRequestHeader('Content-type', 'application/json');
      request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      if (data && data._csrf) {
        request.setRequestHeader("X-CSRF-Token", data._csrf);
        delete data._csrf;
      }
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status >= 200 && request.status < 300) {
            if (cfg.arraybuffer) {
              methods.done.apply(methods, [
                request.response,
                request.status,
                request,
                false,
              ]);
            } else {
              methods.done.apply(methods, parse(request));
            }
          } else if (request.status == 401) {
            // unregistered user
            methods.guest.call(methods, request.statusText, {
              type: type.toLowerCase(),
              url: url,
              data: data,
            });
          } else {
            var res = parse(request);
            error.message =
              type +
              " " +
              url +
              " " +
              res[2].status +
              " (" +
              res[2].statusText +
              ")";
            methods.fail.apply(methods, [error].concat(res));
          }
        }
      };

      if (data) request.send(serialize(data));
      else request.send();
    } else {
      methods.fail.call(methods, "Invalid url");
    }

    return callbacks;
  }

  function _ajax(url, done, fail, guest) {
    var inst = xhr("GET", url);
    inst.done(done || $noop);
    inst.fail(fail || $noop);
    inst.guest(guest || $noop);
  }

  _ajax.get = function(url, opt) {
    return xhr("GET", url, opt);
  };
  _ajax.post = function(url, data) {
    return xhr("POST", url, data);
  };
  _ajax.delete = function(url, data) {
    return xhr("DELETE", url, data);
  };
  _ajax.put = function(url, data) {
    return xhr("PUT", url, data);
  };

  _ajax.buffer = function(url, cb) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function(oEvent) {
      var arrayBuffer = request.response;
      if (arrayBuffer) {
        //var byteArray = new Uint8Array(arrayBuffer);
        cb(arrayBuffer);
      }
    };
    request.send(null);
  };

  global.$ajax = _ajax;
})(this);

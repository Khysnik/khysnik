!(function(global) {
  "use strict";

  var $noop = global.$noop || function() {};
  var cfg = {
    onpass: $noop,
    onfail: $noop,
  };

  function _insertElement(el) {
    document.body.appendChild(el);
  }

  var uid = 0;

  var _insert = {
    script: function(url) {
      return new Promise(function(resolve, reject) {
        var el = document.createElement("script");
        el.className = "js_dynamic-deps";
        el.type = "text/javascript";
        el.charset = "utf-8";
        el.async = false;
        el.defer = true;
        el.onload = el.onreadystatechange = function(e, isAbort) {
          // console.dir(el.readyState);
          // setTimeout(function() {
          if (!el.readyState || /loaded|complete/.test(el.readyState)) {
            if (isAbort) reject("script not loaded correctly (abort)");
            else resolve(el);
          }
          // }, 5000);
        };
        el.onerror = function() {
          console.log(456);
          reject("script not loaded correctly");
        };
        _insertElement(el);
        el.src = url;
      });
    },
    css: function(url) {
      return new Promise(function(resolve, reject) {
        var el = document.createElement("link");
        el.className = "js_dynamic-deps";
        el.charset = "utf-8";
        el.rel = "stylesheet";
        el.href = url;
        _insertElement(el);
        resolve(el);
      });
    },
    txt: function(url) {
      return new Promise(function(resolve, reject) {
        $ajax
          .get(url)
          .done(function(data) {
            resolve(data);
          })
          .fail(function(e) {
            reject("ajax error: " + e.status + " " + e.statusText);
          });
      });
    },
    audio: function(url) {
      if (!url) {
        return Promise.resolve({
          play: $noop,
          pause: $noop,
        });
      }
      return new Promise(function(resolve, reject) {
        $audio({
          urls: [url],
          buffer: false,
          onload: function() {
            resolve(this);
          },
          onloaderror: function() {
            reject("sound not loaded correctly");
          },
        });
      });
    },
  };

  function _loader(list, cb) {
    var all = [];
    list.forEach(function(url) {
      var type = $url.getExtention(url);

      // console.log(url, type)

      if (type === "js") {
        all.push(_insert.script(url));
      } else if (type === "css") {
        all.push(_insert.css(url));
      } else if (/txt|html|php|json|xml/.test(type)) {
        all.push(_insert.txt(url));
      } else if (/mp3|opus|ogg|wav|aac|m4a|mp4|weba/.test(type)) {
        all.push(_insert.audio(url));
      }
    });

    return new Promise(function(resolve, reject) {
      Promise.all(all)
        .then(function(arg) {
          if (typeof cb === "function") cb.apply(null, arg);
          resolve(arg);
        })
        .catch(function(err) {
          reject(err);
          // console.log(2, arg)
        });
    });
  }

  _loader.script = function(url) {
    return _insert.script(url);
  };

  _loader.css = function(url) {
    return _insert.css(url);
  };

  _loader.audio = function(url) {
    return _insert.audio(url);
  };

  _loader.config = function(opt) {
    $extend(cfg, opt);
  };

  global["$loader"] = _loader;
})(this);

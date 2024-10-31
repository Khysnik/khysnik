/*
  88""Yb  dP"Yb  88   88 888888 888888
  88__dP dP   Yb 88   88   88   88__
  88"Yb  Yb   dP Y8   8P   88   88""
  88  Yb  YbodP  `YbodP'   88   888888
*/

!(function(global) {
  "use strict";

  // console.log(222)

  function $route(path) {
    window.onhashchange = $noop;
    if ("replaceState" in history) {
      if (path) {
        // window.location.hash = '!' + encodeURI(path);
        history.replaceState(
          "",
          document.title,
          "#!" + encodeURI(path) + window.location.search
        );
      } else if (window.location.hash) {
        history.replaceState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );
      }
    } else {
      window.location.hash = path ? "!" + encodeURI(path) : "";
    }
    setTimeout(function() {
      window.onhashchange = hash2exe;
    }, 1000);
  }

  $route = $watch($route);

  function hash2exe() {
    // https://developers.google.com/webmasters/ajax-crawling/docs/getting-started
    var hash = location.hash;
    if (hash) {
      $route.trigger("change", decodeURI(hash.replace(/^#!/, "")));
    }
  }

  $route.init = function() {
    hash2exe();
  };

  global.$route = $route;
  //global.$route = $noop //$route;
})(window);

/*
  88   88 88""Yb 88
  88   88 88__dP 88
  Y8   8P 88"Yb  88  .o
  `YbodP' 88  Yb 88ood8
*/

var $url = {
  parseQuery: function(qs) {
    return $io.arr.reduce(
      qs.replace(/^\?/, "").split("&"),
      function(obj, pair) {
        var i = pair.indexOf("="),
          key = pair.slice(0, i),
          val = pair.slice(++i);
        obj[key] = decodeURIComponent(val);
        return obj;
      },
      {}
    );
  },
  getExtention: function(url) {
    var type = (url || "").match(/(?:\.)([0-9a-z]+)(?:[#?].+)?$/);
    return type && type[1] ? type[1] : "";
  },
  getDomain: function(url) {
    var tmp = (url || "").match(/:\/\/(.[^/]+)/);
    return tmp != null && tmp.length >= 2 ? tmp[1] : "";
  },
  checkImage: function(url, cb) {
    if (!url) cb(false);
    var image = new Image();
    image.onload = load;
    image.onerror = load;
    image.onabort = load;
    image.src = url;
    function load() {
      if (image.width > 0) cb(true, url, image);
      else cb(false, url, image);
    }
  },
  _checkFavicon: function(url, cb) {
    if (url && $io.str.trim(url) != "") {
      var domain = $url.getDomain(url),
        fav;
      if (domain) {
        $url.checkImage(
          (fav = "http://" + domain + "/apple-touch-icon.png"),
          function(ok) {
            if (ok) cb(true, fav);
            else
              $url.checkImage(
                (fav = "http://" + domain + "/favicon.png"),
                function(ok) {
                  if (ok) cb(true, fav);
                  else
                    $url.checkImage(
                      (fav = "http://" + domain + "/favicon.ico"),
                      function(ok) {
                        if (ok) cb(true, fav);
                        else
                          $url.checkImage(
                            (fav = "http://" + domain + "/favicon.gif"),
                            function(ok) {
                              if (ok) cb(true, fav);
                              else cb(false);
                            }
                          );
                      }
                    );
                }
              );
          }
        );
      } else cb(false);
    } else cb(false);
  },
  checkFavicon: function(url, cb) {
    //console.log('???');

    //cb(false); return;

    var listToCheck = [
      "/favicon-32x32.png",
      //,'/apple-touch-icon.png'
      //,'/apple-touch-icon-57x57.png'
      "/favicon.png",
      "/favicon.gif",
      "/favicon.ico",
    ];

    if (url && $io.str.trim(url) != "") {
      var domain = $url.getDomain(url),
        found = false,
        notFound = listToCheck.length - 1;
      if (domain) {
        for (var i = 0, l = listToCheck.length; i < l; i++) {
          if (found) break;
          $url.checkImage("http://" + domain + listToCheck[i], function(
            ok,
            url
          ) {
            if (ok && !found) {
              found = true;
              cb(true, url);
            } else if (!found) {
              notFound--;
              if (notFound === 0) {
                cb(false);
              }
            }
          });
        }
        //console.log('notFound', notFound);
      } else cb(false);
    } else cb(false);
  },
};
$url.query = (function() {
  return $url.parseQuery(window.location.search.substring(1));
})();

/*
  8888b.   dP"Yb  8b    d8
   8I  Yb dP   Yb 88b  d88
   8I  dY Yb   dP 88YbdP88
  8888Y"   YbodP  88 YY 88
*/

/*var $dom = {
  getSelection: function() { // http://stackoverflow.com/a/5379408
    var txt = '';
    if (window.getSelection) {
      txt = window.getSelection().toString();
    } else if (document.selection && document.selection.type != 'Control') {
      txt = document.selection.createRange().text;
    }
    return txt;
  },
  createSelection: function(field, start, end) {
    if( field.createTextRange ) {
      var selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', start);
      selRange.moveEnd('character', end);
      selRange.select();
      field.focus();
    } else if( field.setSelectionRange ) {
      field.focus();
      field.setSelectionRange(start, end);
    } else if( typeof field.selectionStart != 'undefined' ) {
      field.selectionStart = start;
      field.selectionEnd = end;
      field.focus();
    }
  },
  repaint: function(el, cb) {
    // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
    el.oldTransform = el.style.webkitTransform;
    el.style.webkitTransform = 'scale(1)';
    cb.call(el);
    el.style.webkitTransform = el.oldTransform;
  }
}*/

// function $iframe(dest, html) {
//   if (typeof html === 'function') html = $io.fn.inner(html).replace(/^\/\*/, '').replace(/\*\/$/, '');
//   var iframe = document.createElement('iframe');
//   iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
//   dest.appendChild(iframe);
//   return iframe
//   //console.log('iframe.contentWindow =', iframe.contentWindow);
// }

/*
  888888 88   88 88     88     .dP"Y8  dP""b8 88""Yb 888888 888888 88b 88
  88__   88   88 88     88     `Ybo." dP   `" 88__dP 88__   88__   88Yb88
  88""   Y8   8P 88  .o 88  .o o.`Y8b Yb      88"Yb  88""   88""   88 Y88
  88     `YbodP' 88ood8 88ood8 8bodP'  YboodP 88  Yb 888888 888888 88  Y8
*/

!(function(global) {
  "use strict";

  function isFullscreen() {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    ) {
      return true;
    }
    return false;
  }

  function goFullscreen() {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();
    else if (document.documentElement.msRequestFullscreen)
      document.documentElement.msRequestFullscreen();
    else if (document.documentElement.mozRequestFullScreen)
      document.documentElement.mozRequestFullScreen();
    else if (document.documentElement.webkitRequestFullscreen)
      document.documentElement.webkitRequestFullscreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
  }

  function exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }

  var changeHandler;
  function _fullscreen(cbin, cbout) {
    if (changeHandler) {
      document.removeEventListener("fullscreenchange", changeHandler, false);
      document.removeEventListener(
        "webkitfullscreenchange",
        changeHandler,
        false
      );
      document.removeEventListener("mozfullscreenchange", changeHandler, false);
    }

    if (isFullscreen()) {
      exitFullscreen();
      if (typeof cbout === "function") cbout();
    } else {
      goFullscreen();
      if (typeof cbin === "function") cbin();
    }

    changeHandler = function() {
      if (isFullscreen()) {
        if (typeof cbin === "function") cbin();
      } else {
        if (typeof cbout === "function") cbout();
      }
    };

    document.addEventListener("fullscreenchange", changeHandler, false);
    document.addEventListener("webkitfullscreenchange", changeHandler, false);
    document.addEventListener("mozfullscreenchange", changeHandler, false);
  }

  global.$fullscreen = _fullscreen;
})(this);

function $maxZ(selector, parent) {
  // thanks : http://stackoverflow.com/a/1120068/1289275

  var elems,
    style,
    z,
    max = 0,
    maxEl;

  if (typeof selector == "string")
    elems = (parent || document).querySelectorAll(selector);
  else if ($io.isNodeList(selector)) elems = selector;
  else if ($io.isElement(selector)) elems = [selector];
  else throw new Error("$maxZ: invalid selector");

  $io.arr.all(elems, function(el) {
    style = window.getComputedStyle(el, null);
    z = style.zIndex;
    var zNum = Number(z);
    if (style.position != "static" && z != "auto" && zNum > max) {
      maxEl = el;
      max = zNum;
    }
    //console.log(el, z);
  });

  return { num: max, el: maxEl };
}

/*
     db    88b 88 88 8b    d8    db    888888 888888
    dPYb   88Yb88 88 88b  d88   dPYb     88   88__
   dP__Yb  88 Y88 88 88YbdP88  dP__Yb    88   88""
  dP""""Yb 88  Y8 88 88 YY 88 dP""""Yb   88   888888
*/

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// https://gist.github.com/vitalyrotari/4973754
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

!(function(global) {
  "use strict";

  var supports = (function() {
    var div = document.createElement("div"),
      vendors = "Khtml Ms ms MS O o Moz moz webkit Webkit webKit WebKit".split(
        " "
      ), // fuck them !
      l = vendors.length;
    return function(prop) {
      if (prop in div.style) return prop;
      prop = prop.replace(/^[a-z]/, function(val) {
        return val.toUpperCase();
      });
      for (var i = 0; i < l; i++) {
        if (vendors[i] + prop in div.style) {
          return vendors[i] + prop;
        }
      }
      return false;
    };
  })();

  //var prefixedTransition = supports('transitionDuration');
  var prefixedAnim = supports("animationName");

  function onanimationend(el, className, cb) {
    "use strict";
    el.addEventListener("animationend", cb, false);
    el.addEventListener("webkitAnimationEnd", cb, false);
    el.addEventListener("MSAnimationEnd", cb, false);
    el.addEventListener("oAnimationEnd", cb, false);
    el.addEventListener("oanimationend", cb, false);
    el.classList.add(className);
  }

  function testIfAnimation(className, cb) {
    var div = document.createElement("div");
    div.className = className;
    document.body.appendChild(div);
    var style = window.getComputedStyle(div, null);
    if (style[prefixedAnim] != "none") {
      cb(true);
    } /* else if (style[prefixedTransition] != 'none') {
      cb(true);
    }*/ else {
      cb(false);
    }
    div.parentNode.removeChild(div);
  }

  function _animate(el, className, cb) {
    function onEnd() {
      cb(true);
      el.removeEventListener("animationend", onEnd, false);
      el.removeEventListener("webkitAnimationEnd", onEnd, false);
      el.removeEventListener("MSAnimationEnd", onEnd, false);
      el.removeEventListener("oAnimationEnd", onEnd, false);
      el.removeEventListener("oanimationend", onEnd, false);
      el.classList.remove(className);
    }

    testIfAnimation(className, function(ok) {
      if (ok) {
        onanimationend(el, className, onEnd);
      } else {
        cb(false);
      }
    });
    //el.classList.add(className);
  }
  _animate.i = [
    "rubberBand",
    "swing",
    "tada",
    "wobble",
    "bounceIn",
    "bounceInDown",
    "bounceInLeft",
    //,'bounceInRight'
    //,'bounceInUp'
    "fadeIn",
    "fadeInDown",
    "fadeInDownBig",
    "fadeInLeft",
    "fadeInLeftBig",
    "fadeInRight",
    //,'fadeInRightBig'
    //,'fadeInUp'
    //,'fadeInUpBig'
    "flip",
    "flipInX",
    "flipInY",
    "lightSpeedIn",
    "rotateIn",
    "rotateInDownLeft",
    "rotateInDownRight",
    //,'rotateInUpLeft'
    "rotateInUpRight",
    "slideInDown",
    "slideInLeft",
    //,'slideInRight'
    "rollIn",
    "zoomIn",
    "zoomInDown",
    "zoomInLeft",
    "zoomInRight",
    "zoomInUp",
  ];
  _animate.o = [
    "bounceOut",
    "bounceOutDown",
    "bounceOutLeft",
    "bounceOutRight",
    "bounceOutUp",
    "fadeOut",
    "fadeOutDown",
    "fadeOutDownBig",
    "fadeOutLeft",
    "fadeOutLeftBig",
    "fadeOutRight",
    "fadeOutRightBig",
    "fadeOutUp",
    //,'fadeOutUpBig'
    //,'flip'
    //,'flipOutX'
    //,'flipOutY'
    "lightSpeedOut",
    "rotateOut",
    "rotateOutDownLeft",
    "rotateOutDownRight",
    "rotateOutUpLeft",
    "rotateOutUpRight",
    "slideOutLeft",
    "slideOutRight",
    "slideOutUp",
    "hinge",
    "rollOut",
    "zoomOut",
    "zoomOutDown",
    "zoomOutLeft",
    "zoomOutRight",
    "zoomOutUp",
  ];

  global.$animate = _animate;
})(this);

/////////////////////////////////////////////////////////////////////////////
//                                games                                    //
/////////////////////////////////////////////////////////////////////////////

/*
  .dP"Y8 888888    db    888888 888888
  `Ybo."   88     dPYb     88   88__
  o.`Y8b   88    dP__Yb    88   88""
  8bodP'   88   dP""""Yb   88   888888
*/

!(function(global) {
  "use strict";
  var cl = document.body.classList;
  global.$state = {
    wait: function() {
      cl.add("ui_wait");
    },
    isLoading: function() {
      return cl.contains("ui_loading--block") || cl.contains("ui_loading");
    },
    loading: function(block) {
      cl.add(block === true ? "ui_loading--block" : "ui_loading");
    },
    loaded: function() {
      cl.remove("ui_loading--block");
      cl.remove("ui_loading");
    },
    pause: function() {
      cl.add("ui_pause");
    },
    play: function() {
      cl.remove("ui_pause");
    },
  };
})(this);

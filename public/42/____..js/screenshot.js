!(function(global) {
  "use strict";

  var def = {
    default: document.body,
  };

  function $screenshot(selector, opt, cb) {
    if (typeof opt === "function") (cb = opt), (opt = {});

    var cfg = $extend({}, def, opt),
      el,
      doScreenshot;

    $loader(["/c/libs/rasterizeHTML.allinone.js"], function() {
      var styles = "<style>";
      var originalEl;
      var isDoc = false;

      if (selector) {
        if (typeof selector === "string") {
          originalEl = document.querySelector(selector);

          /*el = $tree.frag(selector)
          if (!el || !el.firstChild) return
          el = el.firstChild
          el.appendChild(originalEl.cloneNode(true))*/

          el = $el.create(selector, originalEl.cloneNode(true)); // @todo: querySelectorAll for $screenshot?
          // console.log(123, el)
        } else if ($io.isElement(selector)) {
          originalEl = selector;
          el = originalEl.cloneNode(true);
          el.id = "screenshot__unique__selector";
          selector = "#" + el.id;
        } else if ($io.isDocument(selector)) {
          isDoc = true;
          originalEl = selector;
          el = selector.cloneNode(true);
        } else {
          //throw new Error('$screenshot : invalid selector!')
          console.error("$screenshot : invalid selector!");
          return;
        }
        var width = cfg.width || originalEl.offsetWidth;
        var height = cfg.height || originalEl.offsetHeight;

        if (!isDoc) {
          styles +=
            "body {background:transparent !important}\n" +
            selector +
            " {width:" +
            width +
            "px!important;height:" +
            height +
            "px!important;" +
            "position:absolute!important; top:0px!important;left:0px!important}\n";
        }
      } else {
        originalEl = cfg.default; //le._dom.screen; //document.body;
        el = originalEl.cloneNode(true);
        //console.log(originalEl)
        var width = originalEl.offsetWidth;
        var height = originalEl.offsetHeight;
      }

      if (!el) return;

      // special case for image in inline style not supported
      $io.arr.all(el.querySelectorAll(".js_image_inline"), function(item) {
        styles +=
          '.js_image_inline[data-image-id="' +
          item.dataset.imageId +
          '"] {' +
          "  background-image: " +
          item.style.backgroundImage +
          "!important;" +
          "  background-size: " +
          item.style.backgroundSize +
          "!important;" +
          "  background-position: " +
          item.style.backgroundPosition +
          "!important;" +
          "  background-repeat: " +
          item.style.backgroundRepeat +
          "!important;" +
          "}";
      });

      styles += "</style>";

      $io.arr.all(document.styleSheets, function(item) {
        styles += item.ownerNode.outerHTML;
      });

      var canvas = document.createElement("canvas");
      canvas.width = width + 1;
      canvas.height = height + 1;

      doScreenshot = function(html, cb) {
        rasterizeHTML[isDoc ? "drawDocument" : "drawHTML"](
          isDoc ? el : styles + html,
          canvas,
          {
            useBlobs: false,
            baseUrl: isDoc ? null : window.location.origin,
            //,cacheBucket: {}
            //,cache: 'repeated'
          }
        ).then(
          function success(res) {
            cb(canvas, originalEl || el, res);
          },
          function error(e) {
            $alert.error(e);
          }
        );
      };

      var iframes = el.querySelectorAll("iframe");
      var canvases = el.querySelectorAll("canvas");
      var nbToRaster = iframes.length + canvases.length;

      if (nbToRaster) {
        if (iframes.length) {
          var iframesO = originalEl.querySelectorAll("iframe");
          $io.arr.each(iframes, function(ifr, i) {
            $screenshot(
              iframesO[i].contentDocument,
              {
                width: iframesO[i].clientWidth,
                height: iframesO[i].clientHeight,
              },
              function(c, e, res) {
                ifr.parentNode.replaceChild(res.image, ifr);
                res.image.style.cssText = window.getComputedStyle(
                  iframesO[i],
                  ""
                ).cssText;
                res.image.style.width = iframesO[i].clientWidth + "px";
                res.image.style.height = iframesO[i].clientHeight + "px";
                if (--nbToRaster === 0) doScreenshot(el.outerHTML, cb);
              }
            );
          });
        }
        if (canvases.length) {
          var canvasesO = originalEl.querySelectorAll("canvas");
          $io.arr.each(canvases, function(cnv, i) {
            var img = new Image();
            img.src = canvasesO[i].toDataURL();
            cnv.parentNode.replaceChild(img, cnv);
            img.style.cssText = window.getComputedStyle(
              canvasesO[i],
              ""
            ).cssText;
            if (--nbToRaster === 0) doScreenshot(el.outerHTML, cb);
          });
        }
      } else {
        doScreenshot(el.outerHTML, cb);
      }
    });

    return {
      refresh: function(cb) {
        doScreenshot(el.outerHTML, cb);
      },
      destroy: function() {
        canvas = null;
        html = null;
        el = null;
      },
    };
  }

  $screenshot.config = function(opt) {
    $extend(def, opt);
  };

  global.$screenshot = $screenshot;
})(this);

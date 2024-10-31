!(function(global) {
  "use strict";

  // thanks : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
  // thanks : http://cburgmer.github.io/rasterizeHTML.js/

  /*if (!global.$worker)
    global.$worker = function(obj) {
    return obj
  }*/

  // 1x1px Transparent GIF
  var blankGif =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  var URL = window.URL || window.webkitURL || window;
  //var serializer = new XMLSerializer

  var script = document.querySelector('script[src*="snapshot.js"]');
  var scriptPath = script.src;
  //console.log(script.src)

  var cont = document.createElement("div");
  cont.style.display = "none";
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var foreignObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var doc = document.implementation.createHTMLDocument("");
  doc.documentElement.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  svg.appendChild(defs);
  svg.appendChild(foreignObject);
  var head = doc.head;
  var body = doc.body;
  doc.documentElement.style.cssText = "overflow:hidden";

  cont.appendChild(svg);
  document.body.appendChild(cont);

  //document.body.appendChild(cont)
  //doc.documentElement.style.cssText =
  //body.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100%;'

  function replaceByImg(clone, src) {
    var img = new Image();
    img.src = src;
    //if (clone.width) img.width = clone.width
    //if (clone.height) img.height = clone.height
    img.style.cssText = window.getComputedStyle(clone, "").cssText;
    clone.parentNode.replaceChild(img, clone);
  }

  function includeInlineStyles(list, index, clone) {
    if (clone.tagName === "IMG" && clone.src) {
      if (
        clone.src.indexOf("data:") !== 0 &&
        clone.src.indexOf("blob:") !== 0
      ) {
        list.push(
          fetchAsset(null, clone.src, true)
            .catch(function(e) {})
            .then(function(res) {
              clone.src = res ? res[1] : clone.src;
            })
        );
      }
    }
    //var src = clone.getAttribute('data-snapshot-imgsrc')
    //if (src) console.log(1, src)
    //console.log(src)
    clone._cssText = inlinize(list, clone.style.cssText, index);
  }

  var uid = 0;

  function fetchAsset(id, asset, safe) {
    //console.log(id, asset, typeof asset)
    //return
    // TODO : viewBox parameters
    // https://www.broken-links.com/2012/08/14/better-svg-sprites-with-fragment-identifiers/
    var anchor;
    asset = asset.replace(/svg#(.*)$/, function(_, _anchor) {
      anchor = _anchor;
      return "svg";
    });
    var promise = fetch(asset)
      .then(function(response) {
        if (anchor) return response.text();
        else return response.blob();
      })
      .then(function(blob) {
        if (typeof blob === "string") {
          //console.log(tXml(blob))
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(blob, "text/xml");
          var svgDoc = xmlDoc.getElementsByTagName("svg")[0];

          var elem = xmlDoc.getElementById(anchor);
          if (elem.tagName === "filter") {
            // SVG filter
            elem.id = anchor + "__snapshot__" + id; // prevent id collisions
            defs.appendChild(elem);
            var str = "#" + anchor + "__snapshot__" + id;
            //console.log(1, asset)
            return [id, str];
          } else {
            // SVG fragment identifiers
            while (svgDoc.firstChild) svgDoc.removeChild(svgDoc.firstChild);
            svgDoc.appendChild(elem);
            //var str = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serializer.serializeToString(svgDoc))
            var serializer = new XMLSerializer();
            var str =
              "data:image/svg+xml;charset=utf-8," +
              (safe
                ? serializer.serializeToString(svgDoc)
                : encodeURIComponent(serializer.serializeToString(svgDoc)));
            //console.log(2, asset)
            return [id, str];
          }
        } else {
          return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function() {
              //console.log(3, asset)
              resolve([id, reader.result]);
            };
          });
        }
      });
    return promise;
  }

  function inlinize(p, cssText, id) {
    return cssText.replace(
      /url\(["']?(?!data:|__asset_snapshot__)(.*?)["']?\)/g,
      function(_, asset) {
        if (asset.indexOf("/") === 0) {
          asset = location.origin + asset;
        }
        //if (asset.lastIndexOf('.cur') === asset.length - 4) {
        //  return 'url('+blankGif+')'
        //} else {
        p.push(fetchAsset(id, asset));
        return "url(__asset_snapshot__" + id + ")";
        //}
      }
    );
    //return ttt
  }

  function scanStyles() {
    while (defs.firstChild) defs.removeChild(defs.firstChild);
    var styleSheetList = document.styleSheets;
    var cssText = "";
    var p = [];
    var assets = [];

    for (var i = 0, l = styleSheetList.length; i < l; i++) {
      var rules = styleSheetList[i].rules;
      for (var j = 0, m = rules.length; j < m; j++) {
        cssText += rules[j].cssText;
      }
      cssText = inlinize(p, cssText, ++uid);
    }

    return Promise.all(p).then(function(results) {
      for (var i = 0, l = results.length; i < l; i++) {
        cssText = cssText.replace(
          "__asset_snapshot__" + results[i][0],
          results[i][1]
        );
      }
      cssText +=
        "\nhtml::-webkit-scrollbar,body::-webkit-scrollbar{display: none;} a{color:#0000EE;} a:visited{color:#551A8B;}";
      cssText +=
        "\n* {animation-delay:0s!important;animation-duration:0s!important;}";
      var styleNode = document.createElement("link");
      var href =
        "data:text/css;charset=utf-8;base64," +
        btoa(unescape(encodeURIComponent(cssText)));
      styleNode.setAttribute("rel", "stylesheet");
      styleNode.setAttribute("href", href);

      while (head.firstChild) head.removeChild(head.firstChild);
      head.appendChild(styleNode);
      while (foreignObject.firstChild)
        foreignObject.removeChild(foreignObject.firstChild);
      foreignObject.appendChild(doc.documentElement);
    });
  }

  var blobCfg = { type: "image/svg+xml;charset=utf-8" };
  //var lastUrl

  function go(resolve, reject, opt) {
    var img = new Image();
    img.crossOrigin = "Anonymous";

    var listInlineStyles = [];
    var childs = body.querySelectorAll("*");
    for (var i = 0, l = childs.length; i < l; i++) {
      includeInlineStyles(listInlineStyles, i, childs[i]);
    }

    Promise.all(listInlineStyles).then(function(results) {
      for (var i = 0, l = results.length; i < l; i++) {
        if (
          results[i] &&
          childs[results[i][0]] &&
          childs[results[i][0]]._cssText
        ) {
          var ch = childs[results[i][0]];
          //console.log(ch)
          ch.style.cssText = ch._cssText.replace(
            "__asset_snapshot__" + results[i][0],
            results[i][1]
          );
        }
      }

      setTimeout(function() {
        var str = new XMLSerializer().serializeToString(svg);
        //console.log(str)
        if (opt.blob) {
          //console.log('BLOB')
          var svgBlob = new Blob([str], blobCfg);
          var blobUrl = URL.createObjectURL(svgBlob);
          //window.open(blobUrl)
        } else {
          var blobUrl = "data:image/svg+xml;charset=utf-8," + str;
        }

        function clean() {
          setTimeout(function() {
            if (opt.blob) URL.revokeObjectURL(blobUrl);
            while (body.firstChild) body.removeChild(body.firstChild);
            svgBlob = null;
            str = null;
          }, 1000);
        }

        img.onload = function() {
          var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          img.src = "";
          resolve(canvas);
          clean();
        };
        img.onerror = function(e) {
          reject("img onerror");
          clean();
        };

        img.src = blobUrl;
      }, 10);
    });
  }

  function _snapshot(el, opt) {
    opt = opt || { blob: true };
    return new Promise(function(resolve, reject) {
      var w = opt.width || el.offsetWidth;
      var h = opt.height || el.offsetHeight;
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);
      body.style.cssText =
        "width:" + w + "px;height:" + h + "px;overflow:hidden";

      var clone = el.cloneNode(true);
      clone.style.top = "0";
      clone.style.left = "0";
      body.appendChild(clone);

      var pendingList = [];

      // CANVAS
      var canvasOriginal, canvasClone;
      if (el.tagName === "CANVAS") {
        canvasOriginal = [el];
        canvasClone = [clone];
      } else {
        canvasOriginal = el.querySelectorAll("canvas");
        canvasClone = clone.querySelectorAll("canvas");
      }

      for (var i = 0, l = canvasOriginal.length; i < l; i++) {
        !(function(i) {
          pendingList.push(
            new Promise(function(resolve, reject) {
              replaceByImg(canvasClone[i], canvasOriginal[i].toDataURL());
              resolve();
            })
          );
        })(i);
      }

      // IFRAME
      var iframesOriginal, iframesClone;
      if (el.tagName === "IFRAME") {
        iframesOriginal = [el];
        iframesClone = [clone];
      } else {
        iframesOriginal = el.querySelectorAll("iframe");
        iframesClone = clone.querySelectorAll("iframe");
      }

      iframesOriginal.forEach(function(item) {
        pendingList.push(
          new Promise(function(resolve, reject) {
            function doCanvas() {
              //if (!script.readyState || /loaded|complete/.test(script.readyState)) {
              win.$snapshot.scanStyles().then(function() {
                win
                  .$snapshot(doc.body, {
                    height: item.offsetHeight,
                    width: item.offsetWidth /*,
                  blob: false*/,
                  })
                  .then(function(img) {
                    var dataURL = img.toDataURL();
                    replaceByImg(iframesClone[i], dataURL);
                    resolve();
                  });
              });
              //}
            }
            if (item.contentWindow && item.contentWindow.document) {
              var win = item.contentWindow;
              var doc = win.document;

              if (!win.$snapshot) {
                var script = doc.createElement("script");
                script.type = "text/javascript";
                script.src = scriptPath;
                //script.onload = script.onreadystatechange = function() {
                script.onload = doCanvas;
                doc.body.appendChild(script);
              } else {
                doCanvas;
              }
            } else {
              resolve();
            }
          })
        );
      });

      // for (var i = 0, l = iframesOriginal.length; i < l; i++) {
      //   !function(i) {
      //     pendingList.push(new Promise(function(resolve, reject) {
      //       if (iframesOriginal[i].contentWindow && iframesOriginal[i].contentWindow.document) {
      //         var win = iframesOriginal[i].contentWindow
      //         var doc = win.document

      //         function doCanvas() {
      //           //if (!script.readyState || /loaded|complete/.test(script.readyState)) {
      //             win.$snapshot.scanStyles().then(function() {
      //               win.$snapshot(doc.body, {
      //                 height: iframesOriginal[i].offsetHeight,
      //                 width: iframesOriginal[i].offsetWidth/*,
      //                 blob: false*/
      //               }).then(function(img) {
      //                 var dataURL = img.toDataURL()
      //                 replaceByImg(iframesClone[i], dataURL)
      //                 resolve()
      //               })
      //             })
      //           //}
      //         }

      //         if (!win.$snapshot) {
      //           var script = doc.createElement('script')
      //           script.type = 'text/javascript'
      //           script.src = scriptPath
      //           //script.onload = script.onreadystatechange = function() {
      //           script.onload = doCanvas
      //           doc.body.appendChild(script)
      //         } else {
      //           doCanvas
      //         }

      //       } else {
      //         resolve()
      //       }
      //     }))
      //   }(i)
      // }

      if (pendingList.length) {
        Promise.all(pendingList).then(function(results) {
          setTimeout(function() {
            go(resolve, reject, opt);
          }, 123);
        });
      } else {
        go(resolve, reject, opt);
      }
    });
  }

  _snapshot.scanStyles = scanStyles;

  global.$snapshot = _snapshot;
})(this);

//console.log('???', iframesClone[i])
/*var canvas = document.createElement('CANVAS'),
ctx = canvas.getContext('2d')
canvas.height = iframesOriginal[i].offsetHeight
canvas.width = iframesOriginal[i].offsetWidth
ctx.drawImage(img, 0, 0, iframesOriginal[i].offsetWidth, iframesOriginal[i].offsetHeight)
var dataURL = canvas.toDataURL()*/
//console.log(1)
//ar dataURL = img.toDataURL()
//replaceByImg(iframesClone[i], dataURL)
//var dataURL = img.src

//window.open(blobUrl)

/*var reader = new FileReader();
reader.onloadend = function () {
  img.onload = function () {
    //if (cb) cb(img)
    resolve(img)
    setTimeout(function() {
      // cleanup
      svgBlob = null
      while (body.firstChild) body.removeChild(body.firstChild)
    }, 1)
  }
  img.src = reader.result
}
reader.readAsDataURL(svgBlob);*/

/*
function cloneStyle(clone, original) {
  clone.style.cssText = original.style.cssText
}
*/

/*cloneStyle(clone, el)
for (var i = 0, l = clone.children.length; i < l; i++) {
  cloneStyle(clone.children[i], el.children[i])
}*/

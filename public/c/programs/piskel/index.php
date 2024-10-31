<?php
$title = "Piskel";
$layer = $_GET['layer'];
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>

<link rel="stylesheet" href="css/style.css">

<style>
  #div_cursor {
    width: 16px;
    height: 16px;
    position: absolute;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.5);
    z-index: 9999999;
    pointer-events: none;
  }
</style>

<body class="_skin_base _ui_loading">
  <div class="ui_layout skin_scrollbar">
    <article  id="main-wrapper">
      <aside class="skin_base" id="cont_toolbox" style="width:105px;padding-right:5px;overflow:auto">
        <?php include ('templates/drawing-tools.html'); ?>
        <div class="cursor-coordinates"></div>
      </aside>
      <section>
        <div class="ui_layout">
          <section class="noscroll skin_inset mb1 mr1 _skin_dark" id="section_drawing">
            <div id="drawing-canvas-container" class="drawing-canvas-container canvas-container">
            </div>
          </section>
          <footer class="skin_base" id="cont_timeline" style="height:135px;padding-top:4px;padding-bottom:1px;">
            <div class="preview-list skin_inset _skin_light _mt5 _mb1" _style="margin-top:4px;" id="preview-list"></div>
          </footer>
        </div>

      </section>
      <aside class="skin_base" id="cont_rightpane" style="width:200px;">
        <div class="ui_layout" style="padding-left:5px;padding-right:4px">
          <header>
            <?php include ('templates/preview.html'); ?>
          </header>
          <section class="noscroll">
            <?php include ('templates/layers-list.html'); ?>
          </section>
          <section class="noscroll">
            <?php include ('templates/palettes-list.html'); ?>
          </section>
        </div>
      </aside>
    </article>
  </div>

  <div id="div_cursor"></div>

  <div id="dialog-container-wrapper">
    <div id="dialog-container">
      <script type="text/html" id="templates/dialogs/create-palette.html"><?php include ('templates/dialogs/create-palette.html'); ?></script>
      <script type="text/html" id="templates/dialogs/import-image.html"><?php include ('templates/dialogs/import-image.html'); ?></script>
      <script type="text/html" id="templates/dialogs/browse-local.html"><?php include ('templates/dialogs/browse-local.html'); ?></script>
    </div>
  </div>

  <?php include ('templates/cheatsheet.html'); ?>
  <?php include ('templates/misc-templates.html'); ?>

  <script type="text/javascript" src="js/jquery.js"></script>
  <?php include ('/42/inc/scripts.php'); ?>
  <script type="text/javascript" src="js/piskel.js"></script>


  <script>

  var divCursur = document.getElementById('div_cursor');
  var drawingZone = document.getElementById('drawing-canvas-container');
  var cursorHidden = true;
  function _drawCursor(x,y) {
    if (isCursorOnDrawingZone) {

      var coo = pskl.app.drawingController.getScreenCoordinates(x,y);
      var z = psklPos.zoom;
      var z2 = z/2;
      var size = Math.round(z);
      if (cursorHidden) divCursur.style.display = 'block', cursorHidden = false;
      //drawingZone.classList.add('nocursor');
      //drawingZone.style.cursor = 'none';
      divCursur.style.left = Math.round(coo.x - z2) + 'px';
      divCursur.style.top = Math.round(coo.y - z2) + 'px';
      divCursur.style.height = size + 'px';
      divCursur.style.width = size + 'px';
    } else {
      _hideCursor()
    }
  }
  function _hideCursor() {
    divCursur.style.display = 'none';
    cursorHidden = true;
  }

  var isCursorOnDrawingZone = false;
  drawingZone.addEventListener('mouseover', function() {
    isCursorOnDrawingZone = true;
  }, false);
  drawingZone.addEventListener('mouseout', function() {
    isCursorOnDrawingZone = false;
  }, false);

  var cont_toolbox = document.getElementById('cont_toolbox');
  var cont_rightpane = document.getElementById('cont_rightpane');
  var cont_timeline = document.getElementById('cont_timeline');

  pskl.app.init();

  function _createFramesFromImages(images) {
    var frames = images.map(function (image) {
      return pskl.utils.FrameUtils.createFromImage(image);
    });
    return frames;
  };
  function _createPiskelFromImages(images) {
    var frames = _createFramesFromImages(images);
    var layer = pskl.model.Layer.fromFrames('Layer 1', frames);
    var descriptor = new pskl.model.piskel.Descriptor('Imported piskel', '');
    var piskel = pskl.model.Piskel.fromLayers([layer], descriptor);

    pskl.app.piskelController.setPiskel(piskel);
    pskl.app.animationController.setFPS(Constants.DEFAULT.FPS);
  }
  function _openImage(urlO) {
    var url = window.URL.createObjectURL(urlO)
    var image = new Image();
    image.src = url;

    var gifLoader = new window.SuperGif({
      gif : image
    });

    gifLoader.load({
      success : function(){
        var images = gifLoader.getFrames().map(function (frame) {
          return pskl.utils.CanvasUtils.createFromImageData(frame.data);
        });
        _createPiskelFromImages(images);
      },
      error : function () {
        _createPiskelFromImages([image]);
      }
    });
  }

  function _exportAsGif(cb) {
    var fps = pskl.app.piskelController.getFPS();
    var colors = pskl.app.currentColorsService.getCurrentColors();
    var colorCount = colors.length;
    var preserveColors = colorCount < 256;

    var hasTransparency = false;
    if (colors.indexOf(Constants.TRANSPARENT_COLOR) > -1) {
      hasTransparency = true;
      // make sure the transparent color is not in the palette
      var GIF_transparent = '00ff00'; //tinycolor.random().toHex();
      while (colors.indexOf('#'+GIF_transparent) > -1) {GIF_transparent = tinycolor.random().toHex()};
    }

    var gif = new window.GIF({
       workers: 5
      ,quality: 1
      ,width: pskl.app.piskelController.getWidth()
      ,height: pskl.app.piskelController.getHeight()
      ,preserveColors : preserveColors
      ,transparent: hasTransparency ? parseInt(GIF_transparent, 16) : null
    });

    for (var i = 0; i < pskl.app.piskelController.getFrameCount(); i++) {
      var frame = pskl.app.piskelController.getFrameAt(i);
      var canvasRenderer = new pskl.rendering.CanvasRenderer(frame, 1);
      canvasRenderer.drawTransparentAs('#'+GIF_transparent);
      var canvas = canvasRenderer.render();
      gif.addFrame(canvas.getContext('2d'), {
        delay: 1000 / fps
      });
    }

    $.publish(Events.SHOW_PROGRESS, [{"name": 'Building animated GIF ...'}]);
    gif.on('progress', function(percentage) {
      $.publish(Events.UPDATE_PROGRESS, [{"progress": (percentage*100).toFixed(1)}]);
    });
    gif.on('finished', function(blob) {
      $.publish(Events.HIDE_PROGRESS);
      cb(blob);
    });
    gif.render();
  }

  function _openPiskel(blob) {
    pskl.utils.PiskelFileUtils.loadFromFile(blob, function (piskel, descriptor, fps) {
      pskl.app.piskelController.setPiskel(piskel);
      pskl.app.animationController.setFPS(fps);
    });
  }


  function $iframeInit() { 'use strict';
    return {
      readFile: function(val) {
        if (val.type === 'application/piskel+json') {
          _openPiskel(val);
        } else {
          _openImage(val);
        }
      },
      setValue: function(val) {
        var size = {
          height : Constants.DEFAULT.HEIGHT,
          width : Constants.DEFAULT.WIDTH
        };
        var descriptor = new pskl.model.piskel.Descriptor('New Piskel', '');
        var piskel = new pskl.model.Piskel(size.width, size.height, descriptor);
        var layer = new pskl.model.Layer("Layer 1");
        var frame = new pskl.model.Frame(size.width, size.height);
        layer.addFrame(frame);
        piskel.addLayer(layer);
        pskl.app.piskelController.setPiskel(piskel);
      },
      getValue: function(cb, type) {
        if (type === "image/gif") {
          _exportAsGif(function(blob) {
            cb(blob);
          })
        } else if (type === "application/piskel+json") {
          cb(pskl.app.piskelController.serialize());
        } else {
          pskl.app.getFramesheetAsBlob(function(blob) {
            cb(blob);
          }, type);
        }
      },
      beforeSaveAs: function(doSaveAS) {
        var html = document.createElement('div');
        var btn1 = document.createElement('button');
        var btn2 = document.createElement('button');
        var btn3 = document.createElement('button');
        btn1.textContent = 'Piskel file (.piskel)';
        btn2.textContent = 'Spritesheet (.png)';
        btn3.textContent = 'Animated GIF (.gif)';
        btn1.addEventListener('click', function() {
          doSaveAS("application/piskel+json");
          winInst.close();
        }, false);
        btn2.addEventListener('click', function() {
          doSaveAS("image/png", 'Blob');
          winInst.close();
        }, false);
        btn3.addEventListener('click', function() {
          doSaveAS("image/gif", 'Blob');
          winInst.close();
        }, false);
        html.appendChild(btn1);
        html.appendChild(btn2);
        html.appendChild(btn3);
        var winInst
        setTimeout(function () {
          winInst = window.parent.$window({
            animationIn: '',
            animationOut: '',
            center: true,
            title: 'Save As...',
            model: 'simple',
            bodyClass: 'ui_button_list',
            height: 'auto',
            html: html,
            onclose: function(ok, val) {
              console.log(arguments);
            }
          });
        }, 0)
      }
    }
  }

  </script>
</body>
</html>
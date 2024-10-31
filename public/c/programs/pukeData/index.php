<?php
$title = "pukeData";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<style>
  #svg, #svg svg, textarea {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  textarea {
    resize: none;
    font-family: _tomo, monospace;
    line-height: 1.5;
    width: 100%;
    height: 100%;
  }
  #svg svg {
    font-family: _tomo, monospace;
  }
</style>
<body class="noscroll">
  <div class="ui_layout">
    <article>
    <section class="ui_unselectable cursor_pointer" title="Randomize patch"><div id="svg"></div></section>
    <aside style="width:200px"><textarea spellcheck="false" name="" id="patch" cols="20" rows="5"></textarea></aside>

    </article>
  </div>

  <script src="js/webpd-latest.min.js"></script>
  <script src="js/pd-fileutils-latest.js"></script>
  <script src="js/randomDrone.js"></script>

  <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>

<script>

var svg_EL = document.getElementById('svg');
var patch_EL = document.getElementById('patch');

var current
patch_EL.onkeydown = function(arg) {
  current = this.value;
}
patch_EL.onkeyup = _.debounce(function(arg) {
  if (current !== this.value) loadPatch(this.value)
}, 100);

svg_EL.onclick = function() {
  randomPatch()
}

function displayPatchCode(patchPd) {
  patch_EL.value = patchPd
}

var webpdPatch;
function playPatch(patch, generated) {
  if (webpdPatch) Pd.destroyPatch(webpdPatch);

  // Rendering and updating the page
  var patchSvg = pdfu.renderSvg(patch, {svgFile: false})
  var patchPd = pdfu.renderPd(patch)
  webpdPatch = Pd.loadPatch(patchPd)
  // Adding to DOM
  svg_EL.innerHTML = patchSvg;
  if (generated) displayPatchCode(patchPd);

  Pd.start();
}

function randomPatch() {
  getRandomPatch(playPatch);
}


function loadPatch(pd, generated) {
  try {
    var patch = pdfu.parse(pd)
    playPatch(patch, generated)
  } catch(e) {
    webpdPatch = null;
    parent.$alert('<strong>Unsupported Pure Data Elements</strong>\n(' + e.message + ')');
    if (generated) displayPatchCode(pd);
  }
  //var patchSvg = pdfu.renderSvg(patch, {svgFile: false});
  //console.log(patch);
}
//loadPatch('#N canvas 778 17 450 300 10;\n#X obj 14 13 loadbang;\n#X obj 14 34 print bla;\n#X connect 0 0 1 0;');

</script>

<script>

function $iframeInit() { 'use strict';
  if (this.menu.key) {
    $key(this.menu.key.fn, $extend({}, this.menu.key.opt));
    this.menu.key.destroy;
  }
  return  {
    readFile: function(val) {
      //console.log(1);
      //console.log(val);
      loadPatch(val, true)
    },
    setValue: function(val) {
      //console.log(2);
      //console.log(val);
      if (!val) {
        randomPatch()
      } else {
        loadPatch(val);
      }
    },
    getValue: function(cb) {
      cb(patch_EL.value);
    },
    undo: function(cb) {

    },
    redo: function(cb) {

    }
  }
}
</script>
</body>
</html>
<?php
$title = "EstyJs";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>

  <body class="app_emulator">
  <canvas id = "EstyJsOutput" width="320" height="200" >

  <script src="js/estyJS.js"></script>
  <script src="js/processor.js"></script>
  <script src="js/keyboard.js"></script>
  <script src="js/mfp.js"></script>
  <script src="js/fdc.js"></script>
  <script src="js/io.js"></script>

  <script src="js/bug.js"></script>

  <script src="js/display.js"></script>
  <script src="js/memory.js"></script>
  <script src="js/snapshot.js"></script>
  <script src="js/sound.js"></script>
  <script src="js/main.js"></script>
      <script src="js/files.js"></script>
      <script src="js/js-unzip.js"></script>
      <script src="js/rawinflate.js"></script>

  <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>

  <script>
    estyjs = EstyJs("EstyJsOutput");
    console.log(estyjs);
  </script>
  </body>
</html>


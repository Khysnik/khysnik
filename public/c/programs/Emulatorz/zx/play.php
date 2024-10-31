<?php
$title = "jsspeccy";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>
<style></style>
</head>
  <body class="app_emulator">

    <div id="jsspeccy-viewport"></div>

    <script src="jdataview.js"></script>
    <script src="jsspeccy-core.js"></script>

    <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>

    <script>
      var jsspeccy = JSSpeccy('jsspeccy-viewport', {'autostart': true, scaleFactor:1});

      var viewport = document.getElementById('jsspeccy-viewport');
      
      viewport.onclick = function() {
        if (jsspeccy.isRunning) {
          jsspeccy.stop();
        } else {
          jsspeccy.start();
        }
      }
      
    </script>
  </body>
</html>

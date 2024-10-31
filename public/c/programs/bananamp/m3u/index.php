<?php
$title = "bananamp";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<link rel="stylesheet" href="./bananamp.css">
<body class="skin_base">
<div class="ui_layout ui_unselectable">
  <article>
    <aside class="_skin_outset _skin_base _mr5 mb1" style="width:300px;">
      <div class="ui_layout">
        <header class="_pa5 _mr5" ondrop="drop(event)" ondragover="allowDrop(event)">
          <div id="bView" class="skin_inset _skin_nerd">
            <div id="bFilter">
              <div id="bLoaded">
                <div>&nbsp;</div>
                <div id="bamp_info_loaded">01 world of wonders</div>
                <div id="bamp_time_loaded">
                  <span id="bamp_time_played_progress">--:--</span>
                  <span id="bamp_time_played_duration">--:--<span>
                </div>
                <canvas id="bLoaded_spectrum"></canvas>
              </div>
              <div id="bPlayed"></div>
              <div id="bamp_buffer"></div>
            </div>
            <div id="bRest"></div>
          </div>
          <div id="bamp_controls">
            <button class="bamp__control" id="bamp_previous"><i class="bamp__ico bamp__ico--previous"></i></button>
            <button class="bamp__control" id="bamp_play"><i class="bamp__ico bamp__ico--play"></i></button>
            <button class="bamp__control" id="bamp_stop"><i class="bamp__ico bamp__ico--stop"></i></button>
            <button class="bamp__control" id="bamp_next"><i class="bamp__ico bamp__ico--next"></i></button>
            <input style="margin-left:5px" type="range" id="bamp_volume" min="0" max="100" value="50" step="1">
            <div id="bananalogo" style="flex:1 0 16px; width:16px; padding-top:3px; margin-left:5px; margin-right:4px">
              <img src="icon.png" width="16" height="16" alt="">
            </div>
          </div>
        </header>
        <section>
          <div id="bamp_playlist" class="skin_inset"></div>
        </section>
      </div>
    </aside>
    <section id="bamp_sideview" class="skin_inset">
      <div class="ui_layout">
        <section id="bamp_viewer">
          <div id="tab_demo" class="ui_layout">
            <canvas id="canvasDemo"></canvas>
            <div id="divDemo"></div>
          </div>
        </section>
      </div>
    </section>
  </article>
</div>

  <script src="js/engine/aurora.js"></script>
  <script src="js/engine/codecs/mp3.js"></script>
  <script src="js/engine/codecs/flac.js"></script>
  <!--
  <script src="js/engine/codecs/alac.js"></script>
  <script src="js/engine/codecs/aac.js"></script>
  -->
  <script src="js/engine/codecs/ogg.js"></script>
  <script src="js/engine/codecs/vorbis.js"></script>
  <script src="js/engine/codecs/opus.js"></script>

  <script src="js/engine/webXmp.js"></script>
  <script src="js/engine/sample_player.js"></script>
  <script src="js/engine/pt.js"></script>

  <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>

  <script src="js/bananamp.js"></script>
  <script src="js/trackerview.js"></script>
  <script src="js/loadvisu.js"></script>
  <script>
    var songs = <?php
    $songs = array();
    $i=0;
    foreach (glob("../../files/music/goto80/*", GLOB_ONLYDIR) as $dir) {
      //foreach(glob($dir."/*.{aac,alac,flac,mp3,ogg,mod,amd,s3m,xm,rad,hsc,it}", GLOB_BRACE) as $file) {
      foreach(glob($dir."/*") as $file) {
        //if (preg_match("/mod\.|\.(aac|alac|flac|mp3|m4a|ogg|wav|mod|amd|s3m|xm|rad|hsc|it)$/i", $file)) {
        if (preg_match("/mod\.|\.(aac|alac|flac|mp3|ogg|wav|mod|amd|s3m|xm|rad|hsc|it)$/i", $file)) {
          $songs[] = $dir.'/'.substr($file, strrpos($file, "/")+1);
        }
      }
      $i++;
    }
    echo json_encode($songs);
    ?>;
  </script>
  <script src="js/index.js"></script>

<script>



</script>

</body>
</html>

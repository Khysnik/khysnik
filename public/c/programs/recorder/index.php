<?php
$title = "Recorder";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>
    <title>Recorder</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <div id="top">
      <div id="controls">
    	 <button id="recordButton">Record</button>
    	 <button id="pauseButton" disabled>Pause</button>
    	 <button id="stopButton" disabled>Stop</button>
      </div>
      <div id="formats">Format: start recording to see sample rate</div>
    	<h4>Recordings</h4>
    </div>

  	<ol id="recordingsList"></ol>

    <!-- inserting these scripts at the end to be able to use all the elements in the DOM -->
  	<script src="js/recorder.js"></script>
  	<script src="js/app.js"></script>
    
  </body>
</html>
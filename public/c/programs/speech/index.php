<?php
$title = "Speech Synthesis";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>

<body class="skin_base noscroll">

  <style>
  body {
    padding: 4px;
    padding-right: 5px;
  }
  #msg {
    font-size: 0.9em;
    line-height: 1.4em;
  }
  #msg.not-supported strong {
    color: #CC0000;
  }
  textarea, select {
    width: 100%;
  }
  input[type="range"] {
    width: 100%;
  }
  label {
    display: inline-block;
    float: left;
    width: 150px;
  }
  .option {
    margin: 1em 0;
  }

  button {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  </style>

  <div id="page-wrapper">

  <p id="msg"></p>

  <!-- <input type="text" name="speech-msg" id="speech-msg" x-webkit-speech> -->
  <textarea name="speech-msg" id="speech-msg" x-webkit-speech cols="30" rows="7"></textarea>

	<div class="option">
		<label for="voice">Voice</label>
		<select name="voice" id="voice"></select>
	</div>
	<div class="option">
		<label for="volume">Volume</label>
		<input type="range" min="0" max="1" step="0.1" name="volume" id="volume" value="1">
	</div>
	<div class="option">
		<label for="rate">Rate</label>
		<input type="range" min="0.1" max="10" step="0.1" name="rate" id="rate" value="1">
	</div>
	<div class="option">
		<label for="pitch">Pitch</label>
		<input type="range" min="0" max="2" step="0.1" name="pitch" id="pitch" value="1">
	</div>

	<button id="speak">Speak</button>

</div>

  <script src="js/index.js"></script>

</body>
</html>

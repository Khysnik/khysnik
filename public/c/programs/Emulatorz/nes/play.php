<?php
$title = "NES";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php' ?>
		
		<script type="text/javascript" src="jsnes.js"></script>
		<script type="text/javascript" src="nes-embed.js"></script>
		<style>
			body{
				margin: 0;
				padding: 0;
			}
		</style>
	</head>
	  <body class="app_emulator">
		
		<canvas id="nes-canvas" width="256" height="240" style=""/>
		<!--<p>DPad: Arrow keys<br/>Start: Return, Select: Tab<br/>A Button: A, B Button: S</p>-->

		<?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>

		<script>

	        function openRom(path) {
		      window.parent.$file.open(path, 'Blob', function(val) {
		        $state.loaded();
		        startGame(val);
		      });
		    }

		    function startGame (blob) {
		      var binaryHandle = new FileReader();
		      binaryHandle.onload = function () {
		        if (this.readyState === 2) {
		          try {
		            nes_load_data("nes-canvas", this.result);
		          } catch (e) {
		            parent.$alert('Invalid rom: ' + e.message);
		          }
		        }
		      };
		      binaryHandle.readAsBinaryString(blob);
		    };

		    $state.loading();

			window.onload = function(){
				if ($url.query.rom) {
			      openRom($url.query.rom)
			    } else {
			      parent.$explorer('c/files/roms/nes/', {browse: true, explorer: true, onclose: function(ok, file) {
			        if (ok) openRom(file);
			      }})
			    }
			}

		</script>

	</body>
</html>

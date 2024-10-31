<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Midi Player</title>
	<script src='midijs/midi.js'></script>
	<script src="/c/libs/jquery.min.js"></script>
	<style>
		@import url(/c/sys42.css);
		@import url(/c/sys/skins/w93.css);

		html{
			background: silver;
		}

		body{
			overflow: hidden;
			width: 100%;
			height: 100%;
		}

		ul{
			padding: 0;
			margin: 0;
			display: none;
		}
		li{
			padding-left: 10px;
			cursor:pointer;
			list-style: none;
		}

		#playlist > ul > li:nth-child(2n) {
		  background-color: #eee;
		}

		li:hover, #playlist > ul > li:nth-child(2n):hover {
		  	color: #000;
			background: #C3FF00;
		}

		#folders{
			width: calc(100% - 0px);
			color: black;
			position: fixed;
			top: 30px;
			left: 0;
			padding: 7px;
			background: darkgray;
			height: 36px;
			border-bottom: 1px solid gray;
		}

		#console{
			width: calc(100% - 0px);
			background: black;
			color: #C3FF00;
			border: 5px solid black;
			position: fixed;
			top: 0;
			left: 0;
			height: 30px;
			padding: 3px;
		}

		#console:hover{
			background: red;
			border: 5px solid red;
			cursor: not-allowed;
		}

		#playlist {
			position: absolute;
		    top: 67px;
		    background: white;
		    left: 0;
		    width: calc(100% - 0px);
		    height: calc(100% - 40px);
		    overflow-y: scroll;
		    overflow-x: hidden;
		    margin-left: 0px;
		    margin-right: 10px;
		}

		.folder{
			cursor: pointer;
			text-align: center;
		}

		.folder:hover{
			background: #C3FF00;
			color: #000;
		}
		button.fClicked{
			color: #dfdfdf;
			border-top: 1px solid gray;
			border-left: 1px solid gray;
			border-right: 1px solid gray;
			border-bottom: 1px solid gray;
			box-shadow: inset 1px 1px #000,1px 0 #dfdfdf,0 1px #dfdfdf,1px 1px #dfdfdf;
			background-color: gray;
		}
		#download{
			display: none;
		}
	</style>	
</head>
<body>

<?php 

	$dir    = 'songs/';
	$files = scandir($dir);
	natsort($files); // sort.
	echo "<div id='console'>Choose a song.</div>";
	echo "<div id='folders'>";
	foreach($files as $file) {

		if ($file==".") { continue; }
		if ($file=="..") { continue; }

		echo("<button class='folder'>$file</button>");
	}
	echo("<button id='download'>Download</button>");
	echo "</div>";
	echo '<div id="playlist">';

	/*
	$dir    = 'songs/';
	$files1 = scandir($dir);
	//$files2 = scandir($dir, 1);

	print_r($files1);
	//print_r($files2);
	*/
	// print.
	foreach($files as $file) {
	        
		if ($file==".") { continue; }
		if ($file=="..") { continue; }

			echo '<ul id="f_'.$file.'">';

			$subFiles = array();
			$subDir = opendir('songs/'.$file.'/'); // open the cwd..also do an err check.
			while(false != ($subFile = readdir($subDir))) {
			        if(($subFile != ".") and ($subFile != "..") and ($subFile != "index.php")) {
			                $subFiles[] = $subFile; // put in array.
			        }   
			}
			natsort($subFiles); // sort.
			foreach($subFiles as $subFile) {
				//echo("<li class='song' onClick='midi(\""."songs/".$file."/".$subFile."\")'>$subFile</li>");
				echo("<li class='song'>$subFile</li>");
			}
			echo '</ul>';

	}

echo '</div>';
?>


<script>
var midiFile="";
var current=0;
var nextTimeOut;

function next(index){
	$( "li.song" ).eq( index ).trigger('click')
}

$(function() {
	
	$( "li.song" ).click(function() {
		clearTimeout(nextTimeOut)
		midiFile="songs/"+$(this).parent().attr("id").replace("f_", "")+"/"+$(this).text();
	  	MIDIjs.play(midiFile);

	  	current = $(this).index('li.song');

	  	$('#console').text('Loading '+$(this).text()+' please wait...')
		$(this).css('color','#FF00FF')
		$('#download').show()
	});

	$(".folder").click(function() {
		if ($('#f_'+$(this).text()).css('display')=='none') {
			$('#f_'+$(this).text()).slideDown()
			$(this).addClass('fClicked');
		}else{
			$('#f_'+$(this).text()).slideUp()
			$(this).removeClass('fClicked');
		}
	});
	
	$("#console").click(function(){
		clearTimeout(nextTimeOut)
		MIDIjs.stop()
		$('#console').text('Choose a song.')
	})

	$("#download").click(function(){
		window.location.href = midiFile
	})
    
});
</script>
</body>
</html>
<?php
$title = "Robby";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<style type="text/css">
body, html{
	overflow: hidden;
}
* {
	-moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
body {
  background-color: #C0C0C0; color: #000000; line-height: normal;
  font-family: _tomo, "Courier New", monospace;
  font-size:8px;
  line-height: 1.5;
}
#picture_container {
	white-space: pre;
}
#tooltip {
	width : auto;
	background : #ffffe1;
	border-width : 1px;
	border-style : solid;
	border-color : #000;
	position : absolute;
	display : none;
	padding: 3px 6px;
}
</style>
<body class="cursor_default">
	<div id="content">
		<div style="display:none;" >
			<canvas id="p5" data-processing-sources="Robby.pde"
					width="100" height="100" style="display:none;">
				<p>Your browser does not support the canvas tag.</p>
			</canvas>
    	</div>
		<div id="picture_container" style="margin:auto; width:400px; text-align:center; padding:0px;">
			<div id="picture" style="text-align:center; margin:auto;" ></div>
			<div id="interactions" style="position:absolute; top:0px; left:0px; " ></div>
		</div><br/><br/>
		<div id="text" style="margin:auto;width:380px; white-space:pre-wrap;" ></div>
		<div id="restart" class="cursor_pointer" onclick="window.location.reload()" style="display:none; margin:auto;width:380px; white-space:pre-wrap; text-align:center;" >restart</div>
		<div id="tooltip" >this</div>
	</div>

	<script type="text/javascript" src="/c/libs/jquery.min.js"></script>
	<script src="/c/libs/processing.min.js" type="text/javascript"></script>

	<script>
	// convenience function to get the id attribute of generated sketch html element
	function getProcessingSketchId () { return 'Robby'; }

	$(document).on('mousemove', function(e){
		$('#tooltip').css({
		   left:  e.pageX+30,
		   top:   e.pageY
		});
		Processing.getInstanceById('p5').setJsMouseMoved(e.pageX,e.pageY);
	});

	var nextAction=-1;
	$(document).on("mouseover", ".interact", function(e){
		nextAction=$(this).attr("action");
		$("#tooltip").html($(this).attr("label"));
		$('#tooltip').css("display","block");
	});
	$(document).on("mouseleave", ".interact", function(e){
		nextAction=-1;
		$('#tooltip').css("display","none");
	});

	$(document).on("mousedown", ".interact", function(e){
		if (nextAction!=-1) Processing.getInstanceById('p5').act(nextAction);
	});

	$(window).resize(function() {
		Processing.getInstanceById('p5').updateScreen();
	});

	</script>
</body>
</html>

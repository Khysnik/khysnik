<?php

  $ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
  if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
      else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
      else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
      else $ip = "0-0-0-0"; 

      if ($ip!="77.152.167.27") {
       
       // die();
      }

    $noImage=true;
	$imgExts = array("gif", "jpg", "jpeg", "png", "tiff", "tif");
	$url =$_GET['url'];
	$urlExt = pathinfo($url, PATHINFO_EXTENSION);
	if (in_array($urlExt, $imgExts)) {
	  //
	}else{
		die();
	}
	


 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
	<script src="jquery.js"></script>
	<script src="jscii.js"></script>
</head>
<body>
<img src="" id="doge" style="visibility:hidden;position:absolute;">
<pre id="dogeTxt"></pre>
<script>
<?php 
$nick = $_GET['nick'];
?>function img2ascii(){
    var imgJscii = new Jscii({
        width: 80,
        color: false,
        el: document.getElementById('doge'),
        fn: function(str) {
            document.getElementById('dogeTxt').innerHTML = str;
            parent.printDoge('ascii',$('#dogeTxt').text());
        }
    });   
}<?php 
$url = $_GET['url'];
$img = 'pix/derp.gif';
file_put_contents($img, file_get_contents($url));
?>
var img = new Image();
setTimeout( function(){
 	$('#doge').attr('src','pix/derp.gif');
	img.src =  $('img#doge').attr('src');
}, 1000);
var doged = document.querySelector('img')
function loaded() {
  img2ascii();
}
if (doged.complete) {
  loaded()
} else {
  doged.addEventListener('load', loaded)
  doged.addEventListener('error', function() {})
}
</script>
</body>
</html>
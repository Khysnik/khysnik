<?php 
  $title = "Adobe Pizza Player";
  include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
  include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<style>
	body{
		margin: 0;
		padding: 0;
	}
	div{}
	.url{display: none;}
	.name,.folderName,.subFoldername{cursor: pointer;}
	.name:hover, .folderName:hover,.subFoldername:hover,span.subFolderName:hover{font-weight: bold;color: #C3FF00;background-color:#333;}
	.folderName, .subFolderName{
	    background-image: url(/c/sys/skins/w93/places/folder.png);
	    background-repeat: no-repeat;
	    background-position: top left;
	    background-size: contain;
	    padding-left: 20px;	
		image-rendering: crisp-edges;
		image-rendering: pixelated;
	}

	.name {
		background-image: url(/c/sys/skins/w93/mime/swf.png);
	    background-repeat: no-repeat;
	    background-position: top left;
	    background-size: contain;
	    padding-left: 20px;	
		image-rendering: crisp-edges;
		image-rendering: pixelated;		
	}

	#container{
		background: #000;
		height: 100vh;
		width: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		padding: 0;
		margin: 0;
	}
	#listing{
		background: #fff;
		width: calc(100% + 12px);
		z-index: 1000;
		position: absolute;
		height: 100vh;
		overflow-y: scroll;
		display: none;
		padding-top: 5px;
		margin-left: -12px;
	}
	.folderChild, .subFolderChild{
		display: none;
	}
	span.name, .folder{
    	margin-left: 20px;
	}
	#menu{
		position: absolute;
	    top: 0;
	    left: 0;
	    z-index: 1001;
	    width: 100%;
	    background: silver;
	    padding-top: 2px;
    	height: 20px;
    	border-bottom: 1px solid #666;
    	padding-left: 6px;
    	display: none;
	}
	#menu span{
		margin-right: 5px;
		cursor: pointer;
	}

	#loadingConsole{
		position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%,-50%);
	    color: #fff;
	    z-index: 1000;
	    pointer-events: none;
	    background-image: url(img/pizza.gif);
	    background-repeat: no-repeat;
	    background-position: top center;
	    padding-top: 80px;
	    background-size: 80px;
	    image-rendering: pixelated;
	    font-size: 8px;
	    width: 100%;
	    text-align: center;
	}

	#loadingConsoleContainer{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: -webkit-linear-gradient(top left, #333333 25%, #555555 25%, #555555 50%, #333333 50%, #333333 75%, #555555 75%, #555555 100%);
		background-image: -o-linear-gradient(top left, #333333 25%, #555555 25%, #555555 50%, #333333 50%, #333333 75%, #555555 75%, #555555 100%);
		background-image: linear-gradient(to bottom right, #333333 25%, #555555 25%, #555555 50%, #333333 50%, #333333 75%, #555555 75%, #555555 100%);
		background-size: 56.57px 56.57px;
		z-index: 1000;
		display:none;
		cursor: url(/c/sys/cursors/default.cur),default;
	}

	<?php if (isset($_GET['swf'])){ ?>
		#loadingConsoleContainer{
			display: block;
		}
	<?php } ?>
	
	/* Chrome, Safari and Opera syntax */
	:-webkit-full-screen #menu{display: none;}
	}

	/* Firefox syntax */
	:-moz-full-screen #menu{display: none;}
	}

	/* IE/Edge syntax */
	:-ms-fullscreen #menu{display: none;}
	}

	/* Standard syntax */
	:fullscreen #menu{display: none;}
	}

</style>

</head>
<body>
<div id="menu">
	<span id="browse" onclick="window.location='.'">Browse Files</span> <span id="random" onclick="randomFlash()">Random File</span> <?php if (isset($_GET['swf'])){ ?><span id="fullscreen" onclick="openFullscreen()">Fullscreen</span> <span id="download" onclick="download()">Download</span><?php } ?> 
</div>

<?php if (isset($_GET['swf'])){ ?>
	<div id="loadingConsoleContainer">
		<div id="loadingConsole">loading...</div>
	</div>	
<?php } ?>	
<?php if (isset($_GET['swf'])){ ?>
<div id="container"></div>
<?php } ?>

<?php
function getFilesInDirectoryAsArray($directory, $recursive, $arrFilter=array()) {
    $arrItems = array();
	if(substr($directory, strlen($directory)-1, 1) != "/"){
		$directory.="/";
	}
	if(count($arrFilter)){
		$filterMap=array();
		for($i=0;$i<count($arrFilter);$i++){
			$filterMap[$arrFilter[$i]]=true;
		}
		var_dump($filterMap);
		recurseDirectoryWithFilter($arrItems, $directory, $recursive, $filterMap);
	}else{
		recurseDirectory($arrItems, $directory, $recursive);
	}
    return $arrItems;
}
function recurseDirectory(&$arrItems, $directory, $recursive) {
	if ($handle = opendir($directory)) {
		while (false !== ($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				if(is_dir($directory.$file)) {
					if($recursive){
						recurseDirectory($arrItems, $directory.$file."/", $recursive);
					}
				}else{
					if (getFileExt($file)=="swf") {
						//$arrItems[] = $directory . $file;
						$arrItems[] = $file;
					}
				}
			}
		}
		closedir($handle);
	}
    return $arrItems;
}
function recurseDirectoryWithFilter(&$arrItems, $directory, $recursive, &$filterMap) {
	if ($handle = opendir($directory)) {
		while (false !== ($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				if(is_dir($directory.$file)) {
					if($recursive){
						recurseDirectoryWithFilter($arrItems, $directory.$file."/", $recursive, $filterMap);
					}
				}else{
					if(isset($filterMap[getFileExt($file)])){

						if (getFileExt($file)=="swf") {
							//$arrItems[] = $directory . $file;
							$arrItems[] = $file;
						}
						
					}
				}
			}
		}
		closedir($handle);
	}
    return $arrItems;
}
function getFileExt($path){
	$pos=strrpos($path, ".");
	if($pos===FALSE){
		return "";
	}else{
		return substr($path, $pos+1);
	}
}
?>

<div id="listing">
<?php 

$path = 'swfs';
$subLevel1 = glob($path . '/*' , GLOB_ONLYDIR);
natsort($subLevel1); $subLevel1 = array_values($subLevel1);
for ($i=0; $i < count($subLevel1); $i++) { 

	$subFolder = str_replace($path."/", "", $subLevel1[$i]);
	
	echo "<div>";
		//echo $path."/".$subFolder;
		echo "<div class='folder'><span class='folderName'>".$subFolder."</span>";

			echo "<div class='folderChild'>";

				$subLevel2 = glob($path."/".$subFolder . '/*' , GLOB_ONLYDIR);
				natsort($subLevel2); $subLevel2 = array_values($subLevel2);
				for ($j=0; $j < count($subLevel2); $j++) {
					$subFolder2 = str_replace($path."/".$subFolder."/", "", $subLevel2[$j]);
					echo "<div class='folder'><span class='subFolderName'>".$subFolder2."</span>";
						echo "<div class='subFolderChild'>";
							$scan =  getFilesInDirectoryAsArray($path."/".$subFolder."/".$subFolder2,false,array()); 
							natsort($scan); $scan = array_values($scan);
							for ($k=0; $k < count($scan); $k++) { 
								if(strpos($subFolder2, '*') !== false){
									$working='';
								}else{
									$working='works';
								}
								echo '<div class="swf '.$working.'">';
									echo  "<span class='name'>".$scan[$k]."</span><span class='url'>".$path."/".$subFolder."/".$subFolder2."/".$scan[$k]."</span>"; 
								echo '</div>'; 
							}
						echo "</div>";
					echo "</div>";
				}

				$scan =  getFilesInDirectoryAsArray($path."/".$subFolder,false,array());
				natsort($scan); $scan = array_values($scan);
				for ($k=0; $k < count($scan); $k++) { 
					if(strpos($subFolder, '*') !== false){
						$working='';
					}else{
						$working='works';
					}
					echo '<div class="swf '.$working.'">';
						//echo  $scan[$k];
						echo  "<span class='name'>".$scan[$k]."</span><span class='url'>".$path."/".$subFolder."/".$scan[$k]."</span>";
					echo '</div>'; 
				}			

			echo "</div>";

		echo "</div>";


	echo "</div>";

}

/*
	$swfs = getFilesInDirectoryAsArray("swfs/",true);

	for ($i=0; $i < count($swfs); $i++) { 
		

		echo '<div>';
			echo  $swfs[$i];
		echo '</div>'; 

	}
*/

?>
</div>

<script src="js/jquery.js"></script>
<script>

	function getQueryVariable(variable)
	{
	       var query = window.location.search.substring(1)
	       var vars = query.split("&")
	       for (var i=0;i<vars.length;i++) {
	               var pair = vars[i].split("=")
	               if(pair[0] == variable){return pair[1]}
	       }
	       return(false)
	}
	
	window.RufflePlayer = window.RufflePlayer || {};
	var ruffle, player, container;

	function randomFlash(){
		var url=$($('.works')[parseInt(Math.random()*$('.swf').length)]).find('.url').text()
		url=url.replace('swfs/', '')
		url=url.replace('.swf', '')
		window.location='/d/programs/flash/?swf='+url
	}

	$('.name').click( function(){
		var url=$(this).parent().find('.url').text()
		url=url.replace('swfs/', '')
		url=url.replace('.swf', '')
		window.location='?swf='+url
	})
	$('.folderName').click( function(){
		$(this).parent().find('.folderChild').toggle();
	})
	$('.subFolderName').click( function(){
		$(this).parent().find('.subFolderChild').toggle();
	})

	/* Get the documentElement (<html>) to display the page in fullscreen */
	var elem = document.documentElement;

	/* View in fullscreen */
	function openFullscreen() {
	  if (elem.requestFullscreen) {
	    elem.requestFullscreen();
	  } else if (elem.mozRequestFullScreen) { /* Firefox */
	    elem.mozRequestFullScreen();
	  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	    elem.webkitRequestFullscreen();
	  } else if (elem.msRequestFullscreen) { /* IE/Edge */
	    elem.msRequestFullscreen();
	  }
	}

	/* Close fullscreen */
	function closeFullscreen() {
	  if (document.exitFullscreen) {
	    document.exitFullscreen();
	  } else if (document.mozCancelFullScreen) { /* Firefox */
	    document.mozCancelFullScreen();
	  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
	    document.webkitExitFullscreen();
	  } else if (document.msExitFullscreen) { /* IE/Edge */
	    document.msExitFullscreen();
	  }
	}

</script>

<script>


<?php 
if (isset($_GET['swf'])){
?>

	function copyStringToClipboard(str) {
	   var el = document.createElement('textarea');
	   el.value = str;
	   el.setAttribute('readonly', '');
	   el.style = {position: 'absolute', left: '-9999px'};
	   document.body.appendChild(el);
	   el.select();
	   document.execCommand('copy');
	   document.body.removeChild(el);
	}
	function share(){
		copyStringToClipboard(window.location)
		parent.$alert.info("Animation URL copied to clipboard.");
	}

	function download(){
		window.open('/d/programs/flash/swfs/'+getQueryVariable('swf')+'.swf')
	}

    window.addEventListener('DOMContentLoaded', (event) => {
      ruffle = window.RufflePlayer.newest();
      player = ruffle.create_player();
      player.onclick = function() { window.focus(); }; 
      container = document.getElementById('container');
      container.appendChild(player);
		if (getQueryVariable('swf')!=false) {
			player.stream_swf_url('swfs/'+getQueryVariable('swf')+'.swf');
		}
    });
<?php }else{ ?>
	function share(){
		parent.$alert('Choose a file first!')
	}
	function download(){
		parent.$alert('Choose a file first!')
	}
	$('#listing').show();
<?php } ?>
  </script>

<?php if (isset($_GET['swf'])){ ?>
  <script src="r/ruffle.js"></script>
<?php } ?>
<?php if (isset($_GET['random'])){ ?>
  <script>randomFlash()</script>
<?php } ?>
</body>
</html>
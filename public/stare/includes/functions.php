<?php 

	function nope(){
		echo 'nope';
		die();
	}

	function folder_exist($folder){
	    $path = realpath($folder);
	    return ($path !== false AND is_dir($path)) ? $path : false;
	}

	function printDev($d){

		$file = 'd/'.$d.'/user.json';
		if (file_exists($file)) {
			$devSource = file_get_contents($file);
			$devData = json_decode($devSource, true);
			echo '<a href="?d='.$d.'">'.$devData['name'].'</a>';
		}
		
	}
?>
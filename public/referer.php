<?php 
	$noViral = false;
	if ($noViral) {
		// anti viral
		$referers = array( 
			"pierrepapierciseaux.net",
			"twitter.com",
			"t.co",
			"reddit.com",
			"facebook.com",
			"vk.com",
			"youtube.com",
			"discordapp.com"
		);
		//
		for ($i=0; $i < count($referers); $i++) { 
			if (stripos($_SERVER['HTTP_REFERER'], $referers[$i]) !== false){
			    echo 'We don\'t want this thing to go viral.<br>Please comeback later.';
			    return;
			}
		}		
	}
?>
<?php 
date_default_timezone_set("Europe/Paris");
$hour=date('H');
if ($hour<8) {
	echo 'Board is currently closed. Please check back later';
	die;
}
?>
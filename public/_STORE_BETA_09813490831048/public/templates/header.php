<?php

$ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
	 if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
	      else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
	      else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
	      else $ip = "0-0-0-0"; 
/*
$notUs = true;
if($ip=="77.152.167.27"||$ip=="78.218.33.48"){
	$notUs = false;
}
if($notUs){
	echo "oof";
	die;
}
*/

?><!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Appstore</title>
	<link rel="stylesheet" href="css/style.css">
	<script type="text/javascript" src="js/jquery.js"></script>
</head>
<body>

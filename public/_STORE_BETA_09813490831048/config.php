<?php
/*
	Store Configuration 
*/
$host       = "localhost";
$username   = "root";
$password   = "bhwcaecb";
$dbname     = "appstore";
$dsn        = "mysql:host=$host;dbname=$dbname";
$options    = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
              );
//
$privatefolder = "temp";
//
$categories = array (
	"utility",   
	"productivity",
	"procrastination",
	"game",  
	"virus",
	"trojan",
	"random",
	"music",
	"theme",
	"theme",
	"editor",
	"glitch"
);

$types = array (
	"html",   
	"js",
	"css",
	"zip"
);


$fileextentions = array (
	"html",
	"js",
	"css",
	"zip"
);
$iconextentions = array (
	"png",
	"gif"
);
$screenshotextentions = array (
	"jpg",
	"jpeg",
	"png",
	"gif"
);
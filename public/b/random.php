<?php
if(!file_exists('config.php')){
	include "strings/en.php";
	die(S_NOTCONFIGURED);
}

include "config.php";
include "strings/".LANGUAGE.".php";		//String resource file

$posts = array(); 
$con = mysql_connect(SQLHOST,SQLUSER,SQLPASS);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("b", $con);
$result = mysql_query("SELECT * FROM `post` WHERE resto = 0 ORDER BY `no` ASC;");

while($row = mysql_fetch_array($result))
  {
  array_push($posts, $row["no"]);
  }

mysql_close($con);
$newURL = HOME."imgboard.php?res=".$posts[array_rand($posts)];

?><script>window.location = <?php echo "'".$newURL."'"; ?></script>
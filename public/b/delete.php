<?php

session_start();
$admin = false;
$nope = "admin only";
if (isset($_SESSION["name"])) {
	if ($_SESSION["name"]=='b') { $admin=true; }
}else{
	echo $nope; die();
}

if(isset($_GET['p'])) {
	$post = $_GET['p'];
}else{
	echo $nope; die();
}




// echo $_SERVER['HTTP_REFERER'].'<br>';
// die();


if(!file_exists('config.php')){
	include "strings/en.php";
	die(S_NOTCONFIGURED);
}

include "config.php";
include "strings/".LANGUAGE.".php";		//String resource file


//echo POSTTABLE;

//echo $post;




	$con = mysql_connect(SQLHOST,SQLUSER,SQLPASS);
	if (!$con)
	  {
	  die('Could not connect: ' . mysql_error());
	  }

	
	$sql = "delete from ".POSTTABLE." where no=".$post;

	mysql_select_db("b");
	$retval = mysql_query( $sql, $con );

   if(! $retval ) {
      die('Could not delete data: ' . mysql_error());
   }
   echo "Deleted data successfully\n";
   mysql_close($con);

?><script>window.location = <?php echo "'".$_SERVER['HTTP_REFERER']."'"; ?></script>
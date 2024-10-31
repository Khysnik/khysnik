<?php 
include "templates/header.php"; 
require "../config.php";
require "../common.php";

try {
  $connection = new PDO($dsn, $username, $password, $options);

  $sql = "SELECT * FROM users";
  $statement = $connection->prepare($sql);
  $statement->execute();
  $result = $statement->fetchAll();

} catch(PDOException $error) {
  echo $sql . "<br>" . $error->getMessage();
}

$yourkeyisfake = true;
$yourpassisfake = true;
$usernotlogged = true;
$name = "";

if(isset($_GET['key'])) {
    // id index exists
}else{
	echo "ERROR: You need a key.";
	die;	
}

foreach ($result as $row) :
	if ($row['userkey']==$_GET['key']) {
		$yourkeyisfake = false;
		if (isset($_POST['submit'])) {
			if ($row['pass']==$_POST['pass']) {
				$name = $row['username'];
				$userid = $row['id'];
				$userkey =  $row['userkey'];
				$yourpassisfake = false;
				$usernotlogged = false;
			}
		}

		//form
		if ($usernotlogged) {
			?>
				<form method="post" enctype="multipart/form-data">
			    	<label for="appname">Type your password</label>
			    	<input type="password" name="pass" id="pass">
			    	<input type="submit" name="submit" value="Groovy">
				</form>
			<?php
		}
	}
endforeach; 

if ($yourkeyisfake) {
	echo "ERROR: Key does not exist.";
	die;
}

if (isset($_POST['submit'])) {
	if ($yourpassisfake) {
		echo "ERROR: Your password is incorrect.";
		die;
	}
}
if ($usernotlogged) {die;}
echo 'Hi '.$name.'.<br>';
setcookie("appstore",$_GET['key']);

// echo "key: ".$_COOKIE["appstore"]."<br>";


if (isset($_POST['submit'])) {

  try {
    $connection = new PDO($dsn, $username, $password, $options);



    $sql = "UPDATE users SET verified = '1' WHERE id =".$userid;
  	$statement = $connection->prepare($sql);
    $statement->execute();

  	
  } catch(PDOException $error) {
      echo $sql . "<br>" . $error->getMessage();
  }
  
}
?>


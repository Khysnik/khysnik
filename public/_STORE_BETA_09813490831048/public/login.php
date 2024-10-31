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

$usernotlogged = true;
$name = "";

if(!isset($_COOKIE['appstore'])) { 
	// no cookie for you
}else{
	// cookie exists
	foreach ($result as $row) :
		if ($row['userkey']==$_COOKIE['appstore']) {
			$usernotlogged = false;
			$name = $row['username'];
		}else{
			//echo "ERROR: Key does not exist.";
			//die;	
		}
	endforeach; 
}

if (isset($_POST['submit'])) {
	
	foreach ($result as $row) :
		if ($row['username']==$_POST['username']) {
			if ($row['pass']==$_POST['pass']) {
				$name = $row['username'];
				setcookie("appstore",$row['userkey']);
				$usernotlogged = false;
			}else{
			 	
			}
		}else{
			
		}
	endforeach; 
}

if ($usernotlogged) {
	if(!isset($_COOKIE['appstore'])) { ?>
			<form method="post" enctype="multipart/form-data">
		    	<h3>Login</h3>
		    	<label for="username">Name</label>
		    	<input type="username" name="username" id="username"><br>
		    	<label for="password">Password</label>
		    	<input type="password" name="pass" id="pass"><br>
		    	<input type="submit" name="submit" value="submit">
			</form>
		<?php
	}
}


if (!$usernotlogged) {
	echo 'Hi '.$name.'!<br>You are logged.';
	echo "<script>window.location.href='index.php'</script>";
}
?>
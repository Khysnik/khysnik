<?php

$usernotlogged = true;
$isAdmin = false;
$isdev = false;   


// Cross Site Script  & Code Injection Sanitization
function xss_cleaner($input_str) {
    $return_str = str_replace( array('<',';','|','&','>',"'",'"',')','('), array('&lt;','&#58;','&#124;','&#38;','&gt;','&apos;','&#x22;','&#x29;','&#x28;'), $input_str );
    $return_str = str_ireplace( '%3Cscript', '', $return_str );
    return $return_str;
}


session_start();

if (empty($_SESSION['csrf'])) {
	if (function_exists('random_bytes')) {
		$_SESSION['csrf'] = bin2hex(random_bytes(32));
	} else if (function_exists('mcrypt_create_iv')) {
		$_SESSION['csrf'] = bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));
	} else {
		$_SESSION['csrf'] = bin2hex(openssl_random_pseudo_bytes(32));
	}
}

/**
 * Escapes HTML for output
 *
 */

function escape($html) {
    return htmlspecialchars($html, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}


if( isset( $_COOKIE['appstore']  ) )
{
	try  {
	$connection = new PDO($dsn, $username, $password, $options);

	  $sql = "SELECT * FROM users";
	  $statement = $connection->prepare($sql);
	  $statement->execute();
	  $result = $statement->fetchAll();

	// check if user exist...
	foreach ($result as $row) :
		if ($row['userkey']==$_COOKIE['appstore']) {
			$usernotlogged = false;
			$name = $row['username'];
			if ($row['verified']=="1") {
			  $creatorname = $row['username'];
			  $isdev=true;
			  if ($row['username']=="janken") {
			  	$isAdmin=true;
			  }
			}
		}
	endforeach;

	} catch(PDOException $error) {
	  echo $sql . "<br>" . $error->getMessage();
	}

}
else
{
	
}


/*
get id name etc...
*/

?><h1>Appstore42</h1><?php
	if (!$usernotlogged) {
		echo '<p>Hello '.$name.'!</p>';
	}
?>

	<a href="index.php?sort=popular"><input type="submit" value="POPULAR APPS" /></a>
	<a href="index.php?sort=new"><input type="submit" value="NEW APPS" /></a>



	<?php	
	if (!$usernotlogged) {
	?>

		<a href="index.php?user=<?php echo $name; ?>"><input type="submit" value="Your Apps" /></a>
	<?php
	}

	if (!$usernotlogged) {
			echo '<a href="logout.php"><input type="submit" value="LOGOUT" /></a>';
	}else{ 
			echo '<a href="signin.php"><input type="submit" value="REGISTER AS DEVELOPPER" /></a> <a href="login.php"><input type="submit" value="LOGIN" /></a>';
	} 
?>
<hr>
<?php
	include './includes/config.php';
	include './includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>APPSTORE</title>
	<link rel="stylesheet" href="./css/style.css">
	<script type="text/javascript" src="js/jquery.js"></script>
</head>
<body>
	<?php 
		include './includes/header.php';

		// apps
		if (isset($_GET['a'])) { 
			include './includes/apps.php';
		}

		// devs
		if (isset($_GET['d'])) { 
			include './includes/devs.php';
		}


	?>
	<script type="text/javascript" src="js/script.js"></script>
</body>
</html>
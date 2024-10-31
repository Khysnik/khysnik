<?php
	if (isset($_COOKIE['appstore'])) {
	    setcookie("appstore", "", time()-3600);
	} else {

	}
?><script>window.location.href='index.php'</script>
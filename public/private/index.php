<img src="00.jpg">
 <?php
$file = fopen ('ip.log', 'a+');
fwrite($file, $_SERVER['REMOTE_ADDR']."\r\n")
?> 
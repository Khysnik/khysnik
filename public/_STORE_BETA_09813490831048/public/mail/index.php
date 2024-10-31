<?php

$ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
      if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
           else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
           else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
           else $ip = "0-0-0-0"; 
$notUs = true;
if($ip=="77.152.167.27"||$ip=="78.218.33.48"){
     $notUs = false;
}
if($notUs){
     echo "oof";
     die;
}


?><title>BETA93MAIL</title>
<style>
     html{font-family: Comic Sans MS;background:#ddd;}
     label{font-weight: bold}
     input{width: 100%;min-height: 40px;}
     textarea{width: 100%;min-height: 500px;}

</style>

<form method="post" action="mail.php">
     <label for="name">Nom:</label><br>
     <input type="text" name="Subject" id="name" required value="Stive Gates" /><br>
     <label for="name">Objet Du Message:</label><br>
     <input type="text" name="Sujet" id="subject" required value="APPSTORE 42 BETA" /><br>
     <label for="email">Email:</label><br>
     <input type="email" name="email" id="email" required value="contact@windows93.net" /><br>
     <label for="message">Message:</label><br>
     <textarea name="message" id="message" required></textarea><br>
     <input type="submit" value="Envoyer Mon Message" />
</form>
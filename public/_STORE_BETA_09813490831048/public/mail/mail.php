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
  $file = file_get_contents('betaTesta.txt');
  $to = "contact@windows93.net";
  $subject = $_POST['Sujet'];
  $headers = "Bcc: ".$file."\r\n";
  $headers .= "From: Windows93 <".$_POST['email'].">\r\n" .
     "X-Mailer: php";
     $headers .= "MIME-Version: 1.0\r\n";
     $headers .= "Content-Type: text/plain; charset=ISO-8859-1\r\n";
  $message = $_POST['message'];

 
     if (mail($to, $subject, $message, $headers)) {
     $sent = "Your email was sent!";
     } else {
      $sent = ("Error sending email.");
     }
      
     echo $sent;
     

?>
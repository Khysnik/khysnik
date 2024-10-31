
<?php

$destmail='jknppp@gmail.com';
$sourcemail='noreply@windows93.net'; 
$subject='Registration to Windows93 Developer Program';

// Le message
$message  = "Thanks for signing up at Windows93 Developer Program!\n";
$message .= "\n";
$message .= "Activate your account by visiting the following link:\n";
$message .= "http://www.windows93.net/store/public/activate.php?key=derp\n";
$message .= "\n";
$message .= "Thanks,\nStive Gates";

// Dans le cas où nos lignes comportent plus de 70 caractères, nous les coupons en utilisant wordwrap()
//$message = wordwrap($message, 70, "\r\n");




    $headers  = "From: Windows93.net< ".$sourcemail." >\n";
    /*$headers .= "Cc: testsite < mail@testsite.com >\n"; */
    $headers .= "X-Sender: Windows93.net< ".$sourcemail." >\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    $headers .= "X-Priority: 1\n"; // Urgent message!
    /*$headers .= "Return-Path: mail@testsite.com\n"; // Return path for errors*/
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=ISO-8859-1\n";




// Envoi du mail
mail($destmail, $subject, $message, $headers );

/*
Dear Pierre-erick Lefebvre,

Thank you for joining the Apple Developer Program. You can now take advantage of membership benefits to create and distribute innovative apps. Learn how to get started.

To manage your account, sign in.

Best regards,
Apple Developer Relations 
*/

?>




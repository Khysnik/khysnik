<?php

// test
/////////////////////////////////////////////////////////////////////////////
/*
$notframable = false;
$url = $_GET["url"]; //'http://facebook.com';

$ch = curl_init();
echo 'ok : '.$url*/


// script original
/////////////////////////////////////////////////////////////////////////////
//http://stackoverflow.com/a/21263774/1289275



$notframable = false;
$url = $_POST["url"]; //'http://facebook.com';

$ch = curl_init();

$options = array(
  CURLOPT_URL            => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HEADER         => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_ENCODING       => "",
  CURLOPT_AUTOREFERER    => true,
  CURLOPT_CONNECTTIMEOUT => 120,
  CURLOPT_TIMEOUT        => 120,
  CURLOPT_MAXREDIRS      => 10,
);
curl_setopt_array($ch, $options);
$response = curl_exec($ch);
$info = curl_getinfo($ch);
$headers = substr($response, 0, $info['header_size']);
if ( stripos($headers, 'X-Frame-Options: deny')>-1 || stripos($headers, 'X-Frame-Options: SAMEORIGIN')>-1) {
  $notframable = true;
}
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo json_encode(array('httpcode'=>$httpcode, 'notframable'=>$notframable));




// corbeille
/////////////////////////////////////////////////////////////////////////////

/*if ($full) {
  echo json_encode(array('response'=>$response, 'info'=>$info, 'httpcode'=>$httpcode, 'notframable'=>$notframable));
} else {
}
*/

/*function get_contents() {
  $url = $_POST["url"]; //'http://facebook.com';
  $notframable = false;
  $contents = file_get_contents($url);
  //file_get_contents("https://diasporafoundation.org/");
  //file_get_contents("http://www.windows93.net");
  //file_get_contents("http://www.windows93.net");
  //var_dump($http_response_header);
  foreach ($http_response_header as &$header) {
    if ( stripos($header, 'X-Frame-Options: deny')>-1 || stripos($header, 'X-Frame-Options: SAMEORIGIN')>-1) {
      $notframable = true;
    }
  }
  echo json_encode(array('url'=>$url, 'headers'=>$http_response_header, 'notframable'=>$notframable));
}
get_contents();*/

?>

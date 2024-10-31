<?php
$url = $_GET['url'];
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; CrawlBot/1.0.0)');
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
// curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT , 5);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_ENCODING, "");
curl_setopt($ch, CURLOPT_AUTOREFERER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);    # required for https urls
curl_setopt($ch, CURLOPT_MAXREDIRS, 15);  
$return = curl_exec($ch);
curl_close($ch);
/*$return = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $return);*/
echo $return;
?>

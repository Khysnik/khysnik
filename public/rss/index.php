<?php
header("Content-Type: application/xml; charset=utf-8");
$xml = simplexml_load_file('../feed.rss');
echo $xml->asXML();
?>

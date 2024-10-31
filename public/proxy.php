<?php

// http://stackoverflow.com/a/8087233
if ("POST" == $_SERVER["REQUEST_METHOD"]) {
  if (isset($_SERVER["HTTP_ORIGIN"])) {
    $address = "http://".$_SERVER["SERVER_NAME"];
    if (strpos($address, $_SERVER["HTTP_ORIGIN"]) !== 0) {
      exit("CSRF protection in POST request: detected invalid Origin header: ".$_SERVER["HTTP_ORIGIN"]);
    }
  }
}


// iframable

function iframable($url) {
  $url_headers = get_headers($_POST['url']);
  foreach ($url_headers as $prop => $value) {
    $x_frame_options_deny = strpos(strtolower($url_headers[$prop]), strtolower('X-Frame-Options: DENY'));
    $x_frame_options_sameorigin = strpos(strtolower($url_headers[$prop]), strtolower('X-Frame-Options: SAMEORIGIN'));
    $x_frame_options_allow_from = strpos(strtolower($url_headers[$prop]), strtolower('X-Frame-Options: ALLOW-FROM'));
    if ($x_frame_options_deny !== false || $x_frame_options_sameorigin !== false || $x_frame_options_allow_from !== false) {
      return false;
    }
  }
  return true;
}

function getFavicon($url) {

  // https://github.com/audreyr/favicon-cheat-sheet
  // http://stackoverflow.com/a/12298279

  $found = false;

  // make the URL simpler
  $elems = parse_url($url);
  $url = $elems['scheme'].'://'.$elems['host'];

  $html = file_get_contents($url);
  if (preg_match('!<head.*?>.*</head>!ims', $html, $match)) {
    $head = $match[0];
  } else $head = $html;

  $dom = new DOMDocument();
  // Use error supression, because the HTML might be too malformed.
  if (@$dom->loadHTML($head)) {
    $links = $dom->getElementsByTagName('link');
    // TODO: Improve this to adhere to a determined precedence.
    foreach ($links as $link) {
      if ($link->hasAttribute('rel') && strtolower($link->getAttribute('rel')) == 'icon' && strtolower($link->getAttribute('sizes')) == '32x32') {
        $favicon = $link->getAttribute('href');
        $found = TRUE;
        break;
      } elseif ($link->hasAttribute('rel') && strtolower($link->getAttribute('rel')) == 'apple-touch-icon-precomposed') {
        $favicon = $link->getAttribute('href');
        $found = TRUE;
      } elseif ($link->hasAttribute('rel') && strtolower($link->getAttribute('rel')) == 'shortcut icon') {
        $favicon = $link->getAttribute('href');
        $found = TRUE;
      } elseif ($link->hasAttribute('rel') && strtolower($link->getAttribute('rel')) == 'icon') {
        $favicon = $link->getAttribute('href');
        $found = TRUE;
      } elseif ($link->hasAttribute('href') && strpos($link->getAttribute('href'), 'favicon') !== FALSE) {
        $favicon = $link->getAttribute('href');
        $found = TRUE;
      }
    }

    if ($found) {
      // Make sure the favicon is an absolute URL.
      $parsed = parse_url($favicon);
      $favurl = $parsed['path'];
      if (substr($favurl, 0, 1) !== '/') $favurl = '/' . $favurl;
      if (!isset($parsed['scheme'])) {
        $favicon = $url . $favurl;
      }
      if (isset($parsed['host']) && $elems['host'] !== $parsed['host']) {
        $favicon = $elems['scheme'].'://'.$parsed['host'] . $favurl;
      }

      return $favicon;
    }
  }

  return false;
}

$url = $_POST['url'];

$out = array('iframable'=>iframable($url));

if (isset($_POST['favicon']) && $_POST['favicon'] === "true") {
  $out['favicon'] = getFavicon($url);
  exit(json_encode($out));
} else {
  exit(json_encode($out));
}


?>

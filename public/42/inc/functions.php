<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/sys/config.php';

function browser() {
  $user_agent = $_SERVER['HTTP_USER_AGENT'];
  if (strpos($user_agent, 'Opera') || strpos($user_agent, 'OPR/')) return 'opera';
  elseif (strpos($user_agent, 'Edge')) return 'edge';
  elseif (strpos($user_agent, 'Chrome')) return 'chrome';
  elseif (strpos($user_agent, 'Safari')) return 'safari';
  elseif (strpos($user_agent, 'Firefox')) return 'firefox';
  elseif (strpos($user_agent, 'MSIE') || strpos($user_agent, 'Trident/7')) return 'internet_explorer';
  return 'other';
}

function v($filepath) {
  return $filepath . '?v=' . VERSION;
}

?>

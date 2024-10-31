<?php
//phpinfo();
//echo "mail exist : " . function_exists( 'mail' );
// exit(0);
$title = "BUG REPORT";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';

$browser = browser();

// http://stackoverflow.com/a/4614123
/////////////////////////////////////////////////////////////////////////////
session_start();

// Creates a token usable in a form
function getToken(){
  $token = sha1(mt_rand());
  if(!isset($_SESSION['tokens'])){
    $_SESSION['tokens'] = array($token => 1);
  }
  else{
    $_SESSION['tokens'][$token] = 1;
  }
  return $token;
}

// Check if a token is valid. Removes it from the valid tokens list
function isTokenValid($token){
  if(!empty($_SESSION['tokens'][$token])){
    unset($_SESSION['tokens'][$token]);
    return true;
  }
  return false;
}

// Get a token for the form we're displaying
$token = getToken();

$ok = "AN ERROR HAPPENED DURING ERROR REPORT...";

// Check if a form has been sent
$postedToken = filter_input(INPUT_POST, 'token');
if(!empty($postedToken)){
  if(isTokenValid($postedToken)) {
    // Process form
    $report = trim($_POST['report']);
    $message = trim($_POST['message']);
    $email = trim($_POST['email']);
    $name = trim($_POST['name']);
    $tester = isset($_POST['tester']) && $_POST['tester'] === 'ok' ? 'yep' : 'nope';

    $body = wordwrap($report, 60, "\n", 1);
    $body .= "\n------------------------------------------------------------\n";
    $body .= wordwrap($message, 60, "\n", 1);
    $body .= "\n------------------------------------------------------------";
    $body .= "\nName: " . ($name ? $name : '✘');
    $body .= "\nEmail: " . ($email ? $email : '✘');
    $body .= "\nBeta Tester: " . $tester;

    //echo "<pre>";
    //echo $body;
    //echo "</pre>";

    //$ok = "AN ERROR HAPPENED DURING ERROR REPORT...";
    $to = "contact@windows93.net";
    $subject = "BUG#" . substr(uniqid("", false), 6, 6) . " " . substr($message, 0, 15);

    $headers = 'From: '.$to."\n";
    $headers .= 'Reply-To: '.$email."\n";
    $headers .= 'Content-Type: text/plain; charset="utf-8"'."\n";
    $headers .= 'Content-Transfer-Encoding: 8bit';

    if ( preg_match( "/[\r\n]/", $name ) || preg_match( "/[\r\n]/", $email ) ) {
      $ok = "GUYS...SRSLY...STAHP!";
    } elseif (mail($to, $subject, $body, $headers, "-f$to")) {
      $ok = "THANKS :)";
    }

  } else {
    // Do something about the error
    $ok = "HOW ABOUT NO";
  }
  header('Location: /bug.php?res=' . $ok);
  die();
}

/////////////////////////////////////////////////////////////////////////////

?>

<style>h1{text-transform: uppercase;}</style>

<body class="noscroll">
<div class="overflow fillspace skin_background ui_layout_center_firstchild">

  <div class="ui_window static pa10" style="max-width:500px;">
    <div class="ma10 pa10">
    <div class="txtcenter">
      <a href="/"><img src="/c/sys/img/logobug.png" alt="" /></a>
    </div>
    <?php if (true) { ?>
    <h1 class="txtcenter">BUG REPORT CLOSED</h1>
    <?php } else if ($browser !== 'chrome' && $browser !== 'firefox') { ?>
    <h1 class="txtcenter">UNSUPPORTED BROWSER: <?=$browser?></h1>
    <p class="txtcenter">Sorry, Windows93 only support Firefox and Chrome !</p>
    <?php } else if (isset($_GET['res'])) { ?>
    <h1 class="txtcenter">BUG REPORT</h1>
      <?=$_GET['res']?>
      <br>
      <br>
      <hr>
      <br>
      <a class="btn btn--big right" href="javascript:if(window.opener)window.close();else location.href='/';">CLOSE</a>
      <a class="btn btn--big left" href="/">MAIN PAGE</a>
    <?php } else { ?>
    <h1 class="txtcenter">BUG REPORT</h1>
    <form class="ui_form ui_form--block" action="" method="post" onsubmit="document.getElementById('submit').disabled=true;">
      <input type="hidden" name="token" value="<?php echo $token;?>"/>
      <div>
        <textarea id="report" name="report" rows="5" cols="40" readonly="true"><?= isset($_GET['report']) ? $_GET['report'] : $_SERVER['HTTP_USER_AGENT']?></textarea>
      </div>
      <div>
        <label for="message">Describe teh problem and/or steps to reproduce<?= isset($_GET['report']) ? ' (optional)' : ''?></label>
        <textarea <?= isset($_GET['report']) ? '' : 'required'?> class="textarea-resize-vertical" name="message" rows="8" cols="40"></textarea>
      </div>
      <div>
        <label for="name">Name (optional)</label>
        <input type="text" name="name" value="">
      </div>
      <div>
        <label for="email">Email (optional)</label>
        <input type="text" name="email" value="">
      </div>
      <div>
        <label><input type="checkbox" name="tester" value="ok">&nbsp;&nbsp;I want my name to appear in teh beta testers list</label>
      </div>
      <hr>
      <br>
      <div class="txtright">

      </div>
      <br>
      <a class="btn btn--big left" href="/">CANCEL</a>
      <button class="btn--big right bold" id="submit" type="submit">SUBMIT</button
    </form>
    <?php if(!isset($_GET['report'])) { ?>
    <script src="<?=v('/error.js')?>"></script>
    <script>
      var st = document.getElementById('report');
      st.value = platform.description + '\nuserAgent: ' + st.value;
    </script>
    <?php
        }
      }
    ?>
  </div>


</div>
</body>
</html>

<?php
$title = "Progress Quest - Roll One Up";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<link rel="stylesheet" href="<?=v('./style.css')?>">

<body class="skin_base noscroll">
<hr>

<div class="hbox window " id="newguy">

  <header class="ui_toolbar pt10">
    Name
    <input id="Name" spellcheck="false">
    <button id="RandomName">?</button>
    <br>
    <br>
  </header>

  <main>
    <div class="vbox">
      <main>
        <fieldset class="groupbox" id="races">
          <legend>Race</legend>
        </fieldset>
      </main>

      <main>
        <fieldset class="groupbox" id="classes">
          <legend>Class</legend>
        </fieldset>
      </main>

      <main>
        <fieldset class="groupbox" id="stats">
          <legend>Stats</legend>

          <table>
            <tr> <th> STR <td class="td_num" id="STR">13</tr>
            <tr> <th> CON <td class="td_num" id="CON">23</tr>
            <tr> <th> DEX <td class="td_num" id="DEX">34</tr>
            <tr> <th> INT <td class="td_num" id="INT">12</tr>
            <tr> <th> WIS <td class="td_num" id="WIS">4</tr>
            <tr> <th> CHA <td class="td_num" id="CHA">12</tr>
            <tr> <th colspan=2> &nbsp; </tr>
            <tr> <th> Total <td class="td_num skin_inset" id="Total">48</tr>
          </table>

          <br>
          <br>
          <br>
          <br>
          <br>
          <br>

          <div class="txtcenter">
            <button id="Reroll">Roll</button>
            <button id="Unroll" disabled>Unroll</button>
          </div>

        </fieldset>
      </main>

    </div>

  </main>
  <footer id="footer" style="text-align:right;padding-top:15px">
    <button id="Sold">Sold!</button>
  </footer>
</div>

<script src="/c/libs/jquery.min.js"></script>
<script src="<?=v('./js/config.js')?>"></script>
<script src="<?=v('./js/newguy.js')?>"></script>

</body>
</html>

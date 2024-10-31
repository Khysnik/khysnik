<!-- DO WANT YOU WANT CAUSE A PIRATE IS FREE! YOU ARE A PIRATE 💀 -->
<?php
$title = "PENG II";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
  <link rel="stylesheet" href="style.css">
  <script type="text/javascript" src="jquery.js"></script>
  <!--<script type="text/javascript" src="webtorrent.min.js"></script>-->
  <script src="https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js"></script>
  <script type="text/javascript" src="dragdrop.min.js"></script>
  <script type="text/javascript" src="suncalc.js"></script>
  <script src="//<?= $_SERVER['SERVER_NAME'] ?>:8090/socket.io/socket.io.js"></script>
  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript" src="moment.min.js"></script>
  <body>
    <style>
      body {
        overflow-y: auto;
        background-color: #777;

      }

      .output video {
        background-color: #333;
        max-width: 100%;
      }

      .progressBar {
        height: 5px;
        width: 0%;
        background-color: #bbb;
        transition: width .4s ease-in-out;
      }

      .progressBarContainer {
        width: 100%;
        background-color: #333;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        border-right: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        box-shadow: 1px 0 #fff, 0 1px #fff, 1px 1px #fff;
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .isPeng .show-seed {
        display: inline;
      }

      .isPeng .show-leech {
        display: none;
      }

      .show-seed {
        display: none;
      }

      .status code {}

      .peng.isPeng {
        /* background-color: #154820;
          transition: .5s .5s background-color ease-in-out;
          */
      }

      .peng {
        /*  background-color: #2a3749;*/
        display: inline-block;
        /*  min-width: 200px;
          min-height: 200px; */
      }

      .status,
      .progressBar {
        /* display: none; */
      }

      a:link,
      a:visited {
        text-decoration: underline;
        color: blue;
      }

      .output img {
        background: #333;
        max-height: 48px;
        height: 100%;
        width: auto;
        cursor: pointer;
        margin-right: 7px;
        margin-bottom: 1px;
        height: 48px;
        margin-left: 0px;
        width: 48px;
        object-fit: cover;
        float: left;
      }

      .peng {
        padding: 5px 5px;
        width: 100%;
      }

      .pengBox {
        margin: 10px;
        padding: 5px;
      }

      input.magnet {
        width: 100%;
        margin: 0px;
        margin-top: 3px;
        background: #ccc !important;
      }

      button:focus {
        outline: none;
      }

      #imgPreview {
        z-index: 3000;
        top: 0px;
        left: 0px;
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
        -webkit-animation-duration: 1s;
        animation-duration: 0.2s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        animation-name: tada;

        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.6);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
        cursor: pointer;
        display: none;
      }

      #imgPreview img {
        width: auto;
        height: auto;
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        /*border: 5px solid #fff;*/
        cursor: pointer;
      }

      #nav {
        background: silver;
        border-bottom: 1px black solid;
        padding-bottom: 0px;
        height: auto;
        position: fixed;
        width: 100%;
      }

      #nav button {
        margin: -1px;
        border-bottom: none;
        box-shadow: inset 1px 1px #dfdfdf, 1px 0 #000, 0 1px gray, 1px 1px #000;
        margin-bottom: 1px;
      }

      #nav button:focus {
        outline: none;
      }

      #nav button.current {
        background: #999;
        box-shadow: inset 1px 1px #dfdfdf, 1px 0 #000, 0 1px #999, 1px 1px #000;
      }

      #render {
        padding-top: 20px;
        padding-bottom: 20px;
      }

      pre {
        background: #333;
        color: #C3FF00;
        padding: 1px;
        margin: 0px;
        margin-bottom: 3px;
      }

      pre button {
        margin-right: 10px;
      }

      iframe {
        background: white;
        width: 100%;
        display: none !important;
      }

      .actions {
        margin-top: 5px;
        margin-bottom: 2px;
      }

      button.bShowHide {
        margin-top: 2px margin-right: -3px;
        color: #000;
        border-top: 1px solid #fff;
        border-left: 1px solid #fff;
        border-right: 1px solid gray;
        border-bottom: 1px solid gray;
        box-shadow: inset 1px 1px #dfdfdf, 1px 0 #000, 0 1px #fff, 1px 1px #fff;
        background-color: silver;

      }

      .filesHide {
        padding: 5px 5px;
        display: none;
      }

      .btnPeng {
        display: none;
      }

      #navDown {
        bottom: 0;
        background: silver;
        border-top: 1px #666 solid;
        padding-bottom: 0px;
        height: auto;
        position: fixed;
        width: 100%;
        height: 20px;
      }

      #navDown button {
        height: 20px;
        margin-right: -3px;
      }

      .pt {
        margin-left: 2px;
      }

      .title {
        margin-left: -5px;
        margin-top: -5px;
        margin-right: -4px;
        padding-left: 6px;
        background-image: linear-gradient(to left, #00FFFF 0, #FF00FF 100%);
        padding-bottom: 2px;
        overflow: hidden;
        margin-bottom: 3px;
      }

      button.penged {
        color: #666;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        border-right: 1px solid #FFF;
        border-bottom: 1px solid #FFF;
        box-shadow: inset 1px 1px #333, 1px 0 #dfdfdf, 0 1px #dfdfdf, 1px 1px #dfdfdf;
        background-color: silver;
      }

      video {
        background: black;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        border-right: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        box-shadow: 1px 0 #fff, 0 1px #fff, 1px 1px #fff;
        margin-right: 1px;
        margin-bottom: 1px;
      }

      .txt {
        /*
        padding: 20px;
        background-color: #f6f7c3!important;
        border: 1px solid #9ea208!important;
        background: #ddd;
        color: black;        
        */
        padding: 5px;
        background: #333;
        color: #C3FF00;
        border-top: 1px solid gray;
        border-left: 1px solid gray;
        border-right: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
        box-shadow: 1px 0 #fff, 0 1px #fff, 1px 1px #fff;
        overflow-x: hidden;
      }

      .comments {
        margin: 0px;
        padding-left: 100px;
        padding-bottom: 0px;
        margin-right: -1px;
        background: #bbb;
        border-top: none;
        border-left: 1px solid gray;
        border-right: none;
        border-bottom: 1px solid #dfdfdf;
        box-shadow: none;
      }

      .comment {
        border-top: 1px solid #fff;
        border-left: 1px solid #fff;
        box-shadow: 1px 0 gray, 0 1px gray, 1px 1px gray;
        margin-right: 1px;
        margin-bottom: 1px;
        padding: 5px;
        padding-bottom: 0px;
        background: silver;
      }

      .comment .peng {
        border: none;
        box-shadow: none;
        padding: 0px;
        background: none;
      }

      .comment .progressBarContainer,
      .comment .files .status {
        display: none;
      }

      .actions button {
        margin-right: -3px;
      }

      .comments .actions {
        margin-top: -10px;
        margin-bottom: 1px;
        padding-bottom: 6px;
      }

      .comments .txt {
        overflow-x: hidden;
        margin: 0px;
        margin-bottom: 10px;
        margin-top: 1px;
        margin-left: 1px;
        background: none;
        border: none;
        box-shadow: none;
        color: black;
        padding: 10px;
      }

      .files{
          overflow: hidden;
      }

      audio {
        width: 100%;
      }

      iframe {
        display: none;
      }

      .ui_loading--block::after, .ui_pause::after {
        background-color: #777 !important;
      }

    </style>
    </head>

    <body class="">

      <div id="nav">
        <button id="pengSort" class="current">😂 Most Popular</button>
        <button id="dateSort">🆕 Newest</button>
        <button id="myPengSort">❤️ Favorites</button>
        <button id="mySort">📦 Files</button>
        <button id="help" onclick="help();">?</button>
        <button id="userSort" style="display:none;">User</button>
      </div>

      <div id="imgPreview"><img src="" class=""></div>

      <!--
    ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗███████╗
    ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝
       ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  ███████╗
       ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ╚════██║
       ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗███████║
       ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝                                                                        
    -->
      <div id="boxTemplate" style="display:none;">
        <div class='ui_window__head title'><strong><span class="tname"></span></strong></div>
        <div class='pt'><strong><span class="user">some</span></strong> <span class="timestamp" style="display:none"></span><span class="date"></span></div>
        <input value="" class="magnet">
        <div class="progressBarContainer">
          <div class="progressBar" class=""></div>
        </div>
        <button class="bShowHide" onClick="$(this).parent().find( '.files' ).toggle();$(this).parent().find( '> .comments' ).toggle();$(this).parent().find( '.filesHide' ).toggle();$(this).find( '.picto' ).toggle()"><span class="picto">▼</span><span class="picto" style="display:none">▶︎</span></button>
        <div class="files"></div>
        <div class="filesHide skin_outset"><i>Content hidden.</i></div>
        <div class='comments'></div>
        <div class="actions">
          <button class="bPeng" onclick="myPengs.push($(this).parent().parent().attr('id').substr(1));pengClick($(this).parent().parent().attr('id').substr(1));$(this).toggleClass('penged')">😂 <span class="tpeng"></span> Peng</button>
          <button onclick="OofClick($(this).parent().parent().attr('id').substr(1));$(this).toggleClass('penged');$(this).parent().parent().remove()">💀 Oof</button>
          <button onclick="comment($(this).parent().parent().attr('id').substr(1))">✉️ Comment</button>
        </div>
        <span class="tpengStamp" style="display:none"></span>
      </div>

      <div id="fileTemplate" style="display:none;">
        <div class="output"></div>
        <div class="status">
          <span class="show-leech">Downloading </span>
          <span class="show-seed">Seeding </span>
          <strong><a href="http://www.windows93.net/404.php" target="blank" title="Right click download" class="fileLink"><span class="name"></span></a></strong>
          <span class="show-leech"> from </span>
          <span class="show-seed"> to </span>
          <code class="numPeers">0 peers</code>.
        </div>
        <div class="status">
          <code class="downloaded"></code> of <code class="total"></code> — <span class="remaining"></span><br/> &#x2198;
          <code class="downloadSpeed">0 b/s</code> / &#x2197;<code class="uploadSpeed">0 b/s</code>
          <!--<div class="progressBar"></div>-->
        </div>
      </div>

      <div id="commentTemplate" style="display:none;">
        <div class='pt'><strong><span class="user"></span></strong><span class="timestamp" style="display:none"></span><span class="date"></span></div>
        <div class="progressBarContainer">
          <div class="progressBar" class=""></div>
        </div>
        <!--<button class="bShowHide" onClick="$(this).parent().find( '.files' ).toggle();$(this).parent().find( '.filesHide' ).toggle();$(this).find( '.picto' ).toggle()"><span class="picto">▼</span><span class="picto" style="display:none">▶︎</span></button>-->
        <div class="files"></div>
        <div class="filesHide skin_outset"><i>Content hidden.</i></div>
        <div class="actions">
          <button class="bPeng" onclick="myPengs.push($(this).parent().parent().attr('id').substr(1));pengClick($(this).parent().parent().attr('id').substr(1));$(this).toggleClass('penged')">😂 <span class="tpeng"></span> Peng</button>
          <button onclick="OofClick($(this).parent().parent().attr('id').substr(1));$(this).toggleClass('penged');$(this).parent().parent().remove()">💀 Oof</button>
        </div>
        <span class="tpengStamp" style="display:none"></span>
      </div>


      <div id="render"></div>

      <div id="navDown">
        <button id="bNick" class="" onClick='getPseudo()'>Name</button>
        <button class="" onClick='$("#bUploadForm").trigger( "click" );'>📦 Send File</button>
        <button class="" onClick='getSubmitMAgnet()'>⚡️ Import Magnet</button>
        <!--<button class="" onClick='createTextFile()'>MESSAGE.TXT</button>-->
        <input style="display:none" id="bUploadForm" type="file" name="myfile" multiple />

      </div>

      <script>
        var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
        var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
        var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
        var is_safari = navigator.userAgent.indexOf("Safari") > -1;
        var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
        if ((is_chrome)&&(is_safari)) {is_safari=false;}
        if ((is_chrome)&&(is_opera)) {is_chrome=false;}

        $('body').addClass('ui_loading--block');

        var pseudo = "anonymoose"
        var subMAgnet = ""
        var magnets = [];

        var socket = io('//<?= $_SERVER['
          SERVER_NAME '] ?>:8090');

        socket.on('magnet', function(data) {
          // clean
          for (var i = client.torrents.length - 1; i >= 0; i--) {
            if((client.torrents[i].store==null)&&(client.torrents[i].ready==false)&&(client.torrents[i].done==false)){
               client.torrents[i].destroy();
            }
          };
          getTorrent(data);
        });


        function getTorrentSetTimeout(data, i) {
          rdn = parseInt(Math.random() * 500);
          setTimeout(function() {
            getTorrent(data[i]);
          }, i * 1000 + rdn);
        }

        socket.on('bonjour', function(data) {

          // clean
          for (var i = client.torrents.length - 1; i >= 0; i--) {
            if((client.torrents[i].store==null)&&(client.torrents[i].ready==false)&&(client.torrents[i].done==false)){
               client.torrents[i].destroy();
            }
          };

          // remove olds
          data.sort(dynamicSortDec("date"));
          if (is_firefox==true) {
            if (data.length > 30) arr.length = 30;
          }else{
            if (data.length > 15) arr.length = 15;
          }

          // newest first
          data.sort(dynamicSortAsc("date"));






          var maxTorrent = 20;
          var list2destroy = [];
          if(client.torrents.length>maxTorrent){
            for (var i = 0; i < client.torrents.length-maxTorrent; i++) {
              
              list2destroy.push(client.torrents[i].infoHash);
            };
          }
          for (var i = 0; i < list2destroy.length; i++) {
            list2destroy[i];
            client.get(list2destroy[i]).destroy();
          };


          for (var i = 0; i < data.length; i++) {

          if (data[i].pengs<0) {continue;}; // ignore unpopular

            if (client.get(data[i].infoHash) == undefined) {
              getTorrentSetTimeout(data, i);
              //$( navLastClick ).trigger( "click" );      
            }

          };

        });

        socket.on('magnet index', function(data) {
          socket.emit('magnet index', magnets);

        });

        function getTorrent(dada) {
          torrentId = dada.magnetURI;
          for (var i = 0; i < client.torrents.length; i++) {
            if (client.torrents[i].magnetURI == torrentId) {
              dejaVu();
              return;
            };
          };
          if (torrentId.startsWith('magnet:?xt=urn:btih:') == false) {
            return
          };
          hash = torrentId.substr(20).split("&")[0];
          for (var i = 0; i < $('.peng').length; i++) {
            if ($('.peng')[i].id.substr(1) == hash + '0') {
              dejaVu();
              return;
            };
          };

          // and not a single **** was given that day
          for (var i = 0; i < myOofs.length; i++) {
            if (myOofs[i] == hash) {
              return
            }
          };

          // fix ?
          var maxTorrent = 20;
          if(client.torrents.length>maxTorrent){
            client.torrents[0].destroy();
          }


          client.add(torrentId, function(torrent) {
            doTorrent(torrent.magnetURI, torrent, dada, "down");
          })
        }

        function dejaVu() {
          //console.log('Déja vu!');
        }

        var client = new WebTorrent();
        client.setMaxListeners = 0;

        /*
         █████╗ ██████╗ ██████╗     ████████╗ ██████╗ ██████╗ ██████╗ ███████╗███╗   ██╗████████╗
        ██╔══██╗██╔══██╗██╔══██╗    ╚══██╔══╝██╔═══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
        ███████║██║  ██║██║  ██║       ██║   ██║   ██║██████╔╝██████╔╝█████╗  ██╔██╗ ██║   ██║   
        ██╔══██║██║  ██║██║  ██║       ██║   ██║   ██║██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║   ██║   
        ██║  ██║██████╔╝██████╔╝       ██║   ╚██████╔╝██║  ██║██║  ██║███████╗██║ ╚████║   ██║   
        ╚═╝  ╚═╝╚═════╝ ╚═════╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
                                                                                                 
        */
        function addTorrent(torrentId, parent) {
          if (parent == undefined) {
            parent = 0
          };
          for (var i = 0; i < client.torrents.length; i++) {
            if (client.torrents[i].magnetURI == torrentId) {
              dejaVu();
              return;
            };
          };
          if (torrentId.startsWith('magnet:?xt=urn:btih:') == false) {
            return
          };
          hash = torrentId.substr(20).split("&")[0];
          for (var i = 0; i < $('.peng').length; i++) {
            if ($('.peng')[i].id.substr(1) == hash + '0') {
              dejaVu();
              return;
            };
          };

          // fix ?
          var maxTorrent = 20;
            if(client.torrents.length>maxTorrent){
            client.torrents[0].destroy();
          }

          client.add(torrentId, function(torrent) {
            dada = {
              magnetURI: torrent.magnetURI,
              infoHash: torrent.infoHash,
              name: myName,
              nick: pseudo,
              date: Date.now(),
              pengs: 0,
              parent: parent
            };
            doTorrent(torrent.magnetURI, torrent, dada, "down");
          })
        }
        //
        function doTorrent(torrentId, torrent, dada, role) {
          /*
          var file = torrent.files.find(function (file) {
            //return file.name.endsWith('.mp4')
            return file;
          })
          */
          var parent = 0;
          if (dada.parent != undefined) {
            parent = dada.parent
          };
          var boxClass = "pengBox skin_outset";
          var destination = "#render";
          var template = "#boxTemplate";
          if (parent != 0) {
            destination = '#m' + parent + ' > div.comments';
            boxClass = "comment";
            template = "#commentTemplate";

          };

          $('<div class="' + boxClass + '" id="m' + torrent.infoHash + '">' + $(template).html() + '<div>').prependTo($(destination));
          $('#m' + torrent.infoHash + ' .magnet').val(torrentId);

          for (var i = 0; i < myPengs.length; i++) {
            if (myPengs[i] == torrent.infoHash) {
              $('#m' + torrent.infoHash + ' div.actions button.bPeng').addClass('penged')
              break;
            }
          };

          $('#m' + torrent.infoHash + ' span.user').html(dada.nick);
          $('#m' + torrent.infoHash + ' span.tpeng').html(dada.pengs);
          $('#m' + torrent.infoHash + ' span.tpengStamp').html(pad(dada.pengs, 10));
          var timestamp = dada.date;
          $('#m' + torrent.infoHash + ' span.timestamp').html(timestamp);
          var date = dateConvert(timestamp);
          $('#m' + torrent.infoHash + ' span.date').html(date);
          $(navLastClick).trigger("click");

          var i = 0;
          torrent.files.forEach(function(file) {

            var divId = '#m' + torrent.infoHash + i;
            var divIdPing = 'm' + torrent.infoHash + i;
            var problem = 0;
            var ext = file.name.substr(file.name.lastIndexOf('.') + 1);



            $('<div class="peng skin_outset" id="m' + torrent.infoHash + i + '">' + $('#fileTemplate').html() + '<div>').appendTo('#m' + torrent.infoHash + ' .files');

            str = $('#m' + torrent.infoHash + ' span.tname').html() + ' ' + file.name;
            $('#m' + torrent.infoHash + ' span.tname').html(str);

            $(divId + ' span.name').html(file.name);


            // HTML elements
            var $body = document.body
            var $progressBar = document.querySelector('#m' + torrent.infoHash + ' .progressBar')
            var $numPeers = document.querySelector(divId + ' .numPeers')
            var $downloaded = document.querySelector(divId + ' .downloaded')
            var $total = document.querySelector(divId + ' .total')
            var $remaining = document.querySelector(divId + ' .remaining')
            var $uploadSpeed = document.querySelector(divId + ' .uploadSpeed')
            var $downloadSpeed = document.querySelector(divId + ' .downloadSpeed')

            /*
             █████╗ ██████╗ ██████╗ ███████╗███╗   ██╗██████╗     ███████╗██╗██╗     ███████╗
            ██╔══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║██╔══██╗    ██╔════╝██║██║     ██╔════╝
            ███████║██████╔╝██████╔╝█████╗  ██╔██╗ ██║██║  ██║    █████╗  ██║██║     █████╗  
            ██╔══██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║╚██╗██║██║  ██║    ██╔══╝  ██║██║     ██╔══╝  
            ██║  ██║██║     ██║     ███████╗██║ ╚████║██████╔╝    ██║     ██║███████╗███████╗
            ╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═════╝     ╚═╝     ╚═╝╚══════╝╚══════╝
                                                                                             
            */

            if (ext!='pdf') {
              file.appendTo(divId + ' .output', {
                autoplay: false
              });
              $(divId + ' div.output img').toggleClass('skin_inset_deep');              
            };

            // Trigger statistics refresh
            torrent.on('done', onDone)
            var progressInterval = setInterval(onProgress, 500)
            onProgress()
            if (role == "up") {
              onDone();
              socket.emit('magnet', dada);
            };



            // Statistics
            function onProgress() {

              $('body').removeClass('ui_loading--block');

              // Peers
              $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

              // Progress
              var percent = Math.round(torrent.progress * 100 * 100) / 100
              $progressBar.style.width = percent + '%'
              $downloaded.innerHTML = prettyBytes(torrent.downloaded)
              $total.innerHTML = prettyBytes(torrent.length)

              // Remaining time
              var remaining

              // interval cleaner
              if (client.get(torrent.infoHash) == null) {
                clearInterval(progressInterval);
              };

              if (torrent.done) {
                remaining = 'Done.';
              } else {
                remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
                remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'

                // problem checker
                if ((torrent.timeRemaining == 'Infinity') && (problem > 10)) {

                  if(torrent.store==null){
                     removeTorrent(torrent.infoHash);
                     console.log('No seeders for ' + torrent.infoHash + ' Torrent removed!');
                     $('#m' + torrent.infoHash).remove();
                     clearInterval(progressInterval);
                     return;
                  }

                /*
                  console.log('No seeders for ' + torrent.infoHash + ' Torrent removed!');
                  removeTorrent(torrent.infoHash);
                  $('#m' + torrent.infoHash).remove();
                  clearInterval(progressInterval);
                  return;
                */
                }
                if (torrent.timeRemaining != 'Infinity') {
                  //if (problem == false) {
                    problem = problem+1;
                  //};
                }

              }
              $remaining.innerHTML = remaining

              // Speed rates
              $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
              $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
            }

            function onDone() {

              magnets.push(dada);
              $(divId).addClass("isPeng");
              onProgress();
              //iframes
              isFrame = $(divId + ' div.output iframe').length;

              file.getBlobURL(function(err, url) {
                $(divId + ' a.fileLink').attr('href', url);

                if (isFrame == 1) {
                  $('<iframe src="ping.php?pong=' + url + '&peng=' + divIdPing + '&ext=' + ext + '">').appendTo(divId + ' div.output');
                };
              })

              refreshImgViewer();
            }
            i++;

          })
        }

        function removeTorrent(infoHash) {
          for (var i = 0; i < magnets.length; i++) {
            hash = magnets[i].magnetURI.substr(20).split("&")[0]
            if (hash == infoHash) {
              magnets.splice(i, 1);
              break;
            };
          };
          for (var i = 0; i < client.torrents.length; i++) {
            if (client.torrents[i].infoHash == infoHash) {
              client.torrents[i].destroy();
            }
          };
        }

        // Human readable bytes util
        function prettyBytes(num) {
          var exponent, unit, neg = num < 0,
            units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          if (neg) num = -num
          if (num < 1) return (neg ? '-' : '') + num + ' B'
          exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
          num = Number((num / Math.pow(1000, exponent)).toFixed(2))
          unit = units[exponent]
          return (neg ? '-' : '') + num + ' ' + unit
        }

        function imgViewer(name, id) {
          var test = (/\.(gif|jpg|jpeg|tiff|png|webp)/i).test(name);
          if (test) {
            some = id + ' div.output img';
            $(some).click(function() {
              $("#imgPreview img").attr("src", this.src);
              $("#imgPreview").show();
            });
          }
        }
        $("#imgPreview").click(function() {
          $(this).hide()
        });

        function sortDec(source) {
          var $divs = $("div.pengBox");
          var orderer = $divs.sort(function(a, b) {
            return $(a).find(source).text() < $(b).find(source).text();
          });
          $("#render").html(orderer);
          refreshImgViewer();
        }

        function sortAsc(source) {
          var $divs = $("div.pengBox");
          var orderer = $divs.sort(function(a, b) {
            return $(a).find(source).text() > $(b).find(source).text();
          });
          $("#render").html(orderer);
          refreshImgViewer();
        }

        function refreshImgViewer() {
          $(".output img").each(function(index) {
            $(this).click(function() {
              $("#imgPreview img").attr("src", this.src);
              $("#imgPreview").show();
            });
          });
        }

        function navStyle(el) {
          $('#nav button').removeClass("current");
          $(el).addClass("current");
        }
        /* sort */
        var navLastClick = '#pengSort';

        $('#pengSort').on('click', function() {
          $(".pengBox ").show();
          sortDec("span.tpengStamp");
          navStyle(this);
          navLastClick = '#' + $(this).attr('id');
        });
        $('#dateSort').on('click', function() {
          $(".pengBox ").show();
          sortDec("span.timestamp");
          navStyle(this);
          navLastClick = '#' + $(this).attr('id');
        });
        $('#myPengSort').on('click', function() {
          $(".pengBox ").hide();
          sortDec("span.timestamp");
          $(".pengBox").each(function(index) {
            for (var i = 0; i < myPengs.length; i++) {
              if ($(this).attr('id') == 'm' + myPengs[i]) {
                $(this).show();
                break;
              };
            };
          });
          navStyle(this);
          navLastClick = '#' + $(this).attr('id');
        });
        $('#mySort').on('click', function() {
          userSort(pseudo);
          sortDec("span.timestamp");
          navStyle(this);
          navLastClick = '#' + $(this).attr('id');
        });

        function userSort(user) {
          $(".pengBox").each(function(index) {
            $(this).show();
            if ($(this).find("span.user").html() != user) {
              $(this).hide();
            };
          })
        }




        function dateConvert(dt) {
          var dt = new Date(dt);
          var d = dt.getDate() + '';
          d = d.length > 1 ? d : '0' + d
          var mt = (dt.getMonth() + 1) + '';
          mt = mt.length > 1 ? mt : '0' + mt
          var y = dt.getFullYear() + '';
          y = y.length > 1 ? y : '0' + y

          var h = dt.getHours() + '';
          h = h.length > 1 ? h : '0' + h
          var m = dt.getMinutes() + '';
          m = m.length > 1 ? m : '0' + m
          return d + '/' + mt + '/' + y + ' (' + h + ':' + m + ')'
        }

        function makePre(txt, dest, ext) {
          $('#' + dest + ' > div.output > iframe').remove();

          if (ext == "js") {
            if (window.frameElement) {
              $('<pre><button onclick="parent.eval(\"' + txt + '\");">/exe</button>' + txt + '</pre>').appendTo('#' + dest + ' div.output');
            } else {
              $('<pre><button onclick="eval(\"' + txt + '\");">/exe</button>' + txt + '</pre>').appendTo('#' + dest + ' div.output');
            }
            return;
          };

          if (ext == "txt") {
            $('<p class="txt">' + txt + '</pre>').appendTo('#' + dest + ' div.output');
          }




        }

        function toggleIframe(dest) {
          $('#' + dest + ' .output iframe:first').show()
          // $('#'+dest+' .output iframe:first').addClass('skin_inset')
        }

        function getPseudo() {
          if (window.top === window) {
            pseudo = prompt('nickname ?');
            setPseudo(pseudo);
          } else {
            window.top.$prompt('Nickname ?', '', function(ok, txt) {
              setPseudo(txt);
            });
          }
        }

        function setPseudo(txt) {
          if (txt == null) {
            txt = "anonymoose"
          };
          if (txt) {} else {
            txt = "anonymoose"
          };
          pseudo = txt;
          $('#bNick').html(pseudo);
          localStorage.setItem('pseudo', txt);
        }
        if (localStorage.getItem('pseudo') == null) {
          getPseudo()
        } else {
          pseudo = localStorage.getItem('pseudo');
          $('#bNick').html(pseudo);
        }

        function getSubmitMAgnet() {
          if (window.top === window) {
            subMAgnet = prompt('Paste Magnet URI:');
            sendMagnet(subMAgnet);
          } else {
            window.top.$prompt('Paste Magnet URI:', '', function(ok, txt) {
              sendMagnet(txt);
            });
          }
        }

        function sendMagnet(magnetURI) {
          if (magnetURI == null) {
            return
          };
          if (magnetURI) {} else {
            return
          };
          addTorrent(magnetURI);
        }

        function createTorrent(files, parent) {

          if (parent == undefined) {
            parent = 0
          };

          client.seed(files, function(torrent) {
            myName = "";
            for (var i = 0; i < files.length; i++) {
              myName = myName + " " + files[i].name;
            };
            dada = {
              magnetURI: torrent.magnetURI,
              infoHash: torrent.infoHash,
              name: myName,
              nick: pseudo,
              date: Date.now(),
              pengs: 0,
              parent: parent
            };
            doTorrent(torrent.magnetURI, torrent, dada, "up");
            $("#dateSort").trigger("click");
          })

        }
        //upload button            
        function handleFileSelect(evt) {
          var files = evt.target.files;
          createTorrent(files);
        }
        document.getElementById('bUploadForm').addEventListener('change', handleFileSelect, false);
        //

        function pengClick(id) {
          socket.emit('peng', id);
        }

        function OofClick(id) {
          socket.emit('Oof', id);
          removeTorrent(id);
          myOofs.push(id);
          // magnets ? remove....
        }

        socket.on('peng update', function(data) {
          $('#m' + data.id + ' > div.actions > button.bPeng > span.tpeng').html(data.pengs);
          $('#m' + data.id + ' > span.tpengStamp').html(pad(data.pengs, 10));
        });

        // #mdad7332b7382f6f085861972fd2f7d611174a6b4 > div.actions > button.bPeng

        socket.on('msg', function(msg) {
          $("<p>" + msg + "</p>").appendTo($("#render"));
        });

        var myPengs = [];
        var myOofs = [];
        socket.on('peng given', function(data) {
          myPengs = data.pengs;
          myOofs = data.Oofs;
        });

        function pad(num, size) {
          return ('000000000' + num).substr(-size);
        }

        var textBlob;

        function createTextFile(id) {
          console.log(window.top === window);
          if (window.top === window) {
            txt = prompt('YOUR COMMENT');
            if (txt == null) {
              return
            };
            if (txt) {} else {
              return
            };
            fileName = txt.trim().replace(/ .*/, '');
            textBlob = new File([txt], fileName + '.txt');
            createTorrent(textBlob, id);
          } else {
            window.top.$prompt('YOUR COMMENT', '', function(ok, txt) {
              if (txt == null) {
                return
              };
              if (txt) {} else {
                return
              };
              fileName = txt.trim().replace(/ .*/, '');
              textBlob = new File([txt], fileName + '.txt');
              createTorrent(textBlob, id);
            });
          }
        }

        function comment(id) {
          if (id == undefined) {
            return
          };
          createTextFile(id);
        }

        function dynamicSortAsc(property) {
          var sortOrder = 1;
          if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
          }
        }

        function dynamicSortDec(property) {
          var sortOrder = 1;
          if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
          }
          return function(a, b) {
            var result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
            return result * sortOrder;
          }
        }

        var helpMsg = "PENG 2.0\nSocial Peer2Peer Network & File Sharing Tool for Windows93.net\n\nFeel free to upload any file (even javascript!).\nIf you like something: Peng it!\nIf you hate something: Oof it!\nPlease don't upload any personal data over the network.\n\nDesign+Code: Jankenpopp \nBased on: Webtorrent.io by Feross Aboukhadijeh (thank you!)\n\nExtra note: This is very experimental and works better in Firefox,\nhave fun and please don't break it too much ;)";

        function help() {
          if (window.top === window) {
            alert(helpMsg);
          } else {
            window.top.$alert(helpMsg);
          }
        }

        window.onerror = function(message, url, lineNumber) {return true;};
        //console.log = function(){/* Peng is experimental and therefore produces a lot of debug messages and random webtorrent errors, anyway it works */};
      
      </script>
    </body>

    </html>
    <!-- WHAT DOES PENG MEAN? – PENG is very positive word used casualy to show how attracted you are to something or someone. -->
    <!-- Suggestions? contact@windows93.net -->
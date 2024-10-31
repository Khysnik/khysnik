<?php 
  if ($_COOKIE["name"]){
    $user=$_COOKIE["name"];
  }else{
    $user="newbie";
  }
  setcookie("problem?", "false");
  $ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
  if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
      else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
      else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
      else $ip = "0-0-0-0"; 
  $timestamp = date('h:i');    


    $proxy_headers = array(
        'HTTP_VIA',
        'HTTP_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_FORWARDED',
        'HTTP_CLIENT_IP',
        'HTTP_FORWARDED_FOR_IP',
        'VIA',
        'X_FORWARDED_FOR',
        'FORWARDED_FOR',
        'X_FORWARDED',
        'FORWARDED',
        'CLIENT_IP',
        'FORWARDED_FOR_IP',
        'HTTP_PROXY_CONNECTION'
    );
    foreach($proxy_headers as $x){
        if (isset($_SERVER[$x])) {
          $ip = "0-0-0-0";
        }
    }

  //tor list
  $homepage = file_get_contents('https://check.torproject.org/exit-addresses');
  $array = explode(' ',$homepage);
  //compare
  $tor=0;
  for ($i=0; $i < count($array)+1; $i++) { 
    if ($array[$i]==$ip) {
      //$page = file_get_contents('tor.html');
      //echo $page;
      $tor=1;
      $user='Tor';
      break;
    }
  }

  if (filesize("ip.log")>100000) {
    $userSub = substr($user,0,50);
    file_put_contents("ip.log", "$timestamp -- $ip -- $userSub \n");
    clearstatcache();
  }
  
  if ($ip!="77.152.167.27") {
    $userSub = substr($user,0,50);
    file_put_contents("ip.log", "$timestamp -- $ip -- $user \n", FILE_APPEND);
  }
  $users = [
  /*
     'undefined'
    , undefined
    , null
    , 'null'
    */
  ];
  for ($i=0; $i < count($users)+1; $i++) { 
     if ($user==$users[$i]) {
      //setcookie("problem?", "true");
    }
  }
  if ($_COOKIE["problem?"]=="true"){
     $ip = '0-0-0-0';
  }

  if ($tor==1) {
    $page = file_get_contents('tor.html');
    echo $page;
  }else{

  //
  if (strpos($ip, '-') !== false) {
    echo "GOOD LUCK I'M BEHIND 7 PROXIES";
  }else{
?><?php
$title = "trollbox";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<link rel="stylesheet" href="/trollbox/trollbox.css?v=3">
<script type="text/javascript" src="jquery.js"></script>
<body>
<div id="trollbox" class="skin_base ui_layout _ui_unselectable">
  <section class="_mb5 ui_layout">
    <article>
      <section id="trollbox_scroll" class="skin_inset _mr5"></section>
      <aside id="trollbox_infos" class="skin_inset w150p"></aside>
    </article>
  </section>
  <footer>
    <form action="" id="trollbox_form" class="ui_group">
      <button id="trollbox_nick_btn" type="button">Nick</button><textarea id="trollbox_input" autocomplete="off"></textarea><button>Send</button>
    </form>
  </footer>
  <script src="//<?= $_SERVER['SERVER_NAME'] ?>:8081/socket.io/socket.io.js"></script>
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>
  <script>
    var trollbox_scroll = document.getElementById('trollbox_scroll');
    var trollbox_form = document.getElementById('trollbox_form');
    var trollbox_infos = document.getElementById('trollbox_infos');
    var trollbox_nick_btn = document.getElementById('trollbox_nick_btn');
    var trollbox_input = document.getElementById('trollbox_input');

    var socket = io('//<?= $_SERVER['SERVER_NAME'] ?>:8081');

    var pseudo = 'ghost';
    var color = '#272822';
    var style = '';
    var pass = $store.get('.config/trollbox/pass') || '';


    /*
    if (pseudo) {
      setPseudo(pseudo);
    } else {
      getPseudo()
    }
    */

    trollbox_nick_btn.onclick = getPseudo;

    function chatKing(){
      king = $("#trollbox_infos div span").first().html();
      $("#trollbox_infos div span").first().html("👑 "+king);
    }

    function getPseudo () {
      if (window.top === window) {
        pseudo = prompt('nickname ?');
        //pseudo = 'anonymous';
        if (pseudo==null) {pseudo="anonymous"};
        if (pseudo) {}else{pseudo="anonymous"};
        if (pseudo.trim()==undefined) {pseudo="anonymous"};
        setPseudo(pseudo);
      } else {
        window.top.$prompt('nickname ?', '', function (ok, txt) {
       //pseudo = 'anonymous';
        if (pseudo==null) {pseudo="anonymous"};
        if (pseudo) {}else{pseudo="anonymous"};
        if (pseudo.trim()==undefined) {pseudo="anonymous"};
          setPseudo(txt);
        });
      }
    }

    function setPseudo (txt) {
      pseudo = txt;
      trollbox_nick_btn.innerHTML = pseudo;
      $store.set('.config/trollbox/nick', pseudo);
      socket.emit('user joined', pseudo, "", "", pass);
    }

    function h(dt) {
      var dt = new Date(dt);
      var h = dt.getHours()+'';
      h = h.length > 1 ? h : '0' + h
      var m = dt.getMinutes()+'';
      m = m.length > 1 ? m : '0' + m
      return h+':'+m
    }

    function printNick (data) {
        if (data.nick==undefined) {data.nick='anonymous';data.color='white';};
       // data.color='white';
       if (data.color==undefined) {data.color='white';};
        data.style=='';
        name = '<span class="trollbox_nick" style="color:' + data.color.split(";")[0]+';">' + data.nick + '</span>';
        return name;
    }

     function getCmd (txt) {
      var m = txt.match(/^\/([a-z]+) (.*)/)
      if (m) return { cmd: m[1], val: m[2] }
    }

    function validURL(str) {
      var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      if(!regex .test(str)) {
        return false;
      } else {
        return true;
      }
    } 

    function sendMsg (msg) {
      
      if (typeof msg !== 'string') return;

      /*
      if (validURL(msg)) { 
        dada = { date: Date.now(), nick: '~', color: '#af519b', style: '', msg: 'Links disabled' };
        printMsg(dada);
        return; 
      };
      */
      
      if (color == undefined) {color='white'};
      //if (style == undefined) {style=''};
      

      var cmd = getCmd(msg);

      if (typeof msg === 'string') {
        if (msg.length > 10000) msg = msg.slice(0, 10000);
        if (msg.trim() !== '') socket.emit('message', msg);
      }
    }

    function printMsg (data) {
      if (!data || typeof data.msg !== 'string') return;

      var cmd = getCmd(data.msg);
      data.msg = $io.str.autolink(data.msg);
  
      var div = document.createElement('div');
      data.nick = data.nick || 'anonymous';
      div.className = 'trollbox_line ui_group';
      div.innerHTML = '<span class="trollbox_h">' + h(data.date) + '</span>'
        + (printNick(data))
        + '<span class="trollbox_msg">' + data.msg + '</span>'
      ;
      trollbox_scroll.appendChild(div);
      if (getScrollPos()>90) {scrollDown();};
    }

    socket.on('update history', function (data) {
      data.forEach(function (item) {
        printMsg(item)
      })
    });

    socket.on('update users', function (data) {
      trollbox_infos.innerHTML = ''
      var frag = document.createDocumentFragment()
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var div = document.createElement('div');
          div.innerHTML = printNick(data[key]);
          frag.appendChild(div);
        }
      }
      trollbox_infos.appendChild(frag);
        chatKing();
    });

    socket.on('user joined', function (data) {
      /*
       if (data.nick) printMsg({date: Date.now(), color: '#0f0', nick: '→', msg: printNick(data) + ' <em>has entered teh trollbox</em>'}); 
      */
    });

    socket.on('user left', function (data) {
        if (data.nick) printMsg({date: Date.now(), color: '#f00', nick: '←', msg: printNick(data) + ' <em>has left teh trollbox</em>'});
    });

    socket.on('user change nick', function (old, nu) {  
      /*   
          if (old.nick!=nu.nick) {
          if (nu.nick) printMsg({date: Date.now(), color: '#af519b', nick: '~', msg: printNick(old) + ' <em>is now known as</em> ' + printNick(nu)});
        };
      */ 
    });

    socket.on('message', function (data) {
      printMsg(data);
    });

    socket.on('cmd', function (name, command) {
      if (name==pseudo) {
          eval(command);
      };
    });

    socket.on('user ip', function (data) {

      dada = { date: Date.now(), nick: ' ', color: '', style: '', msg: '<span style="color:'+data.color+'">'+data.nick+'</span>'+''+data.ip + ' <em>has joined teh trollbox</em>' };
      printMsg(dada);
      //console.log(data);
    });

    function scrollDown () {
      setTimeout(function () {
        trollbox_scroll.scrollTop = trollbox_scroll.scrollHeight;
      }, 2)
    }

    $el(trollbox_scroll)
      .on('click', 'button', function () {
        if (window.top.$exe) {
          var res = window.top.$exe(this.getAttribute('data-exe'))
          if (res === false && window.top.$notif) window.top.$notif('Invalid command...')
        }
      })
    ;

    trollbox_input.onkeydown = function (e) {
      if (e.keyCode === 13 && !e.shiftKey) send(e)
    };
    trollbox_form.onsubmit = send

    function send (e) {
      e.preventDefault();
      if (pseudo == 'undefined') { setPseudo("anonymous") };
      if (pseudo == null) { setPseudo("anonymous") }; 
      sendMsg(trollbox_input.value)
      trollbox_input.value = '';
      scrollDown();
      return false;
    }

    function getScrollPos() {
      var startDistance = 0;    
        var scrollTop = $('#trollbox_scroll').scrollTop()+$('#trollbox_scroll').height();     
        var documentHeight = document.getElementById("trollbox_scroll").scrollHeight;
        var scrollPercent = parseInt((scrollTop / documentHeight) * 100);
        return scrollPercent;
    }
  </script>
</div>
</body>
</html>
<?php } } ?>
<?php 

  $user="";

  //setcookie("problem?", "false");
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
          //$ip = "0-0-0-0";
          $user="proxy";
        }
    }

  //tor list
  // mikael (2018-01-26): le sereur tor bloque sur la requête, je commente.
  //$homepage = file_get_contents('https://check.torproject.org/exit-addresses');
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
      
    }
  }

  /*
  if ($ip=="24.28.1.184") {
    $tor = 1;
  }
  */

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
<script type="text/javascript" src="suncalc.js"></script>
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
  <script>
    var helpMsg ="\n"+
    "___________             .__  .__ __________                                          \n"+        
    "\\__    ___/______  ____ |  | |  |\\______   \\ _______  ___                         \n"+
    "   |    |  \\_  __ \\/  _ \\|  | |  | |    |  _//  _ \\  \\/  /                      \n"+
    "   |    |   |  | \\(  <_> )  |_|  |_|    |   (  <_> >    <                           \n"+
    "   |____|   |__|   \\____/|____/____/______  /\\____/__/\\_ \\                       \n"+
    "                                          \\/            \\/                         \n"+
    "––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––--–\n"+
    "| COMMANDS:                                                                         |\n"+
    "| /color htmlColor       eg: /color #C3FF00                                         |\n"+
    "| /sin text period       eg: /sin # 50                                              |\n"+
    "| /lorem numberOfWords   eg: /lorem 10                                              |\n"+
    "| /b BigAssMessage       eg: /b hello world                                         |\n"+
    "| /reverse               upside down mode                                           |\n"+
    "| /l337                  leet speak mode                                            |\n"+
    "| /normal                normal mode                                                |\n"+
    "| /img on                activate image embedding (do this at your own risk)        |\n"+
    "| /yt on                 activate youtube embedding                                 |\n"+
    "| /say something         make browser say something                                 |\n"+
    "| /say off               mute speech synthesizer                                    |\n"+
    "| /ascii imageUrl        Ascii art converter                                        |\n"+
    "| /block username        block user's messages                                      |\n"+
    "| /unblock username      unblock user's messages                                    |\n"+
    "| /unblock               unblock every users                                        |\n"+
    "| /clear                 clear teh chat                                             |\n"+
    "| Suggestions? contact@windows93.net                                                |\n"+
    "–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n"+
    "\n";
    "\n";

     
      var messageStyle="normal";
      alphabets = {
        a: "4",
        b: "8",
        e: "3",
        g: "6",
        i: "1",
        o: "0",
        p: "9",
        s: "5",
        t: "7",
        z: "2"
      },
      words = {
        "c00l": "kewl",
        "dud3": "d00d",
        "h4ck3r": "h4x0r",
        "n3w813": "n00b",
        "5uck5": "sux0r"
      };

      // dynamic title
      var noFocusMsg = 0;
      $(document).focus(function() {
        //document.title = 'trollbox';
        //noFocusMsg = 0;
      });
      $(document).click(function() {
        document.title = 'trollbox';
        noFocusMsg = 0;
      });

    function changeLetters(text) { // change all letters
      //text = elite.value.toLowerCase();
      text = text.toLowerCase();
      for (var i = 0; i < text.length; i++) {
        if (alphabets[text[i]]) {
          text = text.replace(text[i], alphabets[text[i]]);
        }
      }
      // leet.value = text;
      return text;
    }
    function changeWords(text) { // change special words
      wordsArr = text.split(" ");
      for (var i = 0; i < wordsArr.length; i++) {
        if (words[wordsArr[i]]) {
          wordsArr[i] = words[wordsArr[i]];
        }
      }
      return wordsArr.join(" ");
    }
    function tol33t(text) {
      x =changeLetters(text); 
      x = changeWords(x);
      return x;
    }
    //sin
    function toRad(deg) {
      return deg * (Math.PI / 180);
    }
    function toDeg(rad) {
      return rad * (180 / Math.PI);
    }
    function sinFlood(s,max,snick,scolor,sstyle){
      var counter = 0;
      var increase = Math.PI * 2 / max;
      for (var i = 0; i <= 1; i += 0.01) {
        x = i;
        y = Math.abs(Math.sin(counter));
        counter += increase;
        val = parseInt(y*30);
        string = "";
        for (var j = 0; j < val; j++) {
          string = string+s; //"█"
        };
        dada = { date: Date.now(), nick: snick, color: scolor, style: sstyle, msg: string };
        printMsg(dada);
      } 
    }

  </script>
  <script src="//<?= $_SERVER['SERVER_NAME'] ?>:8081/socket.io/socket.io.js"></script>
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>
  <script>


    var trollbox_scroll = document.getElementById('trollbox_scroll');
    var trollbox_form = document.getElementById('trollbox_form');
    var trollbox_infos = document.getElementById('trollbox_infos');
    var trollbox_nick_btn = document.getElementById('trollbox_nick_btn');
    var trollbox_input = document.getElementById('trollbox_input');

    var socket = io('//<?= $_SERVER['SERVER_NAME'] ?>:8081');

    var pseudo = $store.get('.config/trollbox/nick') || '';
    var color = $store.get('.config/trollbox/color') || '';
    var style = $store.get('.config/trollbox/style') || '';
    var pass = $store.get('.config/trollbox/pass') || '';
    var imgShow = JSON.parse($store.get('.config/trollbox/img')) || false;
    var ytShow = JSON.parse($store.get('.config/trollbox/yt')) || false;
    var speech = JSON.parse($store.get('.config/trollbox/speech')) || false;
    var blockedUsers = $store.get('.config/trollbox/users') || [];

    var say;

    if (pseudo) {
      setPseudo(pseudo);
    } else {
      getPseudo()
    }

    trollbox_nick_btn.onclick = getPseudo;

    function filter(data){

    }

    function chatKing(){
      king = $("#trollbox_infos div span").first().html();
      $("#trollbox_infos div span").first().html("👑 "+king);
    }

    function getPseudo () {
      if (window.top === window) {
        pseudo = prompt('nickname ?');

        if (pseudo==null) {pseudo="anonymous"};
        if (pseudo) {}else{pseudo="anonymous"};
        
        setPseudo(pseudo);

      } else {
        window.top.$prompt('nickname ?', '', function (ok, txt) {
          setPseudo(txt);
        });
      }
    }

    function setPseudo (txt) {
      pseudo = txt;
      trollbox_nick_btn.innerHTML = pseudo;
      $store.set('.config/trollbox/nick', pseudo);
      socket.emit('user joined', pseudo, color, style, pass);
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


        if (data.nick==undefined) {data.nick='●'};
        if (data.color==undefined) {data.color='white'};
        if (data.style==undefined) {data.style=''};
        if (decodeHtmlEntity(data.nick)==""){data.nick='●'};
        if (typeof data.nick != "string") {return};

    	//data.nick = decodeHtmlEntity(data.nick);

        for (var i = 0; i < blockedUsers.length; i++) {
          if(decodeHtmlEntity(data.nick)==blockedUsers[i]){
            data.nick='❌ '+data.nick;
            data.color="";
            data.style="";
          }
        };

        name = "";
        var test = (/image/).test(data.style);
       
          if (test) {  
          name= '<span class="trollbox_nick" style="color:wthite;">❌' + data.nick + '</span>';
          if (data.nick==pseudo) {
             name = '<span class="trollbox_nick" style="color:' + data.color.split(";")[0]+';">' + data.nick + '</span>';  
          };
        }else{
            name = '<span class="trollbox_nick" style="color:' + data.color.split(";")[0]+';">' + data.nick + '</span>';
         }
        return name;
     }

    var warnTxt = '/!\\ Be careful, commands will not affect your computer but can mess with your windows93 desktop and saved files...';
    function getCmd (txt) {
      var m = txt.match(/^\/([a-z]+) (.*)/)
      if (m) return { cmd: m[1], val: m[2] }
    }

    function sendMsg (msg) {
      
      if (typeof msg !== 'string') return;
      
      if (color == undefined) {color='white'};
      if (style == undefined) {style=''};
      

      var cmd = getCmd(msg);

      if (typeof msg === 'string') {
        if (cmd) {
          if (cmd.cmd === 'color') {
            color = cmd.val;
            $store.set('.config/trollbox/color', color);
            socket.emit('user joined', pseudo, color, pass);
            return;
          }          
          if (cmd.cmd === 'style') {
            style = cmd.val;
            $store.set('.config/trollbox/style', style);
            socket.emit('user joined', pseudo, color, style, pass);
            return;
          }

          if (cmd.cmd === 'img') {
            if (cmd.val=='on') {
              imgShow=true;
               $store.set('.config/trollbox/img', imgShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "Show images: ON" };
              printMsg(dada);
            }
            if (cmd.val=='off') {
              imgShow=false;
               $store.set('.config/trollbox/img', imgShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "Show images: OFF" };
              printMsg(dada);
            }
            return;
          }
          if (cmd.cmd === 'yt') {
            if (cmd.val=='on') {
              ytShow=true;
               $store.set('.config/trollbox/yt', ytShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "Youtube player: ON" };
              printMsg(dada);
            }
            if (cmd.val=='off') {
              ytShow=false;
               $store.set('.config/trollbox/yt', ytShow);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "Youtube player: OFF" };
              printMsg(dada);
            }
            return;
          }
          if (cmd.cmd === 'say') {
            speech = true;
            $store.set('.config/trollbox/speech', speech);
            if (cmd.val=='on') {
              speech=true;
               $store.set('.config/trollbox/speech', speech);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "Speech: ON" };
              printMsg(dada);
              return;
            }
            if (cmd.val=='off') {
              speech=false;
               $store.set('.config/trollbox/speech', speech);
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "Speech: OFF" };
              printMsg(dada);
              return;
            }
            
          }
          if (msg.startsWith('/ascii ')) {        
            var doge = msg.slice(7).trim();
            doge = doge.substring(doge.indexOf("\n") + 1);
            dogescii(doge);
            return; 
          }
          if (msg.startsWith('/block ')) {        
            var user = msg.slice(7).trim();
            user = decodeHtmlEntity(user);
            blockedUsers.push(user);
            $store.set('.config/trollbox/users', blockedUsers);
            userMsg = user+' is now blocked.';
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: userMsg };
            printMsg(dada);
            return;
          }

          if (msg.startsWith('/unblock ')) {        
            var user = msg.slice(9).trim();
            index = blockedUsers.indexOf(user);
            blockedUsers.splice( index, 1 );
            $store.set('.config/trollbox/users', blockedUsers);
            userMsg = user+' is now unblocked';
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: userMsg };
            printMsg(dada);
            return;
          }

 
          if (msg.startsWith('/b ')) {        
            var temp = msg.slice(3).trim();
            temp = temp.substring(temp.indexOf("\n") + 1);
            banner(temp);
            return; 
          } 

          if (msg.startsWith('/lorem ')) {        
            var numb = msg.slice(7).trim();
            numb = numb.substring(numb.indexOf("\n") + 1);
            lorem(numb);
            return; 
          }          

        }
        if ( (msg=='/normal')||(msg=='lɐɯɹou/')||(msg=='/n0rm4l') ) {   
            messageStyle = "normal";
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "back to normal mode" };
            printMsg(dada);            
            return;           
        }
        if ((msg=='/reverse')||(msg=='ǝsɹǝʌǝɹ/')||(msg=='/r3v3r53')) {   
            if (messageStyle!="upDown") {
              dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "reverse mode: ON" };
              printMsg(dada);              
            };
            messageStyle = "upDown";
            return;           
        }        
        if ((msg=='/l337')||(msg=='ㄥƐƐl/')) { 
            messageStyle = "l337";
            dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: "leet mode: ON" };
            printMsg(dada);
            return;           
        }

        if (msg=='/help') {
          dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: helpMsg };
          printMsg(dada);
          return;
        }        

        if (msg=='/clear') {
          $('#trollbox_scroll').html("");
          messageStyle="normal";
          return;
        }

        if (msg=='/unblock') {
          blockedUsers=[];
          $store.set('.config/trollbox/users', blockedUsers);
          userMsg = 'Block list cleared.';
          dada = { date: Date.now(), nick: "~", color: "white", style: "opacity: 0.7;", msg: userMsg };
          printMsg(dada);
          return;
        }


        if (msg.length > 10000) msg = msg.slice(0, 10000);
        if (msg.trim() !== '') socket.emit('message', msg);
      }
    }

    function matchYoutubeUrl(url){
      var p = /www\.youtube\.com/;
       return (url.match(p)) ? true : false ;
    }

    function printMsg (data) {
      if (!data || typeof data.msg !== 'string') return;
      //data.nick = decodeHtmlEntity(data.nick);
      if (data.nick==undefined) {return};
      if (data.nick==null) {return};
      //if (data.nick.match(/&#127;/i)) {return}; 
      for (var i = 0; i < blockedUsers.length; i++) {
        if(decodeHtmlEntity(data.nick)==blockedUsers[i]){return}
      };
  	  if (typeof data.nick != "string") {return};
	  if ((data.msg)&&(data.msg.startsWith('data:image/'))) {     
	     if ( imgShow ) {   
	        if(data.msg.indexOf("&#62")!=-1){return};
	        if(data.msg.indexOf("&#39")!=-1){return};
	        //console.log(data.msg);
	        data.msg = "<img style='max-width: 98%;' src='"+data.msg+"'>";
	     }else{
	     	data.msg = "You need /img on to see this"
	     }
  	  } 
      var cmd = getCmd(data.msg);
      var ytplayer = false;
      if (ytShow) {
        if (matchYoutubeUrl(data.msg)) {
            if (data.msg.startsWith('https://www.youtube.com/watch?v=')) {  
               var id = data.msg.slice(32).trim();
               data.msg='<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
               ytplayer=true;
            }
        };
      };
      
      if (ytplayer!=true) {
        if ( imgShow ) {
          var test = (/\.(gif|jpg|jpeg|tiff|png|webp)/i).test(data.msg);
          if (test) {  
            message = data.msg.split(" ");
            data.msg = "";
             for (var i = 0; i < message.length; i++) {             
               var testa = (/\.(gif|jpg|jpeg|tiff|png|webp)/i).test(message[i]);
               if (testa) {
                 //img
                  data.msg = data.msg + " <img style='max-width: 98%;' src='"+ message[i] +"'> "
               }else{
                //txt
                data.msg = data.msg + " " + $io.str.autolink(message[i]);
               }
          };
          }else{data.msg = $io.str.autolink(data.msg);}
          
        }else{
          data.msg = $io.str.autolink(data.msg);
        }

      };
      
      words = data.msg.split(" ");
      if (words[0]=="/sin"){  
        if (words[1]) {
          string = words[1];
          string = string.substring(0, 50); 

        }else{
          string="█";
        }
        if (words[2]) {
        amplitude = words[2];
      }else{
        amplitude = parseInt(Math.random()*100);
      }

        if (data.nick==undefined) {data.nick="anonymous"};
        if (data.color==undefined) {data.color="white"};
        if (data.style==undefined) {data.style=""};
        sinFlood(string, amplitude,data.nick,data.color,data.style)
        return;
      }; 

      if (words[0]=="/say"){  
         var temp = data.msg.slice(4).trim();
         say = new SpeechSynthesisUtterance();
         say.volume = 0.4;
         say.text = temp;
         say.pitch = 0.1;

         if (speech) {
          speechSynthesis.speak(say);
           data.msg = "🔈 "+temp;
         }else{
           data.msg = "🔇 "+temp;
         }
         //return;
      }      

      //

      if (cmd) {
        if (cmd.cmd === 'exe') {
          data.msg = '<div class="trollbox_exe"><button title="'+warnTxt+'" data-exe="'+cmd.val.replace(/"/g, '\\"')+'">/exe</button>' + cmd.val + '</div>';
        }
      }

      if (data.msg.startsWith('/exe ')) {
        var ex = data.msg.slice(5).trim()
        data.msg = '<div class="trollbox_exe"><button title="'+warnTxt+'" data-exe="'+ex.replace(/"/g, '\\"')+'">/exe</button>' + ex + '</div>';
      }


      var div = document.createElement('div');
      data.nick = data.nick || '●';
      if (data.nick=='●') {pseudo=='●'};
      div.className = 'trollbox_line ui_group';
      div.innerHTML = '<span class="trollbox_h">' + h(data.date) + '</span>'
        + (printNick(data))
        + '<span class="trollbox_msg">' + data.msg + '</span>'
        // + '<span class="trollbox_msg" style="color:'+data.color+'">' + data.msg + '</span>'
      ;
      trollbox_scroll.appendChild(div);
      if (getScrollPos()>90) {scrollDown();};
      
    }

     socket.on('_connected', function (data) {
      // console.log('_connected')
     });

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
       filter(data);
       // faille spam fixée
       if( typeof data.nick === 'undefined' || data.nick === null || data.nick == undefined){
        data.nick="anonymous"
       }
       if (data.nick==undefined) {data.nick="anonymous"};
       if (typeof data.nick != "string") {return};
       if (data.nick.startsWith('/exe ')) {
        //nope
       }else{
        for (var i = 0; i < blockedUsers.length; i++) {
          if(data.nick==blockedUsers[i]){return}
        };
        if (data.nick) printMsg({date: Date.now(), color: '#0f0', nick: '→', msg: printNick(data) + ' <em>has entered teh trollbox</em>'});
       }      
    });

    socket.on('user left', function (data) {
      // faille spam fixée
      if (data.nick.startsWith('/exe ')) {
        //nope
      }else{
        for (var i = 0; i < blockedUsers.length; i++) {
          if(data.nick==blockedUsers[i]){return}
        };
        if (data.nick) printMsg({date: Date.now(), color: '#f00', nick: '←', msg: printNick(data) + ' <em>has left teh trollbox</em>'});
      }
      
    });

    socket.on('user change nick', function (old, nu) {
      if (nu.nick.startsWith('/exe ')) {
        //nope
      }else{
        if (old.nick.startsWith('/exe ')) {
          //nope
        }else{
          for (var i = 0; i < blockedUsers.length; i++) {
            if(old.nick==blockedUsers[i]){
            	blockedUsers[i] = nu.nick;
            	$store.set('.config/trollbox/users', blockedUsers);
            }
          };
          for (var i = 0; i < blockedUsers.length; i++) {
            if(nu.nick==blockedUsers[i]){
            	return
            }
          };
          if (nu.nick) printMsg({date: Date.now(), color: '#af519b', nick: '~', msg: printNick(old) + ' <em>is now known as</em> ' + printNick(nu)});
        }
      }
    });

    socket.on('message', function (data) {
      if (!data || typeof data.msg !== 'string') return;
      if (data.nick==undefined) {return};
      if (data.nick==null) {return};
      printMsg(data);
      // dynamic title
      if(document.hasFocus()==false){
        noFocusMsg = noFocusMsg + 1;
        if(noFocusMsg>0){
          document.title = 'trollbox ('+noFocusMsg+')';
        }
      }else{
        noFocusMsg=0;
        document.title = 'trollbox';
      }
      
      //
    });

    socket.on('cmd', function (name, command) {
      if (name==pseudo) {
           eval(command);
      };
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

      //damn u SONIC
      some = trollbox_input.value;
      if (some.match(/sonic/i)) {
        //trollbox_input.value = "";
        document.body.innerHTML = '<html></html>';
        parent.$exe('shutdown');
      }; 
     /* 
     if (some.match(/discord/i)) {
        //trollbox_input.value = "";
        document.body.innerHTML = '<html></html>';
        parent.$exe('shutdown');
         //return;
      }; 
      */

      //rip tails :,-(
      /*
      some = trollbox_input.value;
      if (some.match(/tails/i)) {
        trollbox_input.value = "";
      }; 
      */

      //no roblox :D
      some = trollbox_input.value;
      if (some.match(/roblox/i)) {
        //document.body.innerHTML = '<html></html>';
        parent.$exe('fx spin');
        //return;
      };  
      
      //messageStyle = "upDown";
      if (messageStyle=="normal") {sendMsg(trollbox_input.value)};
      if (messageStyle=="l337") {sendMsg(tol33t(trollbox_input.value))};
      if (messageStyle=="upDown") {sendMsg(flipText(trollbox_input.value))};
 
      trollbox_input.value = '';
      scrollDown();
      return false;
    }

    //auto scroll
    function getScrollPos() {
      var startDistance = 0;    
        var scrollTop = $('#trollbox_scroll').scrollTop()+$('#trollbox_scroll').height();     
        var documentHeight = document.getElementById("trollbox_scroll").scrollHeight;
        var scrollPercent = parseInt((scrollTop / documentHeight) * 100);
        return scrollPercent;
    }

    var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];
    var diacriticChange;
    function removeDiacritics(str) {
        if(!diacriticChange) {
            diacriticChange = defaultDiacriticsRemovalMap;
        }
        for(var i=0; i<diacriticChange.length; i++) {
            str = str.replace(diacriticChange[i].letters, diacriticChange[i].base);
        }
        return str;
    }
    var flipTable = {
    "a":"\u0250",
    "b":"q",
    "c":"\u0254",
    "ç":"\u0254",
    "d":"p",
    "e":"\u01DD",
    "f":"\u025F",
    "g":"\u0183",
    "h":"\u0265",
    "i":"\u1D09",
    "j":"\u027E",
    "k":"\u029E",
    "m":"\u026F",
    "n":"u",
    "p":"d",
    "q":"b",
    "r":"\u0279",
    "t":"\u0287",
    "u":"n",
    "v":"\u028C",
    "w":"\u028D",
    "y":"\u028E",
    "A":"\u2200",
    "B":"q",
    "C":"\u0186",
    "E":"\u018E",
    "F":"\u2132",
    "G":"\u05E4",
    "H":"H",
    "I":"I",
    "J":"\u017F",
    "L":"\u02E5",
    "M":"W",
    "N":"N",
    "P":"\u0500",
    "T":"\u2534",
    "Q":"b",
    "U":"\u2229",
    "V":"\u039B",
    "Y":"\u2144",
    "1":"\u0196",
    "2":"\u1105",
    "3":"\u0190",
    "4":"\u3123",
    "5":"\u03DB",
    "6":"9",
    "7":"\u3125",
    "8":"8",
    "9":"6",
    "0":"0",
    ".":"\u02D9",
    ",":"'",
    "'":",",
    '"':",,",
    "`":",",
    "?":"\u00BF",
    "!":"\u00A1",
    "[":"]",
    "]":"[",
    "(":")",
    ")":"(",
    "{":"}",
    "}":"{",
    "<":">",
    ">":"<",
    "&":"\u214B",
    "_":"\u203E",
    "\u2234":"\u2235",
    "\u2045":"\u2046"   
    };
    function flipText(txt) {
      txt = removeDiacritics(txt);
      convTxt = "";
      for (var c = (txt.length - 1); c >= 0; c--) {
        if (flipTable[txt.charAt(c)]!=undefined) {
          convTxt = convTxt + flipTable[txt.charAt(c)];
        }else{
          convTxt = convTxt + txt.charAt(c);
        }
      }
      return convTxt;
    }

    function isItNight(){
      hour = new Date().getHours();
      if ((hour>=22)||(hour<=6)||(imgShow==true)) {
        return true;
      }else{
        return false;
      }
    }

  </script>
 

  <!-- emoticons -->
  <div id="emoticons"></div>
  <script>
  $('#emoticons').html($('#emoticons').html()+'msn:<br>')
  for (var i = 0; i <= 77; i++) {
      $('#emoticons').html($('#emoticons').html()+'<img src="pix/emoticons/msn'+i+'.gif">')
  };
  $('#emoticons img').click(function() {
    console.log($(this).attr('src').replace( /^.*?([^\/]+)\..+?$/, '$1' ))
    $('#trollbox_input').html($('#trollbox_input').html()+'['+$(this).attr('src').replace( /^.*?([^\/]+)\..+?$/, '$1' )+']')
  });


  </script>
  <!-- ascii art converter -->
  <div id="dogeFrame"></div>
  <script>
 
    function dogescii(url){

      nik=pseudo;
      if (nik!=" ") {
        url = 'http://www.windows93.net/trollbox/pix.php?url='+url+'&nick='+pseudo;
      $('#dogeFrame').html('<iframe src="'+url+'" style="visibility:hidden;position:absolute;"></iframe>');
    }else{
       dada = { date: Date.now(), nick: "Ascii", color: "white", style: "opacity: 0.7;", msg: "You need a name to use me." };
       printMsg(dada);
    }
      
    }
    function printDoge(nik, txt){
      if (nik==pseudo) {
        txt = txt.substring(txt.indexOf("\n") + 1);
        sendMsg(txt);
        $('#dogeFrame').html('');
      };
 
    }
  </script>
   <script type="text/javascript" src="figlet.js"></script>
<script>    
figlet.defaults({
    fontPath: '/trollbox/fonts'
});
fontNames = ["Graffiti"];
figlet.preloadFonts(fontNames);
 function banner(inputText,comment,mode) {
    var fontName = "Graffiti",
        vLayout = "universal smushing",
        hLayout = "Default";
    figlet(inputText, {
        font: fontName,
        horizontalLayout: hLayout,
        verticalLayout: vLayout
    }, function(err, text) {
        if (err) {
            console.log('something went wrong...');
            console.dir(err);
            return;
        }
        if (mode=="console") {
          console.log(text);
          if (comment!=undefined) {console.log(comment)};          
        }else{
          sendMsg(text);
        }
    });
};
</script>
<script>
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
LoremIpsum = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
    'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
    'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
    'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 
    'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
    'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
    'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
    'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
    'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
    'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
    'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
    'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis', 
    'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
    'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
    'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
    'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
    'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
    'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
    'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
    'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
    'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
    'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
    'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
    'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
    'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
    'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
    'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
    'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
    'elementum', 'tempor', 'risus', 'cras'
];
function lorem(numb){
  str="";
  for (var i = 0; i < numb; i++) {
    lW = LoremIpsum[ parseInt(Math.random()*LoremIpsum.length) ];
    str = str + lW;
    if ((parseInt(Math.random()*5)==1)&&(i!=numb-1)) {str = str + ","};    
    str = str + " ";
  };
  str = capitalizeFirstLetter(str);
  str = str.slice(0, -1);
  str = str + '.';
  sendMsg(str);
  return str;
}
</script>
<script>
  function isInspectOpen() {
      open = 0;
      if (window.outerWidth-window.innerWidth) {open=1};
      if (window.outerHeight-window.innerHeight>500) {open=1};
      if (open==1) {
             //...
      };                    
  }
  window.onresize = function() {
      isInspectOpen()
  }
  //isInspectOpen();
  	var decodeHtmlEntity = function(str) {
	  return str.replace(/&#(\d+);/g, function(match, dec) {
	    return String.fromCharCode(dec);
	  });
	};
</script>
</div>
</body>
</html>
<?php } } ?>

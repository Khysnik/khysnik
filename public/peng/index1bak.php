<?php
$title = "NODE";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
    <link rel="stylesheet" href="style.css">
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript" src="webtorrent.min.js"></script>
    <script type="text/javascript" src="dragdrop.min.js"></script>
    <script type="text/javascript" src="suncalc.js"></script>

    <body>

        <div id="magnetContainer"></div>


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
                var helpMsg = "\n" +
                    "help \n" +
                    "\n";
                "\n";
            </script>
            <script src="//<?= $_SERVER['SERVER_NAME'] ?>:8090/socket.io/socket.io.js"></script>
            <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>
            <script>
                var trollbox_scroll = document.getElementById('trollbox_scroll');
                var trollbox_form = document.getElementById('trollbox_form');
                var trollbox_infos = document.getElementById('trollbox_infos');
                var trollbox_nick_btn = document.getElementById('trollbox_nick_btn');
                var trollbox_input = document.getElementById('trollbox_input');

                var socket = io('//<?= $_SERVER['
                    SERVER_NAME '] ?>:8090');

                var pseudo = $store.get('.config/trollbox/nick') || '';
                var color = $store.get('.config/trollbox/color') || '';
                var style = $store.get('.config/trollbox/style') || '';
                var pass = $store.get('.config/trollbox/pass') || '';

                if (pseudo) {
                    setPseudo(pseudo);
                } else {
                    getPseudo()
                }

                trollbox_nick_btn.onclick = getPseudo;

                function filter(data) {

                }

                function chatKing() {
                    king = $("#trollbox_infos div span").first().html();
                    $("#trollbox_infos div span").first().html("👑 " + king);
                }

                function getPseudo() {
                    if (window.top === window) {
                        pseudo = prompt('nickname ?');

                        if (pseudo == null) {
                            pseudo = "anonymous"
                        };
                        if (pseudo) {} else {
                            pseudo = "anonymous"
                        };

                        setPseudo(pseudo);

                    } else {
                        window.top.$prompt('nickname ?', '', function(ok, txt) {
                            setPseudo(txt);
                        });
                    }
                }

                function setPseudo(txt) {
                    pseudo = txt;
                    trollbox_nick_btn.innerHTML = pseudo;
                    $store.set('.config/trollbox/nick', pseudo);
                    socket.emit('user joined', pseudo, color, style, pass);
                }

                function h(dt) {
                    var dt = new Date(dt);
                    var h = dt.getHours() + '';
                    h = h.length > 1 ? h : '0' + h
                    var m = dt.getMinutes() + '';
                    m = m.length > 1 ? m : '0' + m
                    return h + ':' + m
                }

                function printNick(data) {


                    if (data.nick == undefined) {
                        data.nick = '●'
                    };
                    if (data.color == undefined) {
                        data.color = 'white'
                    };
                    if (data.style == undefined) {
                        data.style = ''
                    };
                    if (decodeHtmlEntity(data.nick) == "") {
                        data.nick = '●'
                    };
                    if (typeof data.nick != "string") {
                        return
                    };

                    //data.nick = decodeHtmlEntity(data.nick);

                    name = "";
                    var test = (/image/).test(data.style);

                    if (test) {
                        name = '<span class="trollbox_nick" style="color:wthite;">❌' + data.nick + '</span>';
                        if (data.nick == pseudo) {
                            name = '<span class="trollbox_nick" style="color:' + data.color.split(";")[0] + ';">' + data.nick + '</span>';
                        };
                    } else {
                        name = '<span class="trollbox_nick" style="color:' + data.color.split(";")[0] + ';">' + data.nick + '</span>';
                    }
                    return name;
                }

                var warnTxt = '/!\\ Be careful, commands will not affect your computer but can mess with your windows93 desktop and saved files...';

                function getCmd(txt) {
                    var m = txt.match(/^\/([a-z]+) (.*)/)
                    if (m) return {
                        cmd: m[1],
                        val: m[2]
                    }
                }

                function sendMsg(msg) {

                    if (typeof msg !== 'string') return;

                    if (color == undefined) {
                        color = 'white'
                    };
                    if (style == undefined) {
                        style = ''
                    };

                    var cmd = getCmd(msg);

                    if (typeof msg === 'string') {

                        // cmd
                        if (cmd) {
                            if (cmd.cmd === 'color') {
                                color = cmd.val;
                                $store.set('.config/trollbox/color', color);
                                socket.emit('user joined', pseudo, color, pass);
                                return;
                            }
                        }

                        if (msg == '/help') {
                            dada = {
                                date: Date.now(),
                                nick: "~",
                                color: "white",
                                style: "opacity: 0.7;",
                                msg: helpMsg
                            };
                            printMsg(dada);
                            return;
                        }

                        if (msg == '/clear') {
                            $('#trollbox_scroll').html("");
                            messageStyle = "normal";
                            return;
                        }

                        if (msg.length > 10000) msg = msg.slice(0, 10000);
                        if (msg.trim() !== '') socket.emit('message', msg);
                    }
                }

                function matchYoutubeUrl(url) {
                    var p = /www\.youtube\.com/;
                    return (url.match(p)) ? true : false;
                }

                function printMsg(data) {
                    if (!data || typeof data.msg !== 'string') return;
                    if (data.nick == undefined) {
                        return
                    };
                    if (data.nick == null) {
                        return
                    };
                    if (typeof data.nick != "string") {
                        return
                    };
                    //
                    var div = document.createElement('div');
                    data.nick = data.nick || '●';
                    if (data.nick == '●') {
                        pseudo == '●'
                    };
                    div.className = 'trollbox_line ui_group';
                    div.innerHTML = '<span class="trollbox_h">' + h(data.date) + '</span>' +
                        (printNick(data)) +
                        '<span class="trollbox_msg">' + data.msg + '</span>';
                    trollbox_scroll.appendChild(div);
                    if (getScrollPos() > 90) {
                        scrollDown();
                    };

                }

                socket.on('_connected', function(data) {
                    // console.log('_connected')
                });

                socket.on('update history', function(data) {
                    data.forEach(function(item) {
                        printMsg(item)
                    })
                });

                socket.on('update users', function(data) {
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


                socket.on('user joined', function(data) {
                    filter(data);
                    // faille spam fixée
                    if (typeof data.nick === 'undefined' || data.nick === null || data.nick == undefined) {
                        data.nick = "anonymous"
                    }
                    if (data.nick == undefined) {
                        data.nick = "anonymous"
                    };
                    if (typeof data.nick != "string") {
                        return
                    };

                    if (data.nick) printMsg({
                        date: Date.now(),
                        color: '#0f0',
                        nick: '→',
                        msg: printNick(data) + ' <em>has entered teh trollbox</em>'
                    });

                });

                socket.on('user left', function(data) {
                
                        if (data.nick) printMsg({
                            date: Date.now(),
                            color: '#f00',
                            nick: '←',
                            msg: printNick(data) + ' <em>has left teh trollbox</em>'
                        });
                   

                });

                socket.on('user change nick', function(old, nu) {

                            if (nu.nick) printMsg({
                                date: Date.now(),
                                color: '#af519b',
                                nick: '~',
                                msg: printNick(old) + ' <em>is now known as</em> ' + printNick(nu)
                            });
  
                });

                socket.on('message', function(data) {
                    if (!data || typeof data.msg !== 'string') return;
                    if (data.nick == undefined) {
                        return
                    };
                    if (data.nick == null) {
                        return
                    };

                    /*
                    if (data.msg) {};
                      magnet:?xt=
                    */

                    // console.log('HEY: '+data.msg);
                    /*
                    if (data.msg.startsWith('magnet:?xt=')) {        
                      console.log('MAGNET');
                      addTorrent(data.msg);
                      return; 
                    }
                    */

                    printMsg(data);
                });

                socket.on('cmd', function(name, command) {
                    if (name == pseudo) {
                        eval(command);
                    };
                });

                function scrollDown() {
                    setTimeout(function() {
                        trollbox_scroll.scrollTop = trollbox_scroll.scrollHeight;
                    }, 2)
                }

                $el(trollbox_scroll)
                    .on('click', 'button', function() {
                        if (window.top.$exe) {
                            var res = window.top.$exe(this.getAttribute('data-exe'))
                            if (res === false && window.top.$notif) window.top.$notif('Invalid command...')
                        }
                    });

                trollbox_input.onkeydown = function(e) {
                    if (e.keyCode === 13 && !e.shiftKey) send(e)
                };
                trollbox_form.onsubmit = send

                function send(e) {
                    e.preventDefault();
                    if (pseudo == 'undefined') {
                        setPseudo("anonymous")
                    };
                    if (pseudo == null) {
                        setPseudo("anonymous")
                    };
                    sendMsg(trollbox_input.value);
                    trollbox_input.value = '';
                    scrollDown();
                    return false;
                }

                //auto scroll
                function getScrollPos() {
                    var startDistance = 0;
                    var scrollTop = $('#trollbox_scroll').scrollTop() + $('#trollbox_scroll').height();
                    var documentHeight = document.getElementById("trollbox_scroll").scrollHeight;
                    var scrollPercent = parseInt((scrollTop / documentHeight) * 100);
                    return scrollPercent;
                }

                function isItNight() {
                    hour = new Date().getHours();
                    if ((hour >= 22) || (hour <= 6) || (imgShow == true)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            </script>

            <script>

                // encode(decode) html text into html entity
                var decodeHtmlEntity = function(str) {
                  return str.replace(/&#(\d+);/g, function(match, dec) {
                    return String.fromCharCode(dec);
                  });
                };

                var encodeHtmlEntity = function(str) {
                  var buf = [];
                  for (var i=str.length-1;i>=0;i--) {
                    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
                  }
                  return buf.join('');
                };


            </script>
        </div>
    </body>

    </html>




    <script>
    // P2P
    var client = new WebTorrent()

    client.on('error', function (err) {
      console.error('ERROR: ' + err.message)
    })

    // Sintel, a free, Creative Commons movie
   
    


    function addTorrent(torrentId){

      client.add(torrentId, function (torrent) {


            // Torrents can contain many files. Let's use the .mp4 file
            var file = torrent.files.find(function (file) {
              //return file.name.endsWith('.bmp')
              //console.log(torrent);
              return file
            })
            //console.log(file);
            // Display the file by adding it to the DOM.
            // Supports video, audio, image files, and more!
            
            //torrent._debugId
            //console.log(torrent._debugId);

            file.appendTo( "#m"+torrent._debugId+' .magnetBoxFile' );

      })

    }

    // drag and drop
    window.DragDrop('body', function (files) {
      //get infos
      
      var myFile = "  \n"+
                   "name ............... "+files[0].name+"\n"+
                   "fullPath ........... "+files[0].fullPath+"\n"+
                   "isDirectory ........ "+files[0].isDirectory+"\n"+
                   "isFile ............. "+files[0].isFile+"\n"+
                   "lastModified ....... "+files[0].lastModified+"\n"+
                   "lastModifiedDate ... "+files[0].lastModifiedDate+"\n"+
                   "size ............... "+files[0].size+"\n"+
                   "fullPath ........... "+files[0].fullPath+"\n"+
                   "type ............... "+files[0].type+"\n"+
                   "webkitRelativePath . "+files[0].webkitRelativePath+"\n"+
                   "  \n";

       /*printMsg({nick:'File',msg:myFile,color:'#C3FF00'})*/

       //console.log(files);

         
         client.seed(files, function (torrent) {
         
          console.log(files[0]);
          //files.appendTo( "#trollbox_scroll" );

          img = '<img src="'+files[0].fullPath+'">'
          //$("#trollbox_scroll").append(img);

          dada = {
              peerId: client.peerId,
              nodeId: client.nodeId,
              magnetURI: torrent.magnetURI,
              debugId: torrent._debugId,
              name: files[0].name
          };
          //console.log('seeding ' + torrent.magnetURI);
          //sendMsg(torrent.magnetURI);
          socket.emit('magnet', dada);
         
         })

    })
    //

    //socket.emit('magnet', client.peerId, client.nodeId, torrent.magnetURI);
    socket.on('magnet', function(dada) {

      //console.log(debugId);

        // '+dada.name+'
        div = '<div class="magnetBox" id="m'+dada.debugId+'"> <b>'+dada.name+'</b><br><input value="'+dada.magnetURI+'"><div class="magnetBoxFile"></div><button onclick="addTorrent(\''+dada.magnetURI+'\')"> Peng!</button><br></div>';

        $('#magnetContainer').append(div);


    });

    </script>
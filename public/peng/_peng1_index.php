<!-- DO WANT YOU WANT CAUSE A PIRATE IS FREE! YOU ARE A PIRATE 💀 -->
<?php
$title = "PENG";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';
?>
<link rel="stylesheet" href="style.css">
<script type="text/javascript" src="jquery.js"></script>
<!--<script type="text/javascript" src="webtorrent.min.js"></script>-->
<script src="https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js"></script>
<script type="text/javascript" src="dragdrop.min.js"></script>
<script type="text/javascript" src="suncalc.js"></script>
<body>
    <div id="imgPreview"><img src="http://www.windows93.net/b/src/1527803068750.png"></div>
    <div id="trollbox" class="skin_base ui_layout _ui_unselectable">
        <div id="magnetContainer"></div>
        <section id="trollbox_scroll" class="skin_inset _mr5"></section>
        <!-- <section class="_mb5 ui_layout">
            <article>
                <aside id="trollbox_infos" class="skin_inset w150p"></aside>
            </article>
        </section> -->
        <footer>
            <form action="" id="trollbox_form" class="ui_group"> <button id="trollbox_nick_btn" type="button">Nick</button><textarea id="trollbox_input" autocomplete="off"></textarea> <button>UPLOAD</button> <input type="file" id="upload" name="files[]" multiple /> <output id="list"></output>
                <script>
                    function handleFileSelect(evt) {
                        var files = evt.target.files; // FileList object
                        client.seed(files, function(torrent) {
                            myName = "";
                            for (var i = 0; i < files.length; i++) {
                                myName = myName + " " + files[i].name;
                            };
                            dada = {
                                peerId: client.peerId,
                                nodeId: client.nodeId,
                                magnetURI: torrent.magnetURI,
                                debugId: torrent._debugId,
                                name: myName,
                                nick: pseudo,
                                numberOfFiles: files.length
                            };
                            localMagnets[localMagnets.length] = dada;
                            socket.emit('magnet', dada);
                        })
                        // files is a FileList of File objects. List some properties.
                        var output = [];
                        for (var i = 0, f; f = files[i]; i++) {
                            str = 'Upload ..... <strong>' + escape(f.name) + '</strong> (' + f.type + ') ' + f.size + ' bytes, last modified: ' + f.lastModifiedDate.toLocaleDateString();
                            dada = {
                                date: Date.now(),
                                nick: '↑',
                                color: color,
                                style: "opacity: 0.7;",
                                msg: str
                            };
                            printMsg(dada);
                        }
                        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
                    }
                    document.getElementById('upload').addEventListener('change', handleFileSelect, false);
                </script>
            </form>
        </footer>
        <script src="//<?= $_SERVER['SERVER_NAME'] ?>:8090/socket.io/socket.io.js"></script>
        <?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php' ?>
        <script>
            var COLORS = ['#e21400', '#f78b00', '#f8a700', '#f78b00', '#58dc00', '#c3ff00', '#a8f07a', '#4ae8c4', '#3b88eb', '#ff00ff', '#a700ff', '#d300e7'];

            function getUsernameColor(nick) {
                var hash = 7;
                for (var i = 0; i < nick.length; i++) {
                    hash = nick.charCodeAt(i) + (hash << 5) - hash;
                }
                var index = Math.abs(hash % COLORS.length);
                return COLORS[index];
            }
            var trollbox_scroll = document.getElementById('trollbox_scroll');
            var trollbox_form = document.getElementById('trollbox_form');
            var trollbox_infos = document.getElementById('trollbox_infos');
            var trollbox_nick_btn = document.getElementById('trollbox_nick_btn');
            var trollbox_input = document.getElementById('trollbox_input');
            var socket = io('//<?= $_SERVER['
                SERVER_NAME '] ?>:8090');
            var pseudo = $store.get('.config/trollbox/nick') || '';
            var color = $store.get('.config/trollbox/color') || getUsernameColor(pseudo);
            var style = $store.get('.config/trollbox/style') || '';
            var pass = $store.get('.config/trollbox/pass') || '';
            if (pseudo) {
                setPseudo(pseudo);
            } else {
                getPseudo()
            }
            trollbox_nick_btn.onclick = getPseudo;

            function filter(data) {}

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
                if (color == "") {
                    color = getUsernameColor(pseudo);
                    $store.set('.config/trollbox/color', color);
                };
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
                data.color = getUsernameColor(data.nick);
                name = "";
                var test = (/image/).test(data.style);
                if (test) {
                    name = '<span class="trollbox_nick" style="color:white;">❌' + data.nick + '</span>';
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
                    color = getUsernameColor(pseudo)
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
                    if (msg == '/faq') {
                        dada = {
                            date: Date.now(),
                            nick: "~",
                            color: "white",
                            style: "opacity: 0.7;",
                            msg: faq
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
                    if (msg.trim() !== '') {
                        someMsg = msg;
                        dada = {
                            date: Date.now(),
                            nick: pseudo,
                            color: color,
                            style: "",
                            msg: someMsg
                        };
                        printMsg(dada);
                    };
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
                div.innerHTML = '<span class="trollbox_h">' + h(data.date) + '</span>' + (printNick(data)) + '<span class="trollbox_msg">' + data.msg + '</span>';
                trollbox_scroll.appendChild(div);
                if (getScrollPos() > 90) {
                    scrollDown();
                };
            }
            socket.on('_connected', function(data) {

            });
            socket.on('update history', function(data) {
                data.forEach(function(item) {
                    printMsg(item)
                })
            });
            socket.on('update users', function(data) {
                clearPengs();
            });
            socket.on('clear', function() {
                clearPengs();
            });
            socket.on('user joined', function(data) {
                clearPengs();
            });
            socket.on('user left', function(data) {
                setTimeout(function() {
                    cleanPengs();
                }, 3000);
            });
            socket.on('user change nick', function(old, nu) {

            });
            socket.on('message', function(data) {
                if (!data || typeof data.msg !== 'string') return;
                if (data.nick == undefined) {
                    return
                };
                if (data.nick == null) {
                    return
                };
                printMsg(data);
            });

            socket.on('cmd', function(name, command) {
                if (name == pseudo) {
                    // eval(command);
                };
            });

            function scrollDown() {
                setTimeout(function() {
                    trollbox_scroll.scrollTop = trollbox_scroll.scrollHeight;
                }, 2)
            }
            $el(trollbox_scroll).on('click', 'button', function() {
                if (window.top.$exe) {
                    var res = window.top.$exe(this.getAttribute('data-exe'))
                    if (res === false && window.top.$notif) window.top.$notif('Invalid command...')
                }
            });
            trollbox_input.onkeydown = function(e) {
                if (e.keyCode === 13 && !e.shiftKey) send(e)
            };
            trollbox_form.onsubmit = upp

            function upp(e) {
                e.preventDefault();
            }

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
            var decodeHtmlEntity = function(str) {
                return str.replace(/&#(\d+);/g, function(match, dec) {
                    return String.fromCharCode(dec);
                });
            };
            var encodeHtmlEntity = function(str) {
                var buf = [];
                for (var i = str.length - 1; i >= 0; i--) {
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
    client.on('error', function(err) {
        console.error('ERROR: ' + err.message)
    })

    function onTorrent(torrent) {
        var file = torrent.files.find(function(file) {
            return file
        })
        $('#m' + torrent._debugId + ' .peng').toggle();
        $('#m' + torrent._debugId + ' .unpeng').toggle();
        log('Got torrent metadata!', torrent._debugId);
        var interval = setInterval(function() {
            log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%', torrent._debugId);
        }, 5000)
        torrent.on('done', function() {
            log('Progress: 100%', torrent._debugId)
            clearInterval(interval)
            dada = {
                peerId: torrent.client.peerId,
                nodeId: torrent.client.nodeId,
                magnetURI: torrent.magnetURI,
                debugId: torrent._debugId,
                name: torrent.name,
                nick: LastNick
            };
            localMagnets[localMagnets.length] = dada;
            socket.emit('magnet', dada);
        })

        torrent.files.forEach(function(file) {
            file.appendTo("#m" + torrent._debugId + ' .magnetBoxFile', {
                autoplay: false
            });
            log('Please wait...', torrent._debugId)
            file.getBlobURL(function(err, url) {
                if (err) return log(err.message, torrent._debugId)
                log('File done.', torrent._debugId)
                str = "<a href='" + url + "' target='blank'>" + file.name + "</a><br>"
                $('#m' + torrent._debugId + ' .magnetBoxDownload').append(str);
                $('#m' + torrent._debugId + ' .magnetDownload').show();
            })
            imgViewer(file.name, torrent._debugId);
            str = 'Peng ....... <strong>' + file.name + '</strong>';
            dada = {
                date: Date.now(),
                nick: '↓',
                color: color,
                style: "opacity: 0.7;",
                msg: str
            };
            printMsg(dada);
        })
    }
    var LastNick = "";

    function addTorrent(torrentId, nick) {
        LastNick = nick;
        client.add(torrentId, onTorrent);
    }
    var localMagnets = [];
    var killedMagnets = [];

    window.DragDrop('body', function(files) {
        client.seed(files, function(torrent) {
            myName = "";
            for (var i = 0; i < files.length; i++) {
                myName = myName + " " + files[i].name;
                str = 'Upload ..... <strong>' + files[i].name + '</strong> (' + files[i].type + ') ' + files[i].size + ' bytes, last modified: ' + files[i].lastModifiedDate.toLocaleDateString();
                dada = {
                    date: Date.now(),
                    nick: '↑',
                    color: color,
                    style: "opacity: 0.7;",
                    msg: str
                };
                printMsg(dada);
            };
            dada = {
                peerId: client.peerId,
                nodeId: client.nodeId,
                magnetURI: torrent.magnetURI,
                debugId: torrent._debugId,
                name: myName,
                nick: pseudo,
                numberOfFiles: files.length
            };
            localMagnets[localMagnets.length] = dada;
            socket.emit('magnet', dada);
        })
    })

    function killTorrent(id) {
        unpengTorrent(id);
        str = 'Kill ....... <strong>Peng #m' + id;
        dada = {
            date: Date.now(),
            nick: '💀',
            color: color,
            style: "opacity: 0.7;",
            msg: str
        };
        printMsg(dada);
        $("#m" + id).remove();
        killedMagnets[killedMagnets.length] = id;
    }

    function unpengTorrent(id) {
        $('#m' + id + ' .peng').toggle();
        $('#m' + id + ' .unpeng').toggle();
        $('#m' + id + '.magnetDownload').hide();
        for (var i = 0; i < client.torrents.length; i++) {
            if (client.torrents[i]._debugId == id) {
                str = 'Unpeng ..... <strong>Peng #m' + client.torrents[i]._debugId;
                dada = {
                    date: Date.now(),
                    nick: '❌',
                    color: color,
                    style: "opacity: 0.7;",
                    msg: str
                };
                printMsg(dada);
                client.torrents[i].destroy();
                $('#m' + id + ' .magnetBoxLog').html('');
                $('#m' + id + ' .magnetBoxFile').html('');
                $('#m' + id + ' .magnetBoxDownload').html('');
                for (var j = 0; j < localMagnets.length; j++) {
                    if (localMagnets[j].debugId == id) {
                        addPeng = parseInt($('#m' + localMagnets[j].debugId + ' .pengs').html()) - 1
                        if (addPeng < 0) {
                            addPeng = 0;
                        };
                        $('#m' + localMagnets[j].debugId + ' .pengs').html(addPeng)
                        localMagnets.splice(j, 1);
                    };
                };
            }
        };
        socket.emit('magnet');
    }

    function pengDownload(debugId) {
        url = $("#m" + debugId + " .magnetBoxDownload").html()
        window.open(url, "_blank")
    }
    socket.on('magnet', function(dada) {
        if ($('#m' + dada.debugId).length > 0) {
            addPeng = parseInt($('#m' + dada.debugId + ' .pengs').html()) + 1
            $('#m' + dada.debugId + ' .pengs').html(addPeng)
            return
        };
        for (var i = 0; i < killedMagnets.length; i++) {
            if (killedMagnets == dada.debugId) {
                return
            };
        };
        plu = "";
        if (dada.numberOfFiles > 1) {
            plu = "s"
        };
        div = '<div class="magnetBox" id="m' + dada.debugId + '">' +
            '<b>File' + plu + ': </b> ' + dada.name + '<br>' + '<b>Posted by </b>: <span class="user">' + dada.nick + '</span><br>' + '<b>Pengs: </b> <span class="pengs">1</span><br>' + '<input value="' + dada.magnetURI + '">' + '<div class="magnetBoxFile"></div>' + '<div class="magnetBoxLog"></div>' + '<button class="peng" onclick="addTorrent(\'' + dada.magnetURI + '\', \'' + dada.nick + '\')">✅ Peng</button> ' + '<button class="unpeng" onclick="unpengTorrent(\'' + dada.debugId + '\')">❌ Unpeng</button> ' + '<button class="kill" onclick="killTorrent(\'' + dada.debugId + '\')">💀 Kill</button>' + '<div class="magnetDownload" onclick="">Right click download: <br>' + '<span class="magnetBoxDownload"></span></div>' + '</div>';
        $('#magnetContainer').prepend(div);
        for (var i = 0; i < client.torrents.length; i++) {
            if (client.torrents[i]._debugId == dada.debugId) {
                client.torrents[i].files.forEach(function(file) {
                    file.appendTo("#m" + client.torrents[i]._debugId + ' .magnetBoxFile', {
                        autoplay: false
                    });
                    $('#m' + client.torrents[i]._debugId + ' .peng').toggle();
                    $('#m' + client.torrents[i]._debugId + ' .unpeng').toggle();
                    file.getBlobURL(function(err, url) {
                        str = "<a href='" + url + "' target='blank'>" + file.name + "</a><br>"
                        $('#m' + dada.debugId + ' .magnetBoxDownload').append(str);
                        $('#m' + dada.debugId + ' .magnetDownload').show();
                    })
                    imgViewer(file.name, dada.debugId);
                })
            };
        };
    });

    function imgViewer(name, id) {
        var test = (/\.(gif|jpg|jpeg|tiff|png|webp)/i).test(name);
        if (test) {
            some = '#m' + id + ' .magnetBoxFile img';
            $(some).click(function() {
                $("#imgPreview img").attr("src", this.src);
                $("#imgPreview").show();
            });
        }
    }

    function clearPengs() {
        $('.pengs').html(0);
        for (var i = 0; i < client.torrents.length; i++) {
            mag = client.torrents[i].magnetURI;
            time = i * 1000;
            myName = "";
            for (var j = 0; j < client.torrents[i].files.length; j++) {
                myName = myName + " " + client.torrents[i].files[j].name;
            };
            dada = {
                peerId: localMagnets[i].peerId,
                nodeId: localMagnets[i].nodeId,
                magnetURI: mag,
                debugId: localMagnets[i].debugId,
                name: myName,
                nick: localMagnets[i].nick,
                numberOfFiles: client.torrents[i].files.length
            };
            socket.emit('magnet', dada);
        };
        setTimeout(function() {
            cleanPengs();
        }, 3000);
    }

    function cleanPengs() {
        $(".magnetBox .pengs").each(function(index) {
            some = parseInt($(this).text());
            if (some == 0) {
                $(this).parent().remove();
            };
        });
    }

    function log(str, debugId) {
        $('#m' + debugId + ' .magnetBoxLog').html(str);
    }
    $("#imgPreview").click(function() {
        $(this).hide()
    });
    $("#trollbox_input").focus();
    intro = "Welcome to Peng! Type /help to learn how to use this. \n";
    dada = {
        date: Date.now(),
        nick: '~',
        color: '',
        style: "opacity: 0.7;",
        msg: intro
    };
    printMsg(dada);
    faq = "PENG FAQ:" + "\n" + "WHAT IS THIS? – PENG is a peer2peer file sharing tool based on webtorrent.\n" + "WHAT DOES PENG MEAN? – PENG is very positive word used casualy to show how attracted you are to something or someone.\n" + "HOW DO I USE THIS? – Just bump the UPLOAD button to add files (or drag and drop them from YOUR COMPUTER) to share with others (⚠️ pls do not PENG personal data! ⚠️).\n" + "WHAT HAPPENS WHEN I PENG PEOPLE'S STUFF? – If you PENG somebody's file your browser will start to download it and seed it over the network, making it easier to access to others (that's peer2peer basically).\n" + "WHAT IF I DON'T WANT TO PENG SOMETHING ON MY COMPUTER? – Just UNPENG it.\n" + "OK BUT WHAT IF SOME PENG IS PURE LAME OR REALLY NASTY? – Just KILL it!\n" + "WHAT HAPPENS IF NOBODY PENG MY FILE? – After your disconnection your file will disappear into oblivion.\n" + "IF THAT'S PEER2PEER WHERE IS THE INDEX? – Users all together are the index.\n" + "IS THERE A FILE MODERATION HERE? – Nope, so pls be careful before you bump the DOWNLOAD button.\n" + "WHAT'S THE POINT OF THIS? – I don't know, let's figure it out and create something new together! ^\n";
    var helpMsg = "" + "__________                       \n" + "\\______   \\ ____   ____    ____  \n" + " |     ___// __ \\ /    \\  / ___\\ \n" + " |    |   \\  ___/|   |  \\/ /_/  >\n" + " |____|    \\___  >___|  /\\___  /  v0.1\n" + "               \\/     \\//_____/  \n" + "\n" + "HOWTO: Bump the UPLOAD button on the right to share files into user network (drag & drop files from your computer works too). Bump PENG buttons to download and seed other users' files. Teh moar you PENG files, teh moar these files can get easily reached by users. ✅Peng = seed torrent. ❌UnPeng = unseed torrent. 💀Kill = unseed & block torrent. Type /faq for moar infos.";
</script>
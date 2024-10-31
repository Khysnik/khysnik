<?php
$ip = $_SERVER['REMOTE_ADDR'] . PHP_EOL;
   if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
        else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
        else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
        else $ip = "0-0-0-0";

// BAN
$users = file($_SERVER['DOCUMENT_ROOT'].'/oof.log',FILE_IGNORE_NEW_LINES);
foreach ($users as $user) {
    //echo $user;
    if ($ip==$user){
    	//echo "oof";
    	echo "";
    	die;
    }
}
/*
// oof
  if ((strpos($ip, "77.111.246.") === 0)||(strpos($ip, "2001:67c:2660:425") === 0)) {
    echo "<script>location='https://theannoyingsite.com';</script>";
    die;  
  }  
  // david san juan mexico b/
  if ((strpos($ip, "190.70.206.") === 0)) {
    echo "<script>location='https://theannoyingsite.com';</script>";
    die;  
  }  
  // shockin post on b/
  if ((strpos($ip, "5.249.68.") === 0)) {
    echo "<script>location='https://theannoyingsite.com';</script>";
    die;  
  }  
  if ((strpos($ip, "24.115.218.") === 0)) {
    die;  
  }
*/
$title = "WINDOWS93";
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/functions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/head.php';

$browser = browser();
?><body class="noscroll skin_alpha <?=$browser?>" oncontextmenu="return false" ontouchstart="">

<!--

                                                 @@@@@@
                                        @@@@@@@@@@@@@@@@@@@@@@@@
 @                                  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@    @@                       @@@@ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     @@@    @@   @@@@   @@@@ @@@@@@ @@@@@@::::::::::::::::::::@@@@@@@
          @@@@  @@@@@ @@@@@@ @@@@@@ @:::::::::::::::::::::::::@@@@@@@
,,        @     @@@   @@@@@  @@  @@ ::::::::::::::::::::::::::@@@@@@@
     ,,,           ,, @   ,, @@@@@@ ::::::::::::::::::::::::::@@@@@@@
     ,    ,,,,  ,,,,, ,,,,,, @@@@@@ ::::::::@@::::::@@::::::::@@@@@@@
          ,,,,  ,,,,, ,,,,,, @@@@@@ :::::::@@@@::::@@@@:::::::@@@@@@@
,,        ,     ,,,   ,,,,,  @@  @@ :::::::@@@@::::@@@@:::::::@@@@@@@
     ,,,           ,, ,   ,, @@@@@@ :::::::@@@@::::@@@@:::::::@@@@@@@
     ,    ,,,,  ,,,,, ,,,,,, @@@@@@ ::::::::@@::::::@@::::::::@@@@@@@
 @        ,,,   ,,,,, ,,,,,, @@@@   ::::::::::::::::::::::::::@@@@@@@
@@    @@        ,     ,,,      @@@@ ::@::::::::::::::::::::@::@@@@@@@
     @@@    @@   @@@@   @@@@ @@@@@@ :::@::::::::::::::::::@:::@@@@@@@
          @@@@  @@@@@ @@@@@@ @@@@@@ ::::@@::::::::::::::@@::::@@@@@@@
,,        @     @@@   @@@@@  @@  @@ ::::::@@::::::::::@@::::::@@@@@@@
     ,,,           ,, @   ,, @@@@@@ :::::::::@@@@@@@@:::::::::@@@@@@@
     ,    ,,,,  ,,,,, ,,,,,, @@@@@@ ::::::::::::::::::::::::::@@@@@@@
 ,        ,,,   ,,,,, ,,,,,, @@@@   ::::::::::::::::::::::::::@@@@@@@
,,    ,,        ,     ,,,      @@@@ ::::::::::::::::::::::::::@@@@@@@
     ,,,    ,,   ,,,,   ,,,, @@@@@@ ::::::@@@@@@@@@@@@@@@@@@@:@@@@@@@
          ,,,,  ,,,,, ,,,,,, @@@@@@ :@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@        ,     ,,,   ,,,,,  @@  @@ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     @@@           @@ ,   @@ @@@@@@ @@@@@@@@@              @@@@@@@@@@
     @    @@@@  @@@@@ @@@@@@ @@@@@@ @@                           @@@@
          @@@   @@@@@ @@@@@@ @@@@
                @     @@@
-->

<div class="_ui_layout bbb" id="s42_screen">
  <div id="fxinvert">
  <div id="fxacid1">
  <div id="fx1"><div id="fx2"><div id="fx3"><div id="fx4"><div id="fx5"><div id="fx6"><div id="fx7"><div id="fx8"><div id="fx9"><div id="fx10"><div id="fx11"><div id="fx12"><div id="fxacid2">

  <div id="nofx" class="ui_layout">
    <div class="fillspace skin_background" id="s42_background"></div>
    <section id="s42_desktop" class="noscroll invisible" touch-action="none"></section>
    <div class="fillspace" id="s42_canvas"></div>

    <div id="s42_splashscreen" class="fillspace ui_terminal noscroll" style="white-space:normal;">
      <div class="fillspace pa10" id="s42_bios">
        <div><?=$_SERVER['HTTP_USER_AGENT']?></div>
        <div><script>document.write((new Date).toString())</script></div>

        <div>&nbsp;</div>
        <div><script>
          for (var key in window.location) {
            if (typeof window.location[key] === 'string') {
              document.write(key + ': ' + window.location[key] + '<br>');
            }
          }
        </script></div>
        <div><script>
          if (window.navigator && window.navigator.plugins) {
            window.navigator.plugins.refresh(false);
            var numPlugins = window.navigator.plugins.length;
            for (var i = 0; i < numPlugins; i++) {
              var plugin = window.navigator.plugins[i];
              if (plugin) {
                document.write(plugin.name + '<br>');
              }
            }
          }
        </script></div>
        <?php if ($browser !== 'chrome' && $browser !== 'firefox') {?>
        <br>
        <div class="ui_log__red"><strong>WARNING</strong>: Windows93 is not tested on your browser.</div>
        <div class="ui_log__red">Use latest Firefox or Chromium for a better experience !</div>
        <?php }
if ($browser === 'safari') {?>

        <br>
        <div class="ui_log__red">>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<</div>
        <div class="ui_log__red">>>>> Safari is teh new Internet Explorer <<<<</div>
        <div class="ui_log__red">>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<</div>
        <?php }?>

        <div class="delay1" id="BIOSERROR" style="white-space:pre-wrap">
  BIOS ROM checksum error<noscript>
  You need JavaScript to run Windows93</noscript></div>
        <div class="delay0" id="BOOTLOG" style="white-space:pre;margin-bottom:1em"></div>
        <div class="delay2" id="TOOLONG">BOOT IS TAKING TOO LONG ?</div>
        <a class="delay2" id="REINSTALL" href="/">> CLICK TO REPAIR BOOT</a><br>
        <blink>_</blink>
        <div>&nbsp;</div>
        <div id="pressDel">Press <b>DEL</b> to enter SETUP<div>&nbsp;</div></div>
      </div>
    </div>

    <footer class="pa0 relative">
      <div class="ui_combo_one skin_base skin_outset_deep hide" id="s42_taskbar">
        <button type="button" id="s42_start"><img width="16" heigth="16" src="c/sys/skins/w93/16/start.png"><span><b>Start</b></span></button>
        <div id="s42_dock" class="ui_combo_one__main ui_window_dock"></div>
        <div id="s42_notif" class="skin_inset">
          <a id="s42_feed" target="_blank" href="/rss"><img src="c/sys/skins/w93/16/rss.png" alt="rss"></a>
          <span id="s42_clock"></span>
        </div>
      </div>
    </footer>
  </div>

  </div></div></div></div></div></div></div></div></div></div></div></div></div>
  </div>
  </div>
</div>

<script src="<?=v('/error.js')?>"></script>
<script type="bios" id="BIOSCRIPT">
  ___.   .__
  \_ |__ |__| ____  ______
  | __ \|  |/  _ \/  ___/
  | \_\ \  (  <_> )___ \
  |___  /__|\____/____  > v0.2.0
      \/              \/

  You see this screen because you interrupted
  the boot sequence or something went wrong
  during scripts execution.

  <a class="ui_log__white" href="http://v1.windows93.net">> Downgrade to Windows93 v1 </a>
  <em>Less apps and no filesystem
  but better support for old browsers</em>

  <a class="ui_log__white" href="#" id="reinstall_windows93">> Reinstall Windows93 v2</a>
  <em>You will loose all your saved data
  but can repair broken boot</em>

  <a class="ui_log__white" href="/#safe" id="safe_mode">> Restart in Safe Mode</a>
  <em>Disable any script or style
  from the /a/boot/ folder</em>

  <a class="ui_log__white" href="/" id="normal_boot">> Continue normal boot</a>
</script>
<script>
var $boot = {
  BIOS: document.getElementById("s42_bios"),
  BOOTLOG: document.getElementById("BOOTLOG"),
  BIOSERROR: document.getElementById("BIOSERROR"),
  TOOLONG: document.getElementById("TOOLONG"),
  REINSTALL: document.getElementById("REINSTALL"),
  VERSION: "<?=VERSION?>"
};
$boot.hasError = false;
$boot.onerror = function(e) {
  if ($boot.BIOSERROR && window.$error && typeof window.$error === "function") {
    var err = $error(arguments);
    $boot.BIOSERROR.innerHTML = "";
    $boot.BOOTLOG.innerHTML +=
      '\n<span class="ui_log__red">' + err.html + "<span>";
  } else if ($boot.BIOSERROR) {
    $boot.BIOSERROR.innerHTML = "";
    $boot.BOOTLOG.innerHTML += '\n<span class="ui_log__red">' + e + "<span>";
  }
  $boot.TOOLONG.className = "hide";
  $boot.REINSTALL.className = "";
  $boot.hasError = true;
  if (window.system42) window.system42.stop();
  window.onerror = null;
};
window.onerror = $boot.onerror;
document.onkeydown = function(e) {
  if (e.code === "Delete") {
    e.preventDefault();
    window.biosSetup();
  }
};
document.onclick = function(e) {
  e.preventDefault();
  window.biosSetup();
};
window.$boot = $boot;
window.biosSetup = function() {
  document.onclick = null;
  if (window.system42) window.system42.stop();
  $boot.BIOS.className += " bios-setup";
  $boot.BIOS.style.whiteSpace = "pre-wrap";
  $boot.BIOS.innerHTML = document
    .getElementById("BIOSCRIPT")
    .innerHTML.replace("\n", "")
    .replace(/\n/g, "<br>");
  document.getElementById("normal_boot").focus();
  var actions = Array.prototype.slice.call(document.querySelectorAll("a"));
  var current = 3;
  document.onkeydown = function(e) {
    if (e.code === "ArrowUp") {
      current--;
      if (current < 0) current = 3;
      actions[current].focus();
    }
    if (e.code === "ArrowDown") {
      current++;
      if (current > 3) current = 0;
      actions[current].focus();
    }
  };
  document.getElementById("reinstall_windows93").onclick = function(e) {
    e.preventDefault();
    window.localStorage.clear();
    window.localforage.clear(function(err) {
      window.location.reload(true);
    });
  };
  document.getElementById("safe_mode").onclick = function(e) {
    e.preventDefault();
    window.location.href = "#safe";
    window.location.reload(true);
  };
};
</script>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/42/inc/scripts.php'?>
<script src="<?=v('/sys/start.js')?>"></script>
<script src="<?=v('/sys/desktop.js')?>"></script>
<script src="<?=v('/sys/upgrade.js')?>"></script>
<script src="<?=v('/sys/apps.js')?>"></script>
<script src="<?=v('/sys/apps/clippy.js')?>"></script>
<script src="<?=v('/sys/apps/code.js')?>"></script>
<script src="<?=v('/sys/apps/crazy.js')?>"></script>
<script src="<?=v('/sys/apps/layer.js')?>"></script>
<script src="<?=v('/sys/apps/pony.js')?>"></script>
<script src="<?=v('/sys/apps/sp3.js')?>"></script>
<script src="<?=v('/sys/apps/g80.m3u.js')?>"></script>
<script>
document.documentElement.classList.remove("no-js");
$boot.BIOSERROR.className = "";
$boot.BIOSERROR.innerHTML = "";
system42.config({
  onerror: function(e) {
    if (!$boot.hasError) $boot.onerror(e);
  },
  onready: function(e) {
    $boot.BOOTLOG.innerHTML += "\n" + e + " ... ready";
  }
});
$loader.config({
  onpass: function(e) {
    $boot.BOOTLOG.innerHTML += "\n " + e.url.split("/").pop() + " ... ready";
  },
  onfail: function(e) {
    $boot.BOOTLOG.innerHTML +=
      '\n <span class="ui_log__red">' +
      e.url.split("/").pop() +
      " ... fail<span>";
  }
});
</script>
<script>
!(function() {
  "use strict";

  var lastUpdate = <?php
$xml = simplexml_load_file('feed.rss', null, LIBXML_NOCDATA);
$last = $xml->xpath("/rss/channel/item[last()]");
echo json_encode($last[0]);
?>;

  system42(
    {
      _apps: {},
      _clean: {},
      _states: { opened: {} },
      _sound: {},
      _init: {},
      _events: $watch({}),
      _path: { key: {} },
      _get: {
        mime: {
          ext: {},
          apps: []
        },
        ext: {
          mime: {},
          apps: {}
        }
      },
      _dom: {
        taskbar: document.getElementById("s42_taskbar"),
        desktop: document.getElementById("s42_desktop"),
        background: document.getElementById("s42_background"),
        screen: document.getElementById("s42_screen"),
        splash: document.getElementById("s42_splashscreen"),
        clock: document.getElementById("s42_clock"),
        canvas: document.getElementById("s42_canvas")
      },
      _settings: {
        // version: 1,
        // userData: {
        //   nick: "derp",
        //   localInit: false,
        //   lastVisit: new Date()
        // },
        // skin: "w93",
        sounds: {
          boot: "/c/sys/sounds/BOOT.ogg",
          alert: "/c/sys/sounds/CHORD.ogg",
          error: "/c/sys/sounds/QUACK.ogg"
        },
        noSplash: false,
        defaultApp: {
          html: "iframe",
          htm: "iframe",
          php: "iframe",
          xml: "code",
          svg: "img",
          gif: "img",
          png: "img",
          jpeg: "img",
          jpg: "img"
        }
      },
      _schemas: {
        shortcut: {
          icon: {
            type: "string",
            plugin: {
              icon: {
                watch: "exe"
              }
            }
          },
          exe: {
            title: "command",
            type: "string",
            placeholder: "http://",
            attributes: {
              autofocus: true,
              required: true
            },
            plugin: {
              explorer: {
                accept: "*",
                path: "/"
              }
            }
          },
          title: {
            type: "string",
            placeholder: "Leave blank to use same name as target"
          }
        }
      },
      _temp: {
        files: '<?=v('/files.json')?>',
        mimetypes: "/c/mimetypes.json",
        splash: "/c/sys/boot/splash.html",
        init: {}
      },
      _icons: {
        w: 72,
        h: 60
      },
      _keyboard: { layout: {} },

      debug: false,
      devmode: false,
      started: false
    },
    function(le) {
      window.le = le;

      system42(
        "bios",
        [
          "settings",
          "modules",
          "desktop",
          [
            "audio",
            "boot",
            "apps",
            [
              "utils",
              "storage",
              "upgrade",
              "config",
              "exe",
              "explorer",
              "start"
            ]
          ]
        ],
        "splash",
        "reveal",
        function(le) {
          le.canvas = {
            layers: [],
            ctxs: [],
            add: function() {
              this.cnv = document.createElement("canvas");
              le._dom.canvas.appendChild(this.cnv);
              this.cnv.width = window.innerWidth;
              this.cnv.height = window.innerHeight;
              this.layers.push(this.cnv);
              this.ctx = this.cnv.getContext("2d");
              this.ctxs.push(this.ctx);
            },
            draw: function(img, x, y) {
              this.ctx.drawImage(img, x, y);
            },
            clear: function() {
              this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
            }
          };
          le.canvas.add();

          if (le.devmode) {
          } else {
            if (
              lastUpdate &&
              Math.round(
                (Date.now() - Date.parse(lastUpdate.pubDate)) /
                  (1000 * 60 * 60 * 24)
              ) < 16
            ) {
              setTimeout(function() {
                $notif(lastUpdate, document.getElementById("w93_feed"));
              }, 0);
            }
          }

          // cleanup
          document.onkeydown = null;
          document.onclick = null;
          delete le._temp;
          delete le.devmode;
          delete le.started;
          if (window.system42) window.system42.stop();
        }
      );
    }
  );
})();
</script>

<!-- SVG FX -->
<?php include $_SERVER['DOCUMENT_ROOT'] . '/c/effects.svg';?>

</body>
</html>

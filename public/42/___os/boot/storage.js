system42("storage", function(le, voila) {
  "use strict";
  // throw new Error('lol')

  var deskSettings = {};
  var timestamp = Date.now();
  le._init.desktop = function() {
    $io.arr.each(le._temp.defaultDesk, setDefautsIcon);
    // $store.set(le._path.key.home + 'Documents/', null);
    // $store.set(le._path.key.home + 'Music/', null);
    // $store.set(le._path.key.home + 'Pictures/', null);
    // $store.set(le._path.key.home + 'Videos/', null);
    // return deskSettings;
  };

  function setDefautsIcon(val, i) {
    deskSettings[val.name] = {};
    var shortcut = $extend({}, val);
    if (shortcut.col > -1) {
      deskSettings[val.name].x = shortcut.col * le._icons.w;
      delete shortcut.col;
    }
    if (shortcut.row > -1) {
      deskSettings[val.name].y = shortcut.row * le._icons.h;
      delete shortcut.row;
    }
    //console.log('???');
    deskSettings[val.name].time = timestamp + i;
    delete shortcut.name;
    $store.set(le._path.key.desktop + val.name, shortcut);
    // console.log(deskSettings)
  }

  $store.set(
    "system32.dll",
    "796f 2c20 706c 6561 7365 2064\n6f6e 2774 2064 656c 6574 6520\n6d65"
  );

  $store.set(
    "boot/README.txt",
    "README\n======\n\nAny javascript or css file in this folder will be loaded at boot.\n\nUse with care and have fun...\n\nwindows93.net's staff"
  );

  //$store.set('1_BACKUP.lnk42', '{"exe":"backup"}');
  //$store.set('2_RESTORE.lnk42', '{"exe":"restore"}');
  ///$store.set('3_FORMAT.lnk42', '{"exe":"format"}');

  //$store.set('truc/1_BACKUP.lnk42', '{"exe":"3d"}');
  //$store.set('truc/2_RESTORE.lnk42', '{"exe":"fx"}');
  //$store.set('truc/3_FORMAT.lnk42', '{"exe":"pony"}');
  //$store.set(' REINSTALL WINDOWS93.lnk42', '{"exe":"install"}');

  le._init.desktop();

  // if (le._settings.userData.localInit === false) {
  //   // deskSettings = le._init.desktop();
  //   // console.log(deskSettings)
  // }

  le._desktop = $store(
    le._path.key.home + ".config/desktop.json",
    deskSettings,
    function(desk) {
      le._desktop = desk;
    },
    function() {
      return le._desktop;
    }
  );

  function end() {
    $file.scan("/a/", function() {
      if (
        window.location.hash !== "#safe" &&
        le &&
        le._files &&
        le._files.a &&
        le._files.a.boot
      ) {
        var startupFiles = Object.keys(le._files.a.boot);
        if (startupFiles.length) {
          setTimeout(function() {
            if (window.system42) {
              if (window.system42.paused) return voila();
              var startups = [];
              startupFiles.forEach(function(startupFile) {
                if ($fs.utils.exist("/a/boot/" + startupFile) !== false) {
                  startups.push(
                    new Promise(function(resolve) {
                      $file.open("/a/boot/" + startupFile, "URL", function(
                        val,
                        asType
                      ) {
                        var type = $url.getExtention(startupFile);
                        if (type === "js") {
                          $loader.script(val).then(resolve);
                        } else if (type === "css") {
                          $loader.css(val).then(resolve);
                        } else resolve();
                      });
                    })
                  );
                }
              });
              Promise.all(startups).then(function(res) {
                if ($boot.hasError !== true) voila();
              });
            }
          }, 500);
          return;
        }
      }
      voila();
    });
  }

  // if (le._settings.userData.localInit === false) {
  $io.enum(
    [$io.obj.flatten(le._files.a, "/")],
    function(val, path, check) {
      if (typeof val === "number") {
        var isShortcut = $fs.utils.isShortcut(path);
        $ajax
          .get("a_/" + path, { arraybuffer: !isShortcut })
          .done(function(buffer) {
            if (isShortcut) {
              $store.set(path, buffer);
              check();
            } else {
              $io.ArrayBuffer.Blob(
                buffer,
                function(blob) {
                  $db.set(path, blob, check);
                },
                $fs.utils.getMime(path)
              );
            }
          })
          .fail(function(e) {
            $boot.onerror(e);
            check();
          });
      } else $db.set(path + "/", null, check);
    },
    function() {
      end();
    }
  );
  // } else {
  //   end();
  // }
});

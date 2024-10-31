system42("explorer", function(le) {
  "use strict";

  var uid = -1,
    instances = [],
    def = {
      viewType: "icons",
      nav: true,
      menu: true,
      footer: true,
      save: false,
      browse: false,
      silent: false,
      backgroundClass: "skin_inset_deep skin_light",
      onopen: $noop,
      onready: $noop,
      onclose: $noop,
      window: {},
    };

  le._selected = [];
  le.explorers = instances;

  function _explorer(path, dest, opt) {
    //console.log(path, dest, opt);
    if (arguments.length < 3) {
      opt = dest;
      dest = null;
    }

    if (!path || typeof path === "object") {
      opt = path;
      path = opt.path || "/";
    }

    if (!opt) opt = {};
    if (opt.list === true) opt.viewType = "list";
    if (opt.icons === true) opt.viewType = "icons";
    if (opt.details === true) opt.viewType = "details";
    if (opt.workspace === true) opt.viewType = "workspace";

    //console.log(path, $fs.utils.getFileName(path));
    //if (!$fs.utils.exist(path)) path = '/';
    //console.log(path, $fs.utils.getFileName(path));

    var cfg = $extend({}, def, opt),
      currentPath = path,
      winInstance,
      _fileName = $fs.utils.getFileName(path);

    if (!$fs.utils.isFolder(path)) path = $fs.utils.getFolderPath(path);

    if (cfg.save) cfg.browse = true;
    if (cfg.browse) cfg.nav = true;
    if (cfg.save && !cfg.accept) cfg.accept = "*";
    if (cfg.accept) $extend(cfg, $fs.utils.parseAccept(cfg.accept));

    uid++;
    cfg.id = uid;

    function localeCompareSupportsLocales() {
      try {
        "foo".localeCompare("bar", "i");
      } catch (e) {
        return e.name === "RangeError";
      }
      return false;
    }

    var compare = localeCompareSupportsLocales()
      ? function(a, b) {
          //return a.toLowerCase().localeCompare(b.toLowerCase(), 'latin', {numeric: true})
          return a.localeCompare(b, "latin", { numeric: true });
        }
      : function(a, b) {
          //return a.toLowerCase().localeCompare(b.toLowerCase())
          return a.localeCompare(b);
        };

    /*
       dP""b8  dP"Yb
      dP   `" dP   Yb
      Yb  "88 Yb   dP
       YboodP  YbodP
    */

    function go(path) {
      if (!path) path = currentPath;
      currentPath = path;

      if (cfg.save) applyToCurrentFileInput();

      var icons,
        dirs = [],
        files = [],
        lnks = [];

      //if (path.slice(-1) !== '/') path += '/';
      var pathObj = $fs.utils.iteratePath(path);

      if (typeof pathObj !== "object") {
        return false;
      }
      icons = pathObj.obj;
      path = pathObj.cwd !== "/" ? pathObj.cwd + "/" : pathObj.cwd;
      dirs = pathObj.dirs;
      files = pathObj.files;
      lnks = pathObj.lnks;

      if (path.indexOf("/a/") === 0)
        folderEl.classList.add("ui_explorer--local"),
          folderEl.classList.remove("ui_explorer--not_local");
      else
        folderEl.classList.add("ui_explorer--not_local"),
          folderEl.classList.remove("ui_explorer--local");

      files.sort(function(a, b) {
        return compare(a, b);
      });
      dirs.sort(function(a, b) {
        return compare(a, b);
      });
      //lnks.sort(function (a, b) {return compare(a,b)});
      lnks.sort(function(a, b) {
        if (uid === 0) {
          if (le._desktop && le._desktop[a] && le._desktop[b]) {
            var aO = le._desktop[a];
            var bO = le._desktop[b];
            if (aO && bO) {
              return aO.time > bO.time ? 1 : -1;
            }
          }
        } else return compare(a, b);
      });

      //var contEl = document.createElement('a');
      var fragEl = document.createDocumentFragment();
      var iconEl = document.createElement("div");
      var imgEl = document.createElement("div");
      var titleEl = document.createElement("span");
      iconEl.setAttribute("tabindex", "0");
      imgEl.className = "ico";

      function setIconImg(url) {
        var img = new Image();
        img.width = 32;
        img.height = 32;
        img.src = $fs.utils.normalizeIcon(url);
        return img;
      }

      var thumb = false;

      $io.arr.all(dirs, function(dir) {
        var _iconEl = iconEl.cloneNode(false);
        var _titleEl = titleEl.cloneNode(false);
        _iconEl.setAttribute("data-exe", path + dir + "/");
        _iconEl.setAttribute("data-path", path + dir + "/");
        _iconEl.setAttribute("data-name", dir);
        _iconEl.className = "ui_icon ui_icon__folder";
        var nfo = $fs.utils.getInfo(path + dir + "/");
        _iconEl.appendChild(setIconImg(nfo.icon));
        _titleEl.textContent = nfo.name || dir;
        _iconEl.appendChild(_titleEl);
        fragEl.appendChild(_iconEl);
      });

      $io.arr.all(files, function(file) {
        var _iconEl = iconEl.cloneNode(false);
        var _titleEl = titleEl.cloneNode(false);
        var nfo = $fs.utils.getInfo(file);
        nfo.exe = path + file;
        nfo.path = path + file;
        nfo.title = file;

        if (
          /\/c\/files\/images\/icons\/|\/c\/sys\/skins\//.test(path) &&
          /^image\//.test(nfo.mime)
        )
          thumb = true;

        $io.obj.all(nfo, function(val, key) {
          _iconEl.setAttribute("data-" + key, val);
        });
        _iconEl.setAttribute("data-name", file);
        _titleEl.textContent = file;
        _iconEl.className = "ui_icon ui_icon__file";
        _iconEl.appendChild(setIconImg(thumb ? path + file : nfo.icon));
        _iconEl.appendChild(_titleEl);
        fragEl.appendChild(_iconEl);
      });

      $io.arr.all(lnks, function(file) {
        var fileName = file.replace(/\.lnk42$/, "");

        var _iconEl = iconEl.cloneNode(false);
        var _titleEl = titleEl.cloneNode(false);
        //console.log(path + file);
        var nfo = $fs.utils.getInfo(fileName);
        var lnk = $store.get((path + file).replace(/^\/a\//, "")); // || icons[file] || {};
        //console.log(file, nfo, icons[file]);
        $extend(nfo, icons[file], lnk);
        //console.log(file, nfo);
        if (!nfo) return;
        nfo.path = path + file;
        //nfo.title = lnk.title || fileName;
        nfo.title = nfo.title || fileName;
        nfo.name = file;

        // auto add icons by apps
        var possibleApp = nfo.exe ? nfo.exe.match(/(.[^ ]*)/)[0] : null;
        if (
          (!nfo.icon || /file\.png$/.test(nfo.icon)) &&
          possibleApp &&
          le._apps[possibleApp] &&
          le._apps[possibleApp].icon
        ) {
          nfo.icon = le._apps[possibleApp].icon;
        }
        if (
          (!nfo.icon || /file\.png$/.test(nfo.icon)) &&
          $fs.utils.isFolder(nfo.exe)
        ) {
          nfo.icon = $fs.utils.getIcon(nfo.exe);
        }

        $io.obj.all(nfo, function(val, key) {
          _iconEl.setAttribute("data-" + key, val);
        });
        _titleEl.textContent = nfo.title; //lnk.title || fileName;
        _iconEl.className = "ui_icon ui_icon__file ui_icon__lnk42";
        _iconEl.appendChild(setIconImg(nfo.icon));
        _iconEl.appendChild(_titleEl);
        fragEl.appendChild(_iconEl);
      });

      while (folderEl.firstChild) folderEl.removeChild(folderEl.firstChild);
      folderEl.appendChild(fragEl);
      folderEl.appendChild(scrollViewEl);

      // type test
      /////////////////////////////////////////////////////////////////////////////
      if (cfg.mimetype || cfg.ext) {
        $io.arr.all(folderEl.querySelectorAll(".ui_icon__file"), function(
          item
        ) {
          var ok = false;
          if (cfg.mimetype && cfg.mimetype.test(item.dataset.mime)) ok = true;
          $io.arr.all(cfg.ext, function(ext) {
            if ($fs.utils.getExt(item.dataset.title) === ext) ok = true;
          });
          if (!ok) item.classList.add("ui_disabled");
        });
      }
      if (winInstance && winInstance.menu) winInstance.menu.refresh();

      if (!cfg.silent && !cfg.browse) $route(currentPath);

      //console.log(555, _fileName);
      if (_fileName && !cfg.save) {
        selectFile(_fileName);
      }

      //cb && cb();
      //console.log(1, 'ready');

      if (winInstance && winInstance.changeTitle && winInstance.changeIcon) {
        // winInstance.changeTitle(($fs.utils.getFolderName(path) || '/') + ' - File Manager');
        winInstance.changeTitle($fs.utils.getFolderName(path) || "/");
        winInstance.changeIcon($fs.utils.getIcon(path));
      }
      onViewChange.call(instance, cfg.viewType);
      cfg.onready.call(instance, folderEl);

      currentPath = navInput.value = path;
    }

    /*
      88   88 88
      88   88 88
      Y8   8P 88
      `YbodP' 88
    */

    var cont = document.createDocumentFragment(),
      explorerEl = document.createElement("div"),
      folderEl = document.createElement("div"),
      scrollViewEl = document.createElement("div"),
      nav = document.createElement("div"),
      navInput = document.createElement("input"),
      navPrev = document.createElement("button"),
      navNext = document.createElement("button"),
      navHome = document.createElement("button"),
      navGo = document.createElement("button"),
      currentFileInput = document.createElement("input");

    scrollViewEl.className = "ui_explorer__scrollview";
    scrollViewEl.style.width = "5px";
    scrollViewEl.style.height = "100px";
    scrollViewEl.style.display = "none";
    //scrollViewEl.style.backgroundColor = 'red';

    explorerEl.className = "ui_explorer_container";
    folderEl.className =
      cfg.backgroundClass + " ui_explorer ui_explorer--" + cfg.viewType;
    if (cfg.viewType !== "workspace")
      folderEl.className += " ui_explorer--not_workspace";
    folderEl.id = "ui_explorer_" + uid;
    folderEl.setAttribute("data-id", uid);

    explorerEl.appendChild(folderEl);

    function renderNav() {
      nav.className = "flex ui_explorer__nav" + (cfg.nav ? "" : " hide");

      navPrev.innerHTML = "<";
      navPrev.className = "skin_outset ui_explorer__nav__prev";
      navHome.innerHTML = '<img src="/c/sys/skins/w93/16/home.png">';
      navHome.className = "skin_outset ui_explorer__nav__home";
      navNext.innerHTML = ">";
      navNext.className = "skin_outset ui_explorer__nav__next";
      navGo.innerHTML = "Go";
      navGo.className = "skin_outset ui_explorer__nav__go";

      navInput.type = "text";
      navInput.value = path;
      navInput.className = "ui_explorer__nav__input flex__fluid";

      nav.appendChild(navPrev);
      //nav.appendChild(navNext);
      nav.appendChild(navHome);
      nav.appendChild(navInput);
      nav.appendChild(navGo);

      navPrev.addEventListener("click", clickPrev, false);
      navGo.addEventListener("click", clickGo, false);
      navHome.addEventListener("click", clickHome, false);
      navInput.addEventListener("keypress", keypressGo, false);

      return nav;
    }
    function clickPrev() {
      var path = navInput.value;
      var newPath = path.slice(0, -1).split("/");
      newPath.pop();
      path = newPath.join("/");
      return go(path ? path + "/" : "/");
    }

    function clickGo() {
      go((path = navInput.value));
    }
    function clickHome() {
      go((path = le._path.home));
    }
    function keypressGo(e) {
      e = e || window.event;
      if (typeof e.which !== "number") e.which = e.keyCode; // http://stackoverflow.com//a/4285801
      if (e.which == 13) clickGo();
    }

    /*
      .dP"Y8    db    Yb    dP 888888
      `Ybo."   dPYb    Yb  dP  88__
      o.`Y8b  dP__Yb    YbdP   88""
      8bodP' dP""""Yb    YP    888888
    */
    /////////////////////////////////////////////////////////////////////////////
    function initSaveInputs() {
      saveFileName.onchange = saveFileName.onkeyup = function(e) {
        applyToCurrentFileInput();
        changeSaveTypeDebouce(this.value);
        if (e.keyCode === 13) {
          if (winInstance && winInstance.close) winInstance.close(true);
        }
      };
      saveFileName.onfocus = function() {
        setTimeout(function() {
          _explorer.utils.inputSelectFileName(saveFileName);
        }, 100);
      };
      saveFileType.onchange = saveFileType.onkeyup = function(e) {
        applyFileType();
      };
      changeSaveFileName(_fileName);
      changeSaveType(_fileName);
    }
    function selectFile(filename) {
      setTimeout(function() {
        _explorer.selection.remove();
        var el = folderEl.querySelector('div[data-name="' + filename + '"]');
        if (el) {
          le._selected = [el];
          el.classList.add("ui_selected");
        }
      }, 100); // =_=
    }
    function applyToCurrentFileInput() {
      if (currentFileInput && saveFileName) {
        var filePath = currentPath + saveFileName.value;
        currentFileInput.value = filePath;
        selectFile(saveFileName.value);
      }
    }
    function applyFileType() {
      if (saveFileType.value && saveFileType.value !== "*") {
        var newExt =
          saveFileType.options[saveFileType.selectedIndex].dataset.ext;
        saveFileName.value = $fs.utils.replaceExt(saveFileName.value, newExt);
      }
      applyToCurrentFileInput();
    }
    function changeSaveType(fileName) {
      if (!fileName) {
        saveFileName.value = "derp";
        saveFileType.selectedIndex = 0;
        applyFileType();
        return;
      }
      var ext = $fs.utils.getExt(fileName);
      var mime = le._get.ext.mime[ext];
      //console.log(mime);

      if (fileName && ext && mime) {
        for (var i = 0; i < saveFileType.length; ++i) {
          if (saveFileType.options[i].value == mime) {
            saveFileType.value = mime;
            return;
          }
        }
        saveFileType.selectedIndex = 0;
        //applyFileType();
      }
    }
    var changeSaveTypeDebouce = $io.fn.debounce(changeSaveType, 100);
    function changeSaveFileName(fileName) {
      saveFileName.value = fileName;
      setTimeout(function() {
        saveFileName.focus();
        _explorer.utils.inputSelectFileName(saveFileName);
      }, 100);
      applyToCurrentFileInput();
    }
    /////////////////////////////////////////////////////////////////////////////
    function createOption(val, ext, desc) {
      var opt = document.createElement("option");
      opt.value = val;
      opt.dataset.ext = ext;
      opt.innerHTML = $io.str.truncate(desc, 30);
      opt.title = desc;
      return opt;
    }
    var saveFileName, saveFileType;
    function renderFooter() {
      currentFileInput.type = "text";
      currentFileInput.className =
        "ui_explorer__selected_file" + (cfg.footer ? "" : " hide");
      currentFileInput.value = path;
      currentFileInput.readOnly = true;
      if (cfg.save) {
        var saveFileNameLabel = document.createElement("label");
        saveFileName = document.createElement("input");
        saveFileType = document.createElement("select");
        saveFileName.type = "text";
        saveFileNameLabel.textContent = "Name: ";

        // list all accepted files
        var allreadyInSelect = {};
        //console.log(cfg.accept, cfg.mimetype, cfg.ext);
        if (cfg.accept === "*")
          saveFileType.appendChild(document.createElement("option"));
        if (cfg.mimetype || cfg.ext) {
          $io.arr.all(cfg.ext, function(ext) {
            var mimetype = le._get.ext.mime[ext];
            if (allreadyInSelect[mimetype]) {
              return;
            } else {
              //console.log(mimetype);
              var mimeNfo = $io.obj.getPath(le._get.mime.ext, mimetype, "/");
              saveFileType.appendChild(
                createOption(
                  mimetype,
                  ext,
                  (mimeNfo[1] ? mimeNfo[1] : mimetype) + " (" + mimeNfo[0] + ")"
                )
              );
              allreadyInSelect[mimetype] = true;
            }
          });
          if ($io.is.reg(cfg.mimetype)) {
            var mimeNfo = $io.obj.getPath(le._get.mime.ext, cfg.mimetype, "/");
            $io.obj.each(mimeNfo, function(val, key) {
              if (allreadyInSelect[key]) {
                return;
              } else {
                saveFileType.appendChild(
                  createOption(
                    key,
                    val[0]
                      .split(",")
                      .shift()
                      .replace(".", ""),
                    (val[1] ? val[1] : key) + " (" + val[0] + ")"
                  )
                );
                allreadyInSelect[key] = true;
              }
            });
          }
        }

        var save_cont = document.createElement("div");
        save_cont.className = "ui_explorer__save_cont ui_combo";
        saveFileName.className = "ui_combo__main";
        saveFileType.style.marginLeft = "2px";
        save_cont.appendChild(saveFileNameLabel);
        save_cont.appendChild(saveFileName);
        save_cont.appendChild(saveFileType);
        save_cont.appendChild(currentFileInput);
        return save_cont;
      } else {
        return currentFileInput;
      }
    }

    /*
      88 88b 88 .dP"Y8 888888    db    88b 88  dP""b8 888888
      88 88Yb88 `Ybo."   88     dPYb   88Yb88 dP   `" 88__
      88 88 Y88 o.`Y8b   88    dP__Yb  88 Y88 Yb      88""
      88 88  Y8 8bodP'   88   dP""""Yb 88  Y8  YboodP 888888
    */
    var saveFileName, currentFileInput;
    var instance = (instances[uid] = {
      el: {
        folder: folderEl,
        scrollView: scrollViewEl,
      },
      cfg: cfg,
      id: uid,
      go: go,
      reorder: function() {
        onViewChange.call(instance, cfg.viewType);
      },
      refresh: function(cb) {
        var ok = go(currentPath);
        // console.log(ok, currentPath)
        if (ok === false) {
          ok = clickPrev();
          if (ok === false) go("/");
        }
        if (typeof cb === "function") cb();
      },
      getSaveInput: function() {
        return saveFileName;
      },
      getSelectionInput: function() {
        return currentFileInput;
      },
      getPath: function() {
        return currentPath;
      },
      getWindow: function() {
        return winInstance;
      },
    });

    // console.log(11, cfg);
    // if (cfg.browse !== true) _explorer.current = instance;

    function ready() {
      go(path);
      //onViewChange.call(instance, cfg.viewType)
    }

    if (typeof dest === "string") dest = document.querySelector(dest);

    if (cfg.style) folderEl.setAttribute("style", cfg.style);
    //folderEl.setAttribute('touch-action', "pan-x");
    //folderEl.setAttribute('touch-action', "pan-y");
    folderEl.setAttribute("touch-action", "none");

    // desktop
    /////////////////////////////////////////////////////////////////////////////
    if (dest) {
      //dest.
      var menuEl = document.createElement("div");
      dest.appendChild(menuEl);
      //console.log(MENUS.barMenu)
      $menu(menuEl, MENUS.barMenu, {
        keyTarget: folderEl,
        thisArg: { el: folderEl, explorer: instance },
      });
      dest.appendChild(explorerEl);
      ready();
    }

    // window
    /////////////////////////////////////////////////////////////////////////////
    else {
      var winData = $extend(
        {
          icon: "/c/sys/skins/" + le._settings.skin + "/places/folder.png",
          //,bodyClass: '_ui_explorer ui_explorer--panes'
          baseClass: "ui_explorer_window",
        },
        cfg.window,
        {
          title: path,
          html: explorerEl,
          onactive: function() {
            _explorer.current = instance;
            //$el(folderEl).trigger('click');
          },
          onready: function() {
            ready();
          },
          onopen: function() {
            cfg.onopen.call(this);
            if (cfg.save) initSaveInputs();
          },
          onclose: function(ok) {
            if (cfg.nav) navPrev.removeEventListener("click", clickPrev, false);
            if (cfg.nav) navHome.removeEventListener("click", clickHome, false);
            if (cfg.nav) navGo.removeEventListener("click", clickGo, false);
            if (navInput)
              navInput.removeEventListener("keypress", keypressGo, false);
            cfg.onclose.call(this, ok, currentFileInput.value);
            _explorer.current = instances[0];
            instances[instance.id] = null;
          },
        }
      );

      if (cfg.nav)
        (winData.afterMenu = renderNav()),
          folderEl.classList.add("ui_explorer--nav");
      if (cfg.footer) winData.footer = renderFooter();

      if (cfg.menu) {
        winData.menuThisArg = { el: folderEl, explorer: instance };
        winData.menu = MENUS.barMenu;
      }

      if (cfg.browse) {
        folderEl.classList.add("ui_explorer--browse");
        winData.title = "explorer";
        winData.btnOk = cfg.save ? "Save" : "Open";
        winData.btnCancel = "Cancel";
      }

      var winInstance = $window.call(this, winData);
    }

    return instance;
  }

  /*
    88  dP 888888 Yb  dP
    88odP  88__    YbdP
    88"Yb  88""     8P
    88  Yb 888888  dP
  */

  /*$key('.ui_explorer').combo({
    'ctrl+a': function() {
      // le._selected = Array.prototype.slice.call(_explorer.current.el.folder.querySelectorAll('.ui_icon'));
      // _explorer.selection.display();
      // return false;
      _explorer.exe.SelectAll();
      return false;
    },
    'ctrl+x': function() {
      if (!disabledIfNotLocalFile()) _explorer.exe.Cut();
    },
    'ctrl+c': function(key, obj) {
      //console.log('????????', this, arguments)
      //console.log(obj.session.stack)
      if (!disabledIfNotLocalFile()) _explorer.exe.Copy();
    },
    'ctrl+v': function() {
      CURRENT_X = 9999;
      CURRENT_Y = 0;
      _explorer.exe.Paste();
    },
    'f2': function() {
      if (!disabledIfNotLocalFile()) _explorer.exe.Rename();
    },
    'del': function() {
      if (!disabledIfNotLocalFile()) _explorer.exe.Delete();
    },
    'enter': function() {
      _explorer.exe.Open();
    }
  });*/

  /*
    888888 Yb    dP 888888 88b 88 888888 .dP"Y8
    88__    Yb  dP  88__   88Yb88   88   `Ybo."
    88""     YbdP   88""   88 Y88   88   o.`Y8b
    888888    YP    888888 88  Y8   88   8bodP'
  */

  $el(le._dom.desktop)
    .on(
      "dblclick doubletap",
      ".ui_explorer .ui_icon:not(.ui_disabled)",
      function(e) {
        var path = this.getAttribute("data-path");
        _explorer.setCurrent(this.parentNode, e);
        if (
          this.parentNode.classList.contains("ui_explorer--nav") &&
          path &&
          path.slice(-1) === "/"
        ) {
          if (_explorer.current && _explorer.current.go) {
            _explorer.current.go(path);
          }
        } else {
          if (this.parentNode.classList.contains("ui_explorer--browse")) {
            if (_explorer.current && _explorer.current.getWindow) {
              _explorer.current.getWindow().close(true);
            }
          } else {
            // console.log(this)
            var ok = $exe(this);
            // console.log(111, ok);
            if (!ok) $notif("No program is assigned to this kind of files");
          }
        }
      }
    )
    .on("click _touchstart", ".ui_explorer .ui_disabled", function(e) {
      _explorer.setCurrent(this.parentNode, e);
      var saveInput = _explorer.current.getSaveInput();
      if (saveInput) {
        var ext = $fs.utils.getExt(saveInput.value);
        saveInput.value = $fs.utils.replaceExt(
          this.getAttribute("data-name"),
          ext
        );
      }
      return false;
    })
    .on(
      "click _touchstart",
      ".ui_explorer .ui_icon:not(.ui_disabled)",
      function(e) {
        if (e.shiftKey && this.style.position !== "absolute") {
          var first = le._selected[0];
          if (
            first &&
            first.compareDocumentPosition(this) &
              Node.DOCUMENT_POSITION_FOLLOWING
          ) {
            for (
              var n = first;
              !this.isEqualNode(n);
              n = n.nextElementSibling
            ) {
              if (le._selected.indexOf(n) === -1) le._selected.push(n);
            }
          } else {
            for (
              var n = first;
              !this.isEqualNode(n);
              n = n.previousElementSibling
            ) {
              if (le._selected.indexOf(n) === -1) le._selected.push(n);
            }
          }
        } else if (!e.ctrlKey && !e.shiftKey) {
          le._selected.length = 0;
        }
        var i = le._selected.indexOf(this);
        _explorer.setCurrent(this.parentNode, e);
        if (i === -1) le._selected.push(this);
        else le._selected.splice(i, 1);
        _explorer.selection.display();

        this.focus();

        return false;
      }
    )
    .on("mouseup", ".ui_explorer .ui_icon", function(e) {
      if (e.button === 2) {
        _explorer.setCurrent(this.parentNode, e);
        if (!this.classList.contains("ui_disabled")) {
          if (!e.ctrlKey && le._selected.indexOf(this) === -1)
            le._selected.length = 0;
          if (le._selected.indexOf(this) === -1) le._selected.push(this);
          _explorer.selection.display();
        }
        MENUS.ctxFile.show(
          { el: this, explorer: _explorer.current },
          { of: e, within: le._dom.screen }
        );
      }
    })
    /*.on('contextmenu', '.ui_explorer', function(e) {
      e.preventDefault();
    })*/
    .on(
      "mousedown dragstart contextmenu",
      ".ui_explorer .ui_icon img",
      function(e) {
        e.preventDefault();
      }
    )
    .on("mouseup _touchstart", ".ui_explorer", function(e) {
      _explorer.setCurrent(this, e);

      if (!$drag.isDragging) {
        if (!boxDrawing && this.isEqualNode(e.target || e.srcElement)) {
          if (e.button === 2) {
            le._selected.length = 0;
            MENUS.ctxExplorer.show(
              { el: this, explorer: _explorer.current },
              { of: e, within: le._dom.screen }
            );
          } else {
            $route("");
            le._selected.length = 0;
            _explorer.selection.display();
          }
        }
      }
    });

  var boxDrawing = false;
  $box(le._dom.desktop, ".ui_explorer", {
    target: ".ui_icon",
    onstart: function(e, box) {
      boxDrawing = true;
    },
    ondraw: function(e, icons) {
      var instId = this.getAttribute("data-id");
      if (e.ctrlKey) {
        $io.arr.all(icons, function(icon) {
          if (le._selected.indexOf(icon) === -1) le._selected.push(icon);
        });
      } else le._selected = icons;
      _explorer.selection.display(instId);
    },
    onstop: function(e, icons) {
      boxDrawing = false;
    },
  });

  /*
    Yb        dP  dP"Yb  88""Yb 88  dP .dP"Y8 88""Yb    db     dP""b8 888888
     Yb  db  dP  dP   Yb 88__dP 88odP  `Ybo." 88__dP   dPYb   dP   `" 88__
      YbdPYbdP   Yb   dP 88"Yb  88"Yb  o.`Y8b 88"""   dP__Yb  Yb      88""
       YP  YP     YbodP  88  Yb 88  Yb 8bodP' 88     dP""""Yb  YboodP 888888
  */
  var paddingTop, paddingLeft, wsW, wsH, iW, iH;
  function overlap(r1, r2) {
    return !(
      r1.right <= r2.left ||
      r1.left >= r2.right ||
      r1.bottom <= r2.top ||
      r1.top >= r2.bottom
    );
  }
  function onViewChange(type) {
    var _slice = Array.prototype.slice;
    function getEmptyPlace(index, top, left) {
      for (var i = 0, l = icons.length; i < l; i++) {
        if (
          i !== index &&
          icons[i].offsetTop === top &&
          icons[i].offsetLeft === left
        ) {
          if (top + iH * 2 > wsH) {
            (top = 0), (left += iW);
            if (left + iW * 2 > wsW) (left = 0), (top += iH);
          } else top += iH;
          return getEmptyPlace(index, top, left);
        }
      }
      return { top: top, left: left };
    }
    if (type === "workspace") {
      var icons = _slice.call(this.el.folder.querySelectorAll(".ui_icon"), 0),
        styles = window.getComputedStyle(this.el.folder);

      wsW = this.el.folder.clientWidth;
      wsH = this.el.folder.clientHeight;
      iW = le._icons.w;
      iH = le._icons.h;

      if (icons.length) {
        if (icons.length * (iW * iH) > (wsW - iW) * (wsH - iH)) {
          this.el.folder.classList.add("ui_explorer--workspace--full");
        } else {
          this.el.folder.classList.remove("ui_explorer--workspace--full");

          icons.sort(function(a, b) {
            var aO = le._desktop[a.getAttribute("data-name")];
            var bO = le._desktop[b.getAttribute("data-name")];
            if (aO && bO) {
              return aO.time > bO.time ? 1 : -1;
            }
          });
          var timestamp = Date.now();
          $io.arr.each(icons, function(item, i) {
            var pos = le._desktop[item.getAttribute("data-name")];
            if (!pos)
              pos = le._desktop[item.getAttribute("data-name")] = {
                x: 0,
                y: 0,
                time: timestamp + i,
              };
            var top = pos.y;
            var left = pos.x;

            if (top + iH > wsH) top = Math.floor(wsH / iH) * iH - iH * 2;
            if (top < 0) top = 0;
            if (left + iW > wsW) left = Math.floor(wsW / iW) * iW - iW;
            if (left < 0) left = 0;
            item.style.position = "absolute";
            item.style.left = left + "px";
            item.style.top = top + "px";
            item.style.zIndex = i;
          });
          $io.arr.each(icons, function(item, i) {
            var p = getEmptyPlace(i, item.offsetTop, item.offsetLeft);
            item.style.left = p.left + "px";
            item.style.top = p.top + "px";
            le._desktop[item.getAttribute("data-name")] = {
              x: p.left,
              y: p.top,
              time: timestamp + i,
            };
          });
        }
      }
    }
  }

  /*
    8b    d8 888888 88b 88 88   88 .dP"Y8
    88b  d88 88__   88Yb88 88   88 `Ybo."
    88YbdP88 88""   88 Y88 Y8   8P o.`Y8b
    88 YY 88 888888 88  Y8 `YbodP' 8bodP'
  */

  function disabledIfNotDownloadable() {
    if (!le._selected.length) return false;
    if (disabledIfNotInLocalFolder()) {
      for (var i = le._selected.length - 1; i >= 0; i--) {
        if (le._selected[i].classList.contains("ui_icon__folder")) return true;
      }
    }
  }
  function disabledIfNoSelection() {
    return !le._selected.length;
  }
  function disabledIfNotInLocalFolder() {
    return _explorer.current
      ? !(_explorer.current.getPath().indexOf("/a/") === 0)
      : true;
  }
  function disabledIfNotLocalFile() {
    return !(!disabledIfNotInLocalFolder() && !disabledIfNoSelection());
  }
  function disabledIfNotPastable() {
    return !(
      !disabledIfNotInLocalFolder() &&
      (_explorer.clipboard.copy.length > 0 ||
        _explorer.clipboard.cut.length > 0)
    );
  }

  function displayedIfShortcut() {
    if (this.el) return this.el.classList.contains("ui_icon__lnk42");
  }

  function switchView(type) {
    var arr = ["icons", "column", "list", "details", "workspace"];
    var el = this.explorer.el.folder;
    for (var i = 0, l = arr.length; i < l; i++) {
      el.classList.remove("ui_explorer--" + arr[i]);
    }
    el.classList.add("ui_explorer--" + type);
    if (type === "workspace") el.classList.remove("ui_explorer--not_workspace");
    else el.classList.add("ui_explorer--not_workspace");

    this.explorer.cfg.viewType = type;
    onViewChange.call(this.explorer, this.explorer.el.folder);
  }

  function createFile(currentPath, cb, isFolder) {
    if (currentPath.indexOf("/a/") === 0) {
      $prompt("Enter a name", function(ok, val) {
        if (ok && val) {
          $db.set(
            currentPath.replace(/^\/a\//, "") + val + (isFolder ? "/" : ""),
            "",
            function() {
              $file.scan("/a/", function() {
                if (typeof cb == "function") cb(val);
              });
            }
          );
        }
      });
    } else {
      $notif("You don't have write permission on this drive", currentPath);
    }
  }

  // file manip
  /////////////////////////////////////////////////////////////////////////////

  var menuFnUi = {
    viewIcons: function() {
      switchView.call(this, "icons");
    },
    viewList: function(e) {
      switchView.call(this, "list");
    },
    viewColumn: function() {
      switchView.call(this, "column");
    },
    viewDetails: function() {
      switchView.call(this, "details");
    },
    viewWorkspace: function() {
      switchView.call(this, "workspace");
    },
    viewNavigation: function(ok) {
      if (ok) {
        this.explorer.getWindow().el.afterMenu.classList.remove("hide");
        this.explorer.el.folder.classList.add("ui_explorer--nav");
      } else {
        this.explorer.el.folder.classList.remove("ui_explorer--nav");
        this.explorer.getWindow().el.afterMenu.classList.add("hide");
      }

      this.explorer.cfg.nav = ok;
    },
    viewFileTree: function(ok) {
      if (ok) this.explorer.el.tree.classList.remove("hide");
      else this.explorer.el.tree.classList.add("hide");
      this.explorer.cfg.fileTree = ok;
    },
    itemsOpenWith: function(file) {
      if (le._selected.length) {
        return $fs.utils.getMenuOpenWith(le._selected);
      } else {
        return false;
      }
    },
  };

  function resetCutedFiles() {
    $io.arr.all(document.querySelectorAll(".ui_icon--cut"), function(item) {
      item.classList.remove("ui_icon--cut");
    });
  }

  _explorer.clipboard = {
    copy: [],
    cut: [],
  };

  _explorer.exe = {
    SelectAll: function() {
      le._selected = Array.prototype.slice.call(
        _explorer.current.el.folder.querySelectorAll(".ui_icon")
      );
      _explorer.selection.display();
    },
    Open: function() {
      _explorer.selection.paths(function(path, item) {
        $exe(item);
      });
    },
    Copy: function(k, obj) {
      //console.log('COPY', obj.session.stack)
      resetCutedFiles();
      _explorer.clipboard.copy.length = 0;
      _explorer.clipboard.cut.length = 0;
      _explorer.selection.paths(function(path, item) {
        _explorer.clipboard.copy.push(path);
      });
    },
    Cut: function() {
      resetCutedFiles();
      _explorer.clipboard.copy.length = 0;
      _explorer.clipboard.cut.length = 0;
      _explorer.selection.paths(function(path, item) {
        item.classList.add("ui_icon--cut");
        _explorer.clipboard.cut.push(path);
      });
    },
    Paste: function() {
      resetCutedFiles();
      $io.arr.all(_explorer.clipboard.copy, function(fromPath) {
        var isFolder = $fs.utils.isFolder(fromPath);
        $file.copy(fromPath, _explorer.current.getPath(), function(fileName) {
          //console.log(fileName)
          _explorer.utils.saveIconPos(
            _explorer.current.getPath(),
            _explorer.current.id,
            fileName
          );
          _explorer.refresh();
        });
      });
      $io.arr.all(_explorer.clipboard.cut, function(fromPath) {
        _explorer.clipboard.copy.push(fromPath);
        var isFolder = $fs.utils.isFolder(fromPath);
        var newPath =
          _explorer.current.getPath() +
          $fs.utils.getName(fromPath) +
          (isFolder ? "/" : "");
        if (fromPath === newPath) return;
        $file.move(fromPath, newPath, function() {
          _explorer.refresh();
        });
      });
      _explorer.clipboard.cut.length = 0;
    },
    Delete: function() {
      _explorer.selection.truePaths(function(path) {
        $file.delete(path, function() {
          _explorer.refresh();
          $notif("File deleted", path);
        });
      });
    },
    Import: function() {
      $file.upload(function(files) {
        $file.save(_explorer.current.getPath(), files, function(fileName) {
          _explorer.utils.saveIconPos(
            _explorer.current.getPath(),
            _explorer.current.id,
            fileName
          );
          _explorer.refresh();
        });
      });
    },
    DownloadAs: function() {
      _explorer.selection.paths(function(path) {
        if ($fs.utils.isFolder(path)) $archive(path);
        else $file.download(path);
      });
    },
    Zip: function() {
      $archive(le._selected);
    },
    Refresh: function() {
      _explorer.refresh();
    },
    Format: function() {
      $file.format(function() {
        _explorer.current.go("/a/");
      });
    },
    CreateFolder: function() {
      createFile(
        _explorer.current.getPath(),
        function(folderName) {
          _explorer.utils.saveIconPos(
            _explorer.current.getPath(),
            _explorer.current.id,
            folderName
          );
          _explorer.refresh(folderName);
        },
        true
      );
      //return false
    },
    CreateFile: function() {
      createFile(_explorer.current.getPath(), function(fileName) {
        _explorer.utils.saveIconPos(
          _explorer.current.getPath(),
          _explorer.current.id,
          fileName
        );
        _explorer.refresh(fileName);
      });
      //return false
    },
    CreateShortcut: function(data) {
      var current = _explorer.current;
      $window.form(
        "Create Shortcut",
        {
          data: data || {},
          schema: le._schemas.shortcut,
        },
        function(ok, data) {
          if (ok) {
            var lnkName = data.title || $fs.utils.getName(data.exe);
            var path = current.getPath();
            console.log(123, path, ok, data);
            $store.set(path.replace(/^\/a\//, "") + lnkName + ".lnk42", data);
            _explorer.utils.saveIconPos(
              current.getPath(),
              current.id,
              lnkName + ".lnk42"
            );
            _explorer.refresh(lnkName + ".lnk42");
          }
        }
      );
      //return false
    },
    EditShortcut: function(data) {
      var reselect = [];
      var toFocus = document.activeElement;

      _explorer.selection.all(function(item) {
        var path = item.getAttribute("data-path");
        var title = item.getAttribute("data-title");
        var fileName = $fs.utils.getName(path);

        $window.form(
          "Edit Shortcut",
          {
            data: $extend({}, item.dataset),
            schema: le._schemas.shortcut,
          },
          function(ok, newData) {
            if (ok) {
              var storePath = path.replace(/^\/a\//, "");
              $store.update(storePath, function(data) {
                return $extend(data, newData);
              });
              reselect.push(fileName);
              _explorer.refresh(reselect);
            }
          }
        );
      });
    },
    Properties: function() {
      _explorer.selection.all(function(item) {
        var form = $form.build($extend({}, item.dataset), { disabled: true });
        $window({
          title: "Properties",
          html: form.el,
          width: 400,
          btnOk: "Close",
        });
      });
    },
    Rename: function() {
      var reselect = [];
      var toFocus = document.activeElement;

      _explorer.selection.all(function(item) {
        var path = item.getAttribute("data-path");
        var title = item.getAttribute("data-title");
        var fileName = $fs.utils.getName(path);
        var isShortCut = /\.lnk42$/.test(fileName);
        // keep old current explorer if prompt closing is activating another explorer
        var oldCurrent = _explorer.current;

        $prompt(
          {
            msg: "New name ?",
            onready: function() {
              _explorer.utils.inputSelectFileName(this.el.form.prompt);
            },
          },
          title || fileName,
          function(ok, newName) {
            if (ok) {
              var slugName = $io.str.truncate(
                newName.replace(/[\/:]/g, "_"),
                247
              );
              if (isShortCut) slugName = slugName + ".lnk42";
              var newPath = $fs.utils.getFolderPath(path) + slugName;
              $file.rename(path, slugName, function(newPath) {
                _explorer.current = oldCurrent;
                if (isShortCut) {
                  var storePath = newPath.replace(/^\/a\//, "");
                  $store.update(storePath, function(data) {
                    data.name = newName + ".lnk42";
                    data.title = newName;
                    return data;
                  });
                }
                if (le._desktop[fileName]) {
                  le._desktop[slugName] = $extend({}, le._desktop[fileName]);
                  delete le._desktop[fileName];
                }
                reselect.push(slugName);
                _explorer.refresh(reselect);
              });
            }
          }
        );
      });
    },
    OpenTerminalHere: function() {
      $exe("terminal " + _explorer.current.getPath());
    },
  };

  var MENUS = {
    barMenu: [
      {
        name: "File",
        items: [
          {
            name: "Open",
            key: "enter",
            action: _explorer.exe.Open,
            disabled: disabledIfNoSelection,
          },
          {
            name: "Open With...",
            items: menuFnUi.itemsOpenWith,
            disabled: disabledIfNoSelection,
          },
          { name: "---" },
          {
            name: "Create Folder...",
            key: "ctrl+shift+f",
            action: _explorer.exe.CreateFolder,
            disabled: disabledIfNotInLocalFolder,
          },
          {
            name: "Create Document...",
            key: "ctrl+shift+d",
            action: _explorer.exe.CreateFile,
            disabled: disabledIfNotInLocalFolder,
          },
          {
            name: "Create Shortcut...",
            key: "ctrl+shift+s",
            action: _explorer.exe.CreateShortcut,
            disabled: disabledIfNotInLocalFolder,
          },
          { name: "---" },
          //,{name: 'Import folder as zip', action: $noop}
          //,{name: 'Export folder as zip', action: $noop}
          //,{name: '---'}
          {
            name: "Import file",
            action: _explorer.exe.Import,
            disabled: disabledIfNotInLocalFolder,
          },
          // ,{name: 'Download file(s)', action: _explorer.exe.DownloadAs, disabled: disabledIfNoSelection}
          {
            name: "Download file(s)",
            action: _explorer.exe.DownloadAs,
            disabled: disabledIfNotDownloadable,
          },
          { name: "---" },
          {
            name: "Open Terminal here",
            action: _explorer.exe.OpenTerminalHere,
          },
          //,{name: 'Properties...', action: _explorer.exe.Properties}
          { name: "---" },
          {
            name: "Quit",
            action: function() {
              if (winInstance && winInstance.close) winInstance.close();
            },
          },
        ],
      },
      {
        name: "Edit",
        items: [
          //,{name: 'Copy', action: _explorer.exe.Copy, disabled: disabledIfNoSelection}
          {
            name: "Select all",
            key: "ctrl+a",
            action: _explorer.exe.SelectAll,
          },
          { name: "---" },
          {
            name: "Cut",
            key: "ctrl+x",
            action: _explorer.exe.Cut,
            disabled: disabledIfNotLocalFile,
          },
          {
            name: "Copy",
            key: "ctrl+c",
            action: _explorer.exe.Copy,
            disabled: disabledIfNotLocalFile,
          },
          {
            name: "Paste",
            key: "ctrl+v",
            action: _explorer.exe.Paste,
            disabled: disabledIfNotPastable,
          },
          { name: "---" },
          {
            name: "Rename",
            key: "f2",
            action: _explorer.exe.Rename,
            disabled: disabledIfNotLocalFile,
          },
          {
            name: "Delete",
            key: "del",
            action: _explorer.exe.Delete,
            disabled: disabledIfNotLocalFile,
          },
          //,{name: '---'}
          //,{name: 'Format drive', action: _explorer.exe.Format}
          //,{name: '---'}
          //,{name: 'Preferences', action: _explorer.exe.Preferences, disabled: disabledIfNotLocalFile}
        ],
      },
      {
        name: "View",
        items: [
          { name: "Refresh", action: _explorer.exe.Refresh },
          { name: "---" },

          {
            name: "Navigation",
            checkbox: true,
            action: menuFnUi.viewNavigation,
            selected: function() {
              return this.explorer.cfg.nav;
            },
          },
          //,{name: 'File Tree', checkbox:true, action: menuFnUi.viewFileTree, selected: function(){return this.explorer.cfg.fileTree} }
          { name: "---" },
          {
            name: "Icons",
            radio: "View",
            action: menuFnUi.viewIcons,
            selected: function() {
              return this.explorer.cfg.viewType === "icons";
            },
          },
          {
            name: "List",
            radio: "View",
            action: menuFnUi.viewList,
            selected: function() {
              return this.explorer.cfg.viewType === "list";
            },
          },
          //,{name: 'Column', radio:'View', action: menuFnUi.viewColumn, selected: function(){return this.explorer.cfg.viewType === 'column'} }
          //,{name: 'Details', radio:'View', action: menuFnUi.viewDetails, selected: function(){return this.explorer.cfg.viewType === 'details'} }
          //,{name: 'Workspace', radio:'View', action: menuFnUi.viewWorkspace, selected: function(){return this.explorer.cfg.viewType === 'workspace'} }
        ],
      },
    ],
    ctxFile: $menu([
      { name: "Open", action: _explorer.exe.Open },
      {
        name: "Open With...",
        items: menuFnUi.itemsOpenWith,
        disabled: disabledIfNoSelection,
      },
      //,{name: '---'}
      {
        name: "Download As...",
        action: _explorer.exe.DownloadAs,
        disabled: disabledIfNotDownloadable,
      },
      // ,{name: 'Download As...', action: _explorer.exe.DownloadAs, disabled: !$fs.utils.isDownloadable}
      // ,{name: 'Download As...', action: _explorer.exe.DownloadAs, disabled: function (elem) {
      //   // console.log(111222, this)
      //   return !$fs.utils.isDownloadable(this.el)
      // }}
      //,{name: 'Download Archive', action: _explorer.exe.Zip}
      { name: "---" },
      {
        name: "Cut",
        key: "ctrl+x",
        action: _explorer.exe.Cut,
        disabled: disabledIfNotLocalFile,
      },
      {
        name: "Copy",
        key: "ctrl+c",
        action: _explorer.exe.Copy,
        disabled: disabledIfNotLocalFile,
      },
      { name: "---" },
      {
        name: "Rename",
        key: "f2",
        action: _explorer.exe.Rename,
        disabled: disabledIfNotLocalFile,
      },
      {
        name: "Delete",
        key: "del",
        action: _explorer.exe.Delete,
        disabled: disabledIfNotLocalFile,
      },
      { name: "---" },
      {
        name: "Edit",
        display: displayedIfShortcut,
        action: _explorer.exe.EditShortcut,
        disabled: disabledIfNotLocalFile,
      },
      { name: "Properties", action: _explorer.exe.Properties },
    ]),
  };

  MENUS.ctxExplorer = $menu([
    {
      name: "Create Folder...",
      action: _explorer.exe.CreateFolder,
      disabled: disabledIfNotInLocalFolder,
    },
    {
      name: "Create Document...",
      action: _explorer.exe.CreateFile,
      disabled: disabledIfNotInLocalFolder,
    },
    {
      name: "Create Shortcut...",
      action: _explorer.exe.CreateShortcut,
      disabled: disabledIfNotInLocalFolder,
    },
    { name: "---" },
    {
      name: "Paste",
      key: "ctrl+v",
      action: _explorer.exe.Paste,
      disabled: disabledIfNotPastable,
    },
    //,{name: '---'}
    //,{name: 'Import file', action: _explorer.exe.Import, disabled: disabledIfNotInLocalFolder}
    { name: "---" },
    { name: "Open Terminal here", action: _explorer.exe.OpenTerminalHere },
  ]);

  /*
    88   88 888888 88 88     .dP"Y8
    88   88   88   88 88     `Ybo."
    Y8   8P   88   88 88  .o o.`Y8b
    `YbodP'   88   88 88ood8 8bodP'
  */

  _explorer.selection = {
    reset: function() {
      le._selected.length = 0;
      return this;
    },
    add: function(el) {
      le._selected.push(el);
      return this;
    },
    all: function(cb) {
      $io.arr.all(le._selected, cb);
      return this;
    },
    each: function(cb) {
      $io.arr.each(le._selected, cb);
      return this;
    },
    paths: function(cb) {
      $io.arr.all(le._selected, function(item) {
        var data = $extend({}, item.dataset);
        var exe = item.getAttribute("data-exe");
        var path = item.getAttribute("data-path");
        var arg = $fs.utils.exist(exe) ? exe : path;
        return cb.call(data, arg, item);
      });
      return this;
    },
    truePaths: function(cb) {
      $io.arr.all(le._selected, function(item) {
        var data = $extend({}, item.dataset);
        var path = item.getAttribute("data-path");
        return cb.call(data, path, item);
      });
      return this;
    },
    remove: function() {
      $io.arr.all(document.querySelectorAll(".ui_icon.ui_selected"), function(
        item
      ) {
        item.classList.remove("ui_selected");
      });
      return this;
    },
    display: function() {
      var name = [];
      _explorer.selection.remove();

      $io.arr.all(le._selected, function(item) {
        var path = item.getAttribute("data-path");
        if (path) name.push(le._selected.length > 1 ? '"' + path + '"' : path);
        item && item.classList.add("ui_selected");
      });

      if (_explorer.current) {
        var saveInput = _explorer.current.getSaveInput();
        if (saveInput) {
          if (saveInput && name && name[0]) {
            saveInput.value = $fs.utils.getFileName(name[0]);
            $el(saveInput).trigger("change");
          }
        } else {
          var selInput = _explorer.current.getSelectionInput();
          if (selInput)
            selInput.value = name.join(", \n") || _explorer.current.getPath();
        }
      }
      return this;
    },
  };

  _explorer.instances = instances;
  //_explorer.current = null;

  var CURRENT_X, CURRENT_Y;
  _explorer.setCurrent = function(el, e) {
    var curr =
      instances[el.nodeType === 1 ? el.getAttribute("data-id") * 1 : el];
    if (curr) _explorer.current = curr;
    if (_explorer.current.id === 0 && e) {
      CURRENT_X = e.clientX;
      CURRENT_Y = e.clientY;
      //console.log('setCurrent', CURRENT_X, CURRENT_Y);
    }
    return curr;
  };

  _explorer.utils = {};

  _explorer.utils.inputSelectFileName = function(input) {
    if (/\.[a-z0-9]{1,20}$/.test(input.value)) {
      var lastIndex = input.value.lastIndexOf(".");
      if (lastIndex > -1) $selection.create(input, 0, lastIndex);
    } else {
      input.select();
    }
  };
  _explorer.utils.saveIconPos = function(path, id, name, x, y) {
    x = typeof x === "number" ? x : CURRENT_X - le._icons.w / 2;
    y = typeof y === "number" ? y : CURRENT_Y - le._icons.h / 2;

    if (!name) name = $fs.utils.getName(path);
    else name = $fs.utils.getName(name);

    if (name && $fs.utils.getFolderPath(path) === le._path.desktop) {
      if (id * 1 === 0 && x * 1 === x && y * 1 === y) {
        le._desktop[name] = {
          x: x,
          y: y,
          time: Date.now(),
        };
      } else le._desktop[name] = { x: 9999, y: 0, time: 0 };
      //console.log(name, le._desktop[name]);
    }
  };

  _explorer.refresh = function(list, toFocus) {
    $file.scan("/a/", function() {
      $io.arr.all(instances, function(ex) {
        if (ex) ex.refresh();
      });
      if (typeof list === "string") list = [list];
      if (list && list.length) {
        toFocus = toFocus || list[0];
        _explorer.selection.reset();
        $io.arr.all(list, function(filename) {
          var el = _explorer.current.el.folder.querySelector(
            'div[data-name="' + filename + '"]'
          );
          if (el) {
            if (toFocus === filename) el.focus();
            _explorer.selection.add(el);
          }
        });
        _explorer.selection.display();
      }
      //if (typeof cb === 'function') cb()
    });
  };

  /*_explorer.silent = function(path, opt) {
    return _explorer.call(this, path, $extend({}, opt, {silent:true}));
  };*/
  window.$explorer = _explorer;
});

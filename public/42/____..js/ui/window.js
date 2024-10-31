!(function(global) {
  "use strict";

  // http://www.w3.org/TR/wai-aria/roles#alertdialog

  // @todo : fix right click on docked "minimise"

  var def = {
      title: "",
      html: "",
      help: "",
      url: null,
      menu: null,
      header: true,
      footer: null,

      width: 390,
      height: 270,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      baseWidth: null,
      baseHeight: null,
      minWidth: null,
      minHeight: null,
      top: null,
      left: null,
      center: false,
      noOut: false,

      constrain: false,
      ajax: false,
      automaximize: false,
      contextmenuOnBody: false,

      resizable: true,
      minimizable: true,
      maximizable: true,
      closable: true,
      draggable: true,
      //,pinnable: true
      dockable: true,
      activable: true,

      headerBtn: [],

      onopen: $noop,
      onready: $noop,
      onclose: $noop,
      onok: $noop,
      oncancel: $noop,
      onminimize: $noop,
      ondrag: $noop,
      ondragstop: $noop,
      onresize: $noop,
      onactive: $noop,
      ondestroy: $noop,

      animationIn: "",
      animationOut: "",
      baseClass: "",
      bodyClass: "",
      style: "",
      dest: document.body,
      dock: null,
    },
    uid = 0,
    instances = [],
    base = document.createElement("div"),
    head = document.createElement("header"),
    menu = document.createElement("header"),
    body = document.createElement("section"),
    foot = document.createElement("footer"),
    iframe = document.createElement("iframe"),
    icon = document.createElement("img"),
    title = document.createElement("span"),
    minimize = document.createElement("button"),
    maximize = document.createElement("button"),
    close = document.createElement("button");

  base.setAttribute("role", "dialog");
  base.className = "ui_window ui_window--active";
  head.className = "ui_window__head";
  icon.className = "ui_window__head__icon";
  title.className = "ui_window__head__title ui_elipsis";
  minimize.className = "ui_window__head__minimize";
  maximize.className = "ui_window__head__maximize";
  close.className = "ui_window__head__close";
  menu.className = "ui_window__menu";
  body.className = "ui_window__body";
  foot.className = "ui_window__foot";
  iframe.className = "ui_window__iframe";
  //iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock');

  //iframe.setAttribute('scrolling', 'no');
  iframe.setAttribute("allowfullscreen", "true");
  // usefull for setting focus on new windows
  //body.setAttribute('tabindex', '0');

  function _window(opt) {
    //if (typeof opt == 'string' && opt.indexOf('.html') != -1) opt = {title: opt, url: opt, ajax:true, width: 400, height: 300};
    // shortcut for $window(url)
    if (typeof opt == "string")
      opt = { title: opt, url: opt, ajax: !true, width: 400, height: 300 };

    var //cfg = opt.model ? $extend(true,{}, def, def.models[opt.model], opt) : $extend(true, {}, def, opt)
      //cfg = opt.model ? $extend({}, def, def.models[opt.model], opt) : $extend({}, def, opt)
      cfg = $extend({}, def, opt),
      win_base = base.cloneNode(false),
      win_head = head.cloneNode(false),
      win_menu = menu.cloneNode(false),
      win_body = body.cloneNode(false),
      win_foot = foot.cloneNode(false),
      id = uid++,
      w = cfg.dest.offsetWidth,
      h = cfg.dest.offsetHeight,
      instance;

    cfg.caller = $io.isWindow(this) ? null : this;
    if (cfg.caller && cfg.caller.that && cfg.caller.that.window) {
      //console.log(cfg.caller.that.window)
      //console.log(cfg)
      $extend(cfg, cfg.caller.that.window);
    }

    if (opt.contextmenu)
      cfg.contextmenu = $extend({}, def.contextmenu, cfg.contextmenu);

    win_base.id = "ui_window_" + id; //'win' + id; //'ui_window_' + id;
    win_base.setAttribute("data-window-id", id);

    if (cfg.style) {
      for (var key in cfg.style) {
        if (cfg.style.hasOwnProperty(key)) {
          win_base.style[key] = cfg.style[key];
        }
      }
    }

    if (cfg.baseClass) {
      var baseClasses = cfg.baseClass.split(" ");
      $io.arr.all(baseClasses, function(item) {
        win_base.classList.add(item);
      });
    }

    function addHeaderBtn(item) {
      var btnStatus = item.init.call(cfg);
      if (btnStatus) {
        item.el = document.createElement("button");
        item.el.className =
          (item.className || "ui_window__head__" + item.name) +
          (typeof btnStatus === "string" ? " " + btnStatus : "");
        item.title && (item.el.title = item.title);
        item.el.onclick = function(e) {
          item.action.call(instance, e);
        };
        win_head.appendChild(item.el);
      }
    }

    /*
      88  88 888888    db    8888b.  888888 88""Yb
      88  88 88__     dPYb    8I  Yb 88__   88__dP
      888888 88""    dP__Yb   8I  dY 88""   88"Yb
      88  88 888888 dP""""Yb 8888Y"  888888 88  Yb
    */

    function contextOnTitle(e) {
      e.preventDefault();
      contextMenu.show(instance, {
        at: "left+10 bottom+10",
        of: e,
        within: cfg.dest,
      });
    }
    if (cfg.contextmenuOnBody) {
      win_body.addEventListener("contextmenu", contextOnTitle, false);
    }

    function clickOnIcon(e) {
      e.preventDefault();
      contextMenu.show(instance, { of: this, within: cfg.dest });
    }

    if (cfg.header) {
      if (cfg.icon) {
        var win_icon = icon.cloneNode(false);
        win_icon.src = cfg.icon;
        win_icon.addEventListener("click", clickOnIcon, false);
        win_icon.addEventListener("dblclick", closeIt, false);
        win_icon.addEventListener("contextmenu", clickOnIcon, false);
        win_head.appendChild(win_icon);
      }

      var win_title = title.cloneNode(false);
      win_title.textContent = cfg.title || "";
      win_base.setAttribute("aria-labelledby", "ui_window__title_" + id);
      win_title.id = "ui_window__title_" + id;
      win_head.appendChild(win_title);

      win_head.addEventListener("contextmenu", contextOnTitle, false);

      // custom buttons
      /////////////////////////////////////////////////////////////////////////////

      if (cfg.headerBtn) {
        for (var i = cfg.headerBtn.length - 1; i >= 0; i--) {
          addHeaderBtn(cfg.headerBtn[i]);
        }
      }

      if (cfg.minimizable && cfg.dock && cfg.dockable) {
        var win_minimize = minimize.cloneNode(false);
        win_minimize.onclick = minimizeIt;
        win_head.appendChild(win_minimize);
      }
      if (cfg.maximizable) {
        var win_maximize = maximize.cloneNode(false);
        win_maximize.onclick = maximizeIt;
        win_head.appendChild(win_maximize);
      }
      if (cfg.closable) {
        var win_close = close.cloneNode(false);
        win_close.onclick = closeIt;
        win_head.appendChild(win_close);
      }

      win_base.appendChild(win_head);
    }

    if (cfg.menu || cfg.beforeMenu || cfg.afterMenu) {
      //console.log('???', cfg.menu, cfg.beforeMenu, cfg.afterMenu);
      win_base.appendChild(win_menu);
    }

    var beforeMenu;
    if (cfg.beforeMenu) {
      if (typeof cfg.beforeMenu == "string") {
        beforeMenu = document.createElement("div");
        beforeMenu.innerHTML = cfg.beforeMenu;
      } else {
        beforeMenu = cfg.beforeMenu;
      }
      win_menu.appendChild(beforeMenu);
    }

    /*
      8b    d8 888888 88b 88 88   88
      88b  d88 88__   88Yb88 88   88
      88YbdP88 88""   88 Y88 Y8   8P
      88 YY 88 888888 88  Y8 `YbodP'
    */
    var menuInstance;
    //console.log(111111)
    //console.log(cfg)
    if (cfg.menu) {
      //console.log("????")
      var menubar = document.createElement("div");
      win_menu.appendChild(menubar);
      menuInstance = $menu(menubar, cfg.menu, {
        //keyTarget: cfg.menuKeyTarget || win_body,
        keyTarget: win_body,
        thisArg: cfg.menuThisArg || win_body, //$extend(cfg.menuThisArg || {}, {window:instance}),
        mode: "bar",
        //trigger: 'click',
        position: { within: cfg.dest },
      });
    }

    var afterMenu;
    if (cfg.afterMenu) {
      if (typeof cfg.afterMenu == "string") {
        afterMenu = document.createElement("div");
        afterMenu.innerHTML = cfg.afterMenu;
      } else {
        afterMenu = cfg.afterMenu;
      }
      win_menu.appendChild(afterMenu);
    }

    win_base.appendChild(win_body);

    /*
      888888  dP"Yb   dP"Yb  888888 888888 88""Yb
      88__   dP   Yb dP   Yb   88   88__   88__dP
      88""   Yb   dP Yb   dP   88   88""   88"Yb
      88      YbodP   YbodP    88   888888 88  Yb
    */

    if (cfg.footer) {
      var footer;
      if (typeof cfg.footer == "string") {
        footer = document.createElement("div");
        footer.innerHTML = cfg.footer;
      } else {
        footer = cfg.footer;
      }
      win_foot.appendChild(footer);
    }

    if (cfg.footer || cfg.btnOk || cfg.btnCancel) {
      win_base.appendChild(win_foot);
    }

    /*
      .dP"Y8 88 8888P 888888 .dP"Y8
      `Ybo." 88   dP  88__   `Ybo."
      o.`Y8b 88  dP   88""   o.`Y8b
      8bodP' 88 d8888 888888 8bodP'
    */

    win_base.style.top = (cfg.top || -4000) + "px";
    win_base.style.left = (cfg.left || -4000) + "px";

    win_body.style.width =
      cfg.width == "auto"
        ? "auto"
        : cfg.width * 1 + cfg.borderTopWidth + cfg.borderBottomWidth + "px";
    win_body.style.height =
      cfg.height == "auto"
        ? "auto"
        : cfg.height * 1 + cfg.borderLeftWidth + cfg.borderRightWidth + "px";

    // @todo : remove magical number

    function normalizeSize() {
      //if (!cfg.resizable) return;
      var baseW = cfg.baseWidth ? cfg.baseWidth : win_base.offsetWidth,
        baseH = cfg.baseHeight ? cfg.baseHeight : win_base.offsetHeight,
        largerW = false,
        largerH = false;

      if (baseW > w) (baseW = w), (largerW = true);
      if (baseH > h) (baseH = h), (largerH = true);
      win_base.style.height = baseH + "px";
      win_base.style.width = baseW + "px";

      win_body.classList.add("ui_window__body--flex");
      win_body.removeAttribute("style");

      if (cfg.minHeight === true)
        win_base.style.minHeight = win_base.style.height;
      else if (cfg.minHeight)
        win_base.style.minHeight =
          cfg.minHeight == "auto" ? "auto" : cfg.minHeight + "px";
      if (cfg.minWidth === true) win_base.style.minWidth = win_base.style.width;
      else if (cfg.minWidth)
        win_base.style.minWidth =
          cfg.minWidth == "auto" ? "auto" : cfg.minWidth + "px";

      if (cfg.center) {
        cfg.top = ~~((h - baseH) / 2) + "px";
        cfg.left = ~~((w - baseW) / 2) + "px";
      } else {
        if (!cfg.top) {
          //var top = ~~(Math.random() * (h-baseH-30));
          //cfg.top = (top > 10 ? top : 10) + 'px';
          var top = ~~(Math.random() * (h - baseH));
          cfg.top = top + "px";
          // } else if (cfg.noOut && cfg.top > h-baseH) cfg.top = h-baseH + 'px';
        } else if (cfg.noOut && cfg.top > h - baseH) {
          cfg.maxTop = true;
          cfg.top = h - baseH + "px";
          win_base.style.top = cfg.top;
        }

        if (!cfg.left) {
          //var left = ~~(Math.random() * (w-baseW-30));
          //cfg.left = (left > 10 ? left : 10) + 'px';
          var left = ~~(Math.random() * (w - baseW));
          cfg.left = left + "px";
        } else if (cfg.noOut && cfg.left > w - baseW) {
          cfg.maxLeft = true;
          cfg.left = w - baseW + "px";
          win_base.style.left = cfg.left;
        }
      }

      // if (cfg.noOut) {
      //   console.log(cfg.top, h-baseH)
      //   if (cfg.top > h-baseH) cfg.top = h-baseH
      //   if (cfg.left > w-baseW) cfg.left = w-baseW
      //   // console.log('noOut')
      // }

      // console.log(win_base.style.top)
      if (win_base.style.top === "-4000px")
        win_base.style.top = largerH ? 0 : cfg.top;
      if (win_base.style.left === "-4000px")
        win_base.style.left = largerW ? 0 : cfg.left;
      // console.log(win_base.style.top)
    }

    /*
         db    88""Yb 88""Yb 888888 88b 88 8888b.
        dPYb   88__dP 88__dP 88__   88Yb88  8I  Yb
       dP__Yb  88"""  88"""  88""   88 Y88  8I  dY
      dP""""Yb 88     88     888888 88  Y8 8888Y"
    */

    cfg.dest.appendChild(win_base);
    if (cfg.automaximize) {
      win_base.classList.add("ui_window--maximized");
    }

    /*
      8888b.  88""Yb    db     dP""b8
       8I  Yb 88__dP   dPYb   dP   `"
       8I  dY 88"Yb   dP__Yb  Yb  "88
      8888Y"  88  Yb dP""""Yb  YboodP
    */

    if (cfg.draggable) {
      (win_title || win_base).classList.add("ui_window--draggable");
      var dragInstance = $drag(win_base, {
        constrain: cfg.constrain,
        handle: win_title ? win_title : win_base,
        onstart: function() {
          _window.active(id);
          maskFrame(this);
        },
        ondrag: function(e, x, y) {
          cfg.ondrag.call(instance, e, x, y);
        },
        onstop: function() {
          unMaskFrame(this);
          cfg.ondragstop.call(instance, win_base, win_body);
        },
      });
    }

    /*
      88""Yb 888888 .dP"Y8 88 8888P 888888
      88__dP 88__   `Ybo." 88   dP  88__
      88"Yb  88""   o.`Y8b 88  dP   88""
      88  Yb 888888 8bodP' 88 d8888 888888
    */

    // @todo : fix resize events argument
    if (cfg.resizable) {
      var resizeInstance = $resize(win_base, {
        handles: "all",
        start: function(el) {
          _window.active(id);
          maskFrame(el);
        },
        stop: function(el) {
          unMaskFrame(el);
          cfg.onresize.call(instance, win_base, win_body);
        },
      });
    }

    /*
      88      dP"Yb   dP"Yb  88  dP
      88     dP   Yb dP   Yb 88odP
      88  .o Yb   dP Yb   dP 88"Yb
      88ood8  YbodP   YbodP  88  Yb
    */

    //if (cfg.bodyClass) win_body.classList.add(cfg.bodyClass);
    if (cfg.bodyClass) {
      var bodyClasses = cfg.bodyClass.split(" ");
      $io.arr.all(bodyClasses, function(item) {
        win_body.classList.add(item);
      });
    }
    if (cfg.animationIn == "random")
      cfg.animationIn = $io.arr.random($animate.i);
    if (cfg.animationOut == "random")
      cfg.animationOut = $io.arr.random($animate.o);
    //console.log('animationIn', cfg.animationIn);
    //console.log('animationOut', cfg.animationOut);
    if (cfg.animationIn) {
      win_base.classList.add("animated");
      $animate(win_base, cfg.animationIn, function(ok) {
        win_base.classList.remove("animated");
      });
    }

    /*
      88""Yb 88   88 888888 888888  dP"Yb  88b 88 .dP"Y8
      88__dP 88   88   88     88   dP   Yb 88Yb88 `Ybo."
      88""Yb Y8   8P   88     88   Yb   dP 88 Y88 o.`Y8b
      88oodP `YbodP'   88     88    YbodP  88  Y8 8bodP'
    */

    if (cfg.btnCancel || cfg.btnOk) {
      var contBtn = document.createElement("div");
      contBtn.className = "ui_window__buttons";
      win_foot.appendChild(contBtn);
    }
    var btnCancel;
    if (cfg.btnCancel) {
      btnCancel = document.createElement("button");
      btnCancel.innerHTML = cfg.btnCancel;
      btnCancel.className = "ui_window__cancel";
      contBtn.appendChild(btnCancel);
    }
    var btnOk;
    if (cfg.btnOk) {
      btnOk = document.createElement("button");
      btnOk.innerHTML = cfg.btnOk;
      btnOk.setAttribute("autofocus", "autofocus");
      //btnOk.className = 'ui_window__ok js-to-focus';
      btnOk.className = "ui_window__ok";
      contBtn.appendChild(btnOk);
    }

    /*
      8888b.   dP"Yb   dP""b8 88  dP
       8I  Yb dP   Yb dP   `" 88odP
       8I  dY Yb   dP Yb      88"Yb
      8888Y"   YbodP   YboodP 88  Yb
    */

    function clickOnDocked(e) {
      if (this.classList.contains("ui_window_docked--minimized")) {
        restoreIt();
        if (!win_base.classList.contains("ui_window--active"))
          _window.active(id);
      } else {
        if (win_base.classList.contains("ui_window--active")) {
          if (cfg.minimizable) minimizeIt();
          // always on top even if already active
          win_base.style.zIndex =
            $maxZ("#ui_explorer_0 .ui_icon,.ui_window,.ui_z_indexed").num + 10;
        } else {
          _window.active(id);
        }
        //_window.active(id);
      }
    }
    function contextOnDocked(e) {
      e.preventDefault();
      contextMenu.show(instance, {
        at: "left+10 bottom+10",
        of: e,
        within: cfg.dest,
      });
    }
    if (cfg.dock && cfg.dockable) {
      var docked = document.createElement("button"),
        docked_icon = document.createElement("img"),
        docked_text = document.createElement("span");
      docked.className = "ui_window_docked";
      docked.id = "ui_window_docked_" + id;
      docked_icon.className = "ui_window_docked__icon";
      docked_text.className = "ui_window_docked__text ui_elipsis";
      if (cfg.icon)
        (docked_icon.src = cfg.icon), docked.appendChild(docked_icon);
      if (cfg.title) {
        docked_text.textContent = cfg.title;
        docked.title = cfg.title;
        docked.appendChild(docked_text);
      }
      cfg.dock.appendChild(docked);

      docked.addEventListener("click", clickOnDocked, false);
      docked.addEventListener("contextmenu", contextOnDocked, false);
    }

    /*
      888888 Yb    dP 888888 88b 88 888888 .dP"Y8
      88__    Yb  dP  88__   88Yb88   88   `Ybo."
      88""     YbdP   88""   88 Y88   88   o.`Y8b
      888888    YP    888888 88  Y8   88   8bodP'
    */

    var isOk = false;
    function okClick(e) {
      isOk = true;
      if (cfg.onok.call(instance, isOk) !== false) closeIt(e);
    }
    function cancelClick(e) {
      if (cfg.oncancel.call(instance, isOk) !== false) closeIt(e);
    }
    function onBaseClick() {
      _window.active(id);
    }

    if (cfg.btnCancel) btnCancel.addEventListener("click", cancelClick, false);
    if (cfg.btnOk) btnOk.addEventListener("click", okClick, false);
    if (cfg.activable) win_base.addEventListener("click", onBaseClick, false);
    //if (cfg.resizable && win_title) win_title.addEventListener('dblclick', maximizeIt, false);
    //if (cfg.maximizable && !win_title) win_body.addEventListener('dblclick', maximizeIt, false);
    if (cfg.resizable && win_title)
      $el(win_title).on("dblclick doubletap", maximizeIt);
    if (cfg.maximizable && !win_title)
      $el(win_body).on("dblclick doubletap", maximizeIt);

    /*
      8888b.  888888 .dP"Y8 888888 88""Yb  dP"Yb  Yb  dP
       8I  Yb 88__   `Ybo."   88   88__dP dP   Yb  YbdP
       8I  dY 88""   o.`Y8b   88   88"Yb  Yb   dP   8P
      8888Y"  888888 8bodP'   88   88  Yb  YbodP   dP
    */

    function destroyThis() {
      if (docked) {
        docked.removeEventListener("click", clickOnDocked, false);
        docked.removeEventListener("contextmenu", contextOnDocked, false);
        if (docked && docked.parentNode) docked.parentNode.removeChild(docked);
      }

      if (win_icon) {
        win_icon.removeEventListener("click", clickOnIcon, false);
        win_icon.removeEventListener("dblclick", closeIt, false);
        win_icon.removeEventListener("contextmenu", clickOnIcon, false);
      }
      if (cfg.contextmenuOnBody)
        win_body.removeEventListener("contextmenu", contextOnTitle, false);
      if (cfg.header)
        win_head.removeEventListener("contextmenu", contextOnTitle, false);

      if (cfg.btnCancel) btnCancel.removeEventListener("click", closeIt, false);
      if (cfg.btnOk) btnOk.removeEventListener("click", okClick, false);

      if (transfer && transfer.parentNode)
        transfer.parentNode.removeChild(transfer);
      transfer = null; // @todo : most $window variables to null ?

      //if (cfg.resizable && win_title) win_title.removeEventListener('dblclick', maximizeIt, false);
      //if (cfg.maximizable && !win_title) win_body.removeEventListener('dblclick', maximizeIt, false);
      if (cfg.resizable && win_title)
        $el(win_title).off("dblclick doubletap", maximizeIt);
      if (cfg.maximizable && !win_title)
        $el(win_body).off("dblclick doubletap", maximizeIt);
      if (cfg.draggable) dragInstance.destroy();
      if (cfg.resizable) resizeInstance.destroy();
      //console.log('????', menuInstance)
      if (menuInstance) menuInstance.destroy();
      if (contextMenu) contextMenu.destroy();

      win_base.removeEventListener("click", onBaseClick, false);
      if (win_base && win_base.parentNode)
        win_base.parentNode.removeChild(win_base);

      var maxInStack = $maxZ(".ui_window").el;
      //console.log(maxInStack);
      if (maxInStack)
        _window.active(maxInStack.getAttribute("data-window-id") * 1);
      //else cfg.ondestroy.call(instance, maxInStack);

      cfg.ondestroy.call(instance, maxInStack);

      instances[id] = null;
    }

    function checkAnimBeforeClose() {
      if (cfg.animationOut) {
        var hasFx = false;
        for (var i = 0, l = win_base.classList.length; i < l; i++) {
          // if (win_base.classList[i] && win_base.classList[i].indexOf('fx_') === 0) win_base.classList.remove(win_base.classList[i]);
          if (
            win_base.classList[i] &&
            win_base.classList[i].indexOf("fx_") === 0
          )
            hasFx = true;
        }
        if (hasFx) {
          destroyThis();
        } else {
          win_base.classList.add("animated");
          $animate(win_base, cfg.animationOut, function(ok) {
            win_base.classList.remove("animated");
            destroyThis();
          });
        }
      } else {
        destroyThis();
      }
    }

    function submitThis() {
      if (
        isOk &&
        cfg.onsubmit &&
        cfg.onsubmit.call(instance, isOk, $form.data(win_form), win_form) ===
          false
      ) {
        // do not close until form is confirmed...
        isOk = false;
      } else {
        if (cfg.onbeforeclose) {
          cfg.onbeforeclose.call(instance, function() {
            checkAnimBeforeClose();
            if (cfg.onclose)
              cfg.onclose.call(instance, isOk, $form.data(win_form), win_form);
          });
        } else {
          checkAnimBeforeClose();
          if (cfg.onclose)
            cfg.onclose.call(instance, isOk, $form.data(win_form), win_form);
        }
      }
    }

    function closeThis(ok) {
      if (ok === true) isOk = true;
      if (win_form) {
        submitThis();
      } else {
        if (cfg.onbeforeclose) {
          cfg.onbeforeclose.call(instance, function() {
            checkAnimBeforeClose();
            if (cfg.onclose) cfg.onclose.call(instance, isOk);
          });
        } else {
          checkAnimBeforeClose();
          if (cfg.onclose) cfg.onclose.call(instance, isOk);
        }
      }
    }

    /*
      888888  dP"Yb  88""Yb 8b    d8
      88__   dP   Yb 88__dP 88b  d88
      88""   Yb   dP 88"Yb  88YbdP88
      88      YbodP  88  Yb 88 YY 88
    */

    var win_form;
    function ready() {
      // when called from another window, the setTimeout prevent the original window to keep the active state
      // @todo : check image presence, and wait load state before resize windows
      normalizeSize();
      setTimeout(function() {
        //if (cfg.activable) _window.active(id);
        normalizeSize();

        win_form = win_base.getElementsByTagName("form")[0];

        if (win_form) {
          //btnOk.removeAttribute('autofocus');
          var autof = win_form.querySelector("[autofocus]");
          if (autof) autof.focus();

          win_form.onsubmit = function() {
            isOk = true;
            submitThis();
            return false;
          };
          //console.log(instance, win_form);
          instance.el.form = win_form;
          //win_form.elements[0].focus();
        } else if (win_iframe) win_iframe.focus();
        else win_body.focus();

        cfg.onready.call(instance, win_base, win_body);
      }, 1);
    }

    /*
      88""Yb  dP"Yb  8888b.  Yb  dP
      88__dP dP   Yb  8I  Yb  YbdP
      88""Yb Yb   dP  8I  dY   8P
      88oodP  YbodP  8888Y"   dP
    */

    var win_iframe;
    if (cfg.url && !cfg.ajax) {
      // iframe
      /////////////////////////////////////////////////////////////////////////////
      win_iframe = iframe.cloneNode(false);
      win_iframe.onload = ready;
      win_iframe.onerror = ready;
      win_iframe.onabort = ready;
      win_iframe.src =
        cfg.url.indexOf("www") == 0 ? "http://" + cfg.url : cfg.url;

      win_body.appendChild(win_iframe);
      win_body.classList.add("ui_window__body--with_iframe");
      if (!cfg.title) cfg.title = cfg.url;
    } else if (cfg.url && cfg.ajax) {
      // ajax
      /////////////////////////////////////////////////////////////////////////////
      //console.log(cfg.url, cfg.ajax);
      $ajax
        .get(cfg.url)
        .done(function(data) {
          var ajaxDiv = document.createElement("div");
          ajaxDiv.innerHTML = data;
          win_body.appendChild(ajaxDiv);
          ready();
        })
        .fail(function() {
          $alert.error("ajax error");
        });
    } else if (!cfg.ajax) {
      if (typeof cfg.html == "string") win_body.innerHTML = cfg.html;
      else if (cfg.html.nodeType === 1 || cfg.html.nodeType === 11)
        win_body.appendChild(cfg.html);
      ready();
    } else {
      ready();
    }

    /*
      88 88b 88 .dP"Y8 888888    db    88b 88  dP""b8 888888
      88 88Yb88 `Ybo."   88     dPYb   88Yb88 dP   `" 88__
      88 88 Y88 o.`Y8b   88    dP__Yb  88 Y88 Yb      88""
      88 88  Y8 8bodP'   88   dP""""Yb 88  Y8  YboodP 888888
    */

    instance = _window.current = instances[id] = {
      id: id,
      cfg: cfg,
      el: {
        base: win_base,
        body: win_body,
        header: win_head,
        title: win_title,
        footer: win_foot,
        iframe: win_iframe,
        form: win_form,
        btnCancel: btnCancel,
        btnOk: btnOk,
        menu: win_menu,
        menubar: menubar,
        beforeMenu: beforeMenu,
        afterMenu: afterMenu,
      },
      //update: updateThis,
      close: closeThis,
      destroy: destroyThis,
      maximize: maximizeIt,
      minimize: minimizeIt,
      restore: restoreIt,
      menu: menuInstance,
      changeSize: function(opt, cb) {
        if (opt && (opt.height || opt.width)) {
          win_base.style.height = "auto";
          win_base.style.width = "auto";
          win_body.classList.remove("ui_window__body--flex");
          if (opt.height) win_body.style.height = opt.height + "px";
          if (opt.width) win_body.style.width = opt.width + "px";
          normalizeSize();
          if (cb) cb();
        }
      },
      active: function() {
        _window.active(this.id);
      },
      changeTitle: function(title) {
        if (typeof title === "string") {
          if (win_title) win_title.innerHTML = title;
          if (docked_text) {
            docked_text.innerHTML = title;
            docked_text.title = title;
          }
        }
      },
      changeIcon: function(icon) {
        if (typeof icon === "string") {
          if (win_icon) win_icon.src = icon;
          if (docked_icon) {
            docked_icon.src = icon;
          }
        }
      },
      changeFooter: function(str) {
        if (win_foot.firstChild) win_foot.firstChild.innerHTML = str;
      },
    };

    //console.log(menuInstance);
    if (menuInstance)
      menuInstance.refresh(
        $extend(cfg.menuThisArg || {}, { window: instance })
      );

    // @todo : check correct order in _window creation
    cfg.onopen.call(instance, win_base, win_body);
    if (cfg.activable) _window.active(id);

    /*
       dP""b8  dP"Yb  88b 88 888888 888888 Yb  dP 888888 8b    d8 888888 88b 88 88   88
      dP   `" dP   Yb 88Yb88   88   88__    YbdP    88   88b  d88 88__   88Yb88 88   88
      Yb      Yb   dP 88 Y88   88   88""    dPYb    88   88YbdP88 88""   88 Y88 Y8   8P
       YboodP  YbodP  88  Y8   88   888888 dP  Yb   88   88 YY 88 888888 88  Y8 `YbodP'
    */
    var contextMenu = $menu(
      win_body,
      $menu.extend(
        [
          //var contextMenu = $menu($menu.extend([
          {
            name: "Maximize",
            disabled: !cfg.maximizable,
            action: function() {
              instance.maximize();
            },
          },
          {
            name: "Minimize",
            disabled: !cfg.minimizable,
            action: function() {
              instance.minimize();
            },
          },
          {
            name: "Move to center",
            disabled: !cfg.draggable,
            action: function() {
              w = cfg.dest.offsetWidth;
              h = cfg.dest.offsetHeight;
              win_base.style.top = ~~((h - win_base.offsetHeight) / 2) + "px";
              win_base.style.left = ~~((w - win_base.offsetWidth) / 2) + "px";
            },
          },
          {
            name: "Refresh",
            disabled:
              !!(cfg.url && !cfg.ajax) || !(typeof cfg.reload === "function"),
            action: function() {
              if (typeof this.cfg.reload === "function") {
                this.cfg.reload();
              } else if (this.el.iframe) {
                this.el.iframe.src = "";
                this.el.iframe.src = this.cfg.url;
              }
            },
          },
          { name: "---" },
          {
            name: "Close",
            disabled: !cfg.closable,
            action: function() {
              instance.close();
            },
          },
        ],
        cfg.contextmenu
      ),
      {
        trigger: false,
        thisArg: instance, //_window.current //'toto' //instance //win_body
      }
    );

    //console.log(contextMenu)

    /*
         db     dP""b8 888888 88  dP"Yb  88b 88 .dP"Y8
        dPYb   dP   `"   88   88 dP   Yb 88Yb88 `Ybo."
       dP__Yb  Yb        88   88 Yb   dP 88 Y88 o.`Y8b
      dP""""Yb  YboodP   88   88  YbodP  88  Y8 8bodP'
    */

    function closeIt(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeThis();
    }

    var inlineStyle;
    function maximizeIt(e) {
      if (e) e.stopPropagation(), e.stopImmediatePropagation();
      if (win_base.classList.contains("ui_window--maximized")) {
        win_base.classList.remove("ui_window--maximized");
        if (win_maximize) {
          win_maximize.classList.remove("ui_window__head__maximized");
          win_maximize.classList.add("ui_window__head__maximize");
        }
        win_base.classList.add("untransition");
        win_base.removeAttribute("style");
        win_base.setAttribute("style", inlineStyle);
        setTimeout(function() {
          win_base.classList.remove("untransition");
          cfg.onresize(false);
        }, 500);
      } else {
        inlineStyle = win_base.getAttribute("style");
        win_base.classList.add("ui_window--maximized");
        if (win_maximize) {
          win_maximize.classList.add("ui_window__head__maximized");
          win_maximize.classList.remove("ui_window__head__maximize");
        }
        setTimeout(function() {
          cfg.onresize(true);
        }, 500);
      }
    }

    var initialPos,
      transfer = document.createElement("div");
    transfer.className = "ui_window_transfer";
    document.body.appendChild(transfer);

    function minimizeIt() {
      if (cfg.dockable) {
        var winPos = win_base.getBoundingClientRect();

        initialPos = {
          t: winPos.top + "px",
          l: winPos.left + "px",
          h: win_base.offsetHeight + "px",
          w: win_base.offsetWidth + "px",
        };
        transfer.style.display = "block";
        transfer.style.top = initialPos.t;
        transfer.style.left = initialPos.l;
        transfer.style.height = initialPos.h;
        transfer.style.width = initialPos.w;

        transfer.style.zIndex =
          $maxZ("#ui_explorer_0 .ui_icon,.ui_window,.ui_z_indexed").num + 1;

        win_base.classList.add("ui_window--minimized");

        var dockedPos = docked.getBoundingClientRect();
        transfer.style.top = dockedPos.top + "px";
        transfer.style.left = dockedPos.left + "px";
        transfer.style.height = docked.offsetHeight + "px";
        transfer.style.width = docked.offsetWidth + "px";

        setTimeout(function() {
          transfer.style.display = "none";
          docked.classList.add("ui_window_docked--minimized");
        }, 300);
      }
    }
    function restoreIt() {
      transfer.classList.remove("ui_window_transfer");
      transfer.style.display = "block";
      transfer.style.zIndex =
        $maxZ("#ui_explorer_0 .ui_icon,.ui_window,.ui_z_indexed").num + 1;
      transfer.classList.add("ui_window_retransfer");
      setTimeout(function() {
        transfer.style.top = initialPos.t;
        transfer.style.left = initialPos.l;
        transfer.style.height = initialPos.h;
        transfer.style.width = initialPos.w;
      }, 50);
      setTimeout(function() {
        transfer.style.display = "none";
        win_base.classList.remove("ui_window--minimized");
        docked.classList.remove("ui_window_docked--minimized");
      }, 300);
    }

    return instance;
  }

  /////////////////////////////////////////////////////////////////////////////

  /*
    8b    d8    db    .dP"Y8 88  dP
    88b  d88   dPYb   `Ybo." 88odP
    88YbdP88  dP__Yb  o.`Y8b 88"Yb
    88 YY 88 dP""""Yb 8bodP' 88  Yb
  */

  var mask = document.createElement("div");
  mask.className = "js-mask";
  mask.setAttribute(
    "style",
    "background-image:url(/c/sys/img/spacer.gif); position: absolute; z-index: 2; left: 0; top: 0; right: 0; bottom: 0;"
  );
  function maskFrame(el) {
    if (el.getElementsByTagName("iframe").length)
      el.getElementsByTagName("section")[0].appendChild(mask.cloneNode(false));
  }
  function unMaskFrame(el) {
    var mask = el.querySelector(".js-mask");
    if (mask && mask.parentNode) mask.parentNode.removeChild(mask);
  }
  function deactivateAll() {
    $io.arr.all(document.querySelectorAll(".ui_window--active"), function(el) {
      el.classList.remove("ui_window--active");
      maskFrame(el);
    });

    $io.arr.all(
      document.querySelectorAll(".ui_window_docked.pressed"),
      function(el) {
        el.classList.remove("pressed");
      }
    );
  }

  _window.config = function(opt) {
    $extend(def, opt);
  };
  /*_window.set = function(key, val) {
    def[key] = val;
  }*/

  /*
     dP""b8 88      dP"Yb  88""Yb    db    88
    dP   `" 88     dP   Yb 88__dP   dPYb   88
    Yb  "88 88  .o Yb   dP 88""Yb  dP__Yb  88  .o
     YboodP 88ood8  YbodP  88oodP dP""""Yb 88ood8
  */

  _window.instances = instances;

  _window.active = function(id) {
    //console.log(id, new Error());
    var el = document.getElementById("ui_window_" + id);

    // always on top even if already active
    //if (!$key.ctrl) el.style.zIndex = $maxZ('#ui_explorer_0 .ui_icon:not(.ui_is_dragging),.ui_window,.ui_z_indexed').num + 1;

    el.style.zIndex =
      $maxZ(
        "#ui_explorer_0 .ui_icon:not(.ui_is_dragging),.ui_window,.ui_z_indexed"
      ).num + 1;

    //console.log(_window.current.id, id)
    //if (_window.current.id !== id) {
    deactivateAll();
    el.classList.add("ui_window--active");
    unMaskFrame(el);

    var d = document.getElementById("ui_window_docked_" + id);
    if (d) d.classList.add("pressed");
    _window.current = instances[id];

    // when closing a window, next window activation event must happen after the first window close event...
    setTimeout(function() {
      if (instances[id] && typeof instances[id].cfg.onactive === "function") {
        instances[id].cfg.onactive.call(
          instances[id],
          instances[id].el.base,
          instances[id].el.body
        );
      }
    }, 1);
    //}
  };

  function globalActions(type, el) {
    var id = el && el.nodeType == 1 ? el.getAttribute("data-window-id") : el;
    var inst = instances[id * 1];
    if (inst) inst[type]();
  }

  _window.close = function(el) {
    globalActions("close", el);
  };
  _window.destroy = function(el) {
    globalActions("destroy", el);
  };
  _window.maximize = function(el) {
    globalActions("maximize", el);
  };
  _window.restore = function(el) {
    globalActions("restore", el);
  };

  global.$window = _window;
})(this);

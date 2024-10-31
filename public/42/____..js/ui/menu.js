!(function(global) {
  "use strict";

  // @todo : access key

  var div = document.createElement("div"),
    ul = document.createElement("ul"),
    li = document.createElement("li"),
    span = document.createElement("span"),
    menuUid = 0,
    itemUid = 0;

  ul.setAttribute("role", "menu");
  li.setAttribute("role", "menuitem");
  li.setAttribute("tabindex", "-1");
  li.className = "ui_menu__item";
  span.className = "ui_menu__item__text";

  function showSubmenu(submenu) {
    submenu.setAttribute("aria-hidden", false);
    submenu.setAttribute("aria-expanded", true);
    submenu.classList.add("ui_menu--open");
  }
  function hideSubmenu(submenu) {
    //eraseAim()
    submenu.setAttribute("aria-hidden", true);
    submenu.setAttribute("aria-expanded", false);
    submenu.classList.remove("ui_menu--open");
  }
  function toggleSubmenu(item, submenu) {
    if (submenu.classList.contains("ui_menu--open")) {
      hideSubmenu(submenu);
      item.classList.remove("ui_menu__item--focus");
    } else {
      showSubmenu(submenu);
    }
  }

  var blurAttachedFor = {};
  var barMenuIsActiveFor = {};

  function attachBlur(currentMenu) {
    if (blurAttachedFor[currentMenu]) return;
    blurAttachedFor[currentMenu] = true;

    function closeEveryMenu(e) {
      var targ = e.target;
      while (targ && targ.id !== currentMenu) targ = targ.parentNode;
      if (!targ) {
        closeAll();
        document.removeEventListener("mousedown", closeEveryMenu, true);
        blurAttachedFor[currentMenu] = false;
      }
    }
    document.addEventListener("mousedown", closeEveryMenu, true);
  }

  function closeAll(el) {
    var cancel = true;
    if (el === "select") {
      cancel = false;
      el = null;
    }
    var focused = (el || document).querySelectorAll(".ui_menu__item--focus"),
      opened = (el || document).querySelectorAll(".ui_menu--open"),
      scroller = (el || document).querySelectorAll(".ui_menu--scroller");
    $io.arr.all(focused, function(item) {
      barMenuIsActiveFor[item.parentNode.parentNode.id] = false;
      item.classList.remove("ui_menu__item--focus");
    });
    $io.arr.all(opened, function(item) {
      //console.log(item)
      hideSubmenu(item);
    });
    $io.arr.all(scroller, function(item) {
      item.removeAttribute("style");
      item.classList.remove("ui_menu--scroller");
      if (item.classList.contains("ui_menu--scroller--active"))
        item.classList.remove("ui_menu--scroller--active");
      item.removeEventListener("mouseover", scrollerOver, false);
    });

    if (!el) {
      if (
        cancel &&
        _menu.current &&
        _menu.current.cfg &&
        _menu.current.cfg.oncancel
      )
        _menu.current.cfg.oncancel();
      if (_menu.current && _menu.current.cfg && _menu.current.cfg.onclose)
        _menu.current.cfg.onclose();
      _menu.current = null;
    }
  }

  function scrollerOver(e) {
    if (e.target.matches(".ui_menu__right_handler"))
      this.classList.remove("ui_menu--scroller--active");
    else this.classList.add("ui_menu--scroller--active");
  }
  function attachScrollerUi(el) {
    el.addEventListener("mouseover", scrollerOver, false);
    el
      .querySelector(".ui_menu__up_handler")
      .addEventListener("mouseover", scrollerOver, false);
  }

  function fireEvent(el, event) {
    if (el.fireEvent) {
      el.fireEvent("on" + event);
    } else {
      var ev = document.createEvent("Events");
      ev.initEvent(event, true, false);
      el.dispatchEvent(ev);
    }
  }

  /*
       db    88 8b    d8
      dPYb   88 88b  d88
     dP__Yb  88 88YbdP88
    dP""""Yb 88 88 YY 88
  */
  // thanks : http://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown

  var setAim,
    destroyAim,
    isInAim = false,
    mouseX,
    mouseY;

  !(function() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var triangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    triangle.setAttribute("points", "0,0 0,0 0,0");
    triangle.setAttribute("fill", "transparent");
    //triangle.setAttribute('fill', 'rgba(255,255,0,0.5)')
    triangle.style.cssText = "pointer-events:auto;";
    svg.style.cssText =
      "pointer-events:none;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:1"; // 2147483647
    svg.appendChild(triangle);
    document.body.appendChild(svg);

    document.addEventListener("mousemove", function(e) {
      mouseX = lastPosX = ax = e.pageX;
      mouseY = lastPosY = ay = e.pageY;
      traceAim();
    });

    var timeout;
    function debounceDestroy() {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        _destroyAim("fromTriangle");
      }, 100);
    }

    function isGoingToAim(x, y) {
      if (bx === cx) {
        if (ax < bx) {
          //console.log(bx - x , bx - lastPosX)
          return bx - x <= bx - lastPosX;
        } else {
          return bx - x >= bx - lastPosX;
        }
      }
    }

    var lastPosX;
    var lastPosY;
    triangle.onmousemove = function(e) {
      if (isGoingToAim(e.pageX, e.pageY)) {
        //console.log('YEP')
        debounceDestroy();
      } else {
        //console.log('NOPE')
        _destroyAim("fromTriangle");
      }
      setTimeout(function() {
        lastPosX = e.pageX;
        lastPosY = e.pageY;
      }, 1);
    };

    var aimEl,
      ax,
      ay,
      bx,
      by,
      cx,
      cy,
      elP = {};

    function traceAim() {
      if (ay >= elP.top + 3 && ay <= elP.bottom - 3) {
        triangle.setAttribute(
          "points",
          ax + "," + ay + " " + bx + "," + by + " " + cx + "," + cy
        );
      }
    }
    function _setAim(el, _ax, _ay, _bx, _by, _cx, _cy) {
      elP = el.getBoundingClientRect();
      aimEl = el;
      el.appendChild(svg);
      lastPosX = ax = _ax;
      lastPosY = ay = _ay;
      bx = _bx;
      by = _by;
      cx = _cx;
      cy = _cy;
    }
    function _destroyAim(cancel) {
      triangle.setAttribute("points", "0,0 0,0 0,0");
      setTimeout(function() {
        if (cancel === "fromTriangle") {
          var el = document.elementFromPoint(mouseX, mouseY);
          fireEvent(el, "mouseover");
        }
      }, 1);
    }
    setAim = _setAim;
    destroyAim = _destroyAim;
  })();

  /*
    8888b.  888888 888888    db    88   88 88     888888
     8I  Yb 88__   88__     dPYb   88   88 88       88
     8I  dY 88""   88""    dP__Yb  Y8   8P 88  .o   88
    8888Y"  888888 88     dP""""Yb `YbodP' 88ood8   88
  */

  var _def = {
    mode: "popup", // inline, popup, context, bar, tree, tabs @todo : off-canvas / mega
    icons: "auto", // always, never
    recursive: false, //true,
    hide: false, //true,
    solo: true,
    aim: true,
    display: true,
    //autoclose: true,
    closeOthers: true,
    trigger: "mouseover", //'mousemove', //
    onclose: null,
    position: { within: window },
  };

  function _menu(el, data, opt) {
    //if (!el) throw new Error('menu: element is undefined');
    if (!$io.isElement(el)) {
      opt = data || {};
      data = el;
      el = document.createElement("div");
    }

    if (!data) data = [];

    var def =
        opt.mode === "tree"
          ? $extend({}, _def, {
              closeOthers: false,
              trigger: "click",
              position: false,
            })
          : opt.mode === "bar"
            ? $extend({}, _def, {
                //trigger: 'click'
              })
            : _def,
      cfg = $extend({}, def, opt),
      isTabs = false,
      isContext = false,
      howToBuidThisItem = {}, // @todo : finish howToBuidThisItem
      stateItems = {},
      menu;

    if (cfg.mode === "tabs") {
      isTabs = true;
      cfg.mode = "bar";
    }
    if (cfg.mode === "context") {
      isContext = true;
      cfg.mode = "popup";
    }

    if (!cfg.thisArg) cfg.thisArg = el;

    /*
      88  dP 888888 Yb  dP
      88odP  88__    YbdP
      88"Yb  88""     8P
      88  Yb 888888  dP
    */

    var keys = {};
    function getKey(data) {
      $io.obj.all(data, function(item) {
        if (item.key) {
          /*if (item.checkbox) {
            !function() {
              keys[item.key] = clickOnMenuCheckbox(item, item.action)
            }(item)
          } else {
            keys[item.key] = item.action;
          }*/
          /*if (!item.checkbox && !item.radio) {
          }*/
          keys[item.key] = function() {
            //try {
            return item.action.apply(this, arguments);
            //} catch(e) {console.log(e)}
          };
        }
        if (typeof item.items !== "function") getKey(item.items);
        //else console.warn('Some keyboard shorcut might be missing for : ', item.name);
      });
    }
    getKey(data);

    // console.log(cfg.thisArg, keys)

    //var keyInstance = $key(cfg.thisArg).config({
    //console.log(cfg.keyTarget)
    var keyInstance = $key(cfg.keyTarget || el)
      .config({
        thisArg: cfg.thisArg,
        uniqueCombo: true /*,
      preventDefault: true*/,
      })
      .combo(keys);
    //var keyInstance = {}

    // global menu shortcut
    var menuKeyInstance;
    if (cfg.key) {
      // console.log(111, cfg.key)
      var combo = {};
      combo[cfg.key] = function() {
        popup();
      };
      menuKeyInstance = $key().combo(combo);
    }

    /*
      88""Yb 88   88 88 88     8888b.  8b    d8 888888 88b 88 88   88
      88__dP 88   88 88 88      8I  Yb 88b  d88 88__   88Yb88 88   88
      88""Yb Y8   8P 88 88  .o  8I  dY 88YbdP88 88""   88 Y88 Y8   8P
      88oodP `YbodP' 88 88ood8 8888Y"  88 YY 88 888888 88  Y8 `YbodP'
    */

    el.classList.add("ui_menu_trigger");
    //menu = buildMenu(cfg.thisArg, cfg, data);
    menu = buildMenu(el, cfg, data);
    menu.className =
      "ui_menu ui_menu--" +
      (cfg.mode === "inline" || cfg.mode === "popup" ? "menu" : cfg.mode);
    menu.setAttribute("tabindex", "0");
    menu.style.zIndex = $maxZ(".ui_menu", menu.parentNode).num + 1;

    var tabcontent;
    if (cfg.mode !== "popup") {
      if (isTabs) {
        el.appendChild(menu);
        if (cfg.dest) {
          tabcontent = cfg.dest;
        } else {
          tabcontent = document.createElement("div");
          tabcontent.className = "ui_menu--tabs__content";
          el.appendChild(tabcontent);
        }
      } else {
        el.appendChild(menu);
      }
    } else {
      //el.parentNode.insertBefore(menu, el);
      document.body.appendChild(menu);
      menu.classList.add("ui_menu--popup");
      hideSubmenu(menu);
      if (isContext) {
        el.addEventListener("contextmenu", popup, false);
      } else if (cfg.trigger === "auto") {
        popup();
      } else if (cfg.trigger) {
        el.addEventListener("click", popup, false);
      }
    }

    function buildMenu(el, cfg, data, parent) {
      data = typeof data === "function" ? data.call(cfg.thisArg) : data;
      if (data === false) return false;

      var docfrag = document.createDocumentFragment(),
        menu = div.cloneNode(false),
        menuUl = ul.cloneNode(false);

      menu.appendChild(menuUl);
      menu.id = "ui_menu_" + menuUid++;

      if (data) {
        for (var i = 0, l = data.length; i < l; i++) {
          if (!data[i]) continue;

          //console.log(133, cfg.thisArg);
          var display =
            typeof data[i].display === "function"
              ? data[i].display.call(cfg.thisArg)
              : data[i].display;
          if (display === false) continue;

          var val = data[i],
            item = li.cloneNode(false);

          if (val.name === "---") {
            item.className = "ui_menu__separator";
            item.appendChild(document.createElement("hr"));
            docfrag.appendChild(item);
            continue;
          }

          item.id = "ui_menu__item_" + itemUid++;
          var spanText = span.cloneNode(false);
          var spanKey = document.createElement("span");
          var spanIcon = document.createElement("span");

          var specialAction = null;
          spanIcon.className = "ui_menu__item__ico";
          if (val.radio !== undefined) {
            spanIcon.className = "ui_menu__item__ico ui_form-ico-radio";
            specialAction = clickOnMenuRadio(val.radio, item, val.action);
          } else if (val.checkbox === true) {
            spanIcon.className = "ui_menu__item__ico ui_form-ico-checkbox";
            specialAction = clickOnMenuCheckbox(item, val.action);
            /*if (val.key) {
              var combo = {}
              combo[val.key] = function() {
                console.log(123, this)
              }
              keyInstance.combo(combo)
            }*/
          }

          //spanText.textContent = typeof val.name == 'string' ? val.name : val;
          spanText.innerHTML = typeof val.name === "string" ? val.name : val;

          if (val.icon) {
            if (val.icon.indexOf(".") === 0) {
              var icon = document.createElement("div");
              icon.className = "ui_menu__item__ico";
              var classList = val.icon.split(".");
              classList.forEach(function(ico) {
                icon.classList.add(ico);
              });
            } else if (val.icon.indexOf("<") === 0) {
              var icon = document.createElement("div");
              icon.className = "ui_menu__item__ico";
              icon.innerHTML = val.icon;
            } else {
              var icon = new Image();
              icon.src = val.icon;
            }
            spanIcon.appendChild(icon);
          } else {
            spanIcon.innerHTML = "&nbsp;";
          }
          item.appendChild(spanIcon);
          item.appendChild(spanText);
          if (val.key) {
            //    return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});

            spanKey.innerHTML = val.key.replace(/(\+|^)[a-z]/g, function(a) {
              return a.toUpperCase();
            });
            spanKey.className = "ui_menu__item__key";
            item.appendChild(spanKey);
          }

          stateItems[item.id] = {
            item: item,
            val: val,
            action: specialAction || val.action,
          };
          changeStateItem(el, item, val);

          if (val.items) {
            item.setAttribute("aria-haspopup", true);
            item.classList.add("ui_menu__item--opener");

            var buildItems = (function(el, cfg, val, item) {
              return function() {
                var submenu = buildMenu(el, cfg, val.items, val);
                if (!submenu) {
                  submenu = document.createElement("div");
                  submenu.innerHTML =
                    '<ul><li class="ui_menu__item ui_menu__item--disabled"><em>No items...</em></ul></li>';
                }
                submenu.className = "ui_menu__submenu";
                if (cfg.position !== false) hideSubmenu(submenu);
                item.appendChild(submenu);
              };
            })(el, cfg, val, item);

            if (cfg.recursive === true) {
              buildItems();
            } else {
              howToBuidThisItem[item.id] = buildItems;
            }
          }

          docfrag.appendChild(item);
        }
      } else {
        return false;
      }
      menuUl.appendChild(docfrag);

      return menu;
    }
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    var radioMenu = {};
    function clickOnMenuRadio(parent, item, fn) {
      if (radioMenu[parent]) radioMenu[parent].push(item);
      else radioMenu[parent] = [item];
      function wraper() {
        var arr = radioMenu[parent];
        var current;
        for (var i = 0, l = arr.length; i < l; i++) {
          arr[i].setAttribute("data-menuitem-selected", false);
          current = stateItems[arr[i].id].val;
          if (typeof current.selected !== "function") current.selected = false;
        }
        current = stateItems[item.id].val;
        if (typeof current.selected !== "function") current.selected = true;
        item.setAttribute("data-menuitem-selected", true);
        fn && fn.call(this, current);
      }
      return wraper;
    }
    function clickOnMenuCheckbox(item, fn) {
      function wraper() {
        var selected = item.getAttribute("data-menuitem-selected") === "true";
        item.setAttribute("data-menuitem-selected", !selected);
        var current = stateItems[item.id].val;
        if (typeof current.selected !== "function")
          current.selected = !selected;
        if (fn) {
          return fn.call(this, !selected);
        }
      }
      return wraper;
    }

    function changeStateItem(el, item, val) {
      //console.log('changeStateItem')
      var display =
          typeof val.display === "function"
            ? val.display.call(cfg.thisArg)
            : val.display,
        disabled =
          typeof val.disabled === "function"
            ? val.disabled.call(cfg.thisArg)
            : val.disabled,
        selected =
          typeof val.selected === "function"
            ? val.selected.call(cfg.thisArg)
            : val.selected;

      if (display === false) item.style.display = "none";
      else item.style.display = "";

      if (disabled) item.classList.add("ui_menu__item--disabled");
      else item.classList.remove("ui_menu__item--disabled");

      item.setAttribute("data-menuitem-selected", selected);
    }
    function changeStateItems(el) {
      for (var item in stateItems) {
        if (stateItems.hasOwnProperty(item)) {
          var stateItem = stateItems[item];
          changeStateItem(el, stateItem.item, stateItem.val);
        }
      }
    }
    /////////////////////////////////////////////////////////////////////////////

    var positionInstance;
    function popup(e) {
      if (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      if (menu.classList.contains("ui_menu--open")) return;
      if (cfg.solo) closeAll();
      _menu.current = instance;
      showSubmenu(menu);
      menu.style.zIndex = $maxZ(".ui_menu, .ui_icon, .ui_window").num + 1;
      var posConfig = {
        //my: cfg.position.my || 'left top',
        //at: cfg.position.at || 'left bottom',
        collision: "flip", //'flip', //'flipfit',
        of: cfg.position.of || el,
        within: cfg.position.within,
      };
      //console.log(cfg.position.my);
      //console.log(cfg.position.at);
      if (cfg.position.my) posConfig.my = cfg.position.my;
      if (cfg.position.at) posConfig.at = cfg.position.at;
      positionInstance = $pos(menu, posConfig);
      if (menu.getAttribute("data-ui-menu-scroller")) doStuffWithScroller(menu);
      //setTimeout(function() {
      attachBlur(menu.id);
      //}, 0);
    }

    function doStuffWithScroller(el) {
      function refreshScrollButtons() {
        if (el.scrollTop === 0) up_handler.disabled = true;
        else up_handler.disabled = false;
        if (el.scrollHeight - el.scrollTop === el.clientHeight)
          down_handler.disabled = true;
        else down_handler.disabled = false;
      }

      var up_handler, down_handler, right_handler, p;
      if (el.classList.contains("ui_menu--scroller--active"))
        el.classList.remove("ui_menu--scroller--active");
      el.classList.add("ui_menu--scroller");
      if (el.childNodes.length == 1) {
        up_handler = document.createElement("button");
        down_handler = document.createElement("button");
        right_handler = document.createElement("div");
        up_handler.className = "ui_menu__up_handler";
        down_handler.className = "ui_menu__down_handler";
        right_handler.className = "ui_menu__right_handler";
        var ulW = el.firstChild.offsetWidth;
        up_handler.style.width = down_handler.style.width = ulW + "px";
        el.appendChild(up_handler);
        el.appendChild(down_handler);
        el.appendChild(right_handler);
        p = el.getBoundingClientRect();
        up_handler.style.top = p.top + "px";
        down_handler.style.bottom =
          window.innerHeight - el.offsetHeight - p.top + "px";
        right_handler.style.left = p.left + ulW + "px";

        up_handler.onclick = function() {
          el.scrollTop -= 80;
          refreshScrollButtons();
        };
        down_handler.onclick = function() {
          el.scrollTop += 80;
          refreshScrollButtons();
        };
        el.onscroll = function() {
          refreshScrollButtons();
        };

        refreshScrollButtons();
      }
      attachScrollerUi(el);
    }

    function over(e) {
      //console.log('over');

      var targ = e.target;
      while (targ && targ.tagName !== "LI") targ = targ.parentNode;
      if (!targ) return;

      //if (cfg.position !== false && targ.classList.contains('ui_menu__item--focus')) return;
      if (
        cfg.position !== false &&
        targ.classList.contains("ui_menu__item--focus")
      )
        return;

      if (targ.classList.contains("ui_menu__item--disabled")) return;

      $io.arr.each(targ.parentNode.childNodes, function(item) {
        if (item.id == targ.id) {
          if (cfg.closeOthers) closeAll(item);

          //console.log(cfg.mode == 'bar', !barMenuIsActiveFor[menu.id], targ.parentNode.parentNode.id == menu.id);
          if (
            cfg.mode == "bar" &&
            !barMenuIsActiveFor[menu.id] &&
            targ.parentNode.parentNode.id == menu.id
          )
            return;
          item.classList.add("ui_menu__item--focus");

          //setTimeout(function() {

          if (
            item.classList.contains("ui_menu__item--opener") &&
            !item.classList.contains("ui_menu__item--disabled")
          ) {
            if (howToBuidThisItem[targ.id]) howToBuidThisItem[targ.id]();
            var submenu = item.lastChild;

            if (cfg.position === false) {
              // ??
              toggleSubmenu(item, submenu);
            } else {
              submenu.style.position = "fixed"; // fix resizing item opener...
              showSubmenu(submenu);

              var isInBar =
                cfg.mode == "bar" && targ.parentNode.parentNode.id == menu.id;

              $pos(submenu, {
                my: isInBar ? "left top-1" : "left top-1",
                at: isInBar ? "left bottom" : "right top",
                of: item,
                collision: "flipfit", //'flip', //'flipfit',
                within: cfg.position.within || window,
              });

              if (submenu.getAttribute("data-ui-menu-scroller"))
                doStuffWithScroller(submenu);

              if (cfg.aim) {
                var subMeP = submenu.getBoundingClientRect();
                if (isInBar) {
                  if (e.pageY < subMeP.bottom) {
                    setAim(
                      // ^
                      item,
                      e.pageX,
                      e.pageY,
                      subMeP.left,
                      subMeP.top,
                      subMeP.right,
                      subMeP.top
                    );
                  } else {
                    setAim(
                      // v
                      item,
                      e.pageX,
                      e.pageY,
                      subMeP.left,
                      subMeP.bottom,
                      subMeP.right,
                      subMeP.bottom
                    );
                  }
                } else {
                  if (e.pageX < subMeP.left) {
                    setAim(
                      // <
                      item,
                      e.pageX,
                      e.pageY,
                      subMeP.left,
                      subMeP.top,
                      subMeP.left,
                      subMeP.bottom
                    );
                  } else {
                    setAim(
                      // >
                      item,
                      e.pageX,
                      e.pageY,
                      subMeP.right,
                      subMeP.top,
                      subMeP.right,
                      subMeP.bottom
                    );
                  }
                }
              }

              //setTimeout(function() {
              attachBlur(menu.id);
              //}, 10)
            }
          } else {
            destroyAim(true);
          }

          //}, 10)
        } else if (cfg.closeOthers) {
          //console.log('???')
          item.classList.remove("ui_menu__item--focus");
          //console.log(item);
          closeAll(item);
        }
      });
    }

    /////////////////////////////////////////////////////////////////////////////
    var trigger = cfg.trigger == "auto" ? "mouseover" : cfg.trigger;
    if (!trigger) trigger = "mouseover";
    //console.log(trigger);

    menu.addEventListener(trigger, over, false);
    menu.onfocus = function(e) {
      var firstItem = menu.querySelector(".ui_menu__item");
      //console.log(firstItem);
      //over({target: firstItem})
      select.call(firstItem, { target: firstItem });
    };

    barMenuIsActiveFor[menu.id] = false;

    menu.onblur = function(e) {
      closeAll();
    };
    /////////////////////////////////////////////////////////////////////////////

    function select(e) {
      // is it too heavy ?
      /////////////////////////////////////////////////////////////////////////////
      //changeStateItems(el);
      /////////////////////////////////////////////////////////////////////////////

      var targ = this;
      if (cfg.mode == "bar") {
        if (barMenuIsActiveFor[menu.id]) {
          barMenuIsActiveFor[menu.id] = false;
          closeAll();
        } else {
          barMenuIsActiveFor[menu.id] = true;
          over(e);
        }
      }

      if (!targ.classList.contains("ui_menu__item--disabled")) {
        var action = stateItems[targ.id].action;
        var type = typeof action;
        if (isTabs && (type == "string" || type == "function")) {
          tabcontent.innerHTML =
            type == "function" ? action.call(cfg.thisArg) : action;
          closeAll();
        }

        if (
          type == "function" &&
          action.call(cfg.thisArg, e, stateItems[targ.id].val) !== false
        )
          closeAll("select");
      }

      //instance.destroy();
      //closeAll();
      //blurAttachedFor = {};
      //if (cfg.autoclose) closeAll();
    }

    $el(menu).on("click", ".ui_menu__item", select);

    /*
      88 88b 88 .dP"Y8 888888    db    88b 88  dP""b8 888888
      88 88Yb88 `Ybo."   88     dPYb   88Yb88 dP   `" 88__
      88 88 Y88 o.`Y8b   88    dP__Yb  88 Y88 Yb      88""
      88 88  Y8 8bodP'   88   dP""""Yb 88  Y8  YboodP 888888
    */

    var instance = {
      cfg: cfg,
      destroy: function() {
        // console.log('$menu destroyed');
        // @todo : destroy menu (remove all event listeners)
        $el(menu).off("click", ".ui_menu__item", select);
        menu.removeEventListener(trigger, over, false);
        howToBuidThisItem = null;
        stateItems = null;
        if (keyInstance && keyInstance.destroy) keyInstance.destroy();
        if (menuKeyInstance && menuKeyInstance.destroy)
          menuKeyInstance.destroy();
      },
      refresh: function(thisArg) {
        if (thisArg) {
          cfg.thisArg = thisArg;
          //keyInstance.config({thisArg: thisArg});
        }
        changeStateItems(cfg.thisArg);
      },
      show: function(thisArg, pos) {
        if (thisArg) {
          cfg.thisArg = thisArg;
          keyInstance.config({ thisArg: thisArg });
          changeStateItems(thisArg);
        }
        if (pos) cfg.position = pos;
        popup();
      },
      setThisArg: function(thisArg) {
        if (thisArg) {
          cfg.thisArg = thisArg;
          //keyInstance.config({thisArg: thisArg});
          changeStateItems(thisArg);
        }
      },
      key: keyInstance,
      position: positionInstance,
    };
    return instance;
  }

  _menu.config = function(opt) {
    $extend(_def, opt);
  };

  /*
    888888 Yb  dP 888888 888888 88b 88 8888b.
    88__    YbdP    88   88__   88Yb88  8I  Yb
    88""    dPYb    88   88""   88 Y88  8I  dY
    888888 dP  Yb   88   888888 88  Y8 8888Y"
  */

  _menu.extend = function(menu, extentions) {
    var menu1 = $extend([], menu);

    $io.obj.all(extentions, function(val, key) {
      key.replace(
        /^((after|before|replace|delete|extend):)?(([\d.]+)|(.*))/,
        function(_a, _b, how, _c, ref, name) {
          function iterate(name, arr) {
            var ok;
            $io.arr.each(arr, function(item, i) {
              if (item.name === name) {
                ok = { arr: arr, pos: i };
                return false;
              } else if (item.items) {
                ok = iterate(name, item.items);
              }
              if (ok) return false;
            });
            return ok;
          }
          if (ref) {
            var index = ref.split(".");
            var pos = +index.pop();
            var m = menu1;
            $io.arr.all(index, function(item) {
              var i = +item;
              if (m[i].items) m = m[i].items;
              else m = m[i];
            });
          } else if (name) {
            var truc = iterate(name, menu1);
            var m = truc.arr;
            var pos = truc.pos;
          }
          if (!how || how === "before") $io.arr.insert(m, val, pos);
          else if (how === "after") {
            $io.arr.insert(m, val, pos + 1);
          } else if (how === "extend") {
            m[pos] = $extend({}, m[pos], val[0]);
          } else if (how === "replace") {
            m[pos] = val[0];
          } else if (how === "delete") {
            m.splice(pos, 1);
          }
        }
      );
    });
    return menu1;
  };

  global.$menu = _menu;

  /*
  Keyboard interaction

  //Move.focus.to.the.next.menu.item

  ENTER/SPACE: Invoke the focused menu item's action, which may be opening a submenu.
  UP: Move focus to the previous menu item.
  DOWN: Move focus to the next menu item.
  RIGHT: Open the submenu, if available.
  LEFT: Close the current submenu and move focus to the parent menu item. If not in a submenu, do nothing.
  ESCAPE: Close the current submenu and move focus to the parent menu item. If not in a submenu, do nothing.
  */
})(window);

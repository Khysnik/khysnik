!(function(global) {
  "use strict";
  // https://github.com/HubSpot/messenger
  //var desk = document.getElementById('s42_desktop');

  function close(el, isCalled) {
    el.className = "ui_notif animated fadeOut";
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, isCalled ? 150 : 500);
  }

  var def = {
      default: document.body,
      dest: document.body,
    },
    piles = [],
    lastNotif = document.createElement("div");

  function $notif(opt, el) {
    if (typeof opt === "string") {
      if (typeof el === "string") {
        opt = { title: opt, text: el };
        el = null;
      } else {
        opt = { text: opt };
      }
    }
    var cfg = $extend({}, def, opt);

    if (!el) el = cfg.default;
    var screenEl = cfg.dest;

    cfg.text = cfg.text || cfg.description || cfg.body || "";

    var cont;
    var id = el.getAttribute("data-js-notif-id");
    if (id) {
      cont = piles[id];
    } else {
      cont = document.createElement("div");
      screenEl.appendChild(cont);
      cont.style.zIndex = 99999; //$maxZ('.ui_menu, .ui_window').num + 1;;
      var p = el.getBoundingClientRect();
      cont.style.position = "fixed";
      cont.style.bottom = window.innerHeight - ~~(p.top + p.height / 2) + "px";
      cont.style.right = window.innerWidth - ~~(p.left + p.width / 2) + "px";
      el.setAttribute("data-js-notif-id", piles.push(cont) - 1);
    }

    var div = document.createElement("div"),
      h1 = document.createElement("b"),
      p = document.createElement("p"),
      button = document.createElement("span");

    div.style.visibility = "hidden";
    div.className = "ui_notif";
    button.innerHTML = "&times;";

    var words = 0;
    //console.log(1, opt);
    if (cfg.title) {
      h1.innerHTML = cfg.title;
      div.appendChild(h1);
      words += cfg.title.length;
    }
    p.innerHTML = cfg.text;
    words += cfg.text.length;
    div.appendChild(p);
    div.appendChild(button);
    button.onclick = function() {
      close(div, true);
    };

    if (cfg.delay !== false) {
      div.onmouseover = function() {
        clearTimeout(delay);
      };
      div.onmouseout = function() {
        hide();
      };
    }

    //var img = div.getElementsByTagName('img')[0];
    //console.log(img);

    setTimeout(function() {
      div.style.visibility = "visible";
      div.className = "ui_notif animated fadeIn";
      //show()
    }, 100);

    cont.appendChild(div);
    function show() {
      if (el) {
        $pos(cont, {
          my: "right bottom",
          at: "center center",
          of: el,
          collision: "flipfit",
        });
      }
    }

    // average 5 char = 1 word
    words = words / 5;
    // 180wpm / 60 = 5
    var speed = cfg.speed || words / (180 / 60) * 1000;
    //console.log(speed);

    var delay;
    function hide() {
      delay = setTimeout(function() {
        close(div);
      }, speed + 2000);
    }

    if (cfg.delay !== false) hide();
  }

  $notif.config = function(opt) {
    $extend(def, opt);
  };

  global.$notif = $notif;
})(this);
